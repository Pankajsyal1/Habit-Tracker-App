import React, { useState } from 'react';
import { ScrollView, View, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import DashboardHeader from '../components/DashboardHeader';
import QuickAddHabit from '../components/QuickAddHabit';
import HabitSection from '../components/HabitSection';
import ConfirmModal from '../components/ConfirmModal';
import EditHabitModal from '../components/EditHabitModal';

// Hooks & Utils
import { useHabits } from '../hooks/useHabits';
import { todayIso } from '../utils/dateUtils';
import { HabitFrequency } from '../constants/enums';
import type { Habit } from '../types';

export default function DashboardScreen() {
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
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-8">
          {/* 1. Header Area */}
          <DashboardHeader 
            stats={stats} 
            dailyHabitsCount={dailyHabits.length} 
          />

          <View className="px-5 mt-8 gap-10">
            {/* 2. Quick Add Form */}
            <QuickAddHabit onAdd={addHabit} />

            {/* 3. Daily Habits Section */}
            <HabitSection
              title="Daily Rhythm"
              habits={dailyHabits}
              activeCount={dailyHabits.length}
              accentColor="emerald"
              emptyMessage="No habits tracked for today."
              onToggleToday={handleToggleToday}
              onEdit={setEditingHabit}
              onDelete={setDeletingHabitId}
            />

            {/* 4. Weekly Moves Section */}
            <HabitSection
              title="Weekly Moves"
              habits={weeklyHabits}
              activeCount={weeklyHabits.length}
              accentColor="sky"
              emptyMessage="Build consistency with weekly targets."
              onToggleToday={handleToggleToday}
              onEdit={setEditingHabit}
              onDelete={setDeletingHabitId}
            />
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
            updateHabit({ ...editingHabit, ...updates });
            setEditingHabit(null);
          }
        }}
        onClose={() => setEditingHabit(null)}
      />
    </SafeAreaView>
  );
}
