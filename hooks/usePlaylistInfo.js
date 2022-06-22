import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentPlaylistIdState } from "../atoms/playlistAtom";
import useSpotify from "./useSpotify";
function usePlaylistsInfo() {
  const spotifyApi = useSpotify();
  const [currentPlaylistId, setCurrentPlaylistId] = useRecoilState(
    currentPlaylistIdState
  );
  const [playlistInfo, setPlaylistInfo] = useState(null);

  useEffect(() => {
    if (currentPlaylistId) {
      const fetchSongInfo = async () => {
        const playlistTrackInfo = await fetch(
          `https://api.spotify.com/v1/playlists/${currentPlaylistId}`,
          {
            headers: {
              //When you make a request to an API endpoint that access token is put inside the header.
              // We can pass around the access token as a bearer with the token.
              Accept: "application/json",
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());
        setPlaylistInfo(playlistTrackInfo);
      };
      fetchSongInfo();
    }
  }, [currentPlaylistId, spotifyApi]);
  return playlistInfo;
}

export default usePlaylistsInfo;
