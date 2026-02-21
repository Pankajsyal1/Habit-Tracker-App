import React, { useMemo } from 'react';
import { ScrollView, View, Text, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart as LineChartIcon, TrendingUp, Target, BarChart2 } from 'lucide-react-native';
import { eachDayOfInterval, subDays, format, isSameDay } from 'date-fns';
import Svg, { Path, Circle, G, Line } from 'react-native-svg';
import ScreenHeader from '../components/ScreenHeader';
import { useHabits } from '../hooks/useHabits';

export default function AnalyticsScreen({ navigation }: any) {
  const { habits, stats: hookStats, isLoading } = useHabits();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const stats = useMemo(() => {
    const now = new Date();
    const totalCompletions = habits.reduce(
      (sum, h) => sum + h.completedDates.length,
      0,
    );
    
    const avgStreak =
      habits.length === 0
        ? 0
        : habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length;

    const thisWeekStart = subDays(now, 6);
    const lastWeekStart = subDays(now, 13);
    const lastWeekEnd = subDays(now, 7);

    const thisWeekCompletions = habits.reduce((acc, h) => {
      return acc + h.completedDates.filter(d => {
        const date = new Date(d);
        return date >= thisWeekStart && date <= now;
      }).length;
    }, 0);

    const lastWeekCompletions = habits.reduce((acc, h) => {
      return acc + h.completedDates.filter(d => {
        const date = new Date(d);
        return date >= lastWeekStart && date <= lastWeekEnd;
      }).length;
    }, 0);

    const growthTrend = lastWeekCompletions === 0 
      ? (thisWeekCompletions > 0 ? 100 : 0) 
      : ((thisWeekCompletions - lastWeekCompletions) / lastWeekCompletions) * 100;

    return {
      totalHabits: habits.length,
      totalCompletions,
      avgStreak,
      completionRate: hookStats.completionRate * 100,
      growthTrend,
      thisWeekCompletions
    };
  }, [habits, hookStats.completionRate]);

  const chartData = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return days.map((day) => {
      const dateStr = format(day, 'EEE');
      const count = habits.reduce((acc, habit) => {
        return acc + (habit.completedDates.some((d) => isSameDay(new Date(d), day)) ? 1 : 0);
      }, 0);
      return { name: dateStr, count };
    });
  }, [habits]);

  // Simple SVG Line Chart generator
  const renderLineChart = () => {
    const width = 300;
    const height = 150;
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const maxCount = Math.max(...chartData.map(d => d.count), 1);
    
    const points = chartData.map((d, i) => ({
      x: padding + (i * (chartWidth / (chartData.length - 1))),
      y: height - padding - (d.count * (chartHeight / maxCount))
    }));

    const pathData = points.reduce((acc, p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, 
    "");

    return (
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <G>
          {/* Horizontal Grid Lines */}
          {[0, 0.5, 1].map((p, i) => (
             <Line 
               key={i}
               x1={padding} 
               y1={height - padding - (p * chartHeight)} 
               x2={width - padding} 
               y2={height - padding - (p * chartHeight)}
               stroke={isDark ? "#1e293b" : "#e2e8f0"}
               strokeDasharray="4 4"
             />
          ))}
          <Path
            d={pathData}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((p, i) => (
            <Circle key={i} cx={p.x} cy={p.y} r="4" fill="#10b981" />
          ))}
        </G>
      </Svg>
    );
  };

  if (isLoading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`} edges={['top']}>
      <ScreenHeader
        title="Growth Analytics"
        subtitle="Tracking the compounding effect of your daily choices."
        icon={<BarChart2 size={20} color="#8b5cf6" />}
        accentColor="violet"
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-8 gap-8 pb-10">

          <View className="flex-row gap-4">
             <View className={`flex-1 rounded-2xl p-4 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <Text className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Active</Text>
                <Text className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalHabits}</Text>
                <View className="h-1 w-8 bg-emerald-500 rounded-full mt-2" />
             </View>
             <View className={`flex-1 rounded-2xl p-4 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <Text className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Logs</Text>
                <Text className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalCompletions}</Text>
                <View className="h-1 w-8 bg-sky-500 rounded-full mt-2" />
             </View>
             <View className={`flex-1 rounded-2xl p-4 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <Text className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Streak</Text>
                <Text className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.avgStreak.toFixed(1)}</Text>
                <View className="h-1 w-8 bg-violet-500 rounded-full mt-2" />
             </View>
          </View>

          <View className={`rounded-3xl p-6 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <View className="mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <TrendingUp size={16} color="#10b981" />
                <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>System Productivity</Text>
              </View>
              <Text className="text-xs text-slate-500">Last 7 days completions count</Text>
            </View>

            <View className="h-40 items-center justify-center">
              {renderLineChart()}
            </View>

            <View className="flex-row justify-between pt-4">
              {chartData.map((d, i) => (
                <Text key={i} className="text-[10px] font-bold text-slate-500 uppercase">
                  {d.name.charAt(0)}
                </Text>
              ))}
            </View>
          </View>

          <View className="gap-4">
            <View className={`flex-row items-center p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-emerald-500/10' : 'bg-white border-emerald-100'}`}>
              <View className="h-10 w-10 bg-emerald-500/10 rounded-xl items-center justify-center">
                 <Target size={20} color="#10b981" />
              </View>
              <View className="ml-4 flex-1">
                 <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Weekly Score</Text>
                 <Text className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.thisWeekCompletions} Points</Text>
              </View>
            </View>

            <View className={`flex-row items-center p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-sky-500/10' : 'bg-white border-sky-100'}`}>
              <View className="h-10 w-10 bg-sky-500/10 rounded-xl items-center justify-center">
                 <LineChartIcon size={20} color="#38bdf8" />
              </View>
              <View className="ml-4 flex-1">
                 <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Growth Trend</Text>
                 <Text className={`text-sm font-black ${stats.growthTrend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {stats.growthTrend >= 0 ? '+' : ''}{stats.growthTrend.toFixed(1)}%
                 </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
