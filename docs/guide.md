# Spotify Clone

## .env.local:

```
NEXTAUTH_URL=
NEXT_PUBLIC_CLIENT_ID=
NEXT_PUBLIC_CLIENT_SECRET=
JWT_SECRET=
```

## Scripts used:

Create a new project folder with nextjs and tailwindcss framwework setup:

```
npx create-next-app -e with-tailwindcss spotify-clone
```

Push your repository from the command line to github:

```
git remote add origin  https://github.com/valyndsilva/spotify-clone.git
git branch -M main
git push -u origin main
```

Install hero-icons by tailwindCSS:

```
npm i @heroicons/react
```

Create a login.js page in pages folder and next install NextAuth:

```
npm i next-auth
```

Next, create a .env.local file which stores all the secret environment variables in it. When deployed to Vercel or Netlify the production environment variables need to be added to them manually.

```
NEXTAUTH_URL=http://localhost:3000 (value changes when deployed to Netlify or Vercel)
NEXT_PUBLIC_CLIENT_ID=spotify client id value goes here
NEXT_PUBLIC_CLIENT_SECRET=spotify client secret value goes here
JWT_SECRET=secret value you can define (go to https://generate-secret.now.sh/32)
```

The NEXTAUTH_URL environment variable will change when deployed to Netlify or Vercel.

Create a "lib" folder in the root to include helper files and create spotify.js.

Install [spotify-web-api-node] (https://github.com/thelinmichael/spotify-web-api-node):
npm i spotify-web-api-node
npm i superagent
npm i formidable

Next, include spotify-web-api-node in spotify.js:

```

import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-email",
  "streaming",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
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


```

Create "auth" folder in pages/api/ and create a file in auth folder called [...nextauth.js] and copy the example code from https://next-auth.js.org/getting-started/example

[...nextauth].js:

```
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { LOGIN_URL } from "../../../lib/spotify";
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
   secret: process.env.JWT_SECRET,
});
```

And open pages/\_app.jsx:
Wrap SessionProvider around Component and update the import and props:

```
 import { SessionProvider } from "next-auth/react"
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

Next, let's implement refresh-token-rotation in [...nextauth].js:
[https://next-auth.js.org/tutorials/refresh-token-rotation]

```
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("Refreshed Token:", refreshedToken);
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1hour as 3600 returns from spotify API
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // replace if new one is returned else fall back to old refresh token
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  //https://next-auth.js.org/tutorials/refresh-token-rotation
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        //if exists it is the 1st time the user has signed in.
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, // handle expire times in milliseconds hence * 1000
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("Existing Access Token Is VALID!");

        return token;
      }
      // Access token has expired, try to refresh it
      console.log("Access Token Has EXPIRED! Refreshing.... :)");
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.username = token.username;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.error = token.error;

      return session;
    },
  },
});

```

Open pages/login.js:

```

