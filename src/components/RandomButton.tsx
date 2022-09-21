import { useNoteContext } from "../context/noteContext";
import { loremIpsum } from "lorem-ipsum";
import { FaMagic } from "react-icons/fa";

export const RandomButton: React.FC = () => {
  const { uploadNote } = useNoteContext();

  const handleGenerateButton = () => {
    const randomTitle = loremIpsum({
      count: 1,
      units: "sentences",
    });
    const randomContent = loremIpsum({
      count: 2,
      units: "paragraphs",
    });
    uploadNote(randomTitle, randomContent);
  };

  return (
    <button
      className="rounded-full p-2 text-gray-700 hover:bg-gray-100 hover:text-black"
      onClick={handleGenerateButton}
    >
      <FaMagic className="h-4 w-4" />
    </button>
  );
};
