import type { Habit } from '../types';
import { isSameDayIso } from '../utils/dateUtils';
import { calculateStreaksForHabit } from '../utils/streakUtils';
import { HabitActionType } from '../constants/enums';

export interface HabitState {
  habits: Habit[];
}

export type HabitAction =
  | { type: typeof HabitActionType.ADD_HABIT; payload: Habit }
  | { type: typeof HabitActionType.UPDATE_HABIT; payload: Habit }
  | { type: typeof HabitActionType.DELETE_HABIT; payload: { id: string } }
  | { type: typeof HabitActionType.TOGGLE_COMPLETE; payload: { id: string; date: string } }
  | { type: typeof HabitActionType.HYDRATE; payload: HabitState };

export function habitReducer(state: HabitState, action: HabitAction): HabitState {
  switch (action.type) {
    case HabitActionType.HYDRATE:
      return action.payload;
    case HabitActionType.ADD_HABIT:
      return { ...state, habits: [...state.habits, action.payload] };
    case HabitActionType.UPDATE_HABIT:
      return {
        ...state,
        habits: state.habits.map((h) =>
          h.id === action.payload.id ? { ...action.payload } : h,
        ),
      };
    case HabitActionType.DELETE_HABIT:
      return {
        ...state,
        habits: state.habits.filter((h) => h.id !== action.payload.id),
      };
    case HabitActionType.TOGGLE_COMPLETE: {
      const { id, date } = action.payload;
      const updatedHabits = state.habits.map((habit) => {
        if (habit.id !== id) return habit;

        const alreadyCompleted = habit.completedDates.some((d) =>
          isSameDayIso(d, date),
        );

        const completedDates = alreadyCompleted
          ? habit.completedDates.filter((d) => !isSameDayIso(d, date))
          : [...habit.completedDates, date];

        const withUpdatedDates: Habit = {
          ...habit,
          completedDates,
        };

        const withStreaks = calculateStreaksForHabit(withUpdatedDates);
        return withStreaks;
      });

      return { ...state, habits: updatedHabits };
    }
    default:
      return state;
  }
}

