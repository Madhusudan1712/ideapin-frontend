import React from 'react';
import { Dialog, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Reusable modal component utilizing Material UI Dialog.
 */
export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            boxShadow: 'var(--shadow)',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 3, pb: 1 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'var(--text-h)' }}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'var(--text)',
            '&:hover': {
              color: 'var(--text-h)',
              backgroundColor: 'var(--accent-bg)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: 3, pb: 3, pt: 1, border: 'none' }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
