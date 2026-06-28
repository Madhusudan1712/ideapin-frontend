import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import NavBarTabs from "../components/navBarTabs/NavBarTabs";
import SideBarTabs from "../components/sideBarTabs/SideBarTabs";
import AppFooter from "../components/common/footer/AppFooter";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Premium dashboard layout housing NavBarTabs, SideBarTabs, active workspaces, and AppFooter.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed((c) => !c);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", boxSizing: "border-box" }}>
      {/* Top Bar Navigation */}
      <NavBarTabs />

      {/* Main layout row containing left sidebar and right content body */}
      <Box sx={{ display: "flex", flex: 1, width: "100%", position: "relative" }}>
        {/* Sidebar visible on desktop, collapsed state managed via GSAP */}
        {!isMobile && (
          <SideBarTabs collapsed={collapsed} onToggle={handleToggle} />
        )}

        {/* Content Workspace and Footer */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "rgba(244, 243, 236, 0.2)",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ flex: 1 }}>
            {children}
          </Box>
          <AppFooter />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
