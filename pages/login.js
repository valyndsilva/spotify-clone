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
