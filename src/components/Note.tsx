import { UniqueIdentifier } from '@dnd-kit/core';
import { useState, forwardRef, useRef } from 'react';
import { INote } from '../@types/note';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {
    MdPushPin,
    MdOutlinePushPin,
    MdOutlineArchive,
    MdOutlineUnarchive,
} from 'react-icons/md';
import { useAutosizeTextArea } from '../lib/useAutosizeTextArea';
import clsx from 'clsx';
import { useNoteContext } from '../context/noteContext';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(localizedFormat);

interface Props
    extends Omit<React.ComponentProps<'div'>, 'className' | 'id' | 'style'> {
    id: UniqueIdentifier;
    style?: React.CSSProperties;
    note: INote;
    isDragging: boolean;
    isClone?: boolean;
    isEditing?: boolean;
    setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}
export type Ref = HTMLDivElement;

export const Note = forwardRef<Ref, Props>((props, ref) => {
    const { replaceNote, deleteNote, toggleArchiveNote, togglePinNote } =
        useNoteContext();

    const {
        id,
        note,
        isDragging,
        isClone,
        isEditing,
        setIsEditing,
        ...otherProps
    } = props;

    const {
        noteTitle: title,
        noteContent: content,
        lastUpdated,
        isPinned,
        isArchived,
    } = note;

    const [noteTitle, setNoteTitle] = useState<string>(title);
    const [noteContent, setNoteContent] = useState<string>(content);

    const [showDialog, setShowDialog] = useState<boolean>(false);

    const isGhost = !isClone && isDragging;
    const isEmpty = noteContent.trim().length <= 0;
    const characterCount = noteContent.trim().length;

    const noteTitleRef = useRef<HTMLTextAreaElement>(null);
    const noteContentRef = useRef<HTMLTextAreaElement>(null);

    useAutosizeTextArea(noteTitleRef.current, noteTitle);
    useAutosizeTextArea(noteContentRef.current, noteContent);

    const displayDate = dayjs(lastUpdated).isToday()
        ? dayjs(lastUpdated).fromNow()
        : dayjs(lastUpdated).format('LL');

    const handleNoteTitleChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setNoteTitle(event.target.value);
    };

    const handleNoteContentChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setNoteContent(event.target.value);
    };

    const handleSaveEditClick = () => {
        const editedNote: INote = {
            ...note,
            noteTitle: noteTitle,
            noteContent: noteContent,
        };
        if (noteContent.trim().length > 0) {
            replaceNote(editedNote);
            setNoteTitle('');
            setNoteContent('');
        }
    };

    const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (setIsEditing) setIsEditing(false);
    };

    const handleTextAreaKeyDown = (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSaveEditClick();
            noteTitleRef.current?.blur();
            noteContentRef.current?.blur();
        }
        if (e.key === 'Escape') {
            if (setIsEditing) setIsEditing(false);
            setNoteTitle(title);
            setNoteContent(content);
            noteTitleRef.current?.blur();
            noteContentRef.current?.blur();
        }
    };

    const handleCopyButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await navigator.clipboard.writeText(noteTitle + ' ' + noteContent);
    };

    const handleEditButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (setIsEditing) setIsEditing(true);
    };

    const handleDeleteButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        deleteNote(note);
    };

    const ViewNote = (
        <>
            {isPinned && (
                <button
                    className="border-300 absolute top-1 right-1 z-0 rotate-45 rounded-full border border-transparent bg-white p-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-black group-hover:hidden"
                    onClick={() => togglePinNote(note)}
                >
                    <MdPushPin className="h-4 w-4" />
                </button>
            )}
            {/* Show when hover */}
            <dialog
                className={clsx(
                    'absolute inset-0 h-full w-full items-center justify-center gap-1 rounded-lg bg-white/30 backdrop-blur-sm',
                    isDragging && 'group-hover:invisible',
                    showDialog ? 'flex' : 'hidden'
                )}
            >
                <div className="absolute top-1 right-1 flex gap-1 ">
                    <button
                        className="border-300 rounded-full border bg-white p-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-black"
                        onClick={() => toggleArchiveNote(note)}
                    >
                        {note.isArchived ? (
                            <MdOutlineUnarchive className="h-4 w-4" />
                        ) : (
                            <MdOutlineArchive className="h-4 w-4" />
                        )}
                    </button>
                    {!isArchived && (
                        <button
                            className="border-300 rotate-45 rounded-full border bg-white p-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-black"
                            onClick={() => togglePinNote(note)}
                        >
                            {isPinned ? (
                                <MdPushPin className="h-4 w-4" />
                            ) : (
                                <MdOutlinePushPin className="h-4 w-4" />
                            )}
                        </button>
                    )}
                </div>
                <button
                    className="border-300 rounded-2xl border bg-white px-4 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-black"
                    onClick={handleCopyButton}
                >
                    Copy
                </button>
                <button
                    className="border-300 rounded-2xl border bg-white px-4 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-black"
                    onClick={handleEditButton}
                >
                    Edit
                </button>
                <button
                    className="rounded-2xl bg-gray-800 px-4 py-1 text-sm font-medium text-gray-100 hover:bg-black hover:text-white"
                    onClick={handleDeleteButton}
                >
                    Delete
                </button>
            </dialog>
            <div className="flex flex-col gap-2">
                {noteTitle && (
                    <p className="whitespace-pre-wrap break-words font-semibold text-gray-800 line-clamp-2">
                        {noteTitle}
                    </p>
                )}
                {noteContent && (
                    <p className="whitespace-pre-wrap break-words text-gray-800 line-clamp-8">
                        {noteContent}
                    </p>
                )}
            </div>
            <small className="mt-4 text-sm text-gray-600">{displayDate}</small>
        </>
    );

    const EditNote = (
        <>
            <div className="flex flex-col gap-2">
                <textarea
                    className="resize-none bg-transparent font-semibold text-gray-800 outline-none"
                    placeholder="Title"
                    value={noteTitle}
                    onChange={handleNoteTitleChange}
                    onKeyDown={handleTextAreaKeyDown}
                    ref={noteTitleRef}
                ></textarea>
                <textarea
                    className="resize-none bg-transparent text-gray-800 outline-none"
                    autoFocus
                    // rows={8}
                    placeholder="Take a note..."
                    value={noteContent}
                    onChange={handleNoteContentChange}
                    onKeyDown={handleTextAreaKeyDown}
                    ref={noteContentRef}
                ></textarea>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <small className="text-sm text-gray-600">
                    count: {characterCount}
                </small>
                <div className="flex gap-1">
                    <button
                        className={clsx(
                            'rounded-2xl px-4 py-1 text-sm font-medium hover:bg-gray-100',
                            isEmpty && 'hidden'
                        )}
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </button>
                    <button
                        className={clsx(
                            'rounded-2xl bg-gray-200 px-4 py-1 text-sm font-medium text-gray-900',
                            isEmpty
                                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                                : 'hover:bg-black hover:text-white'
                        )}
                        onClick={handleSaveEditClick}
                        disabled={isEmpty}
                    >
                        Save Edit
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <div
            className={clsx(
                'overflow-none group relative min-h-[322px] w-full rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:outline-none sm:max-w-md sm:overflow-hidden',
                isClone && 'z-50 select-none bg-gray-100 drop-shadow-lg',
                isGhost && 'opacity-0',
                isEditing ? 'cursor-default' : 'cursor-move'
            )}
            ref={ref}
            id={String(id)}
            {...otherProps}
        >
            <div
                className={clsx(
                    'flex h-full w-full max-w-md flex-col justify-between',
                    !isEditing && 'invisible absolute select-none'
                )}
                aria-hidden={!isEditing}
            >
                {EditNote}
            </div>
            <div
                className={clsx(
                    'flex h-full select-none flex-col justify-between',
                    isEditing && 'hidden'
                )}
                onClick={() => setShowDialog((bool) => !bool)}
                onMouseLeave={() => setShowDialog(false)}
                onMouseEnter={() => setShowDialog(true)}
            >
                {ViewNote}
            </div>
        </div>
    );
});
