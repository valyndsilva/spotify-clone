import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DropDown, SearchInput, Songs, Tracks, Results } from ".";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState, useRecoilValue } from "recoil";
import Link from "next/link";
import Image from "next/image";
import {
  categoriesState,
  categoryIdState,
  categoryNameState,
  categoryPlaylistIdState,
} from "../atoms/categoryAtom";
import {
  newReleasesState,
  searchResultsState,
  searchState,
} from "../atoms/searchAtom";
import { ViewGridIcon } from "@heroicons/react/solid";
import RecentlyPlayed from "./RecentlyPlayed";
import {
  newReleasesPlaylistSongsState,
  recentlyPlayedSongsState,
} from "../atoms/playlistAtom";
import Header from "./Header";
import { shuffle } from "lodash";
function Search() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const [categories, setCategories] = useRecoilState(categoriesState);
  console.log(categories);

  const [categoryId, setCategoryId] = useRecoilState(categoryIdState);
  const [categoryName, setCategoryName] = useRecoilState(categoryNameState);
  const [categoryPlaylistId, setCategoryPlaylistId] = useRecoilState(
    categoryPlaylistIdState
  );

  const [search, setSearch] = useRecoilState(searchState);
  const [searchResults, setSearchResults] = useRecoilState(searchResultsState);

  const [newReleases, setNewReleases] = useRecoilState(newReleasesState);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  const [newReleasesPlaylistSongs, setNewReleasesPlaylistSongs] =
    useRecoilState(newReleasesPlaylistSongsState);
  const [recentlyPlayedSongs, setRecentlyPlayedSongs] = useRecoilState(
    recentlyPlayedSongsState
  );

  const colors = [
    "from-indigo-500",
    "from-blue-700",
    "from-green-500",
    "from-red-700",
    "from-yellow-500",
    "from-pink-700",
    "from-purple-500",
    "from-slate-700",
    "from-orange-500",
    "from-sky-700",
    "from-cyan-500",
    "from-red-700",
    "from-indigo-500",
    "from-blue-700",
    "from-green-500",
    "from-yellow-500",
    "from-pink-700",
    "from-purple-500",
    "from-slate-700",
    "from-orange-500",
    "from-sky-700",
    "from-cyan-500",
  ];

  // Searching...
  const fetchSearchResults = () => {
    if (!search) return setSearchResults([]);
    let cancel = false;

    spotifyApi
      .searchTracks(search)
      .then((res) => {
        if (cancel) return;
        console.log("Search Results:", res.body);
        console.log("Search Results:", res.body.tracks.items);
        setSearchResults(
          res.body.tracks.items.map((track) => {
            return {
              id: track.id,
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: track.album.images[0].url,
              popularity: track.popularity,
            };
          })
        );
      })
      .catch((error) => console.log("Something went wrong!", error));

    spotifyApi
      .searchArtists(search)
      .then((data) => {
        console.log("Search artists:", data.body);
      })
      .catch((error) => console.log("Something went wrong!", error));

    // Search playlists whose name or description contains 'workout'
    spotifyApi
      .searchPlaylists(search)
      .then((data) => {
        console.log("Found playlists:", data.body);
      })
      .catch((err) => {
        console.log("Something went wrong!", err);
      });

    return () => (cancel = true);
  };

  // New Releases...
  const fetchNewReleases = () => {
    spotifyApi
      .getNewReleases()
      .then((res) => {
        // console.log(res.body);
        // console.log("List of New Releases:", res.body.albums.items);

        setNewReleases(
          res.body.albums.items.map((track) => {
            setNewReleasesPlaylistSongs(track);
            return {
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
    // console.log({ newReleasesPlaylistSongs });
  };

  // Get Current User's Recently Played Tracks
  const fetchRecentlyPlayed = () => {
    spotifyApi
      .getMyRecentlyPlayedTracks({ limit: 20 })
      .then((res) => {
        // console.log(res.body);
        console.log("List of Recently Played Tracks:", res.body.items);
        setRecentlyPlayed(
          res.body.items.map(({ track }) => {
            setRecentlyPlayedSongs(track);
            return {
              id: track.id,
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: track.album.images[0].url,
            };
          })
        );
      })
      .catch((error) => console.log("Something went wrong!", error));
    // console.log({ recentlyPlayedSongs });
  };

  // Get a List of Categories
  const fetchCategories = () => {
    spotifyApi
      .getCategories({
        limit: 48,
        offset: 0,
        country: "GB",
      })
      .then((data) => {
        const categoryList = data.body.categories.items;
        // console.log("List of Categories:", categoryList);
        setCategories(categoryList);
        categories.length > 0 &&
          categories.map((category, index) => {
            // console.log(category.id);
            setCategoryPlaylistId(category.id);
          });
      })
      .catch((error) => console.log("Something went wrong!", error));
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      //fetch Categories Info
      fetchCategories();

      //fetch New Releases
      fetchNewReleases();

      //fetch Recently Played
      fetchRecentlyPlayed();
    }
  }, [spotifyApi, session]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && search) {
      //fetch Search Results
      fetchSearchResults();
    }
  }, [search, spotifyApi, session]);

  return (
    <div className="text-white flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <Header />

      <section className="bg-black ml-24 py-4 space-y-8 md:max-w-6xl flex-grow md:mr-2.5">
        {/* Search Results */}
        <div className="grid overflow-y-scroll scrollbar-hide h-72 py-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 p-4">
          {searchResults.length === 0 ? (
            <Results tracks={newReleases} />
          ) : (
            <Results tracks={searchResults} />
          )}
        </div>

        <div className="grid grid-cols-12 gap-3">
          {/* Tracks */}
          <div className="col-span-8 mb-5">
            <h2 className="text-white font-bold mb-3">
              {searchResults.length === 0 ? "New Releases" : "Songs"}
            </h2>
            <div className="space-y-3 border-2 border-[#262626] rounded-2xl p-3 bg-[#0D0D0D] overflow-y-scroll h-72 scrollbar-hide scrollbar-thumb-gray-600 scrollbar-thumb-rounded hover:scrollbar-thumb-gray-500">
              {searchResults.length === 0 ? (
                <Tracks tracks={newReleases} />
              ) : (
                <Tracks tracks={searchResults} />
              )}
            </div>
          </div>

          {/* Recently Played Tracks */}
          <div className="col-span-4">
            <div className=" bg-[#0D0D0D] border-2 border-[#262626] p-4  rounded-xl space-y-4 mt-8 h-74">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold text-sm">
                  Recently Played
                </h4>
                <ViewGridIcon className="text-[#686868] h-6" />
              </div>

              <div className="space-y-4 overflow-y-scroll overflow-x-hidden scrollbar-hide h-40">
                {recentlyPlayed.map((track, index) => (
                  <RecentlyPlayed key={index} track={track} />
                ))}
              </div>
              <button className="text-[#CECECE] bg-[#1A1A1A] text-[13px] py-3.5 px-4 rounded-2xl w-full font-bold bg-opacity-80 hover:bg-opacity-100 transition ease-out">
                View All
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold  mb-5">Browse All</h2>
        {/* <div className="grid gap-3 grid-cols-3 md:grid-cols-4"> */}
        <div className="grid gap-5 grid-cols-3 md:grid-cols-5 ">
          {categories &&
            categories.map((cate, index) => (
              <div
                key={index}
                className={`rounded-lg cursor-pointer bg-gradient-to-b to-black ${
                  colors[index % colors.length]
                } h-[200px]  relative overflow-hidden`}
                onClick={() => {
                  setCategoryName(cate.name);
                  setCategoryId(cate.id);
                }}
              >
                <Link
                  href={{
                    pathname: "/genre/[id]",
                    query: { id: cate.id + "-page" },
                  }}
                >
                  <>
                    <img
                      src={cate.icons.map((icon) => icon?.url)}
                      className="w-30 h-[100px] hover:bg-slate-500 absolute right-2 bottom-2 transform rotate-12"
                    />
                    <h2
                      key={cate.id}
                      className="capitalize w-30 h-30 text-xl font-extrabold bcursor-pointer absolute top-3 left-5"
                    >
                      {cate.name}
                    </h2>
                  </>
                </Link>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default Search;
