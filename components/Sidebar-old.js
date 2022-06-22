import React, { useEffect, useState } from "react";
import {
  SearchIcon,
  LibraryIcon,
  PlusIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import { HomeIcon, HeartIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import { currentButtonState } from "../atoms/sidebarAtom";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  // console.log(session);
  // console.log(status);

  const [playlist, setPlaylist] = useState([]);
  // const [playlistId, setPlaylistId] = useState(null);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [currentButton, setCurrentButton] = useRecoilState(currentButtonState);
  // console.log("You picked playlistId:", playlistId);
  // console.log(currentButton);
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylist(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900  h-screen overflow-y-scroll scrollbar-hide hidden  sm:max-w-[12rem] lg:max-w-[15rem] md:inline-flex md:max-w-[15rem] pb-36">
      <div className="space-y-4">

        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => setCurrentButton("Home")}
        >
          <HomeIcon className="w-5 h-5" />
          <p>Home</p>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => setCurrentButton("Search")}
          
        >
          <SearchIcon className="w-5 h-5" />
          <p>Search</p>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => setCurrentButton("Your Library")}
        >
          <LibraryIcon className="w-5 h-5" />
          <p>Your Library</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => setCurrentButton("Create Playlist")}
        >
          <PlusIcon className="w-5 h-5 bg-white p-1 rounded text-black" />
          <p>Create Playlist</p>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => setCurrentButton("Liked Songs")}
        >
          <HeartIcon className="w-5 h-5 text-white p-1 rounded bg-blue-500" />
          <p>Liked Songs</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists */}
        {playlist.map((playlist) => (
          <p
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)}
            className="cursor-pointer hover:text-white"
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
