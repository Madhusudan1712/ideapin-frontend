import React, { useEffect, useState, useMemo } from 'react';
import { Grid, Typography, Button, TextField, Box, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import NoteCard from '../../components/notes/NoteCard';
import NoteEditor from '../../components/notes/NoteEditor';
import { NotesSkeletonList } from '../../components/common/loading/Skeleton';
import ToastMessage from '../../components/common/toastMessage/ToastMessage';
import { useNotes } from '../../hooks/useNotes';
import type { Note } from '../../features/notes/notesSlice';

/**
 * Notes CRUD Workspace Page displaying personal notes with search and tab filtering.
 */
export const MyNotesPage: React.FC = () => {
  const { notes, loading, error, getNotes, addNote, editNote, removeNote } = useNotes();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const action = searchParams.get('action');

  // Toast notification state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  // Open note editor dynamically if action=create is requested
  useEffect(() => {
    if (action === 'create') {
      setEditingNote(null);
      setEditorOpen(true);
    }
  }, [action]);

  const showToast = (msg: string, sev: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastSeverity(sev);
    setToastOpen(true);
  };

  const handleCreateClick = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('action', 'create');
      return newParams;
    });
  };

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  const handleEditorClose = () => {
    setEditorOpen(false);
    if (action === 'create') {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('action');
        return newParams;
      });
    }
  };

  const handleSaveNote = async (noteData: { title: string; content: string; visibility: 'private' | 'public' }) => {
    setActionLoading(true);
    try {
      if (editingNote) {
        await editNote(editingNote._id, noteData);
        showToast('Note updated successfully');
      } else {
        await addNote(noteData);
        showToast('Note created successfully');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save note', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setActionLoading(true);
    try {
      await removeNote(id);
      showToast('Note deleted successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete note', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePin = async (note: Note) => {
    try {
      await editNote(note._id, { isPinned: !note.isPinned });
      showToast(note.isPinned ? 'Note unpinned' : 'Note pinned');
    } catch (err: any) {
      showToast(err.message || 'Failed to pin note', 'error');
    }
  };

  // Filter notes based on the sidebar tab search param and query search query
  const filteredNotes = useMemo(() => {
    let result = notes;

    // Apply sidebar active filters
    if (filter === 'pin') {
      result = result.filter((n) => n.isPinned);
    } else if (filter === 'public') {
      result = result.filter((n) => n.visibility === 'public');
    } else if (filter === 'private') {
      result = result.filter((n) => n.visibility === 'private');
    }

    // Apply query filters
    return result.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, filter, searchQuery]);

  const pinnedNotes = useMemo(() => filteredNotes.filter((n) => n.isPinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter((n) => !n.isPinned), [filteredNotes]);

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 }, boxSizing: 'border-box' }}>
        {/* Dashboard Header Banner */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            mb: 5,
          }}
        >
          <Box sx={{ textIndent: 0, textAlign: 'left' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, m: 0, fontSize: { xs: '1.8rem', md: '2.4rem' }, color: 'var(--text-h)' }}
            >
              My Workspace
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text)', mt: 0.5 }}>
              Manage your personal thoughts, code structures, and published ideas.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            sx={{
              backgroundColor: 'var(--accent)',
              boxShadow: 'none',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1.25,
              borderRadius: 2.5,
              '&:hover': {
                backgroundColor: 'var(--accent)',
                opacity: 0.9,
                boxShadow: 'none',
              },
            }}
          >
            Create Note
          </Button>
        </Box>

        {/* Query Filter Input Bar */}
        <Box sx={{ mb: 4, display: 'flex' }}>
          <TextField
            fullWidth
            placeholder="Search notes by title or content..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'var(--text)' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'var(--bg)',
                '& fieldset': { borderColor: 'var(--border)' },
                '&:hover fieldset': { borderColor: 'var(--accent-border)' },
                '&.Mui-focused fieldset': { borderColor: 'var(--accent)' },
              },
            }}
          />
        </Box>

        {/* Grid Lists rendering */}
        {loading && notes.length === 0 ? (
          <NotesSkeletonList count={6} />
        ) : error ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography color="error" variant="h6">
              {error}
            </Typography>
            <Button onClick={getNotes} sx={{ mt: 2, color: 'var(--accent)' }}>
              Retry Fetching
            </Button>
          </Box>
        ) : filteredNotes.length === 0 ? (
          <Box
            sx={{
              py: 10,
              textAlign: 'center',
              backgroundColor: 'var(--bg)',
              border: '1px dashed var(--border)',
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" sx={{ color: 'var(--text-h)', fontWeight: 600 }}>
              No notes found
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text)', mt: 0.5 }}>
              {searchQuery ? 'Try refining your search terms.' : 'No notes match the current tab filter.'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Pinned Notes Section */}
            {pinnedNotes.length > 0 && filter !== 'private' && filter !== 'public' && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: 'var(--text-h)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    mb: 2,
                    textAlign: 'left',
                  }}
                >
                  Pinned
                </Typography>
                <Grid container spacing={3}>
                  {pinnedNotes.map((note) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={note._id}>
                      <NoteCard
                        note={note}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteNote}
                        onTogglePin={handleTogglePin}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Other Notes Section */}
            {otherNotes.length > 0 && (
              <Box>
                {pinnedNotes.length > 0 && filter !== 'private' && filter !== 'public' && (
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: 'var(--text-h)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      mb: 2,
                      textAlign: 'left',
                    }}
                  >
                    Recent
                  </Typography>
                )}
                <Grid container spacing={3}>
                  {otherNotes.map((note) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={note._id}>
                      <NoteCard
                        note={note}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteNote}
                        onTogglePin={handleTogglePin}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        )}

        {/* Editor Modal */}
        <NoteEditor
          open={editorOpen}
          onClose={handleEditorClose}
          noteToEdit={editingNote}
          onSave={handleSaveNote}
          loading={actionLoading}
        />

        {/* Toast Alerts */}
        <ToastMessage
          open={toastOpen}
          onClose={() => setToastOpen(false)}
          message={toastMessage}
          severity={toastSeverity}
        />
      </Box>
    </DashboardLayout>
  );
};

export default MyNotesPage;
