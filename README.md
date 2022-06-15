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
Create a file under pages called "\_middleware.js"
