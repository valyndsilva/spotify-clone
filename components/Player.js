import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentTrackIdState,
  isPlayingState,
  currentSongUriState,
  currentAlbumSongUriState,
  songInfoState,
  newSongInfoState,
  prevNextState,
  prevNextClickedState,
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

  const songData = useSongInfo();
  console.log({ songData });
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
        console.log({ songUri });
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
      // setAuto(true);
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
        // audioPlayer.current.pause();
        // cancelAnimationFrame(animationRef.current);
      } else {
        spotifyApi.play();
        setPlay(true);
        setIsPlaying(true);
        // audioPlayer.current.play();
        // animationRef.current = requestAnimationFrame(whilePlaying);
      }
    });
  };

  const [songInfo, setSongInfo] = useRecoilState(songInfoState);
  const [prevNextClicked, setPrevNextClicked] = useState(false);

  const fetchNowPlayingInfo = async () => {
    console.log("fetchNowPlayingInfo triggered!!!!!!!!!");
    return fetch(
      `https://api.spotify.com/v1/me/player/currently-playing`,

      {
        method: "GET",
        headers: {
          //When you make a request to an API endpoint that access token is put inside the header.
          // We can pass around the access token as a bearer with the token.
          Accept: "application/json",
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          // "Content-Length": 0,
        },
      }
    );
  };

  const fetchNextSongInfo = async () => {
    console.log("Before click prevNext value:", prevNextClicked);
    setPrevNextClicked(true);
    console.log("After click prevNext value:", prevNextClicked);

    console.log("fetchNextSongInfo triggered!!!!!!!!!");

    await fetch(
      `https://api.spotify.com/v1/me/player/next`,

      {
        method: "POST",
        headers: {
          //When you make a request to an API endpoint that access token is put inside the header.
          // We can pass around the access token as a bearer with the token.
          Accept: "application/json",
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          "Content-Length": 0,
        },
      }
    );

    const response = await fetchNowPlayingInfo();
    const song = await response.json();
    console.log({ song });
    setSongInfo(song);
    console.log("songInfo:", songInfo);
    console.log("songInfo href:", songInfo.external_urls?.spotify);
    // fetchNowPlayingSongUri(songInfo.id);
  };

  const fetchPreviousSongInfo = async () => {
    console.log("Before click prevNext value:", prevNextClicked);
    setPrevNextClicked(true);
    console.log("After click prevNext value:", prevNextClicked);

    console.log("fetchPreviousSongInfo triggered!!!!!!!!!");

    await fetch(`https://api.spotify.com/v1/me/player/previous`, {
      method: "POST",
      headers: {
        //When you make a request to an API endpoint that access token is put inside the header.
        // We can pass around the access token as a bearer with the token.
        Accept: "application/json",
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
      },
    });
    const response = await fetchNowPlayingInfo();
    const song = await response.json();
    console.log({ song });
    setSongInfo(song);
    console.log("songInfo:", songInfo);
    console.log("songInfo href:", songInfo.external_urls?.spotify);
    // fetchNowPlayingSongUri(songInfo.id);
  };

  /////
  // const [auto, setAuto] = useState(false);
  // //   duration state
  // const [duration, setDuration] = useState(0);
  // const [currentTime, setCurrenttime] = useState(0);

  // const audioPlayer = useRef(); //   reference to our audio component
  // const progressBar = useRef(); //   reference to our prgressbar
  // const animationRef = useRef(); //  reference to our animation

  // useEffect(() => {
  //   const seconds = Math.floor(audioPlayer.current?.duration);
  //   setDuration(seconds);

  //   // set max prop with out seconds in input[range]
  //   progressBar.current.max = seconds;
  // }, [audioPlayer?.current?.loadedmetada, audioPlayer?.current?.readyState]);

  // const whilePlaying = () => {
  //   progressBar.current.value = audioPlayer.current.currentTime;
  //   changeCurrentTime();
  //   // need to run more than once
  //   animationRef.current = requestAnimationFrame(whilePlaying);
  // };

  // const calculateTime = (sec) => {
  //   const minutes = Math.floor(sec / 60);
  //   const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
  //   const seconds = Math.floor(sec % 60);
  //   const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;
  //   return `${returnMin} : ${returnSec}`;
  // };

  // const changeProgress = () => {
  //   audioPlayer.current.currentTime = progressBar.current.value;

  //   // progressBar.current.style.setProperty(
  //   //   "--played-width",
  //   //   `${(progressBar.current.value / duration) * 100}%`
  //   // );

  //   // setCurrenttime(progressBar.current.value);

  //   changeCurrentTime();
  // };

  // const changeCurrentTime = () => {
  //   progressBar.current.style.setProperty(
  //     "--played-width",
  //     `${(progressBar.current.value / duration) * 100}%`
  //   );

  //   setCurrenttime(progressBar.current.value);
  // };

  /////

  return (
    <div className="flex flex-col w-full  bg-gradient-to-b from-black to-gray-900 text-white border-t border-gray-800">
      <div className="h-24 grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
        {/* {songData ? ( */}
        {(prevNextClicked ? songInfo : songData) ? (
          <div className="flex items-center space-x-4">
            {/* <div className=" w-10 h-10 cursor-pointer relative">
          <Image
            className=""
            src={songData?.album.images?.[0]?.url}
            alt="logo"
            layout="fill" // required
            objectFit="cover" // change to suit your needs
            priority
          />
        </div> */}
            <img
              className="hidden md:inline w-10 h-10 cursor-pointer"
              src={
                songInfo?.item?.album?.images?.[0]?.url ||
                songData?.album?.images?.[0]?.url
              }
              alt={songInfo?.item?.album?.name || songData?.album?.name}
            />
            {/* <audio
              className=""
              src={
                prevNextClicked
                  ? songInfo?.item?.preview_url
                  : songData?.preview_url
              }
              preload="metadata"
              ref={audioPlayer}
            /> */}
            <div>
              <h3>{songInfo?.item?.name || songData?.name}</h3>
              <p>
                {songInfo?.item?.artists?.[0]?.name ||
                  songData?.artists?.[0]?.name}
              </p>
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
            // onClick={() =>
            //   spotifyApi.skipToPrevious().then(
            //     function () {
            //       console.log("Skip to previous");
            //     },
            //     function (err) {
            //       //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            //       console.log("Something went wrong!", err);
            //     }
            //   )
            // }
            onClick={() => fetchPreviousSongInfo()}
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
            // onClick={() =>
            //   spotifyApi.skipToNext().then(
            //     function () {
            //       console.log("Skip to next");
            //     },
            //     function (err) {
            //       //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            //       console.log("Something went wrong!", err);
            //     }
            //   )
            // }
            onClick={() => fetchNextSongInfo()}
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
      {/* Player Progress Bar */}
      {/* <div className="grid grid-cols-7 text-xs md:text-base ">
        <div className="col-span-1 md:col-span-2"></div>
        <div className="playerBottom col-span-5 md:col-span-3 flex items-center justify-between mb-5">
          <div className="currentTime">{calculateTime(currentTime)}</div>
          <input
            type="range"
            className="progressBar w-[78%] h-[5px] outline-none"
            ref={progressBar}
            defaultValue="0"
            onChange={changeProgress}
            autoPlay={auto}
          />
          <div className="duration">
            {duration && !isNaN(duration) && calculateTime(duration)
              ? duration && !isNaN(duration) && calculateTime(duration)
              : "00:00"}
          </div>
        </div>
        <div className="col-span-1 md:col-span-2"></div>
      </div> */}
    </div>
  );
}

export default Player;
