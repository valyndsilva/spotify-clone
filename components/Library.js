import React from "react";
import { useSession } from "next-auth/react";
import { RecentlyPlayedPoster } from ".";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState, useRecoilValue } from "recoil";
import Link from "next/link";
import Image from "next/image";
import {
  playlistIdState,
  recentlyPlayedState,
  userPlaylistState,
} from "../atoms/playlistAtom";
import Header from "./Header";
import { likedSongInfoState } from "../atoms/songAtom";
import { categoryPlaylistIdState } from "../atoms/categoryAtom";

function Library() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [userPlaylist, setUserPlaylist] = useRecoilState(userPlaylistState);
  const [categoryPlaylistId, setCategoryPlaylistId] = useRecoilState(
    categoryPlaylistIdState
  );
  // console.log(userPlaylist);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const likedSongInfo = useRecoilValue(likedSongInfoState);
  // console.log(likedSongInfo);
  const recentlyPlayed = useRecoilValue(recentlyPlayedState);
  console.log(recentlyPlayed);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <Header />

      <section className="flex-col text-white p-8 pb-20">
        <div className="grid overflow-y-scroll scrollbar-hide py-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8 p-4">
          <Link href="/collection/tracks">
            <div className=" p-5 space-x-2 space-y-3 ">
              <div className="w-[260px] h-[260px] rounded-lg bg-gradient-to-b to-indigo-500  from-indigo-900 text-white/80 cursor-pointer hover:scale-105 hover:text-white/100 transition duration-200 ease-out group relative">
                <h3 className="font-extrabold text-lg truncate w-44 absolute bottom-10 left-10">
                  Liked Songs
                </h3>
                <h6 className="absolute bottom-5 left-10">
                  {likedSongInfo?.total} Liked songs
                </h6>
                {/* <p className="absolute bottom-5 left-10">{likedSongInfo?.items.map((info)=>{info.track.name
               info.track.artists?.[0].name})}</p> */}
                <p className="absolute bottom-20 left-10">
                  {likedSongInfo?.slice(0, 3).map((info) => (
                    <div className="flex w-72">
                      <span className="font-bold truncate">
                        {info.track.name} &nbsp;
                      </span>
                      <span className="font-light truncate">
                        {info.track?.artists?.[0].name}
                      </span>
                    </div>
                  ))}
                </p>
              </div>
            </div>
          </Link>
          {userPlaylist.length > 0 &&
            userPlaylist?.map((playlist) => (
              <div key={playlist.id}>
                <Link
                  href={`/playlist/${encodeURIComponent(playlist.id)}`}
                  className=""
                >
                  <div
                    onClick={() => {
                      setPlaylistId(playlist.id);
                      setCategoryPlaylistId(playlist.id);
                    }}
                    className="w-[260px] h-[260px] rounded-lg text-white/80 cursor-pointer hover:scale-105 hover:text-white/100 transition duration-200 ease-out group p-5 space-x-2 space-y-3"
                    // onClick={handlePlayPause}
                  >
                    <img
                      src={playlist?.images?.[0].url}
                      alt={playlist.name}
                      className=" inset-0 object-cover rounded-[50px] opacity-80 group-hover:opacity-100"
                    />
                    <div className="p-2 ">
                      <h4 className="font-extrabold truncate w-44">
                        {playlist.name}
                      </h4>
                      <h6 className="truncate">{playlist.description}</h6>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
        <div className="mt-5 ml-5 ">
          {/* Recently Played Tracks Poster*/}
          <h2 className="text-white font-bold mb-3">
            {recentlyPlayed.length > 0 && "Recently Played Songs"}
          </h2>
          <div className="grid overflow-y-scroll scrollbar-hide h-72 py-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8 p-4">
            {recentlyPlayed.length > 0 &&
              recentlyPlayed.map((track) => (
                <RecentlyPlayedPoster track={track} />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Library;
{
  /* <p
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)}
            className="cursor-pointer hover:text-white"
          >
            {playlist.name}
          </p> */
}
