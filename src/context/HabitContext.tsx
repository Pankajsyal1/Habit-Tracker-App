import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { Habit } from '../types';
import { habitReducer } from './habitReducer';
import { HabitActionType } from '../constants/enums';
import { STORAGE_KEYS } from '../constants/design';

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
}

const HabitContext = createContext<HabitContextValue | undefined>(undefined);

const STORAGE_KEY = STORAGE_KEYS.HABITS_V1;

const initialState: HabitState = {
  habits: [],
};

function storageSafeParse(value: string | null): HabitState | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as HabitState;
    if (!Array.isArray(parsed.habits)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatchBase] = useReducer(habitReducer, initialState);

  // Wrap dispatch to handle persistence
  const dispatch: HabitContextValue['dispatch'] = (action) => {
    if (action.type === HabitActionType.HYDRATE) {
      dispatchBase(action);
      return;
    }
    dispatchBase(action);
  };

  // Hydrate from localStorage once
  useEffect(() => {
    const stored = storageSafeParse(localStorage.getItem(STORAGE_KEY));
    if (stored) {
      dispatchBase({ type: HabitActionType.HYDRATE, payload: stored } as HabitAction);
    }
  }, []);

  // Persist whenever state changes
  useEffect(() => {
    if (!state) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(
    () => ({
      habits: state.habits,
      dispatch,
    }),
    [state.habits],
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

