import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import HabitCard from '../components/HabitCard';
import { useHabits } from '../hooks/useHabits';
import { HabitFrequency } from '../constants/enums';

const HabitsPage = () => {
  const { habits, toggleComplete, deleteHabit } = useHabits();
  const [filter, setFilter] = useState<'all' | HabitFrequency>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = habits.filter((h) =>
    filter === 'all' ? true : h.frequency === filter,
  );

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.habits-header', { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out' })
      .from('.habits-filters', { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out' }, '-=0.6')
      .from('.habit-item-anim', { 
        y: 20, 
        opacity: 0, 
        duration: 0.6, 
        ease: 'expo.out', 
        stagger: {
          amount: 0.4,
          from: "start"
        }
      }, '-=0.4');
  }, { scope: containerRef, dependencies: [filter] });

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-8">
      <div className="habits-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-display">
            Habit Directory
          </h2>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Manage your daily systems and weekly milestones.
          </p>
        </div>

        <div className="habits-filters flex items-center gap-1 rounded-[1.25rem] border border-slate-700/50 bg-slate-950/50 p-1">
          {[
            { id: 'all', label: 'All' },
            { id: HabitFrequency.DAILY, label: 'Daily' },
            { id: HabitFrequency.WEEKLY, label: 'Weekly' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilter(opt.id as 'all' | HabitFrequency)}
              className={`
                relative px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded-[0.9rem]
                ${filter === opt.id
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid flex-1 gap-6 content-start pb-8">
        {filtered.length === 0 ? (
          <div className="habit-item-anim glass-card rounded-[2rem] p-12 text-center border-dashed flex flex-col items-center gap-4">
             <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-600">
                <span className="i-lucide-search h-8 w-8" />
             </div>
             <div className="max-w-xs">
                <p className="text-sm font-bold text-slate-300">
                  No habits match this filter.
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Try adjusting your filter or head back to the Today page to track your first win.
                </p>
             </div>
          </div>
        ) : (
          filtered.map((habit) => (
            <div key={habit.id} className="habit-item-anim">
              <HabitCard
                habit={habit}
                onToggleToday={() => toggleComplete(habit.id, new Date().toISOString())}
                onEdit={() => { }}
                onDelete={() => deleteHabit(habit.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HabitsPage;
