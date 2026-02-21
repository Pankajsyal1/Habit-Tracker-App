import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  isToday,
} from 'date-fns';
import type { Habit } from '../types';

interface CalendarProps {
  habits: Habit[];
  month: Date;
}

const Calendar = ({ habits, month }: CalendarProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end: addDays(end, 6) });

  const isCompletedForAnyHabit = (date: Date) =>
    habits.some((habit) =>
      habit.completedDates.some((iso) => isSameDay(new Date(iso), date)),
    );

  return (
    <View className={`rounded-3xl p-6 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} font-display`}>
            {format(month, 'MMMM yyyy')}
          </Text>
          <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
             Monthly Activity Grid
          </Text>
        </View>
        <View className="flex-row gap-2">
           <View className="h-2 w-2 rounded-full bg-emerald-500" />
           <View className={`h-2 w-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
        </View>
      </View>

      <View className="flex-row justify-between mb-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <View key={d} className="w-10 items-center">
            <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              {d.charAt(0)}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap gap-y-2">
        {days.slice(0, 35).map((day) => {
          const inCurrentMonth = isSameMonth(day, month);
          const completed = isCompletedForAnyHabit(day);
          const activeToday = isToday(day);

          return (
            <View
              key={day.toISOString()}
              style={{ width: '14.28%' }}
              className="items-center justify-center aspect-square p-1"
            >
              <View
                className={`
                  w-full h-full items-center justify-center rounded-xl border
                  ${inCurrentMonth
                    ? (isDark ? 'text-slate-200' : 'text-slate-900')
                    : 'opacity-20'}
                  ${completed
                    ? 'bg-emerald-500 border-emerald-500'
                    : (isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200')}
                  ${activeToday && !completed ? 'border-sky-500' : ''}
                `}
              >
                <Text className={`text-xs font-bold ${completed ? 'text-slate-950' : (isDark ? 'text-slate-400' : 'text-slate-600')}`}>
                  {format(day, 'd')}
                </Text>
                {activeToday && (
                  <View className={`absolute bottom-1 h-1 w-1 rounded-full ${completed ? 'bg-slate-950' : 'bg-sky-500'}`} />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Calendar;
