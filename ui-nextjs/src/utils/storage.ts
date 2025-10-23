import { AppState } from "../context/types";

const STORAGE_KEYS = {
  ITEMS: "mess-items",
  MEALS: "mess-meals",
  USAGE: "mess-usage",
  DARK_MODE: "mess-dark-mode",
};

export const loadData = (): Partial<AppState> => {
  if (typeof window === "undefined") return {};

  try {
    return {
      items: JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]"),
      meals: JSON.parse(localStorage.getItem(STORAGE_KEYS.MEALS) || "[]"),
      usage: JSON.parse(localStorage.getItem(STORAGE_KEYS.USAGE) || "[]"),
      darkMode: JSON.parse(
        localStorage.getItem(STORAGE_KEYS.DARK_MODE) || "false"
      ),
    };
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    return {};
  }
};

export const saveData = (state: AppState) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(state.items));
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(state.meals));
    localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(state.usage));
    localStorage.setItem(
      STORAGE_KEYS.DARK_MODE,
      JSON.stringify(state.darkMode)
    );
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
};
