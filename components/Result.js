import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isPlayingState,
  currentAlbumIdState,
  currentSongUriState,
  currentTrackIdState,
  currentAlbumSongUriState,
  currentAlbumSongIdState,
  currentAlbumUriState,
} from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import Image from "next/image";
import { PauseIcon, HeartIcon, PlayIcon } from "@heroicons/react/solid";
import { playState } from "../atoms/playerAtom";

function Result({ track }) {
  // console.log({ track });
  const spotifyApi = useSpotify();
  const [hasLiked, setHasLiked] = useState(false);
  const [currentAlbumId, setCurrentAlbumId] =
    useRecoilState(currentAlbumIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentSongUri, setCurrentSongUri] =
    useRecoilState(currentSongUriState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [currentAlbumSongUri, setCurrentAlbumSongUri] = useRecoilState(
    currentAlbumSongUriState
  );

  const [currentAlbumUri, setCurrentAlbumUri] =
    useRecoilState(currentAlbumUriState);

  const [play, setPlay] = useRecoilState(playState);

  const handlePlayPause = () => {
    console.log({ track });

    console.log(" handlePlayPause triggered in Result Component!!!!!!!!!");
    setCurrentTrackId(track.id); // triggers useSongInfo
    // chooseTrack(track);
    console.log(track.id);
    console.log(currentSongUri);

    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      console.log("handlePlayPause in Track Component:", data.body);
      if (data.body?.is_playing && data.body?.device.id) {
        spotifyApi.pause();
        setPlay(false);
        setIsPlaying(false);
      } else {
        spotifyApi.play({
          uris: [currentSongUri],
        });
        // spotifyApi.play();
        setPlay(true);
        setIsPlaying(true);
      }
    });
  };

  //   const handlePlayPause = () => {
  //     setCurrentAlbumId(track.id); // triggers useSongInfo
  //     spotifyApi.getMyCurrentPlaybackState().then((data) => {
  //       console.log("handlePlayPause in Track Component:", data.body);
  //       setIsPlaying(true);
  //       spotifyApi.play({
  //         uris: [currentSongUri],
  //       });
  //     });
  //   };
  return (
    <div
      className="w-[260px] h-[260px] rounded-[50px] overflow-hidden relative text-white/80 cursor-pointer hover:scale-105 hover:text-white/100 transition duration-200 ease-out group mx-auto"
      onClick={handlePlayPause}
    >
      <img
        src={track.albumUrl}
        alt={track.title}
        className="h-full w-full absolute inset-0 object-cover rounded-[50px] opacity-80 group-hover:opacity-100"
      />
      <div className="absolute bottom-10 inset-x-0 ml-4 flex items-center space-x-3.5">
        <div className="h-10 w-10  rounded-full flex items-center justify-center group-hover:text-green-800 flex-shrink-0">
          {track.uri && play ? (
            <PauseIcon className="text-white text-xl" />
          ) : (
            <PlayIcon className="text-green-600 hover:scale-110 text-xl ml-[1px]" />
          )}
        </div>
        <div className="text-[15px]">
          <h4 className="font-extrabold truncate w-44">{track.title}</h4>
          <h6>{track.artist}</h6>
        </div>
      </div>
    </div>
  );
}

export default Result;
