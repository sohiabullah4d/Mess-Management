import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useAppContext } from "../../context/AppContext";

export const Header: React.FC = () => {
  const { state, toggleDarkMode } = useAppContext();

  return (
    <AppBar position="static" className="bg-primary-500 shadow-md">
      <Toolbar className="flex justify-between">
        <Typography
          variant="h6"
          component="div"
          className="font-bold text-white"
        >
          Mess Management System
        </Typography>
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
            <span className="text-white text-sm">
              {state.darkMode ? "Dark" : "Light"}
            </span>
          }
        />
      </Toolbar>
    </AppBar>
  );
};
