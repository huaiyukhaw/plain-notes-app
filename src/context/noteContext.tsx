import { nanoid } from "nanoid";
import {
  createContext,
  FC,
  PropsWithChildren,
  useState,
  useEffect,
  useContext,
} from "react";
import { NoteContextType, INote } from "../@types/note";

export const NoteContext = createContext<NoteContextType>(
  {} as NoteContextType
);

export const NoteProvider: FC<PropsWithChildren> = ({ children }) => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [retrievedSavedData, setRetrievedSavedData] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [showArchived, setShowArchived] = useState<boolean>(false);

  useEffect(() => {
    const appData = localStorage.getItem("h8w-notes-app-data");
    if (appData) {
      const savedNotes = JSON.parse(appData);
      if (savedNotes) {
        setNotes(savedNotes);
      }
    }
    setRetrievedSavedData(true);
  }, []);

  useEffect(() => {
    if (retrievedSavedData) {
      localStorage.setItem("h8w-notes-app-data", JSON.stringify(notes));
    }
  }, [notes]);

  const uploadNote = (noteTitle: string, noteContent: string) => {
    const newNote: INote = {
      id: nanoid(),
      noteTitle: noteTitle,
      noteContent: noteContent,
      isPinned: false,
      isArchived: false,
      lastUpdated: new Date(),
    };

    setNotes((oldNotes) => [newNote, ...oldNotes]);
  };

  const deleteNote = (currentNote: INote) => {
    setNotes((oldNotes) =>
      oldNotes.filter((note) => note.id !== currentNote.id)
    );
  };

  const replaceNote = (currentNote: INote) => {
    setNotes((oldNotes) => {
      const editedNote: INote = {
        ...currentNote,
        id: nanoid(),
        lastUpdated: new Date(),
      };
      const newNotes = oldNotes.filter((note) => note.id !== currentNote.id);
      newNotes.unshift(editedNote);
      return newNotes;
    });
  };

  const togglePinNote = (currentNote: INote) => {
    setNotes((oldNotes) => {
      const editedNote: INote = {
        ...currentNote,
        isArchived: false,
        isPinned: !currentNote.isPinned,
        lastUpdated: new Date(),
      };
      const newNotes = oldNotes.filter((note) => note.id !== currentNote.id);
      newNotes.unshift(editedNote);
      return newNotes;
    });
  };

  const toggleArchiveNote = (currentNote: INote) => {
    setNotes((oldNotes) => {
      const editedNote: INote = {
        ...currentNote,
        isArchived: !currentNote.isArchived,
        isPinned: false,
        lastUpdated: new Date(),
      };
      const newNotes = oldNotes.filter((note) => note.id !== currentNote.id);
      newNotes.unshift(editedNote);
      return newNotes;
    });
  };
  return (
    <NoteContext.Provider
      value={{
        notes,
        setNotes,
        searchText,
        setSearchText,
        uploadNote,
        deleteNote,
        replaceNote,
        togglePinNote,
        toggleArchiveNote,
        showArchived,
        setShowArchived,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useSearch = () => {
  const { searchText, setSearchText } = useContext(NoteContext);
  return { searchText, setSearchText };
};

export const useNoteContext = () => {
  const {
    notes,
    setNotes,
    searchText,
    setSearchText,
    uploadNote,
    deleteNote,
    replaceNote,
    togglePinNote,
    toggleArchiveNote,
    showArchived,
    setShowArchived,
  } = useContext(NoteContext);
  return {
    notes,
    setNotes,
    searchText,
    setSearchText,
    uploadNote,
    deleteNote,
    replaceNote,
    togglePinNote,
    toggleArchiveNote,
    showArchived,
    setShowArchived,
  };
};

export const useNotes = () => {
  const {
    searchText,
    notes: allNotes,
    setNotes,
    showArchived,
    setShowArchived,
  } = useContext(NoteContext);

  const formattedSearch = searchText.trim().toLowerCase();
  const notes = allNotes.filter(
    (note: INote) =>
      note.noteTitle.toLowerCase().includes(formattedSearch) ||
      note.noteContent.toLowerCase().includes(formattedSearch)
  );

  const pinnedNotes = notes.filter((note) => note.isPinned);
  const archivedNotes = notes.filter((note) => note.isArchived);
  const otherNotes = notes.filter((note) => !note.isPinned && !note.isArchived);

  const notesInOrder = showArchived
    ? archivedNotes
    : [...pinnedNotes, ...otherNotes];

  return {
    notesInOrder,
    notes,
    setNotes,
    archivedCount: archivedNotes.length,
    otherCount: pinnedNotes.length + otherNotes.length,
    showArchived,
    setShowArchived,
  };
};
