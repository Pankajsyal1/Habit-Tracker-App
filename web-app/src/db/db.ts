import { STORAGE_KEYS } from '../constants/design';
import type { Habit } from '../types';
import { calculateStreaksForHabit } from '../utils/streakUtils';

const DB_STORAGE_KEY = 'habit_tracker_data_v2'; // New key for the JSON structure

class DatabaseService {
  private habits: Habit[] = [];
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    this.initPromise = this._doInit();
    return this.initPromise;
  }

  private async _doInit() {
    if (this.isInitialized) return;

    try {
      console.log('Initializing LocalStorage Persistence...');
      
      const savedData = localStorage.getItem(DB_STORAGE_KEY);
      
      if (savedData) {
        this.habits = JSON.parse(savedData);
        console.log('Loaded habits from LocalStorage');
      } else {
        console.log('No existing data found, checking for migration...');
        await this.migrateFromLocalStorage();
        this.saveToStorage();
      }

      this.isInitialized = true;
      console.log('Persistence Initialized Successfully');
    } catch (error) {
      console.error('Failed to initialize persistence:', error);
      this.initPromise = null;
      throw error;
    }
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  private async migrateFromLocalStorage() {
    // Migration from old STORAGE_KEYS.HABITS_V1 if it exists
    const oldData = localStorage.getItem(STORAGE_KEYS.HABITS_V1);
    if (!oldData) return;

    try {
      const parsed = JSON.parse(oldData);
      this.habits = parsed.habits || [];
      console.log(`Migrated ${this.habits.length} habits from legacy storage`);
    } catch (e) {
      console.error('Migration failed:', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.habits));
      console.log('Data saved to LocalStorage');
    } catch (error) {
      console.error('Failed to save to LocalStorage:', error);
    }
  }

  // --- Habit Operations ---

  async getHabits(): Promise<Habit[]> {
    await this.ensureInitialized();
    return [...this.habits];
  }

  async addHabit(habit: Habit) {
    await this.ensureInitialized();
    this.habits.push(habit);
    this.saveToStorage();
  }

  async updateHabit(habit: Habit) {
    await this.ensureInitialized();
    this.habits = this.habits.map(h => h.id === habit.id ? habit : h);
    this.saveToStorage();
  }

  async deleteHabit(id: string) {
    await this.ensureInitialized();
    this.habits = this.habits.filter(h => h.id !== id);
    this.saveToStorage();
  }

  async toggleComplete(habitId: string, date: string) {
    await this.ensureInitialized();
    
    this.habits = this.habits.map(habit => {
      if (habit.id !== habitId) return habit;

      const alreadyCompleted = habit.completedDates.includes(date);
      const completedDates = alreadyCompleted
        ? habit.completedDates.filter(d => d !== date)
        : [...habit.completedDates, date];

      const withUpdatedDates = { ...habit, completedDates };
      return calculateStreaksForHabit(withUpdatedDates);
    });

    this.saveToStorage();
  }

  async getHabitById(id: string): Promise<Habit | null> {
    await this.ensureInitialized();
    return this.habits.find(h => h.id === id) || null;
  }

  async clearDatabase() {
    localStorage.removeItem(DB_STORAGE_KEY);
    this.habits = [];
    window.location.reload();
  }
}

export const dbService = new DatabaseService();
