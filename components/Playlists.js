import { PlayIcon } from "@heroicons/react/solid";
import Link from "next/link";
import React from "react";
import { useRecoilState } from "recoil";
import { categoryPlaylistIdState } from "../atoms/categoryAtom";
import { playlistIdState } from "../atoms/playlistAtom";

function Playlists({ playlists }) {
  console.log({ playlists });
  const [categoryPlaylistId, setCategoryPlaylistId] = useRecoilState(
    categoryPlaylistIdState
  );
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  return (
    <>
      {playlists?.map((playlist) => (
        <Link href={`/playlist/${encodeURIComponent(playlist.id)}`}>
          <div
            key={playlist.id}
            onClick={() => {
              setPlaylistId(playlist.id);
              setCategoryPlaylistId(playlist.id);
            }}
            className="w-full h-72 overflow-hidden relative text-white/80 cursor-pointer hover:scale-105 hover:text-white/100 transition duration-200 ease-out group mx-auto  bg-[#0D0D0D]"
            //   onClick={handlePlayPause}
          >
            <img
              src={playlist.imageUrl}
              alt={playlist.name}
              className="h-[180px] rounded-md object-cover opacity-80 group-hover:opacity-100 mx-auto  my-5 "
            />
            <div className=" inset-x-0 ml-4 flex items-center space-x-3.5  px-5">
              <div className="text-[15px]">
                <h4 className="font-extrabold truncate w-36">
                  {playlist.name}
                </h4>
                <h6 className="truncate w-36">{playlist.description}</h6>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

export default Playlists;
