import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Plus, Award } from 'lucide-react';
import HabitCard from '../components/HabitCard';
import ConfirmModal from '../components/ConfirmModal';
import EditHabitModal from '../components/EditHabitModal';
import { useHabits } from '../hooks/useHabits';
import { todayIso } from '../utils/dateUtils';
import { HabitFrequency } from '../constants/enums';
import type { Habit } from '../types';

const DashboardPage = () => {
  const { habits, addHabit, toggleComplete, updateHabit, deleteHabit, stats } = useHabits();
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>(HabitFrequency.DAILY);
  const containerRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  console.log('Dashboard Render - deletingHabitId:', deletingHabitId, 'editingHabit:', editingHabit?.id);

  const dailyHabits = habits.filter((h) => h.frequency === HabitFrequency.DAILY);
  const weeklyHabits = habits.filter((h) => h.frequency === HabitFrequency.WEEKLY);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.dash-header-anim', { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out' })
      .from('.dash-form-anim', { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out' }, '-=0.6')
      .from('.dash-section-anim', { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.2 }, '-=0.4');
  }, { scope: containerRef, dependencies: [] });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit({ name, frequency });
    setName('');
    
    // Quick success pulse for add button
    gsap.fromTo('.add-btn-icon', 
      { scale: 1 }, 
      { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1, ease: 'back.out' }
    );
  };

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-8">
      {/* Header & Progress Info */}
      <div className="dash-header-anim flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-display">
            Today&apos;s Focus
          </h2>
          <p className="text-sm font-medium text-slate-400 mt-1">
            {new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
           <div className="flex items-center gap-3 text-sm font-bold text-emerald-400">
              <Award className="h-5 w-5" />
              <span>{Math.round(stats.completionRate * 100)}% Daily Goal</span>
           </div>
           <div className="relative h-2.5 w-48 overflow-hidden rounded-full bg-slate-800 shadow-inner">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-emerald-400 to-sky-500 shadow-[0_0_12px_rgba(52,211,153,0.4)] transition-all duration-1000 ease-out"
              style={{ width: `${Math.round(stats.completionRate * 100)}%` }}
            />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {stats.completedToday} OF {dailyHabits.length} COMPLETED
          </p>
        </div>
      </div>

      {/* Quick Add Form */}
      <form
        onSubmit={handleCreate}
        className="dash-form-anim glass-card rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-end"
      >
        <div className="flex-1 w-full space-y-2">
          <label className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            New Habit
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What's your next win?"
            className="w-full h-12 rounded-2xl border border-slate-700/50 bg-slate-950/50 px-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-slate-900/80 focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        <div className="w-full sm:w-48 space-y-2">
          <label className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            Frequency
          </label>
          <div className="flex h-12 rounded-2xl bg-slate-950/50 border border-slate-700/50 p-1">
            {([HabitFrequency.DAILY, HabitFrequency.WEEKLY] as HabitFrequency[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={`flex-1 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${frequency === f
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

         <button
          type="submit"
          className="h-12 w-full sm:w-12 flex items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-sky-500 text-slate-950 shadow-lg glow-primary hover:brightness-110 transition-all active:scale-95"
        >
          <Plus className="add-btn-icon h-6 w-6 font-bold" />
        </button>
      </form>

      {/* Habits Grid */}
      <div className="grid flex-1 gap-8 md:grid-cols-2">
        <section className="dash-section-anim space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Daily Rhythm
            </h3>
            <div className="h-px flex-1 mx-4 bg-slate-800/50" />
            <span className="text-[10px] font-bold text-emerald-400/80 border border-emerald-500/20 rounded-full px-2 py-0.5">
              {dailyHabits.length} ACTIVE
            </span>
          </div>
          
          <div className="grid gap-4">
            {dailyHabits.length === 0 ? (
              <div className="glass-card rounded-3xl p-8 text-center border-dashed">
                <p className="text-sm font-medium text-slate-500">
                  No habits tracked for today.
                </p>
                <button 
                  onClick={() => document.querySelector<HTMLInputElement>('input')?.focus()}
                  className="mt-3 text-xs font-bold text-emerald-400 hover:underline"
                >
                  Create your first goal
                </button>
              </div>
            ) : (
              dailyHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggleToday={() => {
                    console.log('Toggling', habit.id);
                    toggleComplete(habit.id, todayIso());
                  }}
                  onEdit={() => setEditingHabit(habit)}
                  onDelete={() => setDeletingHabitId(habit.id)}
                />
              ))
            )}
          </div>
        </section>

        <section className="dash-section-anim space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Weekly Moves
            </h3>
            <div className="h-px flex-1 mx-4 bg-slate-800/50" />
            <span className="text-[10px] font-bold text-sky-400/80 border border-sky-500/20 rounded-full px-2 py-0.5">
              {weeklyHabits.length} ACTIVE
            </span>
          </div>
          
          <div className="grid gap-4">
            {weeklyHabits.length === 0 ? (
              <div className="glass-card rounded-3xl p-8 text-center border-dashed">
                <p className="text-sm font-medium text-slate-500">
                  Build consistency with weekly targets.
                </p>
              </div>
            ) : (
              weeklyHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggleToday={() => {
                    console.log('Toggling', habit.id);
                    toggleComplete(habit.id, todayIso());
                  }}
                  onEdit={() => setEditingHabit(habit)}
                  onDelete={() => setDeletingHabitId(habit.id)}
                />
              ))
            )}
          </div>
        </section>
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

export default DashboardPage;
