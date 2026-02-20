import initSqlJs, { type Database } from 'sql.js';
import localforage from 'localforage';
import { STORAGE_KEYS } from '../constants/design';
import type { Habit } from '../types';

const DB_STORAGE_KEY = 'habit_tracker_db';

class DatabaseService {
  private db: Database | null = null;
  private isInitialized = false;

  async init() {
    if (this.isInitialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: (file: string) => `/${file}`,
      });

      const savedDb: ArrayBuffer | null = await localforage.getItem(DB_STORAGE_KEY);
      
      if (savedDb) {
        this.db = new SQL.Database(new Uint8Array(savedDb));
      } else {
        this.db = new SQL.Database();
        this.createSchema();
        await this.migrateFromLocalStorage();
        await this.saveToStorage();
      }

      this.isInitialized = true;
      console.log('SQLite Database Initialized');
    } catch (error) {
      console.error('Failed to initialize SQLite:', error);
      throw error;
    }
  }

  private createSchema() {
    if (!this.db) return;
    
    this.db.run(`
      CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        frequency TEXT NOT NULL,
        created_at TEXT NOT NULL,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS completed_dates (
        habit_id TEXT,
        date TEXT,
        PRIMARY KEY (habit_id, date),
        FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
      );
    `);
  }

  private async migrateFromLocalStorage() {
    if (!this.db) return;

    const oldData = localStorage.getItem(STORAGE_KEYS.HABITS_V1);
    if (!oldData) return;

    try {
      const parsed = JSON.parse(oldData);
      const habits: Habit[] = parsed.habits || [];

      for (const habit of habits) {
        this.db.run(
          'INSERT OR IGNORE INTO habits (id, name, frequency, created_at, current_streak, longest_streak) VALUES (?, ?, ?, ?, ?, ?)',
          [habit.id, habit.name, habit.frequency, habit.createdAt, habit.currentStreak, habit.longestStreak]
        );

        for (const date of habit.completedDates) {
          this.db.run(
            'INSERT OR IGNORE INTO completed_dates (habit_id, date) VALUES (?, ?)',
            [habit.id, date]
          );
        }
      }
      console.log(`Migrated ${habits.length} habits from localStorage`);
    } catch (e) {
      console.error('Migration failed:', e);
    }
  }

  async saveToStorage() {
    if (!this.db) return;
    const data = this.db.export();
    await localforage.setItem(DB_STORAGE_KEY, data);
  }

  // --- Habit Operations ---

  getHabits(): Habit[] {
    if (!this.db) return [];

    const result = this.db.exec('SELECT * FROM habits');
    if (result.length === 0) return [];

    const habitsData = result[0].values;
    const habits: Habit[] = habitsData.map((row: any) => {
      const [id, name, frequency, createdAt, currentStreak, longestStreak] = row;
      
      // Fetch completed dates for this habit
      const datesResult = this.db!.exec('SELECT date FROM completed_dates WHERE habit_id = ?', [id]);
      const completedDates = datesResult.length > 0 
        ? datesResult[0].values.map((d: any) => d[0]) 
        : [];

      return {
        id,
        name,
        frequency,
        createdAt,
        currentStreak,
        longestStreak,
        completedDates,
      };
    });

    return habits;
  }

  addHabit(habit: Habit) {
    if (!this.db) return;
    this.db.run(
      'INSERT INTO habits (id, name, frequency, created_at, current_streak, longest_streak) VALUES (?, ?, ?, ?, ?, ?)',
      [habit.id, habit.name, habit.frequency, habit.createdAt, habit.currentStreak, habit.longestStreak]
    );
    this.saveToStorage();
  }

  updateHabit(habit: Habit) {
    if (!this.db) return;
    this.db.run(
      'UPDATE habits SET name = ?, frequency = ?, current_streak = ?, longest_streak = ? WHERE id = ?',
      [habit.name, habit.frequency, habit.currentStreak, habit.longestStreak, habit.id]
    );
    this.saveToStorage();
  }

  deleteHabit(id: string) {
    if (!this.db) return;
    this.db.run('DELETE FROM habits WHERE id = ?', [id]);
    this.db.run('DELETE FROM completed_dates WHERE habit_id = ?', [id]);
    this.saveToStorage();
  }

  toggleComplete(habitId: string, date: string) {
    if (!this.db) return;
    
    const exists = this.db.exec('SELECT 1 FROM completed_dates WHERE habit_id = ? AND date = ?', [habitId, date]);
    
    if (exists.length > 0) {
      this.db.run('DELETE FROM completed_dates WHERE habit_id = ? AND date = ?', [habitId, date]);
    } else {
      this.db.run('INSERT INTO completed_dates (habit_id, date) VALUES (?, ?)', [habitId, date]);
    }
    this.saveToStorage();
  }

  async clearDatabase() {
    await localforage.removeItem(DB_STORAGE_KEY);
    window.location.reload();
  }
}

export const dbService = new DatabaseService();
