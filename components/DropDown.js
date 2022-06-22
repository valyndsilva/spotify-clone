import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import userImg from "../public/spotify-img.png";

function DropDown() {
  const { data: session } = useSession();

  return (
    <Menu as="div">
      <Menu.Button className="flex items-center px-4 py-3 bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white w-64 border-2 border-[#333333]">
        <div className="w-10 h-10 rounded cursor-pointer relative">
          <Image
            src={userImg}
            alt="logo"
            layout="fill" // required
            objectFit="cover" // change to suit your needs
            priority
          />
        </div>
        <h2>{session?.user.name}</h2>
        <ChevronDownIcon
          className="h-5 w-5 text-[#686868]"
          aria-hidden="true"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 origin-top-right bg-[#1A1A1A] divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <>
                  <div className="flex flex-col space-y-3 px-2 py-2 text-sm tracking-wide">
                    <span className="flex justify-between">
                      Account <ExternalLinkIcon className="w-5 h-5" />
                    </span>
                    <span className="">Profile</span>
                    <span className="">Settings</span>
                    <hr className="border-t-[0.1px] border-gray-800" />
                  </div>
                  <button
                    className={`${
                      active && "bg-white/10"
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm tracking-wide text-white cursor-default`}
                    onClick={signOut}
                  >
                    Log out
                  </button>
                </>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default DropDown;
