import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState } from "../atoms/songAtom";
import useSpotify from "./useSpotify";
function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

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
