import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { useAppAuth } from "../../../hooks/useAppAuth";

/**
 * Modern user account profile dropdown/accordion inside topbar and drawer.
 */
const AccountSection = () => {
  const { signOut, user } = useAppAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      // ignore and still force logout
    }
  };

  const firstLetter = user?.email?.charAt(0).toUpperCase() || "?";

  if (isMobile) {
    // Small screen → Accordion inside Drawer
    return (
      <Accordion sx={{ mt: "auto", boxShadow: "none" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Avatar src={user?.avatarUrl} sx={{ width: 32, height: 32, bgcolor: "var(--accent)" }}>
              {firstLetter}
            </Avatar>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--text-h)", lineHeight: 1.2 }}>
                {user?.name || "Guest"}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: "0.68rem", color: "var(--text)", opacity: 0.7 }}>
                {user?.email || ""}
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
            <Divider sx={{ my: 1 }} />
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>
    );
  }

  // Large screen → Dropdown menu button
  return (
    <Box>
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ display: "flex", alignItems: "center", gap: 1.2, cursor: "pointer", pl: 1 }}
      >
        <Avatar src={user?.avatarUrl} sx={{ width: 32, height: 32, bgcolor: "var(--accent)" }}>
          {firstLetter}
        </Avatar>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--text-h)", lineHeight: 1.2 }}>
            {user?.name || "Guest"}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: "0.68rem", color: "var(--text)", opacity: 0.7 }}>
            {user?.email || ""}
          </Typography>
        </Box>
      </Box>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem>
          <PersonIcon fontSize="small" style={{ marginRight: 8 }} />
          Profile
        </MenuItem>
        <MenuItem>
          <Settings fontSize="small" style={{ marginRight: 8 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout fontSize="small" style={{ marginRight: 8 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AccountSection;
