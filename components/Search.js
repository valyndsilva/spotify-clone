import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Tracks, Poster, Artists, Playlists, RecentlyPlayedPoster } from ".";
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
  featuredPlaylistsResultsState,
  newReleasesState,
  searchArtistResultsState,
  searchPlaylistResultsState,
  searchResultsState,
  searchState,
  searchTrackResultsState,
  topArtistResultsState,
} from "../atoms/searchAtom";
import { ViewGridIcon } from "@heroicons/react/solid";
import RecentlyPlayed from "./RecentlyPlayed";
import {
  newReleasesPlaylistSongsState,
  recentlyPlayedSongsState,
  recentlyPlayedState,
} from "../atoms/playlistAtom";
import Header from "./Header";
import { shuffle } from "lodash";
function Search() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const [categories, setCategories] = useRecoilState(categoriesState);
  // console.log(categories);

  const [categoryId, setCategoryId] = useRecoilState(categoryIdState);
  const [categoryName, setCategoryName] = useRecoilState(categoryNameState);
  const [categoryPlaylistId, setCategoryPlaylistId] = useRecoilState(
    categoryPlaylistIdState
  );

  const [featuredPlaylistsResults, setFeaturedPlaylistsResults] =
    useRecoilState(featuredPlaylistsResultsState);

  const [topArtistResults, setTopArtistResults] = useRecoilState(
    topArtistResultsState
  );

  const [search, setSearch] = useRecoilState(searchState);
  const [searchResults, setSearchResults] = useRecoilState(searchResultsState);
  const [searchTrackResults, setSearchTrackResults] = useRecoilState(
    searchTrackResultsState
  );
  const [searchArtistResults, setSearchArtistResults] = useRecoilState(
    searchArtistResultsState
  );
  const [searchPlaylistResults, setSearchPlaylistResults] = useRecoilState(
    searchPlaylistResultsState
  );

  const [newReleases, setNewReleases] = useRecoilState(newReleasesState);
  const [recentlyPlayed, setRecentlyPlayed] =
    useRecoilState(recentlyPlayedState);

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
              track: track,
              id: track.id,
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: track.album.images[0].url,
              duration: track.duration_ms,
            };
          })
        );
      })
      .catch((error) => console.log("Something went wrong!", error));

    // Search artists whose name contains typed search keyword
    spotifyApi
      .searchArtists(search)
      .then((data) => {
        console.log("Search artists:", data.body);
        setSearchArtistResults(
          data.body.artists.items.map((artist) => {
            return {
              id: artist.id,
              name: artist.name,
              uri: artist.uri,
              imageUrl: artist.images[0].url,
              popularity: artist.popularity,
            };
          })
        );
      })
      .catch((error) => console.log("Something went wrong!", error));

    // Search playlists whose name or description contains 'workout'
    spotifyApi
      .searchPlaylists(search)
      .then((data) => {
        console.log("Found playlists:", data.body);
        setSearchPlaylistResults(
          data.body.playlists.items.map((playlist) => {
            return {
              id: playlist.id,
              name: playlist.name,
              uri: playlist.uri,
              imageUrl: playlist.images[0].url,
              description: playlist.description,
            };
          })
        );
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

  const fetchTopArtists = () => {
    /* Get a User’s Top Artists*/
    spotifyApi
      .getMyTopArtists()
      .then((data) => {
        let topArtists = data.body.items;
        console.log({ topArtists });
        setTopArtistResults(
          data.body.items.map((artist) => {
            return {
              id: artist.id,
              name: artist.name,
              uri: artist.uri,
              imageUrl: artist.images[0].url,
              popularity: artist.popularity,
            };
          })
        );
      })
      .catch((err) => {
        console.log("Something went wrong!", err);
      });
  };

  const fetchFeaturedPlaylists = () => {
    //  Retrieve featured playlists
    spotifyApi
      .getFeaturedPlaylists({
        limit: 5,
        offset: 1,
        country: "GB",
      })
      .then((data) => {
        console.log(data.body.playlists.items);
        setFeaturedPlaylistsResults(
          data.body.playlists.items.map((playlist) => {
            return {
              id: playlist.id,
              name: playlist.name,
              uri: playlist.uri,
              imageUrl: playlist.images[0].url,
              description: playlist.description,
            };
          })
        );
      })
      .catch((err) => {
        console.log("Something went wrong!", err);
      });
  };

  // Get Current User's Recently Played Tracks
  const fetchRecentlyPlayed = () => {
    spotifyApi
      .getMyRecentlyPlayedTracks({ limit: 20 })
      .then((res) => {
        // console.log(res.body);
        console.log("List of Recently Played Tracks:", res.body.items);
        const duplicates = res.body.items;
        console.log({ duplicates });
        const unique = [];
        duplicates.map(({ track }) =>
          unique.filter((a) => a.track.id == track.id).length > 0
            ? null
            : unique.push({ track })
        );

        console.log(unique);

        setRecentlyPlayed(
          unique.map(({ track }) => {
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

      //fetch Top Artists
      fetchTopArtists();

      //fetch Featured Playlists
      fetchFeaturedPlaylists();
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

      <section className="bg-black ml-24 py-4 space-y-8 flex-grow md:mx-5 mb-20">
        {search ? (
          <>
            <div className="grid grid-cols-12 gap-3">
              {/* Search Top Artist Result */}
              <div className="col-span-4">
                <div className=" bg-[#0D0D0D] border-2 border-[#262626] p-4  rounded-xl space-y-4 mt-8">
                  <div className="space-y-4 overflow-x-hidden h-72">
                    <h2 className="text-white text-xl font-bold mb-3">
                      Top Result
                    </h2>
                    <div className="grid  grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 ">
                      {searchArtistResults.length > 0 && (
                        <>
                          {searchArtistResults
                            ?.slice(0, 1)
                            .map((artist, index) => (
                              <div
                                key={artist.id}
                                className=" overflow-hidden  text-white/80 cursor-pointer hover:scale-105 hover:text-white/100 transition duration-200 ease-out group mx-auto  bg-[#0D0D0D]"
                                //   onClick={handlePlayPause}
                              >
                                <img
                                  src={artist.imageUrl}
                                  alt={artist.name}
                                  className="h-[150px] w-[150px] object-cover rounded-full opacity-80 group-hover:opacity-100 mx-auto  my-5 "
                                />
                                <div className=" inset-x-0 ml-4 flex items-center space-x-3.5  px-5">
                                  <div className="text-[15px]">
                                    <h4 className="font-extrabold truncate w-36">
                                      {artist.name}
                                    </h4>
                                    <h6>Artist</h6>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Songs Results for search keyword */}
              <div className="col-span-8 mb-5 mt-8 ml-2">
                <h2 className="text-white text-xl font-bold mb-3">
                  {searchResults.length > 0 && `Songs Result for "${search}"`}
                </h2>
                <div className="space-y-3 border-2 border-[#262626] rounded-2xl  bg-[#0D0D0D] overflow-y-scroll h-72 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 scrollbar-thumb-rounded hover:scrollbar-thumb-gray-500">
                  {searchResults.length > 0 &&
                    searchResults.map((track, index) => (
                      <Tracks track={track} order={index} />
                    ))}
                </div>
              </div>
            </div>

            {/* Search Top Songs Poster */}
            <h2 className="text-white font-bold mb-3">
              {searchResults.length && `Top Songs Result for "${search}"`}
            </h2>
            <div className="grid overflow-y-scroll scrollbar-hide h-64 py-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8 p-4">
              {searchResults.length > 0 &&
                searchResults.map((track) => <Poster track={track} />)}
            </div>

            <div className="grid grid-cols-12 gap-3">
              {/* Tracks */}
              <div className="col-span-8 mb-5">
                <h2 className="text-white font-bold mb-3">
                  {searchResults.length > 0 && `Songs Result for "${search}"`}
                </h2>
                <div className="space-y-3 border-2 border-[#262626] rounded-2xl p-3 bg-[#0D0D0D] overflow-y-scroll h-72 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 scrollbar-thumb-rounded hover:scrollbar-thumb-gray-500">
                  {searchResults.length > 0 &&
                    searchResults.map((track, index) => (
                      <Tracks track={track} order={index} />
                    ))}
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

                  <div
                    className="space-y-4 overflow-y-scroll overflow-x-hidden 
               scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 scrollbar-thumb-rounded hover:scrollbar-thumb-gray-500 h-40"
                  >
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

            {/* Search Playlists */}
            <h2 className="text-white font-bold">
              {searchPlaylistResults.length > 0 &&
                `Playlist Result for "${search}"`}
            </h2>
            <div className="grid overflow-y-scroll scrollbar-hide h-96 py-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8 p-4">
              {searchPlaylistResults.length > 0 && (
                <Playlists playlists={searchPlaylistResults} />
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold  mb-5">Browse All</h2>
            {/* <div className="grid gap-3 grid-cols-3 md:grid-cols-4"> */}
            <div className="grid gap-5 grid-cols-3 md:grid-cols-5 ">
              {categories &&
                categories.map((cate, index) => (
                  <Link
                    key={index}
                    href={{
                      pathname: "/genre/[id]",
                      query: { id: cate.id + "-page" },
                    }}
                  >
                    <div
                      className={`rounded-lg cursor-pointer bg-gradient-to-b to-black ${
                        colors[index % colors.length]
                      } h-[200px]  relative overflow-hidden`}
                      onClick={() => {
                        setCategoryName(cate.name);
                        setCategoryId(cate.id);
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
                    </div>
                  </Link>
                ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Search;
