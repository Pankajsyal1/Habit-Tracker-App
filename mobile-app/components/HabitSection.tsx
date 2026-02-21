import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import HabitCard from './HabitCard';
import type { Habit } from '../types';

interface HabitSectionProps {
  title: string;
  habits: Habit[];
  emptyMessage: string;
  activeCount: number;
  accentColor: 'emerald' | 'sky' | 'rose' | 'amber';
  onToggleToday: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const HabitSection = ({
  title,
  habits,
  emptyMessage,
  activeCount,
  accentColor,
  onToggleToday,
  onEdit,
  onDelete,
}: HabitSectionProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colorMap = {
    emerald: isDark ? 'text-emerald-400 border-emerald-500/20' : 'text-emerald-600 border-emerald-200',
    sky: isDark ? 'text-sky-400 border-sky-500/20' : 'text-sky-600 border-sky-200',
    rose: isDark ? 'text-rose-400 border-rose-500/20' : 'text-rose-600 border-rose-200',
    amber: isDark ? 'text-amber-400 border-amber-500/20' : 'text-amber-600 border-amber-200',
  };

  return (
    <View className="space-y-6 mb-8">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className={`h-1 w-6 rounded-full ${accentColor === 'emerald' ? 'bg-emerald-500' : 'bg-sky-500'}`} />
          <Text className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            {title}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full border ${colorMap[accentColor]} ${isDark ? 'bg-slate-900/50' : 'bg-slate-50/50'}`}>
          <Text className="text-[10px] font-bold">
            {activeCount} ACTIVE
          </Text>
        </View>
      </View>
      
      <View>
        {habits.length === 0 ? (
          <View className={`rounded-2xl p-8 items-center border-2 border-dashed ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <Text className="text-sm font-medium text-slate-500 text-center">
              {emptyMessage}
            </Text>
            {title.toLowerCase().includes('daily') && (
              <TouchableOpacity className="mt-3">
                <Text className="text-xs font-bold text-emerald-500">Create your first goal</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggleToday={() => onToggleToday(habit.id)}
              onEdit={() => onEdit(habit)}
              onDelete={() => onDelete(habit.id)}
            />
          ))
        )}
      </View>
    </View>
  );
};

export default HabitSection;
