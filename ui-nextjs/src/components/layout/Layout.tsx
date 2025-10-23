import React, { useState } from "react";
import { Box } from "@mui/material";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const theme = useTheme();

  return (
    <Box className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Box className="flex flex-grow">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Box
          component="main"
          className="flex-grow p-6 transition-all duration-300"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
