import Link from "next/link";
import React from "react";

function Artists({ artist }) {
  // console.log({ artist });

  return (
    <>
      <Link
        key={artist.id}
        href={{
          pathname: "/artist/[id]",
          query: { id: artist.id },
        }}
      >
        <div className="w-[200px] h-[250px] overflow-hidden relative text-white/80 cursor-pointer hover:scale-105 hover:text-white/100 transition duration-200 ease-out group mx-auto  bg-[#181818]">
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="h-[150px] w-[150px] object-cover rounded-full opacity-80 group-hover:opacity-100 mx-auto  my-5 "
          />
          <div className=" inset-x-0 ml-4 flex items-center space-x-3.5  px-5">
            <div className="text-[15px]">
              <p className="w-40  group-hover:text-white group-hover:underline">
                {artist.name}
              </p>
              <h6>Artist</h6>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default Artists;
