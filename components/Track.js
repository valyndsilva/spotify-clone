import React, { useState } from "react";
import Song from "./Song";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistState, currentTrackIdState } from "../atoms/playlistAtom";
import { isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import Image from "next/image";
import { PauseIcon, HeartIcon, PlayIcon } from "@heroicons/react/solid";
import {} from "@heroicons/react/outline";

function Track({ track }) {
  console.log({ track });

  const spotifyApi = useSpotify();
  const [hasLiked, setHasLiked] = useState(false);

  //   const [currentTrackId, setCurrentTrackId]=useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const playSong = () => {
    // setCurrentTrackId(track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.uri],
    });
  };

  const handlePlay = () => {
    // setPlayingTrack(track);
    // if (track.uri === playingTrack.uri) {
    //   setPlay(!play);
    // }
  };
  //   <Song key={track.id} track={track} order={index} />
  return (
    <div className="text-white px-8 flex-col space-y-1 pb-28">
      {track.map((track, index) => (
        <div
          className="grid grid-cols-2 text-gray-500 px-5 py-4 rounded-lg cursor-pointer hover:bg-gray-900"
          onClick={playSong}
        >
          <div className="flex items-center space-x-4">
            <p>{index + 1}</p>
            <div className="w-10 h-10 relative">
              <Image
                src={track.albumUrl}
                alt={track.name}
                layout="fill" // required
                objectFit="cover" // change to suit your needs
                priority
              />
            </div>
            <div>
              <p className="text-white w-36 lg:w-64 truncate">{track.name}</p>
              <p className="w-40">{track.artist}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-between ml-auto md:ml-0 ">
              <p className="hidden md:inline w-40">{track.title}</p>
            </div>
            <div className="md:ml-auto flex items-center space-x-2.5">
              <div className="flex items-center rounded-full border-2 border-[#262626] w-[85px] h-10 relative cursor-pointer group-hover:border-white/40">
                <HeartIcon
                  className={`w-5 h-5 ml-3 ${
                    hasLiked ? "text-[#1ED760]" : "text-[#868686]"
                  }`}
                  onClick={() => setHasLiked(!hasLiked)}
                />
                {track.uri && isPlayingState ? (
                  <>
                    <div
                      className="h-10 w-10 rounded-full border  flex items-center justify-center absolute -right-0.5 icon hover:scale-110"
                      onClick={handlePlay}
                    >
                      <PauseIcon className="text-white text-xl" />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="h-10 w-10 rounded-full text-gray-400 font-thin flex items-center justify-center absolute -right-0.5 icon hover:scale-110"
                      onClick={handlePlay}
                    >
                      <PlayIcon className="text-white text-xl ml-[1px]" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Track;
