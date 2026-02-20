import type { Habit } from '../types';

interface StreakBadgeProps {
  habit: Habit;
}

const StreakBadge = ({ habit }: StreakBadgeProps) => {
  const isHot = habit.currentStreak >= 7;
  const gradient = isHot 
    ? 'from-amber-400 via-orange-500 to-rose-500' 
    : 'from-emerald-400 to-sky-500';

  return (
    <div className={`
      inline-flex items-center gap-2.5 rounded-lg border px-3 py-1.5 transition-all
      ${isHot 
        ? 'border-orange-500/30 bg-orange-500/10 text-orange-200' 
        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}
    `}>
      <span className={`
        flex h-6 w-6 items-center justify-center rounded-lg bg-linear-to-br ${gradient}
        text-[10px] font-black text-slate-950 shadow-lg
      `}>
        {isHot ? '🔥' : '⚡'}
      </span>
      <div className="flex flex-col -space-y-0.5">
        <span className="text-[11px] font-bold uppercase">
          {habit.currentStreak} Day Streak
        </span>
        <span className="text-[9px] font-medium opacity-70">
          Personal Best: {habit.longestStreak}
        </span>
      </div>
    </div>
  );
};

export default StreakBadge;
