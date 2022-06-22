import Image from "next/image";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  categoryIdState,
  categoryNameState,
  categoryPlaylistsState,
  categoryPlaylistIdState,
} from "../../atoms/categoryAtom";
import useSpotify from "../../hooks/useSpotify";
import { Sidebar, DropDown, Player } from "../../components";
import Link from "next/link";

function Genre() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const categoryId = useRecoilValue(categoryIdState);
  console.log({ categoryId });

  const categoryName = useRecoilValue(categoryNameState);
  console.log({ categoryName });

  const [categoryPlaylistId, setCategoryPlaylistId] = useRecoilState(
    categoryPlaylistIdState
  );
  console.log({ categoryPlaylistId });

  const [categoryPlaylists, setCategoryPlaylists] = useRecoilState(
    categoryPlaylistsState
  );
  console.log({ categoryPlaylists });

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

  return (
    <div className="bg-black h-screen overflow-hidden">
      <div className="flex text-white">
        <Sidebar />
        <main className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
          <header className="grid justify-items-end p-8">
            <DropDown />
          </header>

          <h1 className="text-8xl font-semibold capitalize p-8">
            {categoryName}
          </h1>
          <section className="grid grid-cols-3  md:grid-cols-3  lg:grid-cols-7 lg:gap-4 space-x-4 text-white p-8">
            {categoryPlaylists.length > 0 &&
              categoryPlaylists.map((categoryPlaylist, index) => (
                <div
                  key={index}
                  onClick={() => setCategoryPlaylistId(categoryPlaylist.id)}
                >
                  <Link
                    href={`/playlist/${encodeURIComponent(
                      categoryPlaylist.id
                    )}`}
                    className=""
                  >
                    <div className="space-y-2 my-4">
                      <div className="w-44 h-44 shadow-2xl rounded cursor-pointer relative">
                        <Image
                          src={categoryPlaylist?.images?.[0]?.url}
                          layout="fill" // required
                          objectFit="cover" // change to suit your needs
                          priority
                        />
                      </div>
                      <div className="">
                        <h2 className="text-sm md:text-md xl:text-xl font-bold">
                          {categoryPlaylist?.name}
                        </h2>
                        <p> {categoryPlaylist?.description}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
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
