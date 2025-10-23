import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AppState, AppAction, Item, MealRecipe, MealUsage } from "./types";
import { appReducer } from "./appReducer";
import { loadData, saveData } from "../utils/storage";

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addItem: (item: Omit<Item, "id" | "createdAt" | "status">) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  addMeal: (meal: Omit<MealRecipe, "id">) => void;
  updateMeal: (meal: MealRecipe) => void;
  deleteMeal: (id: string) => void;
  addMealUsage: (usage: Omit<MealUsage, "id" | "itemsUsed">) => void;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  items: [],
  meals: [],
  usage: [],
  darkMode: false,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load data from localStorage on mount
    const data = loadData();
    if (data.items) dispatch({ type: "SET_ITEMS", payload: data.items });
    if (data.meals) dispatch({ type: "SET_MEALS", payload: data.meals });
    if (data.usage) dispatch({ type: "SET_USAGE", payload: data.usage });
    if (data.darkMode !== undefined && data.darkMode !== state.darkMode) {
      dispatch({ type: "TOGGLE_DARK_MODE" });
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever state changes
    saveData(state);
  }, [state]);

  const addItem = (itemData: Omit<Item, "id" | "createdAt" | "status">) => {
    const status = itemData.quantity > 0 ? "in-stock" : "out-of-stock";
    const newItem: Item = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status,
    };
    dispatch({ type: "ADD_ITEM", payload: newItem });
  };

  const updateItem = (item: Item) => {
    const status = item.quantity > 0 ? "in-stock" : "out-of-stock";
    dispatch({ type: "UPDATE_ITEM", payload: { ...item, status } });
  };

  const deleteItem = (id: string) => {
    dispatch({ type: "DELETE_ITEM", payload: id });
  };

  const addMeal = (mealData: Omit<MealRecipe, "id">) => {
    const newMeal: MealRecipe = {
      ...mealData,
      id: Date.now().toString(),
    };
    dispatch({ type: "ADD_MEAL", payload: newMeal });
  };

  const updateMeal = (meal: MealRecipe) => {
    dispatch({ type: "UPDATE_MEAL", payload: meal });
  };

  const deleteMeal = (id: string) => {
    dispatch({ type: "DELETE_MEAL", payload: id });
  };

  const addMealUsage = (usageData: Omit<MealUsage, "id" | "itemsUsed">) => {
    const meal = state.meals.find((m) => m.id === usageData.mealId);
    if (!meal) return;

    const itemsUsed = meal.items.map((item) => {
      const totalUsed = item.usagePerPerson * usageData.peopleCount;
      return { itemId: item.itemId, totalUsed };
    });

    // Check if we have enough stock
    for (const item of itemsUsed) {
      const inventoryItem = state.items.find((i) => i.id === item.itemId);
      if (!inventoryItem || inventoryItem.quantity < item.totalUsed) {
        throw new Error(`Insufficient stock for ${inventoryItem?.name}`);
      }
    }

    // Update item quantities
    const updatedItems = state.items.map((item) => {
      const usedItem = itemsUsed.find((i) => i.itemId === item.id);
      if (usedItem) {
        return {
          ...item,
          quantity: item.quantity - usedItem.totalUsed,
        };
      }
      return item;
    });

    dispatch({ type: "SET_ITEMS", payload: updatedItems });

    const newUsage: MealUsage = {
      ...usageData,
      id: Date.now().toString(),
      itemsUsed,
    };
    dispatch({ type: "ADD_USAGE", payload: newUsage });
  };

  const toggleDarkMode = () => {
    dispatch({ type: "TOGGLE_DARK_MODE" });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        updateItem,
        deleteItem,
        addMeal,
        updateMeal,
        deleteMeal,
        addMealUsage,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
