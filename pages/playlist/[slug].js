import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { categoryPlaylistIdState } from "../../atoms/categoryAtom";
import { playlistState } from "../../atoms/playlistAtom";
import useSpotify from "../../hooks/useSpotify";
import { Sidebar, Songs, DropDown, Player } from "../../components";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];
function Playlist() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const [color, setColor] = useState(null);

  const categoryPlaylistId = useRecoilValue(categoryPlaylistIdState);
  console.log({ categoryPlaylistId });

  const [playlist, setPlaylist] = useRecoilState(playlistState);
  console.log({ playlist });

  useEffect(() => {
    setColor(shuffle(colors).pop()); //shuffles the colors array and pops a color
  }, [categoryPlaylistId]);

  const fetchPlaylists = () => {
    spotifyApi
      .getPlaylist(categoryPlaylistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((error) =>
        console.log("Something went wrong with the playlist fetching", error)
      );
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && categoryPlaylistId) {
      //fetch Playlists Info
      fetchPlaylists();
    }
  }, [categoryPlaylistIdState, spotifyApi, session]);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <div className="flex text-white ">
        <Sidebar />
        <main className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
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
              <p>Playlists</p>
              <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
                {playlist?.name}
              </h1>
            </div>
          </section>
          <div>
            <Songs />
          </div>
        </main>
      </div>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context); // prefetches session info so it can use the info before hand. Ex: render the playlist image in MainView.js
  return {
    props: {
      session,
    },
  };
}
export default Playlist;
