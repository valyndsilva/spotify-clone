import Image from "next/image";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Songs, DropDown, Player } from "./";
import { isPlayingState, likedSongInfoState } from "../atoms/songAtom";
import likedImg from "../public/liked.png";
import { DotsHorizontalIcon, PlayIcon } from "@heroicons/react/solid";

function Liked() {
  const likedSongInfo = useRecoilValue(likedSongInfoState);

  return (
    <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <DropDown className="absolute top-5 right-8" />
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black from-indigo-500 h-80 text-white p-8`}
      >
        <div className="w-44 h-44 shadow-2xl rounded cursor-pointer relative">
          {likedSongInfo && (
            <Image
              src={likedImg}
              alt="logo"
              layout="fill" // required
              objectFit="cover" // change to suit your needs
              priority
            />
          )}
          {/* <img src={likedImg} /> */}
        </div>
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            Liked Songs
          </h1>
          <h6>{likedSongInfo?.total} Liked songs</h6>
        </div>
      </section>
      <div>
        <div className="flex items-center space-x-4 p-8">
          <PlayIcon className=" w-20 h-20 text-green-500 hover:scale-110" />
          <DotsHorizontalIcon className=" w-10 h-10" />
        </div>
        <Songs tracks={likedSongInfo?.items} />
      </div>
    </div>
  );
}

export default Liked;
