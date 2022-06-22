import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DropDown, SearchInput, Songs, Track, Poster } from ".";
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
import { newReleasesState, searchResultsState } from "../atoms/searchAtom";
import { ViewGridIcon } from "@heroicons/react/solid";
import RecentlyPlayed from "./RecentlyPlayed";

function Search() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const [categories, setCategories] = useRecoilState(categoriesState);
  const [categoryId, setCategoryId] = useRecoilState(categoryIdState);
  const [categoryName, setCategoryName] = useRecoilState(categoryNameState);
  const [categoryPlaylistId, setCategoryPlaylistId] = useRecoilState(
    categoryPlaylistIdState
  );

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useRecoilState(searchResultsState);
  const [newReleases, setNewReleases] = useRecoilState(newReleasesState);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  // const chooseTrack = (track) => {
  //   setPlayingTrack(track);
  // };

  // Searching...
  const fetchSearchResults = () => {
    if (!search) return setSearchResults([]);
    let cancel = false;

    spotifyApi
      .searchTracks(search)
      .then((res) => {
        if (cancel) return;
        console.log("Search Results:", res.body.albums.items);
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
    return () => (cancel = true);
  };

  // New Releases...
  const fetchNewReleases = () => {
    spotifyApi
      .getNewReleases()
      .then((res) => {
        console.log("List of New Releases:", res.body.albums.items);
        setNewReleases(
          res.body.albums.items.map((track) => {
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
  };

  const fetchRecentlyPlayed = () => {
    spotifyApi
      .getMyRecentlyPlayedTracks({ limit: 20 })
      .then((res) => {
        setRecentlyPlayed(
          res.body.items.map(({ track }) => {
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
        console.log("List of Categories:", categoryList);
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
      fetchRecentlyPlayed();
    }
  }, [spotifyApi, session]);

  // useEffect(() => {
  //   if (spotifyApi.getAccessToken() && search) {
  //     //fetch Search Results
  //     fetchSearchResults();
  //   }
  // }, [searchResultsState, spotifyApi, session]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="flex items-center justify-between px-5 mt-5 mb-5">
        <div className="">
          <SearchInput search={search} setSearch={setSearch} />
        </div>
        <div className="">
          <DropDown />
        </div>
      </header>

      <section className="flex flex-col  text-white p-8">
        {/* Search Results */}
        {/* <div className="grid overflow-y-scroll scrollbar-hide h-96 py-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 p-4">
          {searchResults.length === 0
            ? newReleases
                .slice(0, 4)
                .map((track) => (
                  <Poster
                    key={track.id}
                    track={track}
                    chooseTrack={chooseTrack}
                  />
                ))
            : searchResults
                .slice(0, 4)
                .map((track) => (
                  <Poster
                    key={track.id}
                    track={track}
                    chooseTrack={chooseTrack}
                  />
                ))}
        </div> */}

        <div className="grid grid-cols-12 gap-3">
          {/* Tracks */}
          <div className="col-span-8 mb-5">
            <h2 className="text-white font-bold mb-3">
              {searchResults.length === 0 ? "New Releases" : "Tracks"}
            </h2>
            <div className="space-y-3 border-2 border-[#262626] rounded-2xl p-3 bg-[#0D0D0D] overflow-y-scroll h-96 scrollbar-hide scrollbar-thumb-gray-600 scrollbar-thumb-rounded hover:scrollbar-thumb-gray-500">
              {searchResults.length === 0 ? (
                <Track tracks={newReleases} />
              ) : (
                <Track tracks={searchResults} />
              )}
            </div>
          </div>

          {/* Recently Played Tracks */}

          <div className="col-span-4">
            <div className=" bg-[#0D0D0D] border-2 border-[#262626] p-4 rounded-xl space-y-4 mt-8">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold text-sm">
                  Recently Played
                </h4>
                <ViewGridIcon className="text-[#686868] h-6" />
              </div>

              <div className="space-y-4 overflow-y-scroll overflow-x-hidden scrollbar-hide h-64">
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
        <div className="grid gap-3 grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8">
          {categories &&
            categories.map((cate, index) => (
              <div
                key={index}
                className="rounded-lg"
                onClick={() => {
                  setCategoryName(cate.name);
                  setCategoryId(cate.id);
                }}
              >
                <Link
                  className=" "
                  href={{
                    pathname: "/genre/[id]",
                    query: { id: cate.id + "-page" },
                  }}
                >
                  {/* <a onClick={() => setCategoryName(cate.name)}> */}
                  <div className="w-30 h-30 relative cursor-pointer">
                    <img
                      src={cate.icons.map((icon) => icon?.url)}
                      className="w-30 h-30 hover:bg-slate-500"
                    />
                    <p
                      key={cate.id}
                      className="capitalize w-30 h-30 cursor-pointer absolute top-3 left-5"
                    >
                      {cate.name}
                    </p>
                  </div>
                  {/* </a> */}
                </Link>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default Search;
