import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { DropDown } from ".";
import { searchState } from "../atoms/searchAtom";
import SearchInput from "./SearchInput";

function Header() {
  const [search, setSearch] = useRecoilState(searchState);
  return (
    <header className="flex items-center justify-between px-5 mt-5 mb-5">
      <div className="flex items-center space-x-8">
        <div className="flex text-white space-x-4">
          <ChevronLeftIcon className="w-8 h-8 border rounded-full p-1" />
          <ChevronRightIcon className="w-8 h-8  border rounded-full p-1" />
        </div>
        <div>
          <SearchInput search={search} setSearch={setSearch} />
        </div>
      </div>
      <div>
        <DropDown />
      </div>
    </header>
  );
}

export default Header;
