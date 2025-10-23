import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  Home,
  Inventory,
  Restaurant,
  History,
  Analytics,
} from "@mui/icons-material";
import { useRouter } from "next/router";

const menuItems = [
  { text: "Dashboard", icon: <Home />, path: "/" },
  { text: "Items", icon: <Inventory />, path: "/items" },
  { text: "Meals", icon: <Restaurant />, path: "/meals" },
  { text: "Meal Usage", icon: <History />, path: "/usage" },
  { text: "Statistics", icon: <Analytics />, path: "/stats" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={router.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
