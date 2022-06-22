import Image from "next/image";
import React, { useEffect, useState } from "react";
import userImg from "../public/spotify-img.png";
import { useSession, signOut } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import { Songs, DropDown } from "./";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];
function Liked() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  // const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  //In Recoil instead of getting the whole Recoil State from the atom, we can get the read-only value of the playlistIdState directly as below
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  // console.log(playlistId);
  useEffect(() => {
    setColor(shuffle(colors).pop()); //shuffles the colors array and pops a color
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((error) =>
        console.log("Something went wrong with the playlist fetching", error)
      );
  }, [spotifyApi, playlistId]);
  // console.log(playlist);
  return (
    <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <DropDown className="absolute top-5 right-8" />
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <div className="w-44 h-44 shadow-2xl rounded cursor-pointer relative">
          {playlist && (
            <Image
              src={playlist?.images?.[0]?.url}
              alt="logo"
              layout="fill" // required
              objectFit="cover" // change to suit your needs
              priority
            />
          )}
        </div>
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Liked;
