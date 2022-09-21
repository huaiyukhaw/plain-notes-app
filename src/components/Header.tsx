import { RandomButton } from "./RandomButton";
import { useNotes } from "../context/noteContext";
import clsx from "clsx";

export const Header: React.FC = () => {
  const { showArchived, setShowArchived, archivedCount, otherCount } =
    useNotes();
  return (
    <div className="sticky top-0 z-10 flex items-end justify-between gap-4 bg-white">
      <div className="flex w-full items-end gap-4">
        <h1 className="text-5xl font-bold">Notes</h1>
        <button
          className={clsx(
            "w-fit rounded-lg px-2 py-1 text-sm font-medium hover:bg-gray-100",
            !showArchived ? "bg-gray-200" : "text-gray-500"
          )}
          onClick={() => setShowArchived(false)}
        >
          All {otherCount}
        </button>
        <button
          className={clsx(
            "w-fit rounded-lg px-2 py-1 text-sm font-medium hover:bg-gray-100",
            showArchived ? "bg-gray-200" : "text-gray-500"
          )}
          onClick={() => setShowArchived(true)}
        >
          Archived {archivedCount}
        </button>
      </div>
      <div className="flex-none">
        <RandomButton />
      </div>
    </div>
  );
};
