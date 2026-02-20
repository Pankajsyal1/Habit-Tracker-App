import { useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { eachDayOfInterval, subDays, format, isSameDay } from 'date-fns';
import { LineChart as LineChartIcon, TrendingUp, Target } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';

const AnalyticsView = () => {
  const { habits, stats: hookStats } = useHabits();
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    const now = new Date();
    const totalCompletions = habits.reduce(
      (sum, h) => sum + h.completedDates.length,
      0,
    );
    
    const avgStreak =
      habits.length === 0
        ? 0
        : habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length;

    // Growth Trend: Compare this week vs last week
    const thisWeekStart = subDays(now, 6);
    const lastWeekStart = subDays(now, 13);
    const lastWeekEnd = subDays(now, 7);

    const thisWeekCompletions = habits.reduce((acc, h) => {
      return acc + h.completedDates.filter(d => {
        const date = new Date(d);
        return date >= thisWeekStart && date <= now;
      }).length;
    }, 0);

    const lastWeekCompletions = habits.reduce((acc, h) => {
      return acc + h.completedDates.filter(d => {
        const date = new Date(d);
        return date >= lastWeekStart && date <= lastWeekEnd;
      }).length;
    }, 0);

    const growthTrend = lastWeekCompletions === 0 
      ? (thisWeekCompletions > 0 ? 100 : 0) 
      : ((thisWeekCompletions - lastWeekCompletions) / lastWeekCompletions) * 100;

    return {
      totalHabits: habits.length,
      totalCompletions,
      avgStreak,
      completionRate: hookStats.completionRate * 100,
      growthTrend,
      thisWeekCompletions
    };
  }, [habits, hookStats.completionRate]);

  const chartData = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return days.map((day) => {
      const dateStr = format(day, 'EEE');
      const count = habits.reduce((acc, habit) => {
        return acc + (habit.completedDates.some((d) => isSameDay(new Date(d), day)) ? 1 : 0);
      }, 0);
      return { name: dateStr, count };
    });
  }, [habits]);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.ana-header-anim', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
      )
      .fromTo('.ana-card-anim', 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'expo.out', 
          stagger: 0.2 
        }, '-=0.6')
      .fromTo('.ana-chart-anim', 
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'expo.out' }, '-=0.4');
  }, { scope: containerRef, dependencies: [] });

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-8 pb-8">
      <div className="ana-header-anim">
        <h2 className="text-xl font-bold text-white font-display">
          Growth Analytics
        </h2>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Tracking the compounding effect of your daily choices.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="ana-card-anim glass-card rounded-xl p-6 group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 transition-colors group-hover:text-emerald-400">
            Active Habits
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white">{stats.totalHabits}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Defined</span>
          </div>
          <div className="mt-4 h-1 w-12 bg-emerald-500/20 rounded-full overflow-hidden">
             <div 
               className="h-full bg-emerald-500 transition-all duration-1000" 
               style={{ width: `${Math.min(100, stats.completionRate)}%` }}
             />
          </div>
        </div>

        <div className="ana-card-anim glass-card rounded-xl p-6 group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 transition-colors group-hover:text-sky-400">
            Total Wins
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white">{stats.totalCompletions}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Logs</span>
          </div>
          <div className="mt-4 h-1 w-12 bg-sky-500/20 rounded-full overflow-hidden">
             <div 
               className="h-full bg-sky-500 transition-all duration-1000" 
               style={{ width: `${Math.min(100, (stats.totalCompletions / (stats.totalHabits * 10 || 1)) * 100)}%` }}
             />
          </div>
        </div>

        <div className="ana-card-anim glass-card rounded-xl p-6 group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 transition-colors group-hover:text-violet-400">
            Avg Streak
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white">{stats.avgStreak.toFixed(1)}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Days</span>
          </div>
          <div className="mt-4 h-1 w-12 bg-violet-500/20 rounded-full overflow-hidden">
             <div 
               className="h-full bg-violet-500 transition-all duration-1000" 
               style={{ width: `${Math.min(100, (stats.avgStreak / 30) * 100)}%` }}
             />
          </div>
        </div>
      </div>

      <div className="ana-chart-anim glass-panel rounded-xl p-5 sm:p-8 flex flex-col gap-8 shadow-xl relative overflow-hidden min-h-[400px]">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">System Productivity</h3>
            </div>
            <p className="text-xs text-slate-500">Completions across all habits for the last 7 days</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Count</span>
             </div>
          </div>
        </div>

        <div className="h-[280px] sm:h-[350px] relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                dy={10}
              />
              <YAxis 
                hide 
                domain={[0, 'dataMax + 1']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #1e293b', 
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc'
                }}
                itemStyle={{ color: '#10b981' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#020617' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto relative z-10">
          <div className="glass-card rounded-xl p-4 flex items-center gap-4 border-emerald-500/10">
            <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
               <Target className="h-5 w-5" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase">Weekly Score</p>
               <p className="text-sm font-black text-white">{stats.thisWeekCompletions} Pts</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center gap-4 border-sky-500/10">
            <div className="h-10 w-10 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-400">
               <LineChartIcon className="h-5 w-5" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase">Growth Trend</p>
               <p className={`text-sm font-black ${stats.growthTrend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                 {stats.growthTrend >= 0 ? '+' : ''}{stats.growthTrend.toFixed(1)}%
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
