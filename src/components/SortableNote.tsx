import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { INote } from "../@types/note";
import { Note } from "./Note";
import { useState } from "react";

interface SortableNoteProps {
  id: UniqueIdentifier;
  note: INote;
}

export const SortableNote: React.FC<SortableNoteProps> = ({ id, note }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id, disabled: isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Note
      id={id}
      ref={setNodeRef}
      style={style}
      note={note}
      isDragging={isDragging}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      {...attributes}
      {...listeners}
    />
  );
};
