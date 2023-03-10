import { GoMarkGithub } from "react-icons/go";

export const Footer: React.FC = () => (
  <div className="mt-8 flex justify-center gap-1">
    <div className="w-fit rounded-lg p-3 py-1.5 text-sm font-medium">
      Made by{" "}
      <a
        href="http://huaiyukhaw.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        @huaiyukhaw
      </a>
    </div>
    <a
      href="https://github.com/huaiyukhaw/plain-notes-app"
      className="flex items-center gap-1 rounded-lg bg-gray-200 p-3 py-1.5 text-sm font-medium drop-shadow hover:bg-gray-300"
    >
      <GoMarkGithub />
      View on GitHub
    </a>
  </div>
);
