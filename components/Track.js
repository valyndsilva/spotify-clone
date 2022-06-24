import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isPlayingState,
  currentAlbumIdState,
  currentAlbumSongUriState,
  currentAlbumSongIdState,
  currentTrackIdState,
} from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import Image from "next/image";
import { PauseIcon, HeartIcon, PlayIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { set } from "lodash";

function Track({
  track,
  albumId,
  albumUri,
  albumImg,
  albumName,
  artistName,
  order,
}) {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [hasLiked, setHasLiked] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [currentAlbumId, setCurrentAlbumId] =
    useRecoilState(currentAlbumIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const currentAlbumSongUri = useRecoilValue(currentAlbumSongUriState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);


  const handlePlay = () => {
    console.log({
      track,
      albumId,
      albumUri,
      artistName,
      albumName,
      albumImg,
      currentAlbumSongUri,
    });

    setCurrentAlbumId(albumId); // triggers useAlbumInfo and Player
    setIsPlaying(true);
    spotifyApi.play({
      uris: [currentAlbumSongUri],
    });
  };
  return (
    <div
      className="grid grid-cols-2 text-gray-500 px-5 py-4 rounded-lg cursor-pointer hover:bg-gray-900"
      onClick={handlePlay}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <div className="w-12 h-12 relative">
          <Image
            src={albumImg}
            alt={albumName}
            layout="fill" // required
            objectFit="cover" // change to suit your needs
            priority
          />
        </div>
        <div className="flex-col">
          <p className="text-white w-36 lg:w-64 truncate">{albumName}</p>
          <p className="w-40">{artistName}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="md:ml-auto flex items-center space-x-2.5">
          <div className="flex items-center rounded-full border-2 border-[#262626] w-[60px] h-10 relative cursor-pointer group-hover:border-white/40">
            <HeartIcon
              className={`w-5 h-5 ml-3 ${
                hasLiked ? "text-[#1ED760]" : "text-[#868686]"
              }`}
              onClick={() => setHasLiked(!hasLiked)}
            />
            {/* {isPlaying ? (
              <>
                <div
                  className="h-10 w-10 rounded-full border  flex items-center justify-center absolute -right-0.5 icon hover:scale-110"
                  // onClick={playSong}
                  onClick={handlePlay}
                >
                  <PauseIcon className="text-white text-xl" />
                </div>
              </>
            ) : (
              <>
                <div
                  className="h-10 w-10 rounded-full text-gray-400 font-thin flex items-center justify-center absolute -right-0.5 icon hover:scale-110"
                  // onClick={playSong}
                  onClick={handlePlay}
                >
                  <PlayIcon className="text-white text-xl ml-[1px]" />
                </div>
              </>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Track;
