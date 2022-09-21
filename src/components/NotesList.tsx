import React from "react";
import { INote } from "../@types/note";
import { useState, useEffect, Suspense } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
  DragStartEvent,
  DragOverlay,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { SortableNote } from "./SortableNote";
import { Note } from "./Note";
import { useNotes } from "../context/noteContext";

export const NotesList: React.FC = () => {
  const { notesInOrder, setNotes } = useNotes();

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeNote, setActiveNote] = useState<INote | null>();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 15,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id);
    setActiveNote(notesInOrder.find((note) => note.id === active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      if (active.id !== over.id) {
        setNotes((notes) => {
          const oldIndex = notes.findIndex((note) => note.id === active.id);
          const newIndex = notes.findIndex((note) => note.id === over!.id);

          return arrayMove(notes, oldIndex, newIndex);
        });
      }
    }
    setActiveId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-2 overflow-hidden text-sm sm:gap-4 sm:text-base">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={notesInOrder} strategy={rectSortingStrategy}>
            {notesInOrder.map((note) => (
              <SortableNote key={note.id} id={note.id} note={note} />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId && activeNote ? (
              <Note id={activeId} note={activeNote} isDragging isClone />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
