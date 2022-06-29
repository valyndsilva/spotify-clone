import React from "react";
import { useRecoilState } from "recoil";
import { playingTrackState, playState } from "../atoms/playerAtom";
import {
  currentSongUriState,
  currentTrackIdState,
  isPlayingState,
} from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";

function RecentlyPlayed({ track }) {
  const spotifyApi = useSpotify();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [play, setPlay] = useRecoilState(playState);
  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);
  const [currentSongUri, setCurrentSongUri] =
    useRecoilState(currentSongUriState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const handlePlay = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      console.log("handlePlayPause in Track Component:", data.body);
      setCurrentTrackId(track.id);
      setIsPlaying(true);
      spotifyApi.play({
        uris: [track.uri],
      });
    });
  };

  return (
    <div className="flex items-center space-x-3" onClick={handlePlay}>
      <img
        src={track.albumUrl}
        alt=""
        className="rounded-full w-[52px] h-[52px]"
      />
      <div>
        <h4 className="text-white text-[13px] mb-0.5 font-semibold hover:underline cursor-pointer truncate max-w-[150px]">
          {track.title}
        </h4>
        <p className="text-xs text-[#686868] font-semibold cursor-pointer hover:underline">
          {track.artist}
        </p>
      </div>
    </div>
  );
}

export default RecentlyPlayed;
