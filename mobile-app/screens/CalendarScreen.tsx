import React, { useState } from 'react';
import { ScrollView, View, Text, useColorScheme, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Minus, ArrowRight, Calendar as CalendarIcon } from 'lucide-react-native';
import Calendar from '../components/Calendar';
import ScreenHeader from '../components/ScreenHeader';
import { useHabits } from '../hooks/useHabits';

export default function CalendarScreen() {
  const { habits, isLoading } = useHabits();
  const [month] = useState(new Date());
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
        title="Consistency Matrix"
        subtitle="Visualizing your daily wins across time."
        icon={<CalendarIcon size={20} color="#38bdf8" />}
        accentColor="sky"
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-8 gap-8 pb-10">

          <View>
             <Calendar habits={habits} month={month} />
          </View>

          <View className="gap-8">
            <View className={`rounded-2xl p-6 gap-4 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Legend
              </Text>
              <View className="gap-4">
                <View className="flex-row items-center gap-4">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
                     <Check size={20} color="#ffffff" />
                  </View>
                  <View className="flex-1">
                     <Text className={`font-bold text-xs ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>System Win</Text>
                     <Text className="text-[10px] text-slate-500 mt-0.5">Completed at least 1 habit</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-4">
                  <View className={`h-10 w-10 items-center justify-center rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                     <Minus size={20} color="#64748b" />
                  </View>
                  <View className="flex-1">
                     <Text className={`font-bold text-xs ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Neutral Day</Text>
                     <Text className="text-[10px] text-slate-500 mt-0.5">No activity recorded</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className={`rounded-2xl p-6 border ${isDark ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-100'}`}>
               <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
                  Insight
               </Text>
               <Text className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  You tend to be <Text className="text-emerald-500 font-bold">40% more active</Text> on Tuesdays and Wednesdays. Use this momentum to tackle your hardest habits early in the week.
               </Text>
               <TouchableOpacity className="mt-4 flex-row items-center gap-2">
                  <Text className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    View Insights
                  </Text>
                  <ArrowRight size={12} color="#10b981" />
               </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
