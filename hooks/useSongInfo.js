import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentTrackIdState } from "../atoms/songAtom";
import useSpotify from "./useSpotify";
function useSongInfo() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const currentTrackId = useRecoilValue(currentTrackIdState);
  console.log({ currentTrackId });

  const [songInfo, setSongInfo] = useState(null);
  console.log({ songInfo });
  useEffect(() => {
    if (spotifyApi.getAccessToken() && currentTrackId) {
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
        console.log({ trackInfo });

        // const songUri = trackInfo.uri;
        // console.log({ songUri });
      };
      fetchSongInfo();
    }
  }, [currentTrackId, spotifyApi, session]);
  return songInfo;
}

export default useSongInfo;
