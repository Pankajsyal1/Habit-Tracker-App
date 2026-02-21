import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { CheckCircle2, Settings, Trash2 } from 'lucide-react-native';
import type { Habit } from '../types';
import { isSameDayIso, todayIso } from '../utils/dateUtils';
import { HabitFrequency } from '../constants/enums';
import StreakBadge from './StreakBadge';

interface HabitCardProps {
  habit: Habit;
  onToggleToday: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const HabitCard = ({ habit, onToggleToday, onEdit, onDelete }: HabitCardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const today = todayIso();
  const doneToday = habit.completedDates.some((d) => isSameDayIso(d, today));

  return (
    <View className={`
      relative overflow-hidden rounded-2xl border mb-4
      ${doneToday 
        ? (isDark ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50') 
        : (isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white')}
    `}>
      <View className="p-4">
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1 space-y-3">
            <View className="flex-row items-center gap-3 mb-3">
              <View className={`
                h-10 w-10 items-center justify-center rounded-xl border
                ${habit.frequency === HabitFrequency.DAILY 
                  ? (isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200') 
                  : (isDark ? 'bg-sky-500/10 border-sky-500/30' : 'bg-sky-50 border-sky-200')}
              `}>
                <Text className={`font-black ${habit.frequency === HabitFrequency.DAILY ? 'text-emerald-500' : 'text-sky-500'}`}>
                  {habit.frequency === HabitFrequency.DAILY ? 'D' : 'W'}
                </Text>
              </View>
              <View>
                <Text className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {habit.name}
                </Text>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Started {new Date(habit.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </Text>
              </View>
            </View>
            
            <StreakBadge habit={habit} />
          </View>

          <TouchableOpacity
            onPress={onToggleToday}
            className={`
              h-12 w-12 items-center justify-center rounded-xl active:scale-90
              ${doneToday
                ? 'bg-emerald-500'
                : (isDark ? 'bg-slate-950/50 border border-slate-700' : 'bg-slate-50 border border-slate-200')}
            `}
          >
            <CheckCircle2 
              size={24} 
              color={doneToday ? (isDark ? '#0f172a' : '#ffffff') : (isDark ? '#475569' : '#94a3b8')} 
            />
          </TouchableOpacity>
        </View>

        <View className={`mt-4 pt-4 flex-row items-center justify-between border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
           <View className="flex-row gap-4">
              <TouchableOpacity 
                onPress={onEdit}
                className="flex-row items-center gap-2 px-2 py-1 rounded-lg"
              >
                <Settings size={16} color="#64748b" />
                <Text className="text-[10px] font-black uppercase tracking-widest text-slate-500">Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={onDelete}
                className="flex-row items-center gap-2 px-2 py-1 rounded-lg"
              >
                <Trash2 size={16} color="#ef4444" />
                <Text className="text-[10px] font-black uppercase tracking-widest text-rose-500">Archive</Text>
              </TouchableOpacity>
           </View>
           
           <View className="flex-row gap-1">
             {[...Array(5)].map((_, i) => (
                <View key={i} className={`h-1.5 w-1.5 rounded-full ${i < 3 ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-800'}`} />
             ))}
           </View>
        </View>
      </View>
    </View>
  );
};

export default HabitCard;
