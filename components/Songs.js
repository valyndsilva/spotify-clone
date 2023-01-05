import Image from "next/image";
import React from "react";
import useSpotify from "../hooks/useSpotify";
import { millisecondsToMinutesAndSeconds } from "../lib/time";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import Link from "next/link";
import { PlayIcon } from "@heroicons/react/solid";
import { PauseIcon } from "@heroicons/react/outline";
import { artistIdState } from "../atoms/artistAtom";

function Songs({ track, order }) {
  // console.log(track);
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [artistId, setArtistId] = useRecoilState(artistIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  // const artistid = track.track.artists?.[0].id;
  // console.log({ artistid });

  const handlePlay = () => {
    console.log("handlePlay triggered in Song Component!!!!!!!!");
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    console.log(track.track.uri);

    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  return (
    <div
      key={track?.track.id}
      className="text-white px-8 flex-col space-y-1 group"
    >
      <div
        className="grid grid-cols-2 text-gray-500 px-5 py-4 rounded-lg cursor-pointer active:bg-slate-600  hover:bg-gray-900"
        onClick={handlePlay}
      >
        <div className="flex items-center space-x-4">
          <p>{order + 1}</p>
          <div className="w-10 h-10 relative">
            <Image
              src={track?.track.album.images[0].url}
              alt={track?.track.name}
              layout="fill" // required
              objectFit="cover" // change to suit your needs
              priority
            />
          </div>
          <div>
            <p className="text-white w-36 lg:w-64 truncate">
              {track?.track.name}
            </p>
            <Link
              href={{
                pathname: "/artist/[id]",
                query: { id: track?.track.artists?.[0].id },
              }}
            >
              <p className="w-40  group-hover:text-white group-hover:underline">
                {track?.track.artists[0].name}
              </p>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-between ml-auto md:ml-0 ">
          <p className="hidden md:inline w-40">{track?.track.album.name}</p>
          <p>{millisecondsToMinutesAndSeconds(track?.track.duration_ms)}</p>
        </div>
      </div>
    </div>
  );
}

export default Songs;
