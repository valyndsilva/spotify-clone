import React, { useEffect, useState, Fragment } from "react";
import { useSession } from "next-auth/react";
import { Songs, DropDown } from "./";
import Image from "next/image";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  playlistIdState,
  playlistState,
  playlistSongsState,
} from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";

import { Menu, Transition } from "@headlessui/react";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

import { PlayIcon } from "@heroicons/react/solid";
import { DotsHorizontalIcon, HeartIcon } from "@heroicons/react/outline";
function Home() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);

  const playlistId = useRecoilValue(playlistIdState);
  // const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [playlist, setPlaylist] = useState([]);
  const [playlistSongs, setPlaylistSongs] = useRecoilState(playlistSongsState);

  useEffect(() => {
    setColor(shuffle(colors).pop()); //shuffles the colors array and pops a color
  }, [playlistId]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && playlistId) {
      //fetch Playlist Info
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          // console.log("getPlaylist:", data.body);

          const playlistData = {
            id: data.body.id,
            name: data.body.name,
            imageUrl: data.body.images[0].url,
            description: data.body.description,
            uri: data.body.uri,
            // tracks: data.body.tracks.items,
            tracks: data.body.tracks.items,
          };
          // console.log(playlistData);
          setPlaylist(playlistData);

          const playlistSongsData = data.body.tracks.items;
          // console.log(playlistSongsData);
          setPlaylistSongs(playlistSongsData);
        })
        .catch((error) =>
          console.log("Something went wrong with the playlist fetching", error)
        );
    }
  }, [playlistId, spotifyApi, session]);

  // console.log({ playlistId });
  // console.log({ playlist });
  // console.log({ playlistSongs });
  return (
    <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <DropDown className="absolute top-5 right-8" />
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <div className="w-44 h-44 shadow-2xl rounded cursor-pointer relative">
          {/* {playlist && (
            <Image
              // src={playlist?.images?.[0]?.url}
              src={playlist.imageUrl}
              alt="logo"
              layout="fill" // required
              objectFit="cover" // change to suit your needs
              priority
            />
          )} */}
          <img src={playlist.imageUrl} alt={playlist.name} />
        </div>
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
          <p>{playlist?.description}</p>
        </div>
      </section>
      <section>
        <div className="flex items-center space-x-3 p-8">
          <PlayIcon className=" w-20 h-20 text-green-500 hover:scale-110" />
          <HeartIcon className=" w-10 h-10" />
          <Menu as="div">
            <Menu.Button className="flex items-center px-4 py-3 bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white ">
              <DotsHorizontalIcon className=" w-10 h-10" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute top-56 left-96 w-56 origin-top-right bg-[#1A1A1A] divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <>
                        <div className="flex flex-col space-y-3 px-2 py-2 text-sm tracking-wide">
                          <span className="flex justify-between">Follow</span>
                          <span className="">Go to artist radio</span>
                          <span className="">Share</span>
                          <hr className="border-t-[0.1px] border-gray-800" />
                          <span className="">Open in Desktop app</span>
                        </div>
                      </>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        {playlistSongs.length > 0 &&
          playlistSongs.map((track, index) => (
            <Songs key={track?.track.id} track={track} order={index} />
          ))}
      </section>
    </div>
  );
}

export default Home;
