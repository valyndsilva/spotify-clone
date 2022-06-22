import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Songs, DropDown } from "./";
import Image from "next/image";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];
function Home() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);

  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop()); //shuffles the colors array and pops a color
  }, [playlistId]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && playlistId) {
      //fetch Playlist Info
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          // console.log(data.body);
          // setPlaylist(data.body);

          const playlistData = {
            id: data.body.id,
            name: data.body.name,
            imageUrl: data.body.images[0].url,
            description: data.body.description,
            uri: data.body.uri,
            tracks: data.body.tracks.items,
          };
          console.log(playlistData);
          setPlaylist(playlistData);
        })
        .catch((error) =>
          console.log("Something went wrong with the playlist fetching", error)
        );
    }
  }, [playlistIdState, spotifyApi, session]);

  console.log({ playlistId });
  console.log({ playlist });
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
              // src={playlist?.images?.[0]?.url}
              src={playlist.imageUrl}
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

export default Home;
