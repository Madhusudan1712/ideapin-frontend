import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip, Tooltip, Button } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import type { Note } from '../../features/notes/notesSlice';
import { syncQueue } from '../../services/sync/syncQueue';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (note: Note) => void;
}

/**
 * Premium Note Card component displaying title, content, visibility, and edit/delete controls.
 * Integrates visual "Conflict: Not Saved" flags and manual resolution prompts.
 */
export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onTogglePin }) => {
  const isConflicted = syncQueue.getConflicts().includes(note._id);

  return (
    <Card
      sx={{
        border: isConflicted ? '1.5px solid' : '1px solid',
        borderColor: isConflicted ? 'error.main' : 'var(--border)',
        borderRadius: 2,
        backgroundColor: 'var(--bg)',
        boxShadow: isConflicted ? '0 4px 12px rgba(211, 47, 47, 0.08)' : 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isConflicted ? '0 8px 18px rgba(211, 47, 47, 0.12)' : 'var(--shadow)',
          borderColor: isConflicted ? 'error.main' : 'var(--accent-border)',
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
          p: 3,
          '&:last-child': { pb: 3 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              color: 'var(--text-h)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: isConflicted ? '50%' : '85%',
              textAlign: 'left',
            }}
          >
            {note.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isConflicted && (
              <Tooltip title="Conflict: This edit has the exact same timestamp as another update online. Click Resolve to save again.">
                <Chip
                  label="Not Saved"
                  color="error"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    height: 18,
                    borderRadius: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                />
              </Tooltip>
            )}

            {onTogglePin && !isConflicted && (
              <Tooltip title={note.isPinned ? 'Unpin note' : 'Pin note'}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(note);
                  }}
                  sx={{
                    color: note.isPinned ? 'var(--accent)' : 'var(--text)',
                    padding: 0.25,
                    '&:hover': {
                      color: 'var(--accent)',
                      backgroundColor: 'var(--accent-bg)',
                    },
                  }}
                >
                  {note.isPinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'var(--text)',
            flex: 1,
            mb: 2.5,
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.6,
          }}
        >
          {note.content}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Chip
            size="small"
            icon={note.visibility === 'private' ? <LockIcon style={{ fontSize: '0.85rem' }} /> : <PublicIcon style={{ fontSize: '0.85rem' }} />}
            label={note.visibility === 'private' ? 'Private' : 'Public'}
            sx={{
              backgroundColor: note.visibility === 'private' ? 'rgba(0, 0, 0, 0.05)' : 'var(--accent-bg)',
              color: note.visibility === 'private' ? 'var(--text)' : 'var(--accent)',
              fontWeight: 500,
              fontSize: '0.75rem',
              border: note.visibility === 'public' ? '1px solid var(--accent-border)' : '1px solid var(--border)',
              '& .MuiChip-icon': {
                color: note.visibility === 'private' ? 'var(--text)' : 'var(--accent)',
              },
            }}
          />
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            {isConflicted && onEdit && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note);
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  py: 0.25,
                  px: 1,
                  minWidth: 0,
                  borderRadius: 1.5,
                }}
              >
                Resolve & Save
              </Button>
            )}
            {onEdit && (
              <Tooltip title="Edit note">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(note);
                  }}
                  sx={{
                    color: 'var(--text)',
                    '&:hover': {
                      color: 'var(--accent)',
                      backgroundColor: 'var(--accent-bg)',
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Delete note">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note._id);
                  }}
                  sx={{
                    color: 'var(--text)',
                    '&:hover': {
                      color: 'error.main',
                      backgroundColor: 'rgba(211, 47, 47, 0.08)',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
