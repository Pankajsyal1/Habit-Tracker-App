import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Search, Sparkles } from 'lucide-react';
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
    tl.fromTo('.habits-header', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
      )
      .fromTo('.habits-filters', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, '-=0.6')
      .fromTo('.habit-item-anim', 
        { y: 20, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: 'expo.out', 
          stagger: {
            amount: 0.4,
            from: "start"
          }
        }, '-=0.4');
  }, { scope: containerRef, dependencies: [] });

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
          <div className="habit-item-anim glass-card rounded-4xl p-12 text-center border-dashed border-slate-800 flex flex-col items-center gap-6">
             <div className="h-20 w-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                {habits.length === 0 ? (
                  <Sparkles className="h-10 w-10 text-emerald-400 animate-pulse" />
                ) : (
                  <Search className="h-10 w-10 text-sky-400" />
                )}
             </div>
             <div className="max-w-xs space-y-2">
                <h3 className="text-lg font-bold text-white">
                  {habits.length === 0 ? 'Start Your Journey' : 'No Habits Found'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {habits.length === 0 
                    ? 'Your habit bank is empty. Head back to the Today page to define your first daily win.' 
                    : `No results match the "${filter}" filter. Try adjusting your view or adding a new one.`}
                </p>
             </div>
             {habits.length === 0 && (
               <a 
                 href="/"
                 className="px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all"
               >
                 Go to Today
               </a>
             )}
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
