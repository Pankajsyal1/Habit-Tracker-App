import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Calendar from '../components/Calendar';
import { useHabits } from '../hooks/useHabits';

const CalendarViewPage = () => {
  const { habits } = useHabits();
  const [month] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.cal-header-anim', { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out' })
      .from('.cal-grid-anim', { scale: 0.95, opacity: 0, duration: 0.8, ease: 'expo.out' }, '-=0.6')
      .from('.cal-sidebar-anim', { x: 20, opacity: 0, duration: 0.8, ease: 'expo.out' }, '-=0.6');
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-8">
      <div className="cal-header-anim">
        <h2 className="text-2xl font-bold tracking-tight text-white font-display">
          Consistency Matrix
        </h2>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Visualizing your daily wins across time.
        </p>
      </div>

      <div className="grid flex-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="cal-grid-anim min-w-0">
           <Calendar habits={habits} month={month} />
        </div>

        <aside className="cal-sidebar-anim space-y-8">
          <div className="glass-card rounded-[2rem] p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Legend
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20">
                   <span className="i-lucide-check h-5 w-5 font-bold" />
                </div>
                <div className="text-xs">
                   <p className="font-bold text-slate-200">System Win</p>
                   <p className="text-slate-500 mt-0.5">Completed at least 1 habit</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-700/50 text-slate-600">
                   <span className="i-lucide-minus h-5 w-5" />
                </div>
                <div className="text-xs">
                   <p className="font-bold text-slate-200">Neutral Day</p>
                   <p className="text-slate-500 mt-0.5">No activity recorded</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6 bg-gradient-to-br from-emerald-500/10 to-transparent">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
                Insight
             </h3>
             <p className="text-xs leading-relaxed text-slate-300">
                You tend to be <span className="text-emerald-400 font-bold">40% more active</span> on Tuesdays and Wednesdays. Use this momentum to tackle your hardest habits early in the week.
             </p>
             <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                <span>View Insights</span>
                <span className="i-lucide-arrow-right h-3 w-3" />
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CalendarViewPage;
