import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Components
import ConfirmModal from '../components/ConfirmModal';
import EditHabitModal from '../components/EditHabitModal';
import DashboardHeader from '../components/DashboardHeader';
import QuickAddHabit from '../components/QuickAddHabit';
import HabitSection from '../components/HabitSection';

// Hooks & Utils
import { useHabits } from '../hooks/useHabits';
import { todayIso } from '../utils/dateUtils';
import { HabitFrequency } from '../constants/enums';
import type { Habit } from '../types';

const DashboardView = () => {
  const { habits, addHabit, toggleComplete, updateHabit, deleteHabit, stats } = useHabits();
  const containerRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const dailyHabits = habits.filter((h) => h.frequency === HabitFrequency.DAILY);
  const weeklyHabits = habits.filter((h) => h.frequency === HabitFrequency.WEEKLY);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.dash-header-anim', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
      )
      .fromTo('.dash-form-anim', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, '-=0.6')
      .fromTo('.dash-section-anim', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.2 }, '-=0.4');
  }, { scope: containerRef, dependencies: [] });

  const handleToggleToday = (id: string) => {
    console.log('Toggling', id);
    toggleComplete(id, todayIso());
  };

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-8">
      {/* 1. Header Area */}
      <DashboardHeader 
        stats={stats} 
        dailyHabitsCount={dailyHabits.length} 
      />

      {/* 2. Quick Add Form */}
      <QuickAddHabit onAdd={addHabit} />

      {/* 3. Habits Grid */}
      <div className="grid flex-1 gap-6 lg:gap-8 lg:grid-cols-2">
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
      </div>

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
    </div>
  );
};

export default DashboardView;
