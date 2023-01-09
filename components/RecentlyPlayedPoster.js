import React from "react";
import { useRecoilState } from "recoil";
import {
  isPlayingState,
  currentTrackIdState,
  currentAlbumUriState,
} from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";

function RecentlyPlayedPoster({ track }) {
  console.log({ track });
  const spotifyApi = useSpotify();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [currentAlbumUri, setCurrentAlbumUri] =
    useRecoilState(currentAlbumUriState);

  const handlePlayPause = () => {
    console.log(track);

    console.log(" handlePlayPause triggered in Result Component!!!!!!!!!");
    setCurrentTrackId(track.id); // triggers useSongInfo
    setIsPlaying(true);
    console.log(track.id);
    console.log(track.uri);

    spotifyApi.play({
      uris: [track.uri],
    });
  };

  return (
    <>
      <div
        key={track.id}
        className="w-52 h-60 rounded-[50px] overflow-hidden relative text-white/80 cursor-pointer hover:scale-105 hover:text-white/100 transition duration-200 ease-out group mx-auto"
        onClick={handlePlayPause}
      >
        <img
          src={track.albumUrl}
          alt={track.title}
          className="h-full w-full absolute inset-0 object-cover rounded-[50px] opacity-80 group-hover:opacity-100"
        />
        <div className="absolute bottom-10 inset-x-0 ml-4 flex items-center space-x-3.5">
          <div className="text-[15px]">
            <h4 className="font-extrabold truncate w-44">{track.title}</h4>
            <h6>{track.artist}</h6>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecentlyPlayedPoster;
