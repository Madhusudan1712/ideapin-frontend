import { createSlice } from '@reduxjs/toolkit';
import { fetchNotes, createNote, updateNote, deleteNote } from './notesThunk';

export interface Note {
  _id: string;
  title: string;
  content: string;
  visibility: 'private' | 'public';
  isPinned: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  items: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  items: [],
  loading: false,
  error: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.items = action.payload;
    },
    addLocalNote: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateLocalNote: (state, action) => {
      const index = state.items.findIndex((n) => n._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteLocalNote: (state, action) => {
      state.items = state.items.filter((n) => n._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notes';
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.items.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n._id !== action.payload);
      });
  },
});

export const { setNotes, addLocalNote, updateLocalNote, deleteLocalNote } = notesSlice.actions;
export default notesSlice.reducer;
