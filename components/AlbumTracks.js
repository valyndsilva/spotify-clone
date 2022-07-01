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
import { millisecondsToMinutesAndSeconds } from "../lib/time";

function AlbumTracks({ track, order, albumUrl }) {
  console.log({ track });
  const spotifyApi = useSpotify();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const handlePlayPause = () => {
    console.log({ track });

    console.log(" handlePlay1 triggered!!!!!!!!!");
    setCurrentTrackId(track.id); // triggers useSongInfo
    setIsPlaying(true);
    console.log(track.id);
    spotifyApi.play({
      uris: [track.uri],
    });
  };

  return (
    <div key={track.id} className="text-white px-8 flex-col space-y-1">
      <div
        className="grid grid-cols-2 text-gray-500 px-5 py-4 rounded-lg cursor-pointer hover:bg-gray-900"
        onClick={handlePlayPause}
      >
        <div className="flex items-center space-x-4">
          <p>{order + 1}</p>
          <div className="w-12 h-12 relative">
            <Image
              src={albumUrl}
              alt={track.name}
              layout="fill" // required
              objectFit="cover" // change to suit your needs
              priority
            />
          </div>
          <div className="flex-col">
            <p className="text-white w-36 lg:w-64 truncate">{track.name}</p>
            <p className="w-40">{track.artists[0].name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="md:ml-auto flex items-center space-x-2.5">
            <p>{millisecondsToMinutesAndSeconds(track.duration_ms)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlbumTracks;