import React from "react";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import spotifyImg from "../public/spotify-img.png";
function login({ providers }) {
  console.log({ providers });
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <div className="w-36 h-36 mb-5 cursor-pointer relative">
        <Image
          src={spotifyImg}
          alt="logo"
          layout="fill" // required
          objectFit="conver" // change to suit your needs
          priority
        />
      </div>
      <div>
        {Object.values(providers).map((provider) => (
          <div key={provider.id}>
            <button
              className="bg-[#18D860] text-white p-5 rounded-full"
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              Login with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default login;

// Do a server-side render to get the providers from nextauth everytime a user visits the page
export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}


```

Next, once you click on the login button you get re-directed to a page with an error:

```
INVALID_CLIENT: Invalid redirect URI
```

Open spotify developers dashboard and add the Redirect URIs:

```
http://localhost:3000
http://localhost:3000/api/auth/callback/spotify
```

You should now be able to login.

## Middleware Setup:

Every time a user makes a request to the site we pass the request through (a server that checks something like a JWT token) middleware and then it reaches the page if the user has the accessToken. If not it redirects to logout screen.
Basically, we setup the middleware to redirect a person who is not logged in to the login page.
Create a file under pages called "\_middleware.js":

```

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Token exists if the user is logged in:
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;
  //Allow requests if the following is true:
  // If next-auth session provider request || token exists:
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }
  //if the token does not exist, redirect to the login page if the user requests for a protected route
  if (!token && pathname !== "/login") {
    // return NextResponse.redirect("/login"); // deprecated relative paths afte Next 12... Read https://nextjs.org/docs/messages/middleware-relative-urls
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

   //if the token exist, redirect to the home page if the user requests for a protected route
   if (token && pathname !== "/login") {
    // return NextResponse.redirect("/login"); // deprecated relative paths afte Next 12... Read https://nextjs.org/docs/messages/middleware-relative-urls
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
}



```

Now when you try to access the site without being logged in it throws you to the login page.

## Building the MainView Component:

Create MainView.js in components folder.

Install tailwind-scrollbar-hide: [https://www.npmjs.com/package/tailwind-scrollbar-hide]

```
npm i tailwind-scrollbar-hide
```

In your Sidebar.js template to visually hide scrollbar add class "scrollbar-hide".

Next, edit MainView.js:
install lodash and only import the required shuffle library function

```
npm i lodash
```

```
import { shuffle } from "lodash";
```

```

import Image from "next/image";
import React, { useEffect, useState } from "react";
import userImg from "../public/spotify-img.png";
import { useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];
function MainView() {
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  useEffect(() => {
    setColor(shuffle(colors).pop()); //shuffles the colors array and pops a color
  }, []);
  return (
    <div className="flex-grow text-white">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
          <div className="w-10 h-10 rounded cursor-pointer relative">
            <Image
              src={userImg}
              alt="logo"
              layout="fill" // required
              objectFit="conver" // change to suit your needs
              priority
            />
          </div>
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <div className="w-10 h-10 rounded cursor-pointer relative">
          <Image
            src={userImg}
            alt="logo"
            layout="fill" // required
            objectFit="conver" // change to suit your needs
            priority
          />
        </div>
      </section>
    </div>
  );
}

export default MainView;


```

## Creating Custom Hooks:

useSpotify.js:

```

import React from "react";
import { signIn, useSession } from "next-auth/react";
// import spotifyApi from "../lib/spotify";

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


```

Start using the useSpotify custom hook to pull data:
Edit Sidebar to get the playlists:

```
import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  // console.log(session);
  // console.log(status);

  const [playlist, setPlaylist] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);

  console.log("You picked playlistId:", playlistId);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylist(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <nav className="text-gray-500 p-5 text-sm border-r border-gray-900  h-screen overflow-y-scroll scrollbar-hide pb-36">
      <div className="space-y-4">
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => signOut()}
        >
          <LogoutIcon className="w-5 h-5" />
          <p>Log out</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="w-5 h-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="w-5 h-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="w-5 h-5" />
          <p>Your Library</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="w-5 h-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="w-5 h-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="w-5 h-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists */}
        {playlist.map((playlist) => (
          <p
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)}
            className="cursor-pointer hover:text-white"
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </nav>
  );
}

export default Sidebar;


```

Next, we install Recoil: [https://recoiljs.org/docs/introduction/getting-started/] to manage state.

```
npm i recoil
```

We create atoms in Recoiland is like a slice in Redux.
Create a folder "atoms" in the root folder and "playlistAtom.js" file in it.

```
import { atom } from "recoil";

export const playlistIdState = atom({
  key: "playlistIdState",
  default: "37i9dQZF1DWVrBRunTOXCY",
});

```

Next open Sidebar.js and replace the playlistId useState with useRecoilState

```
 // const [playlistId, setPlaylistId] = useState(null);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

```

and import:

```
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
```

Open MainView.js:
import:

```
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
```

and add:

```
  // const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  //In Recoil instead of getting the whole Recoil State from the atom, we can get the read-only value of the playlistIdState directly as below
  const playlistId = useRecoilValue(playlistIdState);
```

and update the useEffect to have the playlistId dependency so that the color changes everytime a new playlist is selected.

```
 useEffect(() => {
    setColor(shuffle(colors).pop()); //shuffles the colors array and pops a color
  }, [playlistId]);
```

Next to get a plylist, we need to store it in the playlistAtom first:

Update playlistAtom.js:

```
import { atom } from "recoil";
export const playlistState = atom({
  key: "playlistState",
  default: null,
});
export const playlistIdState = atom({
  key: "playlistIdState",
  default: "37i9dQZF1DWVrBRunTOXCY",
});


```

Next edit MainView.js:

```
import Image from "next/image";
import React, { useEffect, useState } from "react";
import userImg from "../public/spotify-img.png";
import { useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import { Songs } from "../components";
const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];
function MainView() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  // const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  //In Recoil instead of getting the whole Recoil State from the atom, we can get the read-only value of the playlistIdState directly as below
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  console.log(playlistId);
  useEffect(() => {
    setColor(shuffle(colors).pop()); //shuffles the colors array and pops a color
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((error) =>
        console.log("Something went wrong with the playlist fetching", error)
      );
  }, [spotifyApi, playlistId]);
  console.log(playlist);
  return (
    <div className="flex-grow text-white">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
          <div className="w-10 h-10 rounded cursor-pointer relative">
            <Image
              src={userImg}
              alt="logo"
              layout="fill" // required
              objectFit="conver" // change to suit your needs
              priority
            />
          </div>
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <div className="w-44 h-44 shadow-2xl rounded cursor-pointer relative">
          {playlist && (
            <Image
              src={playlist?.images?.[0]?.url}
              alt="logo"
              layout="fill" // required
              objectFit="conver" // change to suit your needs
              priority
            />
          )}
        </div>
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
}

export default MainView;


```

Next to pre-render the user data let's add in the getServerSideProps in the index.jsx file:

```
import Head from "next/head";
import { getSession } from "next-auth/react";
import { Sidebar, MainView } from "../components";
const Home = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <Sidebar />
        <MainView />
      </main>
      <div>{/* Player */}</div>
    </div>
  );
};

