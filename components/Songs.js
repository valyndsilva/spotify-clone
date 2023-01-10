// Home.js, playlist/[id].js uses Songs.js
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { millisecondsToMinutesAndSeconds } from "../lib/time";
import {
  currentSongUriState,
  currentTrackIdState,
  isPlayingState,
  songInfoState,
} from "../atoms/songAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import Link from "next/link";
import { PlayIcon } from "@heroicons/react/solid";
import { PauseIcon } from "@heroicons/react/outline";
import { artistIdState } from "../atoms/artistAtom";
import { playlistIdState } from "../atoms/playlistAtom";
import {
  currentDurationMinState,
  currentProgressWidthState,
  durationMsState,
  playerSongState,
  progressMsState,
  totalDurationMinState,
} from "../atoms/playerAtom";
import { useSession } from "next-auth/react";
import useSongInfo from "../hooks/useSongInfo";

function Songs({ track, order }) {
  // console.log(track);
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const [currentSongUri, setCurrentSongUri] =
    useRecoilState(currentSongUriState);
  const [volume, setVolume] = useState(50);
  const [playerSong, setPlayerSong] = useRecoilState(playerSongState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  // const [artistId, setArtistId] = useRecoilState(artistIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  // const artistid = track.track.artists?.[0].id;
  // console.log({ artistid });
  const playlistId = useRecoilValue(playlistIdState);
  // console.log(playlistId);

  const [songInfo, setSongInfo] = useRecoilState(songInfoState);
  const [durationMs, setDurationMs] = useRecoilState(durationMsState);
  const [currentDurationMin, setCurrentDurationMin] = useRecoilState(
    currentDurationMinState
  );
  const [totalDurationMin, setTotalDurationMin] = useRecoilState(
    totalDurationMinState
  );
  const [progressMs, setProgressMs] = useRecoilState(progressMsState);
  const [currentProgressWidth, setCurrentProgressWidth] = useRecoilState(
    currentProgressWidthState
  );

  const fetchPlaylist = async (playlistId) => {
    // console.log("fetchPlaylist triggered!!!!!!!!!");
    return fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,

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

  const handlePlay = async () => {
    // const response = await fetchPlaylist(playlistId);
    // const songsPlaylist = await response.json();
    // console.log({ songsPlaylist });
    // console.log(songsPlaylist?.tracks.items);
    // console.log("handlePlay triggered in Songs Component!!!!!!!!");
    // console.log(track.track);
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    // console.log(track);
    // console.log(track.track.uri);

    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  // // Fetch Current Song Track Playing In Player:
  // const fetchCurrentSong = async () => {
  //   if (!currentTrackId && !currentSongUri) {
  //     // console.log("fetchCurrentSong Triggered!!");

  //     // Get the User's Currently Playing Track
  //     spotifyApi.getMyCurrentPlayingTrack().then((data) => {
  //       console.log("Now Playing:", data.body);
  //       // setSongInfo(data.body?.item);
  //       setCurrentTrackId(data.body?.item?.id);
  //       // console.log(currentTrackId);

  //       const songUri = data.body?.item?.uri;
  //       // console.log({ songUri });
  //       setCurrentSongUri(songUri);

  //       // Get Information About The User's Current Playback State
  //       spotifyApi.getMyCurrentPlaybackState().then((data) => {
  //         setIsPlaying(data.body?.is_playing);
  //       });
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (spotifyApi.getAccessToken() && !currentTrackId && !currentSongUri) {
  //     fetchCurrentSong();
  //     setVolume(50);
  //   }
  // }, [currentTrackId, currentSongUri, spotifyApi, session]);

  // // Play / Pause Player:

  // const playMusic = () => {
  //   setIsPlaying(true);
  //   setCurrentTrackId(track.track.id);
  //   // spotifyApi.play();
  //   spotifyApi.play({
  //     uris: [track.track.uri],
  //   });
  // };

  // const pauseMusic = () => {
  //   setIsPlaying(false);
  //   // spotifyApi.pause();
  //   spotifyApi.pause({
  //     uris: [track.track.uri],
  //   });
  // };
  // // Handle Play/Pause events if device id available and is_playing is set to true
  // const handlePlayPause = async () => {
  //   spotifyApi.getMyCurrentPlaybackState().then((data) => {
  //     console.log("handlePlayPause in Player Component:", data.body);
  //     if (data.body?.is_playing && data.body?.device.id) {
  //       setIsPlaying(false);
  //       pauseMusic();
  //     } else {
  //       setIsPlaying(true);
  //       playMusic();
  //     }
  //   });
  // };

  // const fetchNowPlayingInfo = async () => {
  //   // console.log("fetchNowPlayingInfo triggered!!!!!!!!!");
  //   return fetch(
  //     `https://api.spotify.com/v1/me/player/currently-playing`,

  //     {
  //       method: "GET",
  //       headers: {
  //         //When you make a request to an API endpoint that access token is put inside the header.
  //         // We can pass around the access token as a bearer with the token.
  //         Accept: "application/json",
  //         Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
  //       },
  //     }
  //   );
  // };

  // function msToMinutesAndSeconds(ms) {
  //   let minutes = Math.floor(ms / 60000);
  //   // console.log({ minutes });
  //   let seconds = Number(((ms % 60000) / 1000).toFixed(0));
  //   // console.log({ seconds });
  //   return seconds >= 60
  //     ? minutes + 1 + ":00"
  //     : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  // }

  // const fetchDuration = async () => {
  //   const response = await fetchNowPlayingInfo();
  //   const song = await response.json();
  //   // console.log({ song });
  //   setSongInfo(song);
  //   // console.log("songInfo:", songInfo);
  //   const progress_ms = song.progress_ms;
  //   // console.log({ progress_ms });
  //   setProgressMs(progress_ms);
  //   const duration_ms = song.item?.duration_ms;
  //   // console.log({ duration_ms });
  //   setDurationMs(duration_ms);
  //   const currentDuration = msToMinutesAndSeconds(0);
  //   // console.log({ currentDuration });
  //   setCurrentDurationMin(currentDuration);
  //   const total_duration = msToMinutesAndSeconds(song.item?.duration_ms);
  //   // console.log({ total_duration });
  //   setTotalDurationMin(total_duration);
  // };

  // useEffect(() => {
  //   fetchDuration();
  // }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (isPlaying) {
  //       if (progressMs >= durationMs) return;
  //       if (progressMs <= durationMs) {
  //         // console.log({ progressMs });
  //         let progressWidth = (progressMs / durationMs) * 100;
  //         // console.log({ progressWidth });
  //         setCurrentProgressWidth(progressWidth);
  //         // progressBar.current.style.width = `${progressWidth}%`;
  //         const currentDuration = msToMinutesAndSeconds(progressMs);
  //         // console.log({ currentDuration });
  //         setCurrentDurationMin(currentDuration);
  //         progressMs += 1000;
  //         setProgressMs(progressMs);
  //       }
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [progressMs, isPlaying]);

  return (
    <div className="text-white px-8 flex-col space-y-1 group">
      <div
        className="grid grid-cols-2 text-gray-500 px-5 py-4 rounded-lg cursor-pointer active:bg-slate-600  hover:bg-gray-900"
        onClick={handlePlay}
        // onClick={handlePlayPause}
      >
        <div className="flex items-center space-x-4">
          <p>{order + 1}</p>
          <div className="w-10 h-10 relative">
            <Image
              src={track?.track.album.images[0].url}
              alt={track?.track.name}
              layout="fill" // required
              objectFit="cover" // change to suit your needs
              priority
            />
          </div>
          <div>
            <p className="text-white w-36 lg:w-64 truncate">
              {track?.track.name}
            </p>
            <Link
              href={{
                pathname: "/artist/[id]",
                query: { id: track?.track.artists?.[0].id },
              }}
            >
              <p className="w-40  group-hover:text-white group-hover:underline">
                {track?.track.artists[0].name}
              </p>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-between ml-auto md:ml-0 ">
          <p className="hidden md:inline w-40">{track?.track.album.name}</p>
          <p>{millisecondsToMinutesAndSeconds(track?.track.duration_ms)}</p>
        </div>
      </div>
    </div>
  );
}

export default Songs;
