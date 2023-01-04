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
import { millisecondsToMinutesAndSeconds } from "../lib/time";
import Link from "next/link";

function Tracks({ track, order }) {
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

  const handlePlay = () => {
    // console.log({ track });
    // console.log(" handlePlay triggered!!!!!!!!!");
    setCurrentTrackId(track.id); // triggers useSongInfo
    setIsPlaying(true);
    console.log(track.id);
    spotifyApi.play({
      uris: [track.uri],
    });
  };

  return (
    <div key={track.id} className="text-white px-8 flex-col space-y-1 group">
      <div
        className="grid grid-cols-2 text-gray-500 px-5 py-4 rounded-lg cursor-pointer hover:bg-gray-900"
        onClick={handlePlay}
      >
        <div className="flex items-center space-x-4">
          <p>{order + 1}</p>
          {/* <div className="w-12 h-12 relative"> */}
          {/* <Image
              src={track.albumUrl}
              alt={track.title}
              layout="fill" // required
              objectFit="cover" // change to suit your needs
              priority
            /> */}
          {/* </div> */}
          <img
            src={track.albumUrl}
            alt={track.title}
            className="object-cover w-12 h-12"
          />
          <div className="flex-col">
            <p className="text-white w-36 lg:w-64 truncate">{track.title}</p>
            <Link
              href={{
                pathname: "/artist/[id]",
                query: { id: track.track.artists?.[0].id },
              }}
            >
              <p className="w-40 group-hover:text-white group-hover:underline">
                {track.artist}
              </p>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-between ml-auto md:ml-0 ">
          <p className="hidden md:inline w-40">{track.albumName}</p>
          <p>{millisecondsToMinutesAndSeconds(track.duration)}</p>
        </div>
      </div>
    </div>
  );
}

export default Tracks;
