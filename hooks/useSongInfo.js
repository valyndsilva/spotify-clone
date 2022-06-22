import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isPlayingState, currentTrackIdState } from "../atoms/songAtom";
import useSpotify from "./useSpotify";
function useSongInfo() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  console.log({ currentTrackId });

  const [songInfo, setSongInfo] = useState(null);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const fetchCurrentSong = () => {
    // if (!songInfo) {
    if (!songInfo && !currentTrackId) {
      // Get the User's Currently Playing Track
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        // console.log("Now Playing:", data.body?.item);
        setCurrentTrackId(data.body?.item?.id);

        // Get Information About The User's Current Playback State
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId && !songInfo) {
      //fetch song Info
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, songInfo, spotifyApi, session]);

  useEffect(() => {
    if (currentTrackId) {
      const fetchSongInfo = async () => {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              //When you make a request to an API endpoint that access token is put inside the header.
              // We can pass around the access token as a bearer with the token.
              Accept: "application/json",
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());
        setSongInfo(trackInfo);
      };
      fetchSongInfo();
    }
  }, [currentTrackId, spotifyApi]);
  return songInfo;
}

export default useSongInfo;
