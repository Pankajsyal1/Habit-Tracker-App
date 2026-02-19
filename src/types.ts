import { HabitFrequency } from './constants/enums';

export interface Habit {
  id: string;
  name: string;
  frequency: HabitFrequency;
  createdAt: string; // ISO date string
  completedDates: string[]; // ISO date strings
  currentStreak: number;
  longestStreak: number;
}

export interface HabitSummary {
  totalHabits: number;
  completedToday: number;
  completionRate: number; // 0-1
}


export { HabitFrequency };
