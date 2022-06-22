import React from "react";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import spotifyImg from "../public/spotify.jpeg";
function login({ providers }) {
  console.log({ providers });
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <div className="w-80 h-36 mb-5 cursor-pointer relative">
        <Image
          src={spotifyImg}
          alt="logo"
          layout="fill" // required
          objectFit="cover" // change to suit your needs
          priority
          className="animate-pulse"
        />
      </div>
      <div>
        {Object.values(providers).map((provider) => (
          <div key={provider.id}>
            <button
              // className="bg-[#18D860] text-white p-5 rounded-full"
              className="text-white py-4 px-6 rounded-full bg-[#18D860] transition duration-300 ease-out border border-transparent uppercase font-bold text-xs md:text-base tracking-wider hover:scale-105 hover:bg-[#0db146]"
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
