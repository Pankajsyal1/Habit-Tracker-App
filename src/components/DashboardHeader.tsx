import { Zap, Calendar, Trophy } from 'lucide-react';

interface DashboardHeaderProps {
  stats: {
    completionRate: number;
    completedToday: number;
  };
  dailyHabitsCount: number;
}

const DashboardHeader = ({ stats, dailyHabitsCount }: DashboardHeaderProps) => {
  return (
    <div className="dash-header-anim flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between px-1">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500/80">
            Level Up Your Day
          </span>
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white font-display flex items-center gap-3">
          Focus Mode <span className="text-gradient">Active</span>
        </h2>
        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Calendar className="h-4 w-4 text-sky-400" />
            <span>
              {new Date().toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>{dailyHabitsCount} Main Goals</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 lg:items-end w-full lg:w-auto">
        <div className="glass-card rounded-2xl p-4 lg:p-5 flex items-center gap-5 min-w-[300px] border-emerald-500/10">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="24"
                className="stroke-slate-800 fill-none"
                strokeWidth="4"
              />
              <circle
                cx="50%"
                cy="50%"
                r="24"
                className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - stats.completionRate)}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xs font-black text-white">
              {Math.round(stats.completionRate * 100)}%
            </span>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Daily Mastery
              </span>
              <span className="text-[10px] font-bold text-emerald-400">
                {stats.completedToday}/{dailyHabitsCount} Done
              </span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800/50">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-emerald-400 to-sky-500 transition-all duration-1000 ease-out"
                style={{ width: `${Math.round(stats.completionRate * 100)}%` }}
              />
            </div>
            <p className="text-[10px] font-medium text-slate-400 leading-none">
              {stats.completionRate === 1 ? 'Legacy Achieved!' : 'Keep pushing your limits.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
