import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isPlayingState,
  currentAlbumIdState,
  currentSongUriState,
  currentTrackIdState,
  currentAlbumSongUriState,
  currentAlbumSongIdState,
  currentAlbumUriState,
} from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import Image from "next/image";
import { millisecondsToMinutesAndSeconds } from "../lib/time";
import Link from "next/link";

function AlbumTracks({ tracks, order, albumUrl }) {
  console.log({ tracks });
  const spotifyApi = useSpotify();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const handlePlayPause = (id, uri) => {
    console.log({ id });
    console.log({ uri });

    console.log(" handlePlay triggered!!!!!!!!!");
    setCurrentTrackId(id); // triggers useSongInfo
    setIsPlaying(true);
    console.log(id);
    spotifyApi.play({
      uris: [uri],
    });
  };

  return (
    <section>
      {tracks.items.map((track, index) => (
        <div
          key={track.id}
          className="text-white px-8 flex-col space-y-1 group"
        >
          <div
            className="grid grid-cols-2 text-gray-500 px-5 py-4 rounded-lg cursor-pointer hover:bg-gray-900"
            onClick={() => {
              handlePlayPause(track.id, track.uri);
            }}
          >
            <div className="flex items-center space-x-4">
              <p>{index + 1}</p>
              <div className="w-12 h-12 relative">
                <Image
                  src={albumUrl}
                  alt={track.name}
                  layout="fill" // required
                  objectFit="cover" // change to suit your needs
                  priority
                />
              </div>
              <div className="flex-col">
                <p className="text-white w-36 lg:w-64 truncate">{track.name}</p>
                <Link
                  key={track.artists[0].id}
                  href={{
                    pathname: "/artist/[id]",
                    query: { id: track.artists[0].id },
                  }}
                >
                  <p className="w-40  group-hover:text-white group-hover:underline">
                    {track.artists[0].name}
                  </p>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="md:ml-auto flex items-center space-x-2.5">
                <p>{millisecondsToMinutesAndSeconds(track.duration_ms)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default AlbumTracks;
