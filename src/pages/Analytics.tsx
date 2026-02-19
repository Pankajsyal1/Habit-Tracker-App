import { useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useHabits } from '../hooks/useHabits';

const AnalyticsPage = () => {
  const { habits } = useHabits();
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    const totalCompletions = habits.reduce(
      (sum, h) => sum + h.completedDates.length,
      0,
    );
    const avgStreak =
      habits.length === 0
        ? 0
        : habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length;

    return {
      totalHabits: habits.length,
      totalCompletions,
      avgStreak,
    };
  }, [habits]);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.ana-header-anim', { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out' })
      .from('.ana-card-anim', { 
        y: 20, 
        opacity: 0, 
        duration: 0.8, 
        ease: 'expo.out', 
        stagger: 0.2 
      }, '-=0.6')
      .from('.ana-footer-anim', { y: 20, opacity: 0, duration: 1, ease: 'expo.out' }, '-=0.4');
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-8">
      <div className="ana-header-anim">
        <h2 className="text-2xl font-bold tracking-tight text-white font-display">
          Growth Analytics
        </h2>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Tracking the compounding effect of your daily choices.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="ana-card-anim glass-card rounded-[2rem] p-6 group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 transition-colors group-hover:text-emerald-400">
            Active Habits
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{stats.totalHabits}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Defined</span>
          </div>
          <div className="mt-4 h-1 w-12 bg-emerald-500/20 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 w-1/2" />
          </div>
        </div>

        <div className="ana-card-anim glass-card rounded-[2rem] p-6 group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 transition-colors group-hover:text-sky-400">
            Total Wins
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{stats.totalCompletions}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Logs</span>
          </div>
          <div className="mt-4 h-1 w-12 bg-sky-500/20 rounded-full overflow-hidden">
             <div className="h-full bg-sky-500 w-2/3" />
          </div>
        </div>

        <div className="ana-card-anim glass-card rounded-[2rem] p-6 group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 transition-colors group-hover:text-violet-400">
            Avg Streak
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{stats.avgStreak.toFixed(1)}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Days</span>
          </div>
          <div className="mt-4 h-1 w-12 bg-violet-500/20 rounded-full overflow-hidden">
             <div className="h-full bg-violet-500 w-1/3" />
          </div>
        </div>
      </div>

      <div className="ana-footer-anim flex-1 glass-card rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
        {/* Abstract Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/5 blur-[80px] rounded-full" />

        <div className="relative z-10 max-w-lg">
          <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
            <span className="i-lucide-line-chart h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Deep Insights Coming Soon</h3>
          <p className="text-sm font-medium text-slate-400 leading-relaxed">
            Our neural mapping engine is warming up. Soon you'll visualize your progress with interactive line charts, heatmaps, and pattern recognition to optimize your routine.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
             <div className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse delay-75" />
             <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse delay-150" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
