import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import type { Habit } from '../types';

interface StreakBadgeProps {
  habit: Habit;
}

const StreakBadge = ({ habit }: StreakBadgeProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isHot = habit.currentStreak >= 7;

  return (
    <View className={`
      flex-row items-center gap-2.5 rounded-lg border px-3 py-1.5
      ${isHot 
        ? (isDark ? 'border-orange-500/30 bg-orange-500/10' : 'border-orange-200 bg-orange-50') 
        : (isDark ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50')}
    `}>
      <View className={`
        h-6 w-6 items-center justify-center rounded-lg
        ${isHot ? 'bg-orange-500' : 'bg-emerald-500'}
      `}>
        <Text className="text-[10px]">{isHot ? '🔥' : '⚡'}</Text>
      </View>
      <View className="flex-col">
        <Text className={`text-[11px] font-bold uppercase ${isHot ? 'text-orange-500' : 'text-emerald-600'}`}>
          {habit.currentStreak} Day Streak
        </Text>
        <Text className="text-[9px] font-medium text-slate-500">
          Personal Best: {habit.longestStreak}
        </Text>
      </View>
    </View>
  );
};

export default StreakBadge;
