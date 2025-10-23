import { AppState, AppAction } from './types';

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id ? action.payload : item
        )
      };
    
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        meals: state.meals.map(meal => ({
          ...meal,
          items: meal.items.filter(item => item.itemId !== action.payload)
        })).filter(meal => meal.items.length > 0)
      };
    
    case 'SET_MEALS':
      return { ...state, meals: action.payload };
    
    case 'ADD_MEAL':
      return { ...state, meals: [...state.meals, action.payload] };
    
    case 'UPDATE_MEAL':
      return {
        ...state,
        meals: state.meals.map(meal => 
          meal.id === action.payload.id ? action.payload : meal
        )
      };
    
    case 'DELETE_MEAL':
      return {
        ...state,
        meals: state.meals.filter(meal => meal.id !== action.payload),
        usage: state.usage.filter(usage => usage.mealId !== action.payload)
      };
    
    case 'SET_USAGE':
      return { ...state, usage: action.payload };
    
    case 'ADD_USAGE':
      return { ...state, usage: [...state.usage, action.payload] };
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    
    default:
      return state;
  }
};