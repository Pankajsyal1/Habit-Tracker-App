import React, { useState } from 'react';
import { ScrollView, View, useColorScheme, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';

// Components
import DashboardHeader from '../components/DashboardHeader';
import HabitSection from '../components/HabitSection';
import ConfirmModal from '../components/ConfirmModal';
import EditHabitModal from '../components/EditHabitModal';

// Hooks & Utils
import { useHabits } from '../hooks/useHabits';
import { todayIso } from '../utils/dateUtils';
import { HabitFrequency } from '../constants/enums';
import type { Habit } from '../types';

export default function DashboardScreen({ navigation }: any) {
  const { habits, addHabit, toggleComplete, updateHabit, deleteHabit, stats, isLoading } = useHabits();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Modal states
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const dailyHabits = habits.filter((h) => h.frequency === HabitFrequency.DAILY);
  const weeklyHabits = habits.filter((h) => h.frequency === HabitFrequency.WEEKLY);

  const handleToggleToday = (id: string) => {
    toggleComplete(id, todayIso());
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
      {/* 1. Sticky Header Area */}
      <DashboardHeader 
        stats={stats} 
        onCalendarPress={() => navigation.navigate('Calendar')}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-8 pb-32 gap-10">
          {/* 2. Daily Habits Section - Limited to 3 */}
          <View>
            <HabitSection
              title="Daily Rhythm"
              habits={dailyHabits.slice(0, 3)}
              activeCount={dailyHabits.length}
              accentColor="emerald"
              emptyMessage="No habits tracked for today."
              onToggleToday={handleToggleToday}
              onEdit={setEditingHabit}
              onDelete={setDeletingHabitId}
            />
            {dailyHabits.length > 3 && (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Habits', { filter: HabitFrequency.DAILY })}
                className="flex-row items-center justify-center gap-2 py-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10"
              >
                <Text className="text-xs font-black uppercase tracking-widest text-emerald-500">View All Daily Goals</Text>
                <ChevronRight size={14} color="#10b981" strokeWidth={3} />
              </TouchableOpacity>
            )}
          </View>

          {/* 3. Weekly Moves Section - Limited to 3 */}
          <View>
            <HabitSection
              title="Weekly Moves"
              habits={weeklyHabits.slice(0, 3)}
              activeCount={weeklyHabits.length}
              accentColor="sky"
              emptyMessage="Build consistency with weekly targets."
              onToggleToday={handleToggleToday}
              onEdit={setEditingHabit}
              onDelete={setDeletingHabitId}
            />
            {weeklyHabits.length > 3 && (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Habits', { filter: HabitFrequency.WEEKLY })}
                className="flex-row items-center justify-center gap-2 py-3 bg-sky-500/5 rounded-2xl border border-sky-500/10"
              >
                <Text className="text-xs font-black uppercase tracking-widest text-sky-500">View All Weekly Moves</Text>
                <ChevronRight size={14} color="#0ea5e9" strokeWidth={3} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <ConfirmModal
        isOpen={!!deletingHabitId}
        title="Archive Habit?"
        message="This will hide the habit from your daily list. You can still access its history in the Analytics section later."
        confirmLabel="Archive"
        onConfirm={() => {
          if (deletingHabitId) {
            deleteHabit(deletingHabitId);
            setDeletingHabitId(null);
          }
        }}
        onCancel={() => setDeletingHabitId(null)}
      />

      <EditHabitModal
        isOpen={!!editingHabit}
        habit={editingHabit}
        onSave={(updates) => {
          if (editingHabit) {
            const latest = habits.find(h => h.id === editingHabit.id);
            if (latest) updateHabit({ ...latest, ...updates });
          }
        }}
        onClose={() => setEditingHabit(null)}
      />
    </SafeAreaView>
  );
}
