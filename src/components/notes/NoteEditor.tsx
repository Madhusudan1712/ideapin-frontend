import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl, Typography } from '@mui/material';
import Modal from '../common/modal/Modal';
import type { Note } from '../../features/notes/notesSlice';

interface NoteEditorProps {
  open: boolean;
  onClose: () => void;
  noteToEdit: Note | null;
  onSave: (noteData: { title: string; content: string; visibility: 'private' | 'public' }) => Promise<void>;
  loading: boolean;
}

/**
 * Note Creation and Edit Editor Form inside a Modal overlay.
 */
export const NoteEditor: React.FC<NoteEditorProps> = ({ open, onClose, noteToEdit, onSave, loading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setVisibility(noteToEdit.visibility);
    } else {
      setTitle('');
      setContent('');
      setVisibility('private');
    }
    setError(null);
  }, [noteToEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      await onSave({ title, content, visibility });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save note');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={noteToEdit ? 'Edit Note' : 'Create Note'}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!error && !title.trim()}
          helperText={!title.trim() && error ? 'Title is required' : ''}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: 'var(--accent-border)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--accent)' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: 'var(--accent)' },
          }}
        />

        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          multiline
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={!!error && !content.trim()}
          helperText={!content.trim() && error ? 'Content is required' : ''}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: 'var(--accent-border)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--accent)' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: 'var(--accent)' },
          }}
        />

        <FormControl component="fieldset">
          <FormLabel
            component="legend"
            sx={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text)',
              mb: 1,
              '&.Mui-focused': { color: 'var(--text)' },
            }}
          >
            Visibility
          </FormLabel>
          <RadioGroup
            row
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as 'private' | 'public')}
          >
            <FormControlLabel
              value="private"
              control={<Radio size="small" sx={{ '&.Mui-checked': { color: 'var(--accent)' } }} />}
              label="Private"
              disabled={loading}
            />
            <FormControlLabel
              value="public"
              control={<Radio size="small" sx={{ '&.Mui-checked': { color: 'var(--accent)' } }} />}
              label="Public"
              disabled={loading}
            />
          </RadioGroup>
        </FormControl>

        {error && !(!title.trim() || !content.trim()) && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
          <Button
            onClick={onClose}
            variant="text"
            disabled={loading}
            sx={{
              color: 'var(--text)',
              '&:hover': {
                backgroundColor: 'var(--accent-bg)',
                color: 'var(--accent)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: 'var(--accent)',
              boxShadow: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                backgroundColor: 'var(--accent)',
                opacity: 0.9,
                boxShadow: 'none',
              },
            }}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NoteEditor;
