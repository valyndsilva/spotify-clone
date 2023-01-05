import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  categoryIdState,
  categoryNameState,
  categoryPlaylistsState,
  categoryPlaylistIdState,
} from "../../atoms/categoryAtom";
import useSpotify from "../../hooks/useSpotify";
import { Sidebar, DropDown, Player, Poster } from "../../components";
import Link from "next/link";
import { playlistIdState } from "../../atoms/playlistAtom";
import { newReleasesState } from "../../atoms/searchAtom";
import { shuffle } from "lodash";
function Genre() {
  const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
  ];

  const [color, setColor] = useState(null);
  const [categoryPlaylistId, setCategoryPlaylistId] = useRecoilState(
    categoryPlaylistIdState
  );
  useEffect(() => {
    console.log({ categoryPlaylistId });
    setColor(shuffle(colors).pop()); //shuffles the colors array and pops a color
  }, [categoryPlaylistId]);

  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const categoryId = useRecoilValue(categoryIdState);
  console.log({ categoryId });

  const categoryName = useRecoilValue(categoryNameState);
  console.log({ categoryName });
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  const [categoryPlaylists, setCategoryPlaylists] = useRecoilState(
    categoryPlaylistsState
  );
  console.log({ categoryPlaylists });

  const [newReleases, setNewReleases] = useRecoilState(newReleasesState);

  const fetchCategoryPlaylists = () => {
    // Get Playlists for a Category
    spotifyApi
      .getPlaylistsForCategory(categoryId, {
        country: "GB",
        limit: 14,
        offset: 0,
      })
      .then((data) => {
        console.log(data.body);
        const PlaylistList = data.body.playlists.items;
        console.log(`playlists for ${categoryId}:`, PlaylistList);
        setCategoryPlaylists(PlaylistList);
      })
      .catch((error) => console.log("Something went wrong!", error));
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && categoryId && categoryName) {
      //fetch Categories Info
      fetchCategoryPlaylists();
    }
  }, [categoryIdState, categoryNameState, spotifyApi, session]);

  // New Releases...
  const fetchNewReleases = () => {
    spotifyApi
      .getNewReleases({})
      .then((res) => {
        console.log(res.body);
        console.log("List of New Releases:", res.body.albums.items);

        setNewReleases(
          res.body.albums.items.map((track) => {
            return {
              track: track,
              id: track.id,
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: track.images[0].url,
            };
          })
        );
      })
      .catch((error) => console.log("Something went wrong!", error));
    console.log({ newReleases });
  };
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      //fetch New Releases
      fetchNewReleases();
    }
  }, [spotifyApi, session]);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <div className="flex text-white">
        <Sidebar />
        <main className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
          <header className="absolute top-5 right-8">
            <DropDown className="absolute top-5 right-8" />
          </header>

          {/* <section className="bg-red-500 ml-10 py-4 space-y-2 md:max-w-6xl flex-grow md:mr-2.5"> */}
          <section
            className={` bg-gradient-to-b to-black ${color} h-80 text-white p-8  max-w-7xl`}
          >
            <h1 className="text-8xl font-bold capitalize p-8">
              {categoryName}
            </h1>
            <h2 className="text-xl font-semibold ml-10 capitalize">
              Popular playlists
            </h2>
            {/* <div className="grid grid-cols-3  md:grid-cols-3  lg:grid-cols-5 lg:gap-4 space-x-4 text-white p-4 ml-5 overflow-y-scroll scrollbar-hide h-72"> */}
            <div className="grid grid-cols-3  md:grid-cols-3  lg:grid-cols-5 lg:gap-4 space-x-4 text-white p-4 ml-5 overflow-y-scroll scrollbar-hide h-[60vh]">
              {categoryPlaylists.length > 0 &&
                categoryPlaylists.map((categoryPlaylist, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setCategoryPlaylistId(categoryPlaylist.id);
                      setPlaylistId(categoryPlaylist.id);
                    }}
                  >
                    <Link
                      href={{
                        pathname: "/playlist/[id]",
                        query: { id: categoryPlaylist.id },
                      }}
                    >
                      <div className="space-y-2 my-4">
                        <div className="w-44 h-44 shadow-2xl rounded-md cursor-pointer relative">
                          <Image
                            src={categoryPlaylist?.images?.[0]?.url}
                            layout="fill" // required
                            objectFit="cover" // change to suit your needs
                            priority
                            className="shadow-2xl rounded-md"
                          />
                        </div>
                        <div className="">
                          <h2 className="truncate text-sm md:text-md xl:text-xl font-bold">
                            {categoryPlaylist?.name}
                          </h2>
                          <p className="truncate">
                            {categoryPlaylist?.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>

            {/* Tracks */}
            {/* <h2 className="text-xl font-semibold ml-10 pt-5 capitalize">
              New Releases
            </h2>
            <div className="grid ml-5 overflow-y-scroll scrollbar-hide h-[350px] py-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8 p-4">
              {newReleases.length > 0 &&
                newReleases.map((track) => <Poster track={track} />)}
            </div> */}
          </section>
        </main>
      </div>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

// export async function getServerSideProps(context) {
//   const session = await getSession(context); // prefetches session info so it can use the info before hand. Ex: render the playlist image in MainView.js
//   return {
//     props: {
//       session,
//     },
//   };
// }
export default Genre;
