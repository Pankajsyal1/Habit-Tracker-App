import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Sparkles, ListTodo } from 'lucide-react-native';
import HabitCard from '../components/HabitCard';
import ScreenHeader from '../components/ScreenHeader';
import { useHabits } from '../hooks/useHabits';
import { HabitFrequency } from '../constants/enums';
import { todayIso } from '../utils/dateUtils';
import ConfirmModal from '../components/ConfirmModal';
import EditHabitModal from '../components/EditHabitModal';
import type { Habit } from '../types';

export default function HabitsScreen() {
  const { habits, toggleComplete, deleteHabit, updateHabit, isLoading } = useHabits();
  const [filter, setFilter] = useState<'all' | HabitFrequency>('all');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Modal states
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const filtered = habits.filter((h) =>
    filter === 'all' ? true : h.frequency === filter,
  );

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
        title="Habit Directory"
        subtitle="Manage your daily and weekly goals."
        icon={<ListTodo size={20} color="#10b981" />}
        accentColor="emerald"
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-8 gap-8">
          <View className={`flex-row items-center p-1 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-100'}`}>
            {[
              { id: 'all', label: 'All' },
              { id: HabitFrequency.DAILY, label: 'Daily' },
              { id: HabitFrequency.WEEKLY, label: 'Weekly' },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setFilter(opt.id as 'all' | HabitFrequency)}
                className={`flex-1 py-2 items-center justify-center rounded-lg ${filter === opt.id
                  ? 'bg-emerald-500'
                  : ''
                  }`}
              >
                <Text className={`text-[10px] font-bold uppercase tracking-widest ${filter === opt.id ? 'text-white' : 'text-slate-500'}`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="gap-4">
            {filtered.length === 0 ? (
              <View className={`rounded-3xl p-10 items-center border-2 border-dashed ${isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <View className={`h-16 w-16 rounded-2xl items-center justify-center mb-6 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border`}>
                  {habits.length === 0 ? (
                    <Sparkles size={32} color="#10b981" />
                  ) : (
                    <Search size={32} color="#38bdf8" />
                  )}
                </View>
                <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                  {habits.length === 0 ? 'Start Your Journey' : 'No Habits Found'}
                </Text>
                <Text className="text-xs text-slate-500 text-center leading-relaxed">
                  {habits.length === 0 
                    ? 'Your habit bank is empty. Head back to the Today page to define your first daily win.' 
                    : `No results match the "${filter}" filter.`}
                </Text>
              </View>
            ) : (
              filtered.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggleToday={() => toggleComplete(habit.id, todayIso())}
                  onEdit={() => setEditingHabit(habit)}
                  onDelete={() => setDeletingHabitId(habit.id)}
                />
              ))
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
            updateHabit({ ...editingHabit, ...updates });
            setEditingHabit(null);
          }
        }}
        onClose={() => setEditingHabit(null)}
      />
    </SafeAreaView>
  );
}
