import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  // Images
  "ugc-image-upload",
  // Spotify Connect
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-read-currently-playing",
  // Follow
  "user-follow-modify",
  "user-follow-read",
  // Listening History
  "user-read-recently-played",
  "user-read-playback-position",
  "user-top-read",
  // Playlists
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  // Playback
  "app-remote-control",
  "streaming",
  // Users
  "user-read-email",
  "user-read-private",
  // Library
  //   "user-library-modify", // Allows users to edit your library. (Not recommended to include.)
  "user-library-read",
].join(",");

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params);
// const LOGIN_URL= `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;
// OR
const LOGIN_URL =
  "https://accounts.spotify.com/authorize?" + queryParamString.toString();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;

export { LOGIN_URL };
