import { PlayIcon } from "@heroicons/react/solid";
import React from "react";

function Artists({ artists }) {
  console.log({ artists });

  return (
    <>
      {artists?.map((artist) => (
        <div
          key={artist.id}
          className="w-[200px] h-[250px] overflow-hidden relative text-white/80 cursor-pointer hover:scale-105 hover:text-white/100 transition duration-200 ease-out group mx-auto  bg-[#0D0D0D]"
          //   onClick={handlePlayPause}
        >
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="h-[150px] w-[150px] object-cover rounded-full opacity-80 group-hover:opacity-100 mx-auto  my-5 "
          />
          <div className=" inset-x-0 ml-4 flex items-center space-x-3.5  px-5">
            <div className="text-[15px]">
              <h4 className="font-extrabold truncate w-36">{artist.name}</h4>
              <h6>Artist</h6>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Artists;
