import { PlayIcon } from "@heroicons/react/solid";
import Link from "next/link";
import React from "react";
import { useRecoilState } from "recoil";
import { artistAlbumIdState } from "../atoms/artistAtom";

function Albums({ albums }) {
  // console.log({ albums });

  return (
    <>
      {albums?.map((album) => (
        <Link
          key={album.id}
          href={{
            pathname: "/album/[id]",
            query: { id: album.id },
          }}
        >
          <div
            className="w-full h-72 overflow-hidden relative text-white/80 cursor-pointer hover:scale-105 hover:text-white/100 transition duration-200 ease-out group mx-auto  bg-[#0D0D0D]"
            //   onClick={handlePlayPause}
          >
            <img
              src={album.imageUrl}
              alt={album.name}
              className="h-[180px] rounded-md object-cover opacity-80 group-hover:opacity-100 mx-auto  my-5 "
            />
            <div className=" inset-x-0 ml-4 flex items-center space-x-3.5  px-5">
              <div className="text-[15px]">
                <h4 className="font-extrabold truncate w-36">{album.name}</h4>
                <h6 className="truncate w-36 capitalize">
                  {album.releaseDate.slice(0, 4)} • {album.type}
                </h6>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

export default Albums;
