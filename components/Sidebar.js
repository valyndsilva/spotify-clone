import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import SidebarOption from "./SidebarOption";
import spotifyImg from "../public/spotify.jpeg";
import { SearchIcon, LibraryIcon, PlusIcon } from "@heroicons/react/outline";
import { HomeIcon, HeartIcon } from "@heroicons/react/solid";
function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  // console.log(session);
  // console.log(status);

  const [playlist, setPlaylist] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  // console.log("You picked playlistId:", playlistId);

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
        <div className="h-10 relative">
          <Image
            src={spotifyImg}
            alt="logo"
            layout="fill" // required
            objectFit="cover" // change to suit your needs
            priority
          />
        </div>

        <SidebarOption Icon={HomeIcon} title="Home" link="/" />

        <SidebarOption Icon={SearchIcon} title="Search" link="/search" />

        <SidebarOption
          Icon={LibraryIcon}
          title="Your Library"
          link="/collection/playlists"
        />

        <hr className="border-t-[0.1px] border-gray-800" />

        <SidebarOption
          Icon={PlusIcon}
          title="Create Playlist"
          link="/playlist"
        />

        <SidebarOption
          Icon={HeartIcon}
          title="Liked Songs"
          link="/collection/tracks"
        />

        <hr className="border-t-[0.1px] border-gray-800" />

        {/* <SidebarOption
            key={playlist.id}
            title={playlist.name}
            onClick={() => setPlaylistId(playlist.id)}
          /> */}

        {/* Playlists */}
        {playlist?.map((playlist) => (
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
