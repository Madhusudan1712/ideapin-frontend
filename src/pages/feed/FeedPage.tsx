import React, { useEffect, useState, useMemo } from 'react';
import { Grid, Typography, TextField, Box, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import NoteCard from '../../components/notes/NoteCard';
import { NotesSkeletonList } from '../../components/common/loading/Skeleton';
import { useNotes } from '../../hooks/useNotes';
import type { Note } from '../../features/notes/notesSlice';

// Mocks representing collaborative ideas shared publicly by other platform developers
const communityNotes: Note[] = [
  {
    _id: 'mock-1',
    title: 'Clean Architecture with React',
    content: 'Clean architecture organizes react projects into clear logic boundaries: Core (entities/usecases), Adapters (api wrappers/state modules), and Presenters (components/views). This keeps views completely dumb and mockable.',
    isPinned: false,
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 3, // Trending metric
  },
  {
    _id: 'mock-2',
    title: 'Vite 6 is ridiculously fast!',
    content: 'Just tried HMR in Vite 6 using Rolldown. Cold server startups are under 180ms and hot updates are instant even in deeply nested component trees. Highly recommend migrating from Webpack.',
    isPinned: false,
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 4, // Trending metric
  },
  {
    _id: 'mock-3',
    title: 'Supabase JWT local validation keys',
    content: 'Instead of fetching public signing keys repeatedly, retrieve the local JWKS from supabase auth and verify RS256/ES256 signatures directly in your Express middleware using jsonwebtoken and jwks-rsa.',
    isPinned: false,
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  }
];

export const FeedPage: React.FC = () => {
  const { notes, loading, error, getNotes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  // Filter user's public notes
  const userPublicNotes = useMemo(() => {
    return notes.filter((n) => n.visibility === 'public');
  }, [notes]);

  // Combine user's public notes and community notes
  const allFeedNotes = useMemo(() => {
    return [...userPublicNotes, ...communityNotes];
  }, [userPublicNotes]);

  // Filter feed items based on sidebar filter criteria
  const filteredNotesByTab = useMemo(() => {
    if (filter === 'trending') {
      // Show notes with high version/updates count
      return allFeedNotes.filter((n) => n.version >= 2);
    }
    if (filter === 'favorites') {
      // Mock favorites selection
      return allFeedNotes.slice(0, 2);
    }
    return allFeedNotes;
  }, [allFeedNotes, filter]);

  // Filter notes by search input
  const filteredNotes = useMemo(() => {
    return filteredNotesByTab.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredNotesByTab, searchQuery]);

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 }, boxSizing: 'border-box' }}>
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
            mb: 5,
            textAlign: 'left',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <RssFeedIcon sx={{ fontSize: 32, color: 'var(--accent)' }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, m: 0, fontSize: { xs: '1.8rem', md: '2.4rem' }, color: 'var(--text-h)' }}
            >
              Public Ideas Feed
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'var(--text)', mt: 0.5 }}>
            Explore open insights, tips, and collaborative ideas shared by developers across the community.
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 4, display: 'flex' }}>
          <TextField
            fullWidth
            placeholder="Search feed by title or content..."
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

        {/* Content Section */}
        {loading && notes.length === 0 ? (
          <NotesSkeletonList count={3} />
        ) : error ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography color="error" variant="h6">
              {error}
            </Typography>
            <Button onClick={getNotes} sx={{ mt: 2, color: 'var(--accent)' }}>
              Retry Loading
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
              No matches in feed
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text)', mt: 0.5 }}>
              Try searching for different terms or selecting another tab filter.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredNotes.map((note) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={note._id}>
                {/* Render NoteCard in read-only mode by omitting action callbacks */}
                <NoteCard note={note} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default FeedPage;
