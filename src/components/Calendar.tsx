import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  isToday,
} from 'date-fns';
import type { Habit } from '../types';

interface CalendarProps {
  habits: Habit[];
  month: Date;
}

const Calendar = ({ habits, month }: CalendarProps) => {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end: addDays(end, 6) });

  const isCompletedForAnyHabit = (date: Date) =>
    habits.some((habit) =>
      habit.completedDates.some((iso) => isSameDay(new Date(iso), date)),
    );

  return (
    <div className="glass-panel rounded-4xl p-6 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
           <p className="text-xl font-bold tracking-tight text-white font-display">
            {format(month, 'MMMM yyyy')}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
             Monthly Activity Grid
          </p>
        </div>
        <div className="flex gap-2">
           <div className="h-2 w-2 rounded-full bg-emerald-400 glow-primary" />
           <div className="h-2 w-2 rounded-full bg-slate-800" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 text-center mb-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-3">
        {days.slice(0, 35).map((day) => {
          const inCurrentMonth = isSameMonth(day, month);
          const completed = isCompletedForAnyHabit(day);
          const activeToday = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              className={`
                relative flex aspect-square w-full items-center justify-center rounded-2xl text-xs font-bold transition-all duration-300
                ${inCurrentMonth
                  ? 'text-slate-200'
                  : 'text-slate-700 opacity-40'}
                ${completed
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 active:scale-95'
                  : 'bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-emerald-500/5'}
                ${activeToday && !completed ? 'border-sky-500/50 scale-105' : ''}
              `}
            >
              {format(day, 'd')}
              {activeToday && (
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${completed ? 'bg-slate-950' : 'bg-sky-400'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
