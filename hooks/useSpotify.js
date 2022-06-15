import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
// import spotifyApi from "../lib/spotify";
import SpotifyWebApi from "spotify-web-api-node";

// You can initialize another instance of the Spotify API here locally if you want to keep the server instance separate from this instance.
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

function useSpotify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      console.log(session);
      //If refresh access token attempt fails, redirect user to login page
      if (session.error === "RefreshAccessTokenError") {
        signIn();
      }
      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);
  return spotifyApi;
}

export default useSpotify;
