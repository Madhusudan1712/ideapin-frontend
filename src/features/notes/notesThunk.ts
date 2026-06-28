import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';
import type { Note } from './notesSlice';

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
  const res = await apiRequest('/notes');
  return res.data as Note[];
});

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData: { title: string; content: string; visibility: 'private' | 'public'; isPinned?: boolean }) => {
    const res = await apiRequest('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
    return res.data as Note;
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, noteData }: { id: string; noteData: { title?: string; content?: string; visibility?: 'private' | 'public'; isPinned?: boolean } }) => {
    const res = await apiRequest(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
    return res.data as Note;
  }
);

export const deleteNote = createAsyncThunk('notes/deleteNote', async (id: string) => {
  await apiRequest(`/notes/${id}`, {
    method: 'DELETE',
  });
  return id;
});
