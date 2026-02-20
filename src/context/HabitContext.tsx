import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import type { Habit } from '../types';
import { habitReducer } from './habitReducer';
import { HabitActionType } from '../constants/enums';
import { dbService } from '../db/db';

interface HabitState {
  habits: Habit[];
}

type HabitAction =
  | { type: typeof HabitActionType.ADD_HABIT; payload: Habit }
  | { type: typeof HabitActionType.UPDATE_HABIT; payload: Habit }
  | { type: typeof HabitActionType.DELETE_HABIT; payload: { id: string } }
  | { type: typeof HabitActionType.TOGGLE_COMPLETE; payload: { id: string; date: string } }
  | { type: typeof HabitActionType.HYDRATE; payload: HabitState };

interface HabitContextValue extends HabitState {
  dispatch: (action: HabitAction) => void;
  isLoading: boolean;
}

const HabitContext = createContext<HabitContextValue | undefined>(undefined);

const initialState: HabitState = {
  habits: [],
};

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatchBase] = useReducer(habitReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize DB and hydrate state
  useEffect(() => {
    const init = async () => {
      try {
        await dbService.init();
        const habits = dbService.getHabits();
        dispatchBase({ 
          type: HabitActionType.HYDRATE, 
          payload: { habits } 
        } as HabitAction);
      } catch (error) {
        console.error('Persistence initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Wrap dispatch to handle persistence
  const dispatch: HabitContextValue['dispatch'] = (action) => {
    // 1. Update local state for immediate UI feedback
    dispatchBase(action);

    // 2. Persist to SQLite
    switch (action.type) {
      case HabitActionType.ADD_HABIT:
        dbService.addHabit(action.payload);
        break;
      case HabitActionType.UPDATE_HABIT:
        dbService.updateHabit(action.payload);
        break;
      case HabitActionType.DELETE_HABIT:
        dbService.deleteHabit(action.payload.id);
        break;
      case HabitActionType.TOGGLE_COMPLETE:
        dbService.toggleComplete(action.payload.id, action.payload.date);
        break;
    }
  };

  const value = useMemo(
    () => ({
      habits: state.habits,
      dispatch,
      isLoading,
    }),
    [state.habits, isLoading],
  );

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
};

export const useHabitContext = () => {
  const ctx = useContext(HabitContext);
  if (!ctx) {
    throw new Error('useHabitContext must be used within a HabitProvider');
  }
  return ctx;
};

