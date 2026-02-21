import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Zap, Calendar as CalendarIcon, Trophy } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

interface DashboardHeaderProps {
  stats: {
    completionRate: number;
    completedToday: number;
  };
  dailyHabitsCount: number;
}

const DashboardHeader = ({ stats, dailyHabitsCount }: DashboardHeaderProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const radius = 24;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - stats.completionRate);

  return (
    <View className={`flex flex-col gap-6 px-5 pt-2 pb-6 border-b ${isDark ? 'bg-slate-950 border-slate-800/60' : 'bg-white border-slate-200/80'}`}>
      <View className="space-y-1">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Zap size={14} color="#10b981" />
          </View>
          <Text className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/80">
            Level Up Your Day
          </Text>
        </View>
        <Text className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Focus Mode <Text className="text-emerald-500">Active</Text>
        </Text>
        <View className="flex-row items-center gap-4 pt-1">
          <View className="flex-row items-center gap-2">
            <CalendarIcon size={14} color="#38bdf8" />
            <Text className="text-[11px] font-bold text-slate-400">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View className={`h-3 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`} />
          <View className="flex-row items-center gap-2">
            <Trophy size={14} color="#fbbf24" />
            <Text className="text-[11px] font-bold text-slate-400">{dailyHabitsCount} Main Goals</Text>
          </View>
        </View>
      </View>
      
      <View className={`rounded-3xl p-5 flex-row items-center gap-5 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm shadow-slate-200'}`}>
        <View className="relative flex h-14 w-14 items-center justify-center">
          <Svg height="56" width="56" viewBox="0 0 56 56" style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle
              cx="28"
              cy="28"
              r={radius}
              stroke={isDark ? '#1e293b' : '#e2e8f0'}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx="28"
              cy="28"
              r={radius}
              stroke="#10b981"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
          <View className="absolute inset-0 items-center justify-center">
             <Text className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {Math.round(stats.completionRate * 100)}%
             </Text>
          </View>
        </View>
        
        <View className="flex-1 space-y-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Daily Mastery
            </Text>
            <Text className="text-[10px] font-bold text-emerald-400">
              {stats.completedToday}/{dailyHabitsCount} Done
            </Text>
          </View>
          <View className={`relative h-1.5 w-full overflow-hidden rounded-full ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
            <View
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
              style={{ width: `${Math.round(stats.completionRate * 100)}%` }}
            />
          </View>
          <Text className="text-[10px] font-medium text-slate-400">
            {stats.completionRate === 1 ? 'Legacy Achieved!' : 'Keep pushing your limits.'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DashboardHeader;
