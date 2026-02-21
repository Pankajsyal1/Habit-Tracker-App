import type { Habit } from '../types';
import { daysBetweenIso, todayIso } from './dateUtils';

export function calculateStreaksForHabit(habit: Habit): Habit {
  const today = todayIso();
  const dates = [...habit.completedDates].sort();
  if (dates.length === 0) {
    return { ...habit, currentStreak: 0, longestStreak: 0 };
  }

  if (habit.frequency === 'daily') {
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
  const date = new Date(isoDate);
  const firstDayOfYear = new Date(date.getUTCFullYear(), 0, 1);
  const pastDaysOfYear = Math.floor(
    (Number(date) - Number(firstDayOfYear)) / 86400000,
  );
  const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${date.getUTCFullYear()}-W${week}`;
}

function weekDistance(a: string, b: string): number {
  const [yearA, weekA] = a.split('-W').map(Number);
  const [yearB, weekB] = b.split('-W').map(Number);
  return (yearB - yearA) * 52 + (weekB - weekA);
}
