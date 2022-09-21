import { UniqueIdentifier } from "@dnd-kit/core";

export interface INote {
  id: UniqueIdentifier;
  noteContent: string;
  noteTitle: string;
  isPinned: boolean;
  isArchived: boolean;
  lastUpdated: Date;
}

export type NoteContextType = {
  notes: INote[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  uploadNote: (noteTitle: string, noteContent: string) => void;
  deleteNote: (currentNote: INote) => void;
  replaceNote: (currentNote: INote) => void;
  togglePinNote: (currentNote: INote) => void;
  toggleArchiveNote: (currentNote: INote) => void;
  showArchived: boolean;
  setShowArchived: React.Dispatch<React.SetStateAction<boolean>>;
};
