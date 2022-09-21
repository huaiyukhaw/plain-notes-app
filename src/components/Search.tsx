import { useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { useKeyPress } from "../lib/useKeyPress";
import { useSearch } from "../context/noteContext";

export const Search: React.FC = () => {
  const { searchText, setSearchText } = useSearch();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const onKeyPressToSearch = () => {
    searchInputRef.current?.focus();
  };
  useKeyPress(["/"], onKeyPressToSearch, "ctrlKey");

  return (
    <div className="relative flex rounded-lg shadow-sm">
      <input
        type="text"
        placeholder="Quick search..."
        className="block w-full rounded-lg bg-gray-100 py-3 pl-11 pr-4 text-sm shadow-sm outline-none placeholder:font-medium placeholder:text-gray-400 focus:z-10 focus:ring focus:ring-gray-300"
        onChange={(event) => setSearchText(event.target.value)}
        ref={searchInputRef}
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
        <BiSearch className="h-5 w-5 fill-gray-500" />
      </div>
      {!searchText && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 my-auto hidden h-max pr-4 font-medium text-gray-400 sm:block">
          Ctrl + /
        </div>
      )}
    </div>
  );
};
