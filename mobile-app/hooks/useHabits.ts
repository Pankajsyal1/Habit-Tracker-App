import { useMemo } from 'react';
import { useHabitContext } from '../context/HabitContext';
import type { Habit } from '../types';
import { HabitFrequency } from '../constants/enums';
import { isSameDayIso, todayIso } from '../utils/dateUtils';

export const useHabits = () => {
  const { habits, dispatch, isLoading } = useHabitContext();

  const today = todayIso();

  const stats = useMemo(() => {
    const dailyHabits = habits.filter(h => h.frequency === HabitFrequency.DAILY);
    const weeklyHabits = habits.filter(h => h.frequency === HabitFrequency.WEEKLY);
    
    const dailyCompleted = dailyHabits.filter(h => 
      h.completedDates.some(d => isSameDayIso(d, today))
    );

    const completionRate = dailyHabits.length === 0 
      ? 0 
      : dailyCompleted.length / dailyHabits.length;

    return {
      totalHabits: habits.length,
      dailyCount: dailyHabits.length,
      weeklyCount: weeklyHabits.length,
      dailyCompleted: dailyCompleted.length,
      completionRate,
    };
  }, [habits, today]);

  const addHabit = (data: { name: string; frequency: HabitFrequency }) => {
    const now = todayIso();
    const habit: Habit = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
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
    isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleComplete,
    stats,
  };
};
