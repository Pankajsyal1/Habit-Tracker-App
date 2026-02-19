import { useMemo } from 'react';
import { useHabitContext } from '../context/HabitContext';
import type { Habit, HabitFrequency } from '../types';
import { isSameDayIso, todayIso } from '../utils/dateUtils';

export const useHabits = () => {
  const { habits, dispatch } = useHabitContext();

  const today = todayIso();

  const habitsForToday = useMemo(
    () => habits.filter((h) => h.frequency === 'daily'),
    [habits],
  );

  const completedToday = useMemo(
    () =>
      habitsForToday.filter((h) =>
        h.completedDates.some((d) => isSameDayIso(d, today)),
      ),
    [habitsForToday, today],
  );

  const completionRate =
    habitsForToday.length === 0
      ? 0
      : completedToday.length / habitsForToday.length;

  const addHabit = (data: { name: string; frequency: HabitFrequency }) => {
    const now = todayIso();
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      frequency: data.frequency,
      createdAt: now,
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
    };
    dispatch({ type: 'ADD_HABIT', payload: habit });
  };

  const updateHabit = (habit: Habit) => {
    dispatch({ type: 'UPDATE_HABIT', payload: habit });
  };

  const deleteHabit = (id: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: { id } });
  };

  const toggleComplete = (id: string, dateIso: string) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: { id, date: dateIso } });
  };

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleComplete,
    stats: {
      totalHabits: habits.length,
      completedToday: completedToday.length,
      completionRate,
    },
  };
};

