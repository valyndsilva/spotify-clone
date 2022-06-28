import Image from "next/image";
import React from "react";
import useSpotify from "../hooks/useSpotify";
import { millisecondsToMinutesAndSeconds } from "../lib/time";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { useRecoilState, useRecoilValue } from "recoil";
// import { playlistState } from "../atoms/playlistAtom";

function Song({
  trackId,
  trackUri,
  trackImg,
  trackName,
  artistName,
  albumName,
  duration,
  order,
  track,
}) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  // const playlist = useRecoilValue(playlistState);
  // console.log({ playlist });

  // get songInfo here

  const handlePlay = () => {
    console.log("handlePlay triggered in Song Component!!!!!!!!");
    console.log({
      track,
      trackId,
      trackUri,
      artistName,
      albumName,
      trackName,
      duration,
      trackImg,
    });
    setCurrentTrackId(trackId);
    setIsPlaying(true);
    console.log(trackUri);

    spotifyApi.play({
      uris: [trackUri],
    });
  };

  return (
    <div
      className="grid grid-cols-2 text-gray-500 px-5 py-4 rounded-lg cursor-pointer hover:bg-gray-900"
      onClick={handlePlay}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <div className="w-10 h-10 relative">
          <Image
            // src={track.track.album.images[0].url}
            // alt={track.track.name}
            src={trackImg}
            alt={trackName}
            layout="fill" // required
            objectFit="cover" // change to suit your needs
            priority
          />
        </div>
        <div>
          {/* <p className="text-white w-36 lg:w-64 truncate">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p> */}
          <p className="text-white w-36 lg:w-64 truncate">{trackName}</p>
          <p className="w-40">{artistName}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0 ">
        {/* <p className="hidden md:inline w-40">{track.track.album.name}</p>
        <p>{millisecondsToMinutesAndSeconds(track.track.duration_ms)}</p> */}
        <p className="hidden md:inline w-40">{albumName}</p>
        <p>{millisecondsToMinutesAndSeconds(duration)}</p>
      </div>
    </div>
  );
}

export default Song;
