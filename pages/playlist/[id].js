import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { categoryPlaylistIdState } from "../../atoms/categoryAtom";
import {
  playlistIdState,
  playlistSongsState,
  playlistState,
} from "../../atoms/playlistAtom";
import useSpotify from "../../hooks/useSpotify";
import { Sidebar, Songs, DropDown, Player } from "../../components";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const id = router.query["id"];
  // console.log("url params id:", id);

  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  // setPlaylistId(id);
  // console.log("playlistId in [id]", playlistId);

  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const [color, setColor] = useState(null);

  const [playlist, setPlaylist] = useRecoilState(playlistState);
  // console.log({ playlist });

  const [playlistSongs, setPlaylistSongs] = useRecoilState(playlistSongsState);
  // console.log({ playlistSongs });

  useEffect(() => {
    setColor(shuffle(colors).pop()); //shuffles the colors array and pops a color
  }, [playlistId]);

  const fetchPlaylists = () => {
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
          // tracks: data.body.tracks.items,
          tracks: data.body.tracks.items,
        };
        // console.log(playlistData);
        setPlaylist(playlistData);
        const playlistSongsData = data.body.tracks.items;
        // console.log(playlistSongsData);
        setPlaylistSongs(playlistSongsData);
      })
      .catch((error) =>
        console.log("Something went wrong with the playlist fetching", error)
      );
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && playlistId) {
      //fetch Playlists Info
      fetchPlaylists();
    }
  }, [playlistId, spotifyApi, session]);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <div className="flex text-white ">
        <Sidebar />
        <main className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
          <header className="absolute top-5 right-8">
            <DropDown />
          </header>
          <section
            className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
          >
            <div className="w-44 h-44 shadow-2xl rounded cursor-pointer relative">
              {/* {playlist && (
                <Image
                  src={playlist?.images?.[0]?.url}
                  alt="logo"
                  layout="fill" // required
                  objectFit="cover" // change to suit your needs
                  priority
                />
              )} */}
              <img src={playlist.imageUrl} alt={playlist.name} />
            </div>
            <div>
              <p>Playlists</p>
              <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
                {playlist?.name}
              </h1>
              <p>{playlist?.description}</p>
            </div>
          </section>
          <div>
            {/* <Songs tracks={playlist?.tracks?.items} /> */}
            {playlistSongs.length > 0 &&
              playlistSongs.map((track, index) => (
                <Songs key={index} track={track} order={index} />
              ))}
          </div>
        </main>
      </div>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export default Playlist;
