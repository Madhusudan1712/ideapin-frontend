import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchNotes } from '../features/notes/notesThunk';
import { selectAllNotes, selectNotesLoading, selectNotesError } from '../features/notes/notesSelector';
import { addLocalNote, updateLocalNote, deleteLocalNote } from '../features/notes/notesSlice';
import { syncQueue } from '../services/sync/syncQueue';

/**
 * Generates a valid 24-character hexadecimal ObjectId matching MongoDB format.
 */
const generateObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return timestamp + random;
};

/**
 * Custom hook abstracting Notes CRUD operations, with optimistic state updates and offline queueing.
 */
export const useNotes = () => {
  const dispatch = useAppDispatch();
  const notes = useAppSelector(selectAllNotes);
  const loading = useAppSelector(selectNotesLoading);
  const error = useAppSelector(selectNotesError);

  const getNotes = useCallback(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const addNote = useCallback(
    async (noteData: { title: string; content: string; visibility: 'private' | 'public'; isPinned?: boolean }) => {
      const newNote = {
        _id: generateObjectId(),
        title: noteData.title,
        content: noteData.content,
        visibility: noteData.visibility,
        isPinned: noteData.isPinned ?? false,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 1. Optimistic local update
      dispatch(addLocalNote(newNote));

      // 2. Queue for background sync
      syncQueue.enqueue({
        type: 'CREATE',
        noteId: newNote._id,
        title: newNote.title,
        content: newNote.content,
        visibility: newNote.visibility,
        isPinned: newNote.isPinned,
      });

      return newNote;
    },
    [dispatch]
  );

  const editNote = useCallback(
    async (id: string, noteData: { title?: string; content?: string; visibility?: 'private' | 'public'; isPinned?: boolean }) => {
      // 1. Optimistic local update
      dispatch(updateLocalNote({ _id: id, ...noteData }));

      // 2. Clear conflict tag if user re-saves/updates the note
      syncQueue.removeConflict(id);

      // 3. Queue for background sync
      syncQueue.enqueue({
        type: 'UPDATE',
        noteId: id,
        ...noteData,
      });

      const updated = notes.find((n) => n._id === id);
      return updated ? { ...updated, ...noteData } : null;
    },
    [dispatch, notes]
  );

  const removeNote = useCallback(
    async (id: string) => {
      // 1. Optimistic local delete
      dispatch(deleteLocalNote(id));

      // 2. Clear conflict tag
      syncQueue.removeConflict(id);

      // 3. Queue for background sync
      syncQueue.enqueue({
        type: 'DELETE',
        noteId: id,
      });

      return id;
    },
    [dispatch]
  );

  return {
    notes,
    loading,
    error,
    getNotes,
    addNote,
    editNote,
    removeNote,
  };
};
