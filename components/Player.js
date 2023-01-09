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
  currentSongAlbumUriState,
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
  VolumeOffIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { playlistIdState } from "../atoms/playlistAtom";

function Player() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [durationMs, setDurationMs] = useState();
  const [currentDurationMin, setCurrentDurationMin] = useState();
  const [totalDurationMin, setTotalDurationMin] = useState();
  const [progressMs, setProgressMs] = useState();

  const playlistId = useRecoilValue(playlistIdState);
  // console.log(playlistId);

  const songData = useSongInfo();
  // console.log("songData from useSongInfo:", songData);
  const [hasLiked, setHasLiked] = useState(false);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [deviceId, setDeviceId] = useRecoilState(deviceIdState);

  const [isDeviceActive, setIsDeviceActive] =
    useRecoilState(isDeviceActiveState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  // const [volume, setVolume] = useRecoilState(volumeState);
  const [volume, setVolume] = useState(50);
  const [isMuted, setMuted] = useState(false);

  const [currentSongUri, setCurrentSongUri] =
    useRecoilState(currentSongUriState);

  const currentSongAlbumUri = useRecoilValue(currentSongAlbumUriState);
  const [trackUrl, setTrackUrl] = useState("");

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

  // Fetch Current Song Track Playing In Player:
  const fetchCurrentSong = async () => {
    if (!currentTrackId && !currentSongUri) {
      // console.log("fetchCurrentSong Triggered!!");

      // Get the User's Currently Playing Track
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        // console.log("Now Playing:", data.body?.item);
        // setSongInfo(data.body?.item);
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

  // Play / Pause Player:

  const playMusic = () => {
    setIsPlaying(true);
    spotifyApi.play();
  };

  const pauseMusic = () => {
    setIsPlaying(false);
    spotifyApi.pause();
  };
  // Handle Play/Pause events if device id available and is_playing is set to true
  const handlePlayPause = async () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      console.log("handlePlayPause in Player Component:", data.body);
      if (data.body?.is_playing && data.body?.device.id) {
        setIsPlaying(false);
        pauseMusic();
      } else {
        setIsPlaying(true);
        playMusic();
      }
    });
  };

  const [songInfo, setSongInfo] = useRecoilState(songInfoState);
  const [prevNextClicked, setPrevNextClicked] = useState(false);

  const fetchNowPlayingInfo = async () => {
    // console.log("fetchNowPlayingInfo triggered!!!!!!!!!");
    return fetch(
      `https://api.spotify.com/v1/me/player/currently-playing`,

      {
        method: "GET",
        headers: {
          //When you make a request to an API endpoint that access token is put inside the header.
          // We can pass around the access token as a bearer with the token.
          Accept: "application/json",
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        },
      }
    );
  };

  function msToMinutesAndSeconds(ms) {
    let minutes = Math.floor(ms / 60000);
    // console.log({ minutes });
    let seconds = Number(((ms % 60000) / 1000).toFixed(0));
    // console.log({ seconds });
    return seconds >= 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  const fetchDuration = async () => {
    const response = await fetchNowPlayingInfo();
    const song = await response.json();
    // console.log({ song });
    setSongInfo(song);
    // console.log("songInfo:", songInfo);
    const progress_ms = song.progress_ms;
    // console.log({ progress_ms });
    setProgressMs(progress_ms);
    const duration_ms = song.item?.duration_ms;
    // console.log({ duration_ms });
    setDurationMs(duration_ms);
    const currentDuration = msToMinutesAndSeconds(0);
    // console.log({ currentDuration });
    setCurrentDurationMin(currentDuration);
    const total_duration = msToMinutesAndSeconds(song.item?.duration_ms);
    // console.log({ total_duration });
    setTotalDurationMin(total_duration);
  };

  useEffect(() => {
    fetchDuration();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        if (progressMs >= durationMs) return;
        if (progressMs <= durationMs) {
          // console.log({ progressMs });
          let progressWidth = (progressMs / durationMs) * 100;
          // console.log({ progressWidth });
          progressBar.current.style.width = `${progressWidth}%`;
          const currentDuration = msToMinutesAndSeconds(progressMs);
          // console.log({ currentDuration });
          setCurrentDurationMin(currentDuration);
          progressMs += 1000;
          setProgressMs(progressMs);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [progressMs, isPlaying, fetchNextSongInfo, fetchPreviousSongInfo]);

  const fetchNextSongInfo = async (id) => {
    // console.log("fetchNextSongInfo triggered!!!!!!!!!");
    setPrevNextClicked(true);
    setIsPlaying(true);
    // spotifyApi.skipToNext();

    await fetch(
      `https://api.spotify.com/v1/me/player/next`,

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          "Content-Length": 0,
        },
      }
    );

    fetchDuration();
  };

  const fetchPreviousSongInfo = async (id) => {
    // console.log("fetchPreviousSongInfo triggered!!!!!!!!!");

    setPrevNextClicked(true);
    setIsPlaying(true);
    //  spotifyApi.skipToPrevious();

    await fetch(`https://api.spotify.com/v1/me/player/previous`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
      },
    });

    fetchDuration();
  };

  const progressBar = useRef(); //   reference to our progressbar

  return (
    <div className="flex flex-col w-full  bg-gradient-to-b from-black to-gray-900 text-white border-t border-gray-800">
      <div className="h-20 grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
        {(prevNextClicked ? songInfo : songData) ? (
          <div className="flex items-center space-x-4">
            <img
              className="hidden md:inline w-10 h-10 cursor-pointer"
              src={
                songInfo?.item?.album?.images?.[0]?.url ||
                songData?.album?.images?.[0]?.url
              }
              alt={songInfo?.item?.album?.name || songData?.album?.name}
            />
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
            onClick={() =>
              fetchPreviousSongInfo(songInfo?.item?.id || songData?.id)
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
              fetchNextSongInfo(songInfo?.item?.id || songData?.id)
            }
          />
          <ReplyIcon className="playerButton" />
        </div>
        <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
          {/* <VolumeDownIcon
            className="playerButton"
            onClick={() => volume > 0 && setVolume(volume - 10)}
          /> */}
          <span className="sounds-icon" onClick={() => setMuted(!isMuted)}>
            {isMuted ? (
              <VolumeOffIcon className="playerButton" />
            ) : (
              <VolumeUpIcon className="playerButton" />
            )}
          </span>
          <input
            className="w-14 md:w-28"
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            // onChange={(e) => setVolume(Number(e.target.value))}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (Number(e.target.value) === 0) {
                setMuted(true);
              } else if (Number(e.target.value) > 0) {
                setMuted(false);
              }
            }}
          />
          <VolumeUpIcon
            className="playerButton"
            onClick={() => volume < 100 && setVolume(volume + 10)}
          />
        </div>
      </div>

      {/* Custom Progress Area */}
      <div className="grid grid-cols-7 text-xs md:text-base mb-10">
        <div className="col-span-1 md:col-span-2"></div>
        <div className="progress-area col-span-5 md:col-span-3 h-[6px] w-full bg-red rounded-full cursor-pointer bg-white/30">
          <div
            className="progress-bar h-[6px] w-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 relative before:content-['*'] before:absolute before:h-[12px] before:w-[12px] before:bg-[#f0f0f0] before:rounded-full before:top-1/2 before:right-[-5px] before:translate-y-[-50%] bg-inherit before:opacity-0 before:transition-all before:ease-in-out before:hover:opacity-100"
            ref={progressBar}
            id="progressBar"
          ></div>
          <div className="timer flex items-center justify-between mt-1">
            <span className="current text-xs text-gray-400">
              {currentDurationMin}
            </span>
            <span className="duration text-xs text-gray-400">
              {totalDurationMin}
            </span>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2"></div>
      </div>
    </div>
  );
}

export default Player;
