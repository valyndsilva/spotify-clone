# Spotify Clone

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
    <nav className="text-gray-500 p-5 text-sm border-r border-gray-900  h-screen overflow-y-scroll scrollbar-hide">
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
