export const HabitFrequency = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
} as const;

export type HabitFrequency = typeof HabitFrequency[keyof typeof HabitFrequency];

export const HabitActionType = {
  ADD_HABIT: 'ADD_HABIT',
  UPDATE_HABIT: 'UPDATE_HABIT',
  DELETE_HABIT: 'DELETE_HABIT',
  TOGGLE_COMPLETE: 'TOGGLE_COMPLETE',
  HYDRATE: 'HYDRATE',
} as const;

export type HabitActionType = typeof HabitActionType[keyof typeof HabitActionType];

export const RoutePaths = {
  DASHBOARD: '/',
  HABITS: '/habits',
  CALENDAR: '/calendar',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;

export type RoutePaths = typeof RoutePaths[keyof typeof RoutePaths];
