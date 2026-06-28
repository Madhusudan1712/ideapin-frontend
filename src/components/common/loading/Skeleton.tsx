import React from 'react';
import { Box, Card, CardContent, Skeleton as MuiSkeleton, Grid } from '@mui/material';

/**
 * Skeleton loader representing a single Note Card placeholder.
 */
export const NoteSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        border: '1px solid var(--border)',
        borderRadius: 2,
        backgroundColor: 'var(--bg)',
        boxShadow: 'none',
        height: '180px',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%', boxSizing: 'border-box' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <MuiSkeleton variant="text" width="60%" height={28} />
          <MuiSkeleton variant="circular" width={24} height={24} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <MuiSkeleton variant="text" width="100%" height={20} />
          <MuiSkeleton variant="text" width="85%" height={20} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <MuiSkeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 1.5 }} />
          <MuiSkeleton variant="text" width="30%" height={16} />
        </Box>
      </CardContent>
    </Card>
  );
};

interface SkeletonListProps {
  count?: number;
}

/**
 * Grid list of skeleton loader cards.
 */
export const NotesSkeletonList: React.FC<SkeletonListProps> = ({ count = 6 }) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <NoteSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};
