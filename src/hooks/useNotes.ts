import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchNotes, createNote, updateNote, deleteNote } from '../features/notes/notesThunk';
import { selectAllNotes, selectNotesLoading, selectNotesError } from '../features/notes/notesSelector';

/**
 * Custom hook abstracting all Notes CRUD dispatch commands.
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
      return dispatch(createNote(noteData)).unwrap();
    },
    [dispatch]
  );

  const editNote = useCallback(
    async (id: string, noteData: { title?: string; content?: string; visibility?: 'private' | 'public'; isPinned?: boolean }) => {
      return dispatch(updateNote({ id, noteData })).unwrap();
    },
    [dispatch]
  );

  const removeNote = useCallback(
    async (id: string) => {
      return dispatch(deleteNote(id)).unwrap();
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
