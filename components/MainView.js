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
