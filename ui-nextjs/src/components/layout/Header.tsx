import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Switch,
  FormControlLabel,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Menu,
  Home,
  Inventory,
  Restaurant,
  History,
  Analytics,
} from "@mui/icons-material";
import { useAppContext } from "../../context/AppContext";
import { useRouter } from "next/router";

const menuItems = [
  { text: "Dashboard", icon: <Home />, path: "/" },
  { text: "Items", icon: <Inventory />, path: "/items" },
  { text: "Meals", icon: <Restaurant />, path: "/meals" },
  { text: "Meal Usage", icon: <History />, path: "/usage" },
  { text: "Statistics", icon: <Analytics />, path: "/stats" },
];

export const Header: React.FC = () => {
  const { state, toggleDarkMode } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavigation = (path: string) => {
    router.push(path);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <AppBar position="static" className="bg-primary-500 shadow-md">
        <Toolbar className="flex justify-between items-center">
          {/* Left side - Title */}
          <Typography
            variant="h6"
            component="div"
            className="font-bold text-white"
          >
            Mess Management System
          </Typography>

          {/* Center spacer to push items to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Theme Toggle (right but before menu) */}
          <FormControlLabel
            control={
              <Switch
                checked={state.darkMode}
                onChange={toggleDarkMode}
                icon={<Brightness7 className="text-white" />}
                checkedIcon={<Brightness4 className="text-gray-300" />}
                className="text-white"
              />
            }
            label={
              <span className="text-white text-sm hidden sm:inline">
                {state.darkMode ? "Dark" : "Light"}
              </span>
            }
          />

          {/* Menu Button (at far right) */}
          <IconButton
            onClick={toggleSidebar}
            className="text-white hover:bg-white hover:bg-opacity-20 transition-all duration-200 ml-2"
            aria-label="menu"
          >
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor={isMobile ? "left" : "right"}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="shadow-xl"
        PaperProps={{
          className:
            "w-72 bg-white dark:bg-gray-800 transition-colors duration-300",
        }}
      >
        {/* Creative Drawer Header */}
        <Box className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-800 dark:to-primary-600">
          <Typography
            variant="h6"
            className="font-extrabold text-white text-center tracking-wide uppercase"
          >
            ⚙️ Mess Portal
          </Typography>
        </Box>

        {/* Menu Items */}
        <List className="flex-grow p-0">
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <ListItemButton
                selected={router.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                    transition-all duration-200
                    ${
                      router.pathname === item.path
                        ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300 border-r-4 border-primary-500"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
              >
                <ListItemIcon
                  className={`
                      min-w-10
                      ${
                        router.pathname === item.path
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-500 dark:text-gray-400"
                      }
                    `}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  className="font-medium"
                  primaryTypographyProps={{
                    className:
                      router.pathname === item.path
                        ? "font-semibold"
                        : "font-normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Box className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"></Box>
      </Drawer>
    </>
  );
};
