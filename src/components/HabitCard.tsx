import { CheckCircle2, Settings, Trash2 } from 'lucide-react';
import type { Habit } from '../types';
import { isSameDayIso, todayIso } from '../utils/dateUtils';
import { HabitFrequency } from '../constants/enums';
import StreakBadge from './StreakBadge';

interface HabitCardProps {
  habit: Habit;
  onToggleToday: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const HabitCard = ({ habit, onToggleToday, onEdit, onDelete }: HabitCardProps) => {
  const today = todayIso();
  const doneToday = habit.completedDates.some((d) => isSameDayIso(d, today));

  return (
    <div className={`
      group relative overflow-hidden rounded-4xl border transition-all duration-500
      ${doneToday 
        ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_40px_rgba(52,211,153,0.05)]' 
        : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-600/50'}
    `}>
      {/* Glow Effect on Over */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`
                flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black shadow-lg transition-transform group-hover:scale-110
                ${habit.frequency === HabitFrequency.DAILY 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'}
              `}>
                {habit.frequency === HabitFrequency.DAILY ? 'D' : 'W'}
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  {habit.name}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
                  Started {new Date(habit.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <StreakBadge habit={habit} />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleToday();
            }}
            className={`
              relative z-10 flex h-14 w-full sm:w-14 items-center justify-center rounded-2xl transition-all duration-300 active:scale-90
              ${doneToday
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/40 glow-primary'
                : 'bg-slate-950/50 border border-slate-700/50 text-slate-400 hover:border-emerald-500/60 hover:text-emerald-400'}
            `}
          >
            <CheckCircle2 className={`${doneToday ? 'h-7 w-7' : 'h-6 w-6'} transition-all`} />
            <span className="sm:hidden ml-3 font-bold uppercase tracking-widest text-xs">
              {doneToday ? 'Completed' : 'Mark Done'}
            </span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 mt-6 pt-5 flex items-center justify-between border-t border-slate-800/50">
           <div className="flex gap-4">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="relative z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 transition-all cursor-pointer"
                aria-label="Edit habit"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="relative z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                aria-label="Delete habit"
              >
                <Trash2 className="h-4 w-4" />
                <span>Archive</span>
              </button>
           </div>
           
           <div className="flex -space-x-1.5">
             {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-1.5 w-1.5 rounded-full ${i < 3 ? 'bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-slate-800'}`} />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
