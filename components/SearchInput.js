import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@heroicons/react/outline";

function Search({ search, setSearch }) {
  return (
    <div className="bg-white rounded-full overflow-hidden border-2 px-4 py-2 p-1 pr-2 flex items-center">
     
      <form className="">
        <div className="flex ">
          <div className="relative w-96">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-500" />
            </div>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full z-20 text-sm text-gray-500 rounded-r-lg focus:outline-none focus:none block p-2.5 pl-10  rounded-lg"
              placeholder="Artists, Songs or Podcasts..."
              required
            />
            <button
              type="submit"
              className="absolute top-0 right-0 p-2.5 text-sm font-medium text-black-500 rounded-r-lg   hover:text-black-900 focus:outline-none focus:none  "
            ></button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Search;
