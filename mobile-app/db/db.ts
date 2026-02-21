import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Habit } from '../types';
import { calculateStreaksForHabit } from '../utils/streakUtils';

const HABITS_KEY = 'habits';

class DatabaseService {
  async init(): Promise<void> {
    // AsyncStorage requires no explicit native init
    console.log('AsyncStorage Initialized');
  }

  async getHabits(): Promise<Habit[]> {
    try {
      const data = await AsyncStorage.getItem(HABITS_KEY);
      if (!data) return [];
      return JSON.parse(data) as Habit[];
    } catch (e) {
      console.error('Failed to parse habits from storage:', e);
      return [];
    }
  }

  private async saveHabits(habits: Habit[]) {
    try {
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits:', e);
    }
  }

  async addHabit(habit: Habit) {
    const habits = await this.getHabits();
    habits.push(habit);
    await this.saveHabits(habits);
  }

  async updateHabit(habit: Habit) {
    const habits = await this.getHabits();
    const updated = habits.map(h => h.id === habit.id ? habit : h);
    await this.saveHabits(updated);
  }

  async deleteHabit(id: string) {
    const habits = await this.getHabits();
    const filtered = habits.filter(h => h.id !== id);
    await this.saveHabits(filtered);
  }

  async toggleComplete(habitId: string, date: string) {
    const habits = await this.getHabits();
    const updated = habits.map(habit => {
      if (habit.id !== habitId) return habit;

      const alreadyCompleted = habit.completedDates.includes(date);
      const completedDates = alreadyCompleted
        ? habit.completedDates.filter(d => d !== date)
        : [...habit.completedDates, date];

      const withUpdatedDates = { ...habit, completedDates };
      return calculateStreaksForHabit(withUpdatedDates);
    });
    await this.saveHabits(updated);
  }

  async clearDatabase() {
    try {
      await AsyncStorage.removeItem(HABITS_KEY);
    } catch (e) {
      console.error('Failed to clear database:', e);
    }
  }
}

export const dbService = new DatabaseService();
