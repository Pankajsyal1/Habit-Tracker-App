import type { Habit } from '../types';
import { daysBetweenIso, todayIso } from './dateUtils';
import { HabitFrequency } from '../constants/enums';

export function calculateStreaksForHabit(habit: Habit): Habit {
  if (!habit) return habit;
  
  const today = todayIso();
  const dates = [...(habit.completedDates || [])].sort();
  
  if (dates.length === 0) {
    return { ...habit, currentStreak: 0, longestStreak: 0 };
  }

  if (habit.frequency === HabitFrequency.DAILY) {
    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;

    for (let i = 0; i < dates.length; i++) {
      streak = 1;
      while (
        i + 1 < dates.length &&
        daysBetweenIso(dates[i], dates[i + 1]) === 1
      ) {
        streak += 1;
        i += 1;
      }
      longestStreak = Math.max(longestStreak, streak);
    }

    const lastCompletion = dates[dates.length - 1];
    const daysSinceLast = daysBetweenIso(lastCompletion, today);
    if (daysSinceLast === 0) {
      currentStreak = 1;
      for (let i = dates.length - 2; i >= 0; i--) {
        if (daysBetweenIso(dates[i], dates[i + 1]) === 1) {
          currentStreak += 1;
        } else {
          break;
        }
      }
    } else {
      currentStreak = 0;
    }

    return {
      ...habit,
      currentStreak,
      longestStreak,
    };
  }

  // weekly frequency
  const weeks = new Map<string, number>();
  for (const d of dates) {
    const weekKey = getWeekKey(d);
    weeks.set(weekKey, (weeks.get(weekKey) ?? 0) + 1);
  }

  const sortedWeeks = [...weeks.keys()].sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 0;

  for (let i = 0; i < sortedWeeks.length; i++) {
    streak = 1;
    while (
      i + 1 < sortedWeeks.length &&
      weekDistance(sortedWeeks[i], sortedWeeks[i + 1]) === 1
    ) {
      streak += 1;
      i += 1;
    }
    longestStreak = Math.max(longestStreak, streak);
  }

  const currentWeek = getWeekKey(today);
  if (weeks.has(currentWeek)) {
    currentStreak = 1;
    let idx = sortedWeeks.indexOf(currentWeek);
    while (
      idx - 1 >= 0 &&
      weekDistance(sortedWeeks[idx - 1], sortedWeeks[idx]) === 1
    ) {
      currentStreak += 1;
      idx -= 1;
    }
  } else {
    currentStreak = 0;
  }

  return {
    ...habit,
    currentStreak,
    longestStreak,
  };
}

function getWeekKey(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const firstDayOfYear = new Date(date.getUTCFullYear(), 0, 1);
    const pastDaysOfYear = Math.floor(
      (Number(date) - Number(firstDayOfYear)) / 86400000,
    );
    const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    // Pad week number with leading zero for correct lexicographical sorting
    const paddedWeek = week.toString().padStart(2, '0');
    return `${date.getUTCFullYear()}-W${paddedWeek}`;
  } catch (e) {
    console.error('Error generating week key:', e);
    return '0000-W00';
  }
}

function weekDistance(a: string, b: string): number {
  const [yearA, weekA] = a.split('-W').map(Number);
  const [yearB, weekB] = b.split('-W').map(Number);
  
  if (isNaN(yearA) || isNaN(weekA) || isNaN(yearB) || isNaN(weekB)) return 0;
  
  // Approximation: years have 52.17 weeks on average
  // Better: calculate total weeks since a fixed point
  const totalWeeksA = yearA * 52 + weekA;
  const totalWeeksB = yearB * 52 + weekB;
  
  return totalWeeksB - totalWeeksA;
}
