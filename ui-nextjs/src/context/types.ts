export interface Item {
  id: string;
  createdAt: string;
  name: string;
  quantity: number;
  unit: string;
  status: "in-stock" | "out-of-stock";
  notes?: string;
}

export interface MealRecipe {
  id: string;
  name: string;
  items: {
    itemId: string;
    usagePerPerson: number;
  }[];
}

export interface MealUsage {
  id: string;
  date: string;
  mealId: string;
  peopleCount: number;
  itemsUsed: {
    itemId: string;
    totalUsed: number;
  }[];
}

export interface AppState {
  items: Item[];
  meals: MealRecipe[];
  usage: MealUsage[];
  darkMode: boolean;
}

export type AppAction =
  | { type: "SET_ITEMS"; payload: Item[] }
  | { type: "ADD_ITEM"; payload: Item }
  | { type: "UPDATE_ITEM"; payload: Item }
  | { type: "DELETE_ITEM"; payload: string }
  | { type: "SET_MEALS"; payload: MealRecipe[] }
  | { type: "ADD_MEAL"; payload: MealRecipe }
  | { type: "UPDATE_MEAL"; payload: MealRecipe }
  | { type: "DELETE_MEAL"; payload: string }
  | { type: "SET_USAGE"; payload: MealUsage[] }
  | { type: "ADD_USAGE"; payload: MealUsage }
  | { type: "TOGGLE_DARK_MODE" };