//Pre-render user on the server side which gives accessToken before it hits the client side so we have the key.
export async function getServerSideProps(context) {
  const session = await getSession(context); // prefetches session info so it can use the info before hand. Ex: render the playlist image in MainView.js
  return {
    props: {
      session,
    },
  };
}
export default Home;

```

Create a new file Songs.js and Song.js in components folder:

Update Song.js:

```
import React from "react";
import { useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

function Songs() {
  const playlist = useRecoilValue(playlistState);

  return (
    <div className="text-white px-8 flex-col space-y-1 pb-28">
      {playlist?.tracks.items.map((track, index) => (
        <Song key={track.track.id} track={track} order={index} />
      ))}
    </div>
  );
}

export default Songs;

```

Create a helper function called time.js in the lib folder or use moment package:

```
export function millisecondsToMinutesAndSeconds(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return seconds == 60
    ? minutes + 1 + ":00"
    : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

```

Update Song.js:

```
import Image from "next/image";
import React from "react";
import useSpotify from "../hooks/useSpotify";
import { millisecondsToMinutesAndSeconds } from "../lib/time";
function Song({ order, track }) {
  const spotifyApi = useSpotify();
  return (
    <div className="grid grid-cols-2 text-gray-500 px-5 py-4 rounded-lg cursor-pointer hover:bg-gray-900">
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <div className="w-10 h-10 relative">
          <Image
            src={track.track.album.images[0].url}
            alt={track.track.name}
            layout="fill" // required
            objectFit="cover" // change to suit your needs
            priority
          />
        </div>
        <div>
          <p className="text-white w-36 lg:w-64 truncate">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0 ">
        <p className="hidden md:inline w-40">{track.track.album.name}</p>
        <p>{millisecondsToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;


```

Next, lets create a songAtom.js in atoms folder:

```
import {atom} from "recoil";

export const currentTrackIdState=atom({
    key:"currentTrackIdState", //unique ID(with respect to other atom/selectors)
    default:null // default value (initial value)
});

export const isPlayingState = atom({
    key:"isPlayingState",
    default:false,
})

```

Next, update the Song component with the atoms isPlayingState and currentTrackIdState and create a playSong function:

```
import Image from "next/image";
import React from "react";
import useSpotify from "../hooks/useSpotify";
import { millisecondsToMinutesAndSeconds } from "../lib/time";
import {currentTrackIdState,isPlayingState} from "../atoms/songAtom";
import {useRecoilState} from "recoil";
function Song({ order, track }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId ]=useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying]=useRecoilState(isPlayingState);
  const playSong = () => {
setCurrentTrackId(track.track.id);
setIsPlaying(true);
spotifyApi.play({
  uris:[track.track.uri],
})
  }

  return (
    <div className="grid grid-cols-2 text-gray-500 px-5 py-4 rounded-lg cursor-pointer hover:bg-gray-900" onClick={playSong}>
      <div className="flex items-center space-x-4">
      ..........
      ....
      ..

```

Next, create a Player.js component and add it in the index.jsx:

```
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";

function Player() {
  const { data: session, status } = useSession();
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  return (
    <div>
      <div>
        <div className="w-10 h-10 rounded cursor-pointer relative">
          <Image
            src=""
            alt="logo"
            layout="fill" // required
            objectFit="conver" // change to suit your needs
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default Player;

```

When we fetch the song track info it gives the info in one format and when you play the song track it gives the info in a different format. We can create a helper called useSongInfo.js in hooks folder to get the songID and gives the correct song track info no matter it's fetched from the playlist or selected from the song list.

useSongInfo.js:

```
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



```

Open globals.css files in styles folder in the root.

```
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .button {
    @apply h-5 w-5;
  }
}


```

Now in Player.js:

```
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import {
  ReplyIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  PlayIcon,
  PauseIcon,
  RewindIcon,
  FastForwardIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
  const { data: session } = useSession();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const spotifyApi = useSpotify();

  const songInfo = useSongInfo();
  //   console.log(songInfo);
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now Playing:", data.body?.item);
        setCurrentTrackId(data.body?.item?.id);
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      //fetch song Info
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) debouncedAdjustVolume(volume);
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce(async (volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );
  return (
    <div className="h-24 grid grid-cols-3 text-xs md:text-base px-2 md:px-8 bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="flex items-center space-x-4">
        {/* <div className=" w-10 h-10 cursor-pointer relative">
          <Image
            className=""
            src={songInfo?.album.images?.[0]?.url}
            alt="logo"
            layout="fill" // required
            objectFit="cover" // change to suit your needs
            priority
          />
        </div> */}
        <img
          className="hidden md:inline w-10 h-10 cursor-pointer"
          src={songInfo?.album.images?.[0]?.url}
          alt={songInfo?.album.name}
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="playerButton" />
        <RewindIcon
          className="playerButton"
          onClick={() =>
            spotifyApi.skipToPrevious().then(
              function () {
                console.log("Skip to previous");
              },
              function (err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log("Something went wrong!", err);
              }
            )
          }
        />
        {isPlaying ? (
          <PauseIcon
            onClick={handlePlayPause}
            className="playerButton w-10 h-10"
          />
        ) : (
          <PlayIcon
            onClick={handlePlayPause}
            className="playerButton w-10 h-10"
          />
        )}

        <FastForwardIcon
          className="playerButton"
          onClick={() =>
            spotifyApi.skipToNext().then(
              function () {
                console.log("Skip to next");
              },
              function (err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log("Something went wrong!", err);
              }
            )
          }
        />
        <ReplyIcon className="playerButton" />
      </div>
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          className="playerButton"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="playerButton"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;


```

Implementing Debounce function: (import debounce from lodash)
Used for example when you increase decrease volume it called the Spotify API every time you move the input range slider and leads to too many calls. Instead of making multiple requests using debounce we make just 1 request. Here we make use of useCallback() which allows us to have a memoized function. When component mounts create the function once and don't keep creating it again. We can debounce the function. The inpput will wait for a duration in milliseconds so that the input stops and then it calls the function. It is similar to useMemo().

```

  useEffect(() => {
    if (volume > 0 && volume < 100) debouncedAdjustVolume(volume);
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce(async (volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );
```

Install HeadlessUI to use components:

```
npm install @headlessui/react
```

Add the Website and Redirect URIs in Spotify Developer API Dashboard and add a user that can have access to the app.
Ex:

```
Website:
http://localhost:3000
OR
https://spotify-clone-valyndsilva.vercel.app


Redirect URIs
http://localhost:3000/api/auth/callback/spotify Remove
http://localhost:3000 Remove
```
