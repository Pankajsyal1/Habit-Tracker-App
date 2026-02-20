import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { HabitFrequency } from '../constants/enums';
import gsap from 'gsap';

interface QuickAddHabitProps {
  onAdd: (data: { name: string; frequency: HabitFrequency }) => void;
}

const QuickAddHabit = ({ onAdd }: QuickAddHabitProps) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>(HabitFrequency.DAILY);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, frequency });
    setName('');
    
    // Quick success pulse for add button
    gsap.fromTo('.add-btn-icon', 
      { scale: 1 }, 
      { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1, ease: 'back.out' }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="dash-form-anim glass-card rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-end"
    >
      <div className="flex-1 w-full space-y-2">
        <label className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
          New Habit
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What's your next win?"
          className="w-full h-12 rounded-lg border border-slate-700/50 bg-slate-950/50 px-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-slate-900/80 focus:ring-4 focus:ring-emerald-500/10"
        />
      </div>

      <div className="w-full sm:w-48 space-y-2">
        <label className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
          Frequency
        </label>
        <div className="flex h-12 rounded-md bg-slate-950/50 border border-slate-700/50 p-1">
          {([HabitFrequency.DAILY, HabitFrequency.WEEKLY] as HabitFrequency[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`flex-1 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all ${frequency === f
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

       <button
        type="submit"
        className="h-12 w-full sm:w-12 flex items-center justify-center rounded-md bg-linear-to-br from-emerald-400 to-sky-500 text-slate-950 shadow-lg glow-primary hover:brightness-110 transition-all active:scale-95"
      >
        <Plus className="add-btn-icon h-6 w-6 font-bold" />
      </button>
    </form>
  );
};

export default QuickAddHabit;
