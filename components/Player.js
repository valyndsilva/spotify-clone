import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentTrackIdState,
  isPlayingState,
  currentSongUriState,
  currentAlbumSongUriState,
} from "../atoms/songAtom";
import {
  deviceIdState,
  isDeviceActiveState,
  playState,
  volumeState,
} from "../atoms/playerAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import {
  HeartIcon,
  ReplyIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  PlayIcon,
  PauseIcon,
  RewindIcon,
  FastForwardIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const songInfo = useSongInfo();
  // console.log({ songInfo });
  const [hasLiked, setHasLiked] = useState(false);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [deviceId, setDeviceId] = useRecoilState(deviceIdState);

  const [isDeviceActive, setIsDeviceActive] =
    useRecoilState(isDeviceActiveState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [play, setPlay] = useRecoilState(playState);
  // const [volume, setVolume] = useRecoilState(volumeState);
  const [volume, setVolume] = useState(50);

  const [currentSongUri, setCurrentSongUri] =
    useRecoilState(currentSongUriState);

  const currentAlbumSongUri = useRecoilValue(currentAlbumSongUriState);

  const fetchDevice = () => {
    // Check if user device active and only then set volume
    spotifyApi.getMyDevices().then((data) => {
      let availableDevices = data.body.devices;
      // console.log(availableDevices);
      availableDevices.map((device) => {
        // console.log({ device });
        // console.log(device.id);
        // console.log(device.is_active);
        setDeviceId(device.id);
        setIsDeviceActive(device.is_active);
      });
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      //fetch Device Info
      fetchDevice();
    }
  }, [deviceId, isDeviceActive, spotifyApi, session]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
      return volume;
    }, 500),
    []
  );

  // const debouncedAdjustVolume = useCallback(
  //   debounce((volume) => {
  //     console.log(deviceId);
  //     deviceId && spotifyApi.setVolume(volume);
  //     return volume;
  //   }, 500),
  //   []
  // );

  useEffect(() => {
    if (volume > 0 && volume < 100) debouncedAdjustVolume(volume);
  }, [volume]);

  const fetchCurrentSong = () => {
    if (!currentTrackId && !currentSongUri) {
      console.log("fetchCurrentSong Triggered!!");

      // Get the User's Currently Playing Track
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        // console.log("Now Playing:", data.body?.item);
        setCurrentTrackId(data.body?.item?.id);
        // console.log(currentTrackId);

        const songUri = data.body?.item?.uri;
        // console.log({ songUri });
        setCurrentSongUri(songUri);

        // Get Information About The User's Current Playback State
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId && !currentSongUri) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, currentSongUri, spotifyApi, session]);

  // Handle Play/Pause events if device id available and is_playing is set to true
  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      // console.log("handlePlayPause in Player Component:", data.body);
      if (data.body?.is_playing && data.body?.device.id) {
        spotifyApi.pause();
        setPlay(false);
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setPlay(true);
        setIsPlaying(true);
      }
    });
  };
  return (
    <div className="h-24 grid grid-cols-3 text-xs md:text-base px-2 md:px-8 bg-gradient-to-b from-black to-gray-900 text-white border-t border-gray-800">
      {songInfo ? (
        <div className="flex items-center space-x-4">
          {/* <div className=" w-10 h-10 cursor-pointer relative">
          <Image
            className=""
            src={songInfo?.album.images?.[0]?.url}
            alt="logo"
            layout="fill" // required
            objectFit="cover" // change to suit your needs
            priority
          />
        </div> */}
          <img
            className="hidden md:inline w-10 h-10 cursor-pointer"
            src={songInfo?.album?.images?.[0]?.url}
            alt={songInfo?.album?.name}
          />
          <div>
            <h3>{songInfo?.name}</h3>
            <p>{songInfo?.artists?.[0]?.name}</p>
          </div>
          <div>
            <HeartIcon
              className={`w-5 h-5  ml-3 ${
                hasLiked ? "fill-[#1ED760] text-[#1ED760]" : "text-[#868686]"
              }`}
              onClick={() => setHasLiked(!hasLiked)}
            />
          </div>
        </div>
      ) : null}

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="playerButton" />
        <RewindIcon
          className="playerButton"
          onClick={() =>
            spotifyApi.skipToPrevious().then(
              function () {
                console.log("Skip to previous");
              },
              function (err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log("Something went wrong!", err);
              }
            )
          }
        />
        {isPlaying ? (
          <PauseIcon
            onClick={handlePlayPause}
            className="playerButton w-10 h-10"
          />
        ) : (
          <PlayIcon
            onClick={handlePlayPause}
            className="playerButton w-10 h-10"
          />
        )}

        <FastForwardIcon
          className="playerButton"
          onClick={() =>
            spotifyApi.skipToNext().then(
              function () {
                console.log("Skip to next");
              },
              function (err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log("Something went wrong!", err);
              }
            )
          }
        />
        <ReplyIcon className="playerButton" />
      </div>
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          className="playerButton"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="playerButton"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
