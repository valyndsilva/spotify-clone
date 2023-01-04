import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { categoryIdState, categoryNameState } from "../../atoms/categoryAtom";
import useSpotify from "../../hooks/useSpotify";
import {
  Sidebar,
  DropDown,
  Player,
  Tracks,
  Albums,
  Artists,
} from "../../components";
import Link from "next/link";
import { useRouter } from "next/router";

import { shuffle } from "lodash";
import {
  artistAlbumsState,
  artistIdState,
  artistsRelatedToArtistState,
  artistTopTracksState,
  singleArtistState,
} from "../../atoms/artistAtom";
import {
  BadgeCheckIcon,
  DotsHorizontalIcon,
  PlayIcon,
} from "@heroicons/react/solid";
import { HeartIcon } from "@heroicons/react/outline";
import { numberWithCommas } from "../../lib/numberWithCommas";

function Artist() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  // get (query string) parameters from the URL in Next.js:
  const router = useRouter();
  // console.log(router.query.id);

  const [artistId, setArtistId] = useRecoilState(artistIdState);
  // setArtistId(router.query.id);
  // console.log({ artistId });

  const [artistAlbums, setArtistAlbums] = useRecoilState(artistAlbumsState);
  const [singleArtist, setSingleArtist] = useRecoilState(singleArtistState);
  const [artistTopTracks, setArtistTopTracks] =
    useRecoilState(artistTopTracksState);
  const [artistsRelatedToArtist, setArtistsRelatedToArtist] = useRecoilState(
    artistsRelatedToArtistState
  );

  useEffect(() => {
    setArtistId(router.query.id);
  }, [router.query.id]);

  const fetchSingleArtist = () => {
    // Get an artist
    spotifyApi
      .getArtist(artistId)
      .then((data) => {
        console.log("Artist information", data.body);
        const artistInfo = {
          id: data.body.id,
          name: data.body.name,
          artistUrl: data.body.href,
          uri: data.body.uri,
          followers: data.body.followers?.total,
          imageUrl: data.body.images?.[0].url,
          genres: data.body.genres,
        };

        console.log({ artistInfo });
        setSingleArtist(artistInfo);
      })
      .catch((error) => console.log("Something went wrong!", error));
  };

  const fetchArtistTopTracks = () => {
    // Get an artist's top tracks
    spotifyApi
      .getArtistTopTracks(artistId, "GB")
      .then((data) => {
        // console.log("Artists Top Tracks", data.body);
        setArtistTopTracks(
          data.body.tracks.map((track) => {
            return {
              track: track,
              id: track.id,
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: track.album.images[0].url,
              albumName: track.album.name,
              duration: track.duration_ms,
              followers: track.followers?.total,
              imageUrl: track.images?.[0].url,
              genres: track.genres,
            };
          })
        );
      })
      .catch((error) => console.log("Something went wrong!", error));
  };

  const fetchArtistAlbums = () => {
    console.log("fetchArtistAlbums triggered!!!!!");
    // Get Artist albums
    spotifyApi
      .getArtistAlbums(artistId, { limit: 5, country: "GB", offset: 1 })
      .then((data) => {
        // console.log("Artist albums", data.body);
        const artistAlbumsInfo = data.body.items;
        console.log({ artistAlbumsInfo });
        setArtistAlbums(
          data.body.items.map((album) => {
            return {
              type: album.album_type,
              releaseDate: album.release_date,
              id: album.id,
              name: album.name,
              uri: album.uri,
              imageUrl: album.images?.[0].url,
            };
          })
        );
      })
      .catch((error) => console.log("Something went wrong!", error));
  };

  const fetchArtistsRelatedToArtist = () => {
    // Get artists related to an artist
    spotifyApi
      .getArtistRelatedArtists(artistId)
      .then((data) => {
        // console.log("Artists Related To Artist", data.body.artists);
        setArtistsRelatedToArtist(
          data.body.artists.map((artist) => ({
            id: artist.id,
            name: artist.name,
            uri: artist.uri,
            imageUrl: artist.images?.[0].url,
            popularity: artist.popularity,
          }))
        );
        // console.log({ artistsRelatedToArtist });
      })
      .catch((error) => console.log("Something went wrong!", error));
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && artistId) {
      //fetch Categories Info
      fetchArtistAlbums();
      fetchSingleArtist();
      fetchArtistTopTracks();
      fetchArtistsRelatedToArtist();
    }
  }, [artistId, spotifyApi, session]);

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
  useEffect(() => {
    setColor(shuffle(colors).pop()); //shuffles the colors array and pops a color
  }, []);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <div className="flex text-white">
        <Sidebar />
        <main className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
          <header className="absolute top-5 right-8">
            <DropDown className="absolute top-5 right-8" />
          </header>

          <section
            className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
          >
            <div className="w-56 h-56 cursor-pointer relative">
              {/* {singleArtist && (
                <Image
                  src={singleArtist.imageUrl}
                  alt={singleArtist.name}
                  layout="fill" // required
                  objectFit="cover" // change to suit your needs
                  priority
                  className="shadow-2xl rounded-full "
                />
              )} */}
              <img src={singleArtist.imageUrl} alt={singleArtist.name} />
            </div>
            <div className="ml-10 space-y-2 ">
              <span className="text-sm font-light flex items-center">
                <BadgeCheckIcon className="w-8 h-8 text-blue-500" />
                Verified Artist
              </span>
              <h1 className="text-8xl font-bold capitalize ">
                {singleArtist.name}
              </h1>
              <p className="text-xl font-light ml-2">
                {singleArtist.followers} monthly listeners
              </p>
            </div>
          </section>
          {/* <div className="grid grid-cols-3  md:grid-cols-3  lg:grid-cols-5 lg:gap-4 space-x-4 text-white p-4 ml-5 overflow-y-scroll scrollbar-hide h-72">
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
                      href={`/playlist/${encodeURIComponent(
                        categoryPlaylist.id
                      )}`}
                      className=""
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
            </div> */}

          <div>
            <section className="flex items-center space-x-4 p-8 ">
              <PlayIcon className=" w-20 h-20 text-green-500 hover:scale-110" />
              <HeartIcon className=" w-10 h-10" />
              <DotsHorizontalIcon className=" w-10 h-10" />
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold ml-10 pt-5 capitalize">
                Popular
              </h2>
              {artistTopTracks.length > 0 &&
                artistTopTracks.map((track, index) => (
                  <Tracks track={track} order={index} />
                ))}
            </section>
            <section className="">
              <h2 className="text-xl font-semibold ml-10 pt-5 capitalize">
                Discography
              </h2>
              <div className="grid ml-5 overflow-y-scroll scrollbar-hide h-[350px] py-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8 p-4">
                {artistAlbums ? (
                  <Albums albums={artistAlbums} />
                ) : (
                  <p className="text-xl font-semibold text-white">
                    Sorry, No Albums Found For {singleArtist.name}...
                  </p>
                )}
              </div>
            </section>
            <section className="mb-20">
              <h2 className="text-xl font-semibold ml-10 pt-5 capitalize">
                Fans also like
              </h2>
              <div className="grid overflow-y-scroll scrollbar-hide h-72 py-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8 p-4">
                {artistsRelatedToArtist &&
                  artistsRelatedToArtist.map((artist) => (
                    <Artists artist={artist} />
                  ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export default Artist;
