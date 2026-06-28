import React, { useRef, useLayoutEffect } from "react";
import { Paper, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Tooltip, Avatar, Typography, Divider, Box, Button } from "@mui/material";
import { Icon } from "@iconify/react";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { useAppAuth } from "../../hooks/useAppAuth";

interface SideBarTabsProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Collapsible contextual sidebar displaying options specific to active page roots.
 * Enhanced with MUI Paper and custom shadow elevation.
 */
export const SideBarTabs: React.FC<SideBarTabsProps> = ({ collapsed, onToggle }) => {
  const { user, signOut } = useAppAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchParams] = useSearchParams();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Contextual items computation
  let sidebarTitle = "";
  let items: { key: string; label: string; path: string; icon: string }[] = [];
  let showCreateBtn = false;

  if (currentPath.startsWith("/home")) {
    sidebarTitle = "Home Guide";
    items = [
      { key: "overview", label: "Overview", path: "/home?tab=overview", icon: "lucide:info" },
      { key: "features", label: "Core Features", path: "/home?tab=features", icon: "lucide:star" },
    ];
  } else if (currentPath.startsWith("/feed")) {
    sidebarTitle = "Feed Filter";
    items = [
      { key: "all", label: "Explore Feed", path: "/feed?filter=all", icon: "lucide:compass" },
      { key: "trending", label: "Trending Feed", path: "/feed?filter=trending", icon: "lucide:trending-up" },
      { key: "favorites", label: "My Favorites", path: "/feed?filter=favorites", icon: "lucide:heart" },
    ];
  } else if (currentPath.startsWith("/mynotes")) {
    sidebarTitle = "Workspace";
    showCreateBtn = true;
    items = [
      { key: "all", label: "All Notes", path: "/mynotes?filter=all", icon: "lucide:files" },
      { key: "pinned", label: "Pinned Only", path: "/mynotes?filter=pin", icon: "lucide:pin" },
      { key: "public", label: "Public Notes", path: "/mynotes?filter=public", icon: "lucide:globe" },
      { key: "private", label: "Private Notes", path: "/mynotes?filter=private", icon: "lucide:lock" },
    ];
  }

  const getIsActive = (itemKey: string) => {
    if (currentPath.startsWith("/home")) {
      return (searchParams.get("tab") || "overview") === itemKey;
    }
    if (currentPath.startsWith("/feed")) {
      return (searchParams.get("filter") || "all") === itemKey;
    }
    if (currentPath.startsWith("/mynotes")) {
      return (searchParams.get("filter") || "all") === itemKey;
    }
    return false;
  };

  // GSAP animation for collapsing/expanding width
  useLayoutEffect(() => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        width: collapsed ? 72 : 260,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, [collapsed]);

  const firstLetter = user?.email?.charAt(0).toUpperCase() || "?";

  return (
    <Paper
      ref={sidebarRef}
      elevation={0}
      square
      sx={{
        width: collapsed ? 72 : 260,
        height: "calc(100vh - 64px)",
        position: "sticky",
        top: 64,
        left: 0,
        backgroundColor: "var(--bg)",
        boxShadow: "4px 0 24px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflowX: "hidden",
        zIndex: 99,
        flexShrink: 0,
        border: "none",
      }}
    >
      <Box sx={{ p: 2 }}>
        {!collapsed && sidebarTitle && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "var(--text)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              mb: 2,
              px: 1,
              display: "block",
              textAlign: "left",
              opacity: 0.8,
            }}
          >
            {sidebarTitle}
          </Typography>
        )}

        {/* Quick Action Button for Note Creation */}
        {showCreateBtn && (
          <Box sx={{ mb: 2, px: 0.5 }}>
            {collapsed ? (
              <Tooltip title="Create New Note" placement="right">
                <IconButton
                  component={Link}
                  to="/mynotes?action=create"
                  sx={{
                    width: 44,
                    height: 44,
                    backgroundColor: "var(--accent)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "var(--accent)",
                      opacity: 0.9,
                    },
                  }}
                >
                  <Icon icon="lucide:plus" width="20" height="20" />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                component={Link}
                to="/mynotes?action=create"
                variant="contained"
                startIcon={<Icon icon="lucide:plus" width="18" height="18" />}
                fullWidth
                sx={{
                  backgroundColor: "var(--accent)",
                  boxShadow: "none",
                  fontWeight: 600,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "var(--accent)",
                    opacity: 0.9,
                    boxShadow: "none",
                  },
                }}
              >
                Create Note
              </Button>
            )}
          </Box>
        )}

        <List sx={{ display: "flex", flexDirection: "column", gap: 1, p: 0 }}>
          {items.map((item) => {
            const isActive = getIsActive(item.key);

            return (
              <Tooltip key={item.key} title={collapsed ? item.label : ""} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    px: 2.5,
                    backgroundColor: isActive ? "var(--accent-bg)" : "transparent",
                    color: isActive ? "var(--accent)" : "var(--text)",
                    "&.Mui-selected": {
                      backgroundColor: "var(--accent-bg)",
                      color: "var(--accent)",
                      "&:hover": { backgroundColor: "var(--accent-bg)" },
                    },
                    "&:hover": {
                      backgroundColor: "var(--accent-bg)",
                      color: "var(--accent)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? "auto" : 2,
                      justifyContent: "center",
                      color: isActive ? "var(--accent)" : "var(--text)",
                    }}
                  >
                    <Icon icon={item.icon} width="20" height="20" />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: { sx: { fontWeight: 600, fontSize: "0.9rem" } },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* User Section and Sidebar Toggle */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.05)" }} />
        {user && (
          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Tooltip title={collapsed ? `${user.name || "Guest"}\n${user.email}` : ""} placement="right">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 0.5 }}>
                <Avatar src={user.avatarUrl} sx={{ bgcolor: "var(--accent)", fontWeight: 600, width: 36, height: 36 }}>
                  {firstLetter}
                </Avatar>
                {!collapsed && (
                  <Box sx={{ overflow: "hidden", textAlign: "left" }}>
                    <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.85rem" }}>
                      {user.name || "Guest"}
                    </Typography>
                    <Typography variant="caption" noWrap sx={{ color: "var(--text)", fontSize: "0.72rem", opacity: 0.8 }}>
                      {user.email}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Tooltip>

            {!collapsed && (
              <IconButton
                onClick={signOut}
                sx={{
                  color: "var(--text)",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: 2,
                  py: 1,
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                  width: "100%",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "var(--accent)",
                    color: "var(--accent)",
                    backgroundColor: "var(--accent-bg)",
                  },
                }}
              >
                <Icon icon="lucide:log-out" width="16" height="16" />
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                  Sign Out
                </Typography>
              </IconButton>
            )}
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: collapsed ? "center" : "flex-end",
            p: 1.5,
            borderTop: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <IconButton onClick={onToggle} sx={{ color: "var(--text)" }}>
            {collapsed ? <Icon icon="lucide:chevron-right" /> : <Icon icon="lucide:chevron-left" />}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default SideBarTabs;
