import {
  Analytics,
  History,
  Home,
  Inventory,
  Menu,
  Restaurant
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

const menuItems = [
  { text: "Dashboard", icon: <Home />, path: "/" },
  { text: "Items", icon: <Inventory />, path: "/items" },
  { text: "Meals", icon: <Restaurant />, path: "/meals" },
  { text: "Meal Usage", icon: <History />, path: "/usage" },
  { text: "Statistics", icon: <Analytics />, path: "/stats" },
];

export const Header: React.FC = () => {
  // const { state, toggleDarkMode } = useAppContext();
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
          {/* Menu Button (at far right) */}
          <IconButton
            onClick={toggleSidebar}
            className="text-white hover:bg-white hover:bg-opacity-20 transition-all duration-200 ml-2"
            aria-label="menu"
          >
            <Menu sx={{ color: 'white' }} />
          </IconButton>
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
          {/* <FormControlLabel
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
          /> */}

        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor={'left'}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 315,
            bgcolor: 'background.paper',
            transition: 'transition-colors duration-300',
          }
        }
        }
      >
        {/* Menu Items */}
        < List className="flex-grow p-0">
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
                    ${router.pathname === item.path
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300 border-r-4 border-primary-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                  `}
              >
                <ListItemIcon
                  className={`
                      min-w-10
                      ${router.pathname === item.path
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

      </Drawer >
    </>
  );
};
