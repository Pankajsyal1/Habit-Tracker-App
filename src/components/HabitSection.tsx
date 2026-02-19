import HabitCard from './HabitCard';
import type { Habit } from '../types';

interface HabitSectionProps {
  title: string;
  habits: Habit[];
  emptyMessage: string;
  activeCount: number;
  accentColor: 'emerald' | 'sky' | 'rose' | 'amber'; // Added common colors
  onToggleToday: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const HabitSection = ({
  title,
  habits,
  emptyMessage,
  activeCount,
  accentColor,
  onToggleToday,
  onEdit,
  onDelete,
}: HabitSectionProps) => {
  const colorMap = {
    emerald: 'text-emerald-400/80 border-emerald-500/20',
    sky: 'text-sky-400/80 border-sky-500/20',
    rose: 'text-rose-400/80 border-rose-500/20',
    amber: 'text-amber-400/80 border-amber-500/20',
  };

  return (
    <section className="dash-section-anim space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          {title}
        </h3>
        <div className="h-px flex-1 mx-4 bg-slate-800/50" />
        <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${colorMap[accentColor]}`}>
          {activeCount} ACTIVE
        </span>
      </div>
      
      <div className="grid gap-4">
        {habits.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center border-dashed">
            <p className="text-sm font-medium text-slate-500">
              {emptyMessage}
            </p>
            {title.toLowerCase().includes('daily') && (
              <button 
                onClick={() => document.querySelector<HTMLInputElement>('input')?.focus()}
                className="mt-3 text-xs font-bold text-emerald-400 hover:underline"
              >
                Create your first goal
              </button>
            )}
          </div>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggleToday={() => onToggleToday(habit.id)}
              onEdit={() => onEdit(habit)}
              onDelete={() => onDelete(habit.id)}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default HabitSection;
