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
import { PauseIcon, HeartIcon, PlayIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { playingTrackState, playState } from "../atoms/playerAtom";

function Track({
  track,
  albumId,
  albumUri,
  albumImg,
  albumName,
  artistName,
  order,
}) {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const [hasLiked, setHasLiked] = useState(false);
  const [currentAlbumId, setCurrentAlbumId] =
    useRecoilState(currentAlbumIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentSongUri, setCurrentSongUri] =
    useRecoilState(currentSongUriState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [currentAlbumSongUri, setCurrentAlbumSongUri] = useRecoilState(
    currentAlbumSongUriState
  );

  const [currentAlbumUri, setCurrentAlbumUri] =
    useRecoilState(currentAlbumUriState);

  const [currentAlbumSongId, setCurrentAlbumSongId] = useRecoilState(
    currentAlbumSongIdState
  );

  // const handlePlay1 = () => {
  //   console.log("handlePlay triggered in Track Component!!!!!!!!!");

  //   console.log({ albumUri });
  //   console.log({ currentAlbumUri });
  //   console.log({ albumId });
  //   console.log({ currentAlbumSongUri });
  //   console.log({ currentSongUri });
  //   if (currentAlbumSongUri === currentSongUri) {
  //     setPlay(!play);
  //   }

  //   setCurrentAlbumId(albumId); // triggers useSongInfo
  //   setIsPlaying(true);
  // spotifyApi.play({
  //   uris: [currentAlbumSongUri],
  // });
  //   console.log({
  //     track,
  //     albumId,
  //     albumUri,
  //     artistName,
  //     albumName,
  //     currentSongUri,
  //   });
  //   // }
  // };

  const [play, setPlay] = useRecoilState(playState);
  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);

  // const chooseTrack = (track) => {
  //   setPlayingTrack(track);
  // };

  const handlePlayPause = () => {
    console.log(" handlePlay1 triggered!!!!!!!!!");
    setCurrentAlbumId(albumId); // triggers useSongInfo
    // chooseTrack(track);
    console.log({ albumId });
    console.log(currentSongUri);
    console.log(currentAlbumSongUri);

    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      console.log("handlePlayPause in Track Component:", data.body);
      if (data.body?.is_playing && data.body?.device.id) {
        spotifyApi.pause();
        setPlay(false);
        setIsPlaying(false);
      } else {
        spotifyApi.play({
          uris: [currentSongUri],
        });
        // spotifyApi.play();
        setPlay(true);
        setIsPlaying(true);
      }
    });
  };

  return (
    <div
      className="grid grid-cols-2 text-gray-500 px-5 py-4 rounded-lg cursor-pointer hover:bg-gray-900"
      // onClick={handlePlay1}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <div className="w-12 h-12 relative">
          <Image
            src={albumImg}
            alt={albumName}
            layout="fill" // required
            objectFit="cover" // change to suit your needs
            priority
          />
        </div>
        <div className="flex-col">
          <p className="text-white w-36 lg:w-64 truncate">{albumName}</p>
          <p className="w-40">{artistName}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="md:ml-auto flex items-center space-x-2.5">
          <div className="flex items-center rounded-full border-2 border-[#262626] w-[85px] h-10 relative cursor-pointer group-hover:border-white/40">
            <HeartIcon
              className={`w-5 h-5 ml-3 ${
                hasLiked ? "text-[#1ED760]" : "text-[#868686]"
              }`}
              onClick={() => setHasLiked(!hasLiked)}
            />
            {/* {isPlaying ? ( */}
            {/* {currentSongUri && isPlaying && play ? ( */}
            {track.uri === currentAlbumUri && play ? (
              <>
                <div
                  className="h-10 w-10 rounded-full border  flex items-center justify-center absolute -right-0.5 icon hover:scale-110"
                  // onClick={playSong}
                  onClick={handlePlayPause}
                >
                  <PauseIcon className="text-white text-xl" />
                </div>
              </>
            ) : (
              <>
                <div
                  className="h-10 w-10 rounded-full text-gray-400 font-thin flex items-center justify-center absolute -right-0.5 icon hover:scale-110"
                  // onClick={playSong}
                  onClick={handlePlayPause}
                >
                  <PlayIcon className="text-white text-xl ml-[1px]" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Track;
