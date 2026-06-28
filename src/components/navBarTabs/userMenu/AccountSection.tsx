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
  Tooltip,
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
    } catch {
      // ignore and still force logout
    }
  };

  const firstLetter = user?.email?.charAt(0).toUpperCase() || "?";

  if (isMobile) {
    // Small screen → Accordion inside Drawer
    return (
      <Accordion sx={{ mt: "auto", boxShadow: "none", width: "100%", overflow: "hidden" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minWidth: 0,
            width: "100%",
            "& .MuiAccordionSummary-content": { minWidth: 0 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, minWidth: 0, width: "100%" }}>
            <Avatar src={user?.avatarUrl} sx={{ width: 32, height: 32, bgcolor: "var(--accent)", flexShrink: 0 }}>
              {firstLetter}
            </Avatar>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", minWidth: 0, flexGrow: 1 }}>
              <Tooltip title={user?.name || "Guest"} placement="top-start" enterDelay={500}>
                <Typography
                  noWrap
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    color: "var(--text-h)",
                    lineHeight: 1.2,
                    width: "100%",
                  }}
                >
                  {user?.name || "Guest"}
                </Typography>
              </Tooltip>
              <Tooltip title={user?.email || ""} placement="top-start" enterDelay={500}>
                <Typography
                  noWrap
                  variant="caption"
                  sx={{
                    fontSize: "0.68rem",
                    color: "var(--text)",
                    opacity: 0.7,
                    width: "100%",
                  }}
                >
                  {user?.email || ""}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1 }}>
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
    <Box sx={{ minWidth: 0 }}>
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          px: 1,
          height: 36,
          minWidth: 0,
          border: "none",
          borderRadius: "999px",
          backgroundColor: "transparent",
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: "rgba(170, 59, 255, 0.08)",
          }
        }}
      >
        <Avatar src={user?.avatarUrl} sx={{ width: 28, height: 28, bgcolor: "var(--accent)", flexShrink: 0 }}>
          {firstLetter}
        </Avatar>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0, maxWidth: { xs: 80, sm: 120, md: 150 } }}>
            <Tooltip title={user?.name || "Guest"} placement="bottom-start" enterDelay={500}>
              <Typography
                noWrap
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  color: "var(--text-h)",
                  lineHeight: 1.1,
                  width: "100%",
                }}
              >
                {user?.name || "Guest"}
              </Typography>
            </Tooltip>
            <ExpandMoreIcon sx={{ fontSize: "1rem", color: "var(--text)", opacity: 0.7, flexShrink: 0 }} />
          </Box>
          <Tooltip title={user?.email || ""} placement="bottom-start" enterDelay={500}>
            <Typography
              noWrap
              variant="caption"
              sx={{
                fontSize: "0.62rem",
                color: "var(--text)",
                opacity: 0.7,
                width: "100%",
                maxWidth: { xs: 80, sm: 110, md: 130 },
              }}
            >
              {user?.email || ""}
            </Typography>
          </Tooltip>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 150,
              boxShadow: "var(--shadow)",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "var(--bg)",
            },
          },
        }}
      >
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

