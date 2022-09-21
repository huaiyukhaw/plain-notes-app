import { clsx } from "clsx";
import { useAutosizeTextArea } from "../lib/useAutosizeTextArea";
import { RemoveScroll } from "react-remove-scroll";
import { useKeyPress } from "../lib/useKeyPress";
import { useNoteContext } from "../context/noteContext";
import { useState, useEffect, useRef } from "react";

export const CreateNote: React.FC = () => {
  const { uploadNote } = useNoteContext();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteContent, setNoteContent] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isTitleFocused, setIsTitleFocused] = useState<boolean>(false);
  const [isContentFocused, setIsContentFocused] = useState<boolean>(false);

  const isEmpty =
    noteTitle.trim().length <= 0 && noteContent.trim().length <= 0;
  const characterCount = noteContent.trim().length;

  const noteTitleRef = useRef<HTMLTextAreaElement>(null);
  const noteContentRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(noteTitleRef.current, noteTitle, isMinimized === false);
  useAutosizeTextArea(noteContentRef.current, noteContent);

  const handleTextAreaClick = () => {
    setIsLoaded(true);
    setIsMinimized(false);
  };

  const handleNoteTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isLoaded) setIsLoaded(true);
    setNoteTitle(e.target.value);
  };

  const handleNoteContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!isLoaded) setIsLoaded(true);
    setNoteContent(e.target.value);
  };

  const handleClearClick = () => {
    setNoteTitle("");
    setNoteContent("");
    setIsMinimized(true);
  };

  const handleSaveClick = () => {
    if (!isEmpty) {
      uploadNote(noteTitle, noteContent);
      setNoteTitle("");
      setNoteContent("");
    }
    setIsMinimized(true);
  };

  const handleTextAreaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSaveClick();
      noteTitleRef.current?.blur();
      noteContentRef.current?.blur();
      setIsMinimized(true);
    }
    if (e.key === "Escape") {
      handleClearClick();
      noteTitleRef.current?.blur();
      noteContentRef.current?.blur();
      setIsMinimized(true);
    }
  };

  const onKeyPressToCreateNote = () => {
    noteContentRef.current?.focus();
  };
  useKeyPress(["\\"], onKeyPressToCreateNote, "ctrlKey");

  useEffect(() => {
    if (isLoaded) {
      if (isTitleFocused == false && isContentFocused == false && isEmpty) {
        setIsMinimized(true);
      } else {
        setIsMinimized(false);
      }
    }
  }, [isTitleFocused, isContentFocused, isEmpty]);

  return (
    <>
      <RemoveScroll enabled={!isMinimized} removeScrollBar>
        <div
          className={clsx(
            "mx-auto h-max max-h-[96vh] w-full max-w-2xl rounded-lg border border-gray-300 bg-gray-100 py-4 focus-within:drop-shadow-xl",
            isMinimized
              ? "pl-6"
              : "fixed inset-0 z-50 my-4 flex flex-col px-6 backdrop-blur-3xl"
          )}
        >
          <div className="relative flex flex-col gap-2 overflow-auto">
            {isMinimized && (
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 my-auto hidden h-max pr-4 font-medium text-gray-400 sm:block">
                Ctrl + \
              </div>
            )}

            <textarea
              className={clsx(
                "flex-none resize-none bg-transparent font-semibold text-gray-800 outline-none",
                isMinimized && "hidden"
              )}
              placeholder="Title"
              value={noteTitle}
              onChange={handleNoteTitleChange}
              onFocus={() => setIsTitleFocused(true)}
              onBlur={() => setIsTitleFocused(false)}
              onKeyDown={handleTextAreaKeyDown}
              ref={noteTitleRef}
            ></textarea>
            <textarea
              className="flex-none resize-none bg-transparent text-gray-800 outline-none"
              cols={10}
              placeholder="Take a note..."
              autoFocus
              value={noteContent}
              onChange={handleNoteContentChange}
              onClick={() => handleTextAreaClick()}
              onFocus={() => setIsContentFocused(true)}
              onBlur={() => setIsContentFocused(false)}
              onKeyDown={handleTextAreaKeyDown}
              ref={noteContentRef}
            ></textarea>
          </div>
          <div
            className={clsx(
              "mt-4 flex flex-col items-start justify-between sm:flex-row sm:items-center",
              isMinimized && "hidden"
            )}
          >
            <small className="text-sm text-gray-600">
              count: {characterCount}
            </small>
            <div
              className={clsx(
                "flex w-full items-center justify-end gap-1 sm:w-fit",
                isEmpty && "invisible"
              )}
            >
              <small className="pointer-events-none hidden text-xs font-medium text-gray-400 sm:block">
                Ctrl + Enter to save
              </small>
              <button
                className="rounded-2xl px-4 py-1 text-sm font-medium hover:bg-gray-100"
                onClick={handleClearClick}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-900 hover:bg-black hover:text-white"
                onClick={handleSaveClick}
                disabled={isEmpty}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </RemoveScroll>
      {!isMinimized && (
        <div
          className="fixed inset-0 z-10 overflow-hidden bg-black/30 backdrop-blur-sm"
          onClick={handleClearClick}
        ></div>
      )}
    </>
  );
};
