import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { Habit } from '../types';
import { HabitFrequency } from '../constants/enums';

interface EditHabitModalProps {
  isOpen: boolean;
  habit: Habit | null;
  onSave: (updates: Partial<Habit>) => void;
  onClose: () => void;
}

const EditHabitModal: React.FC<EditHabitModalProps> = ({
  isOpen,
  habit,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>(HabitFrequency.DAILY);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setFrequency(habit.frequency);
    }
  }, [habit]);

  if (!isOpen || !habit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), frequency });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-slate-950/40">
      <div 
        className="glass-panel w-full max-w-md rounded-4xl p-8 border border-slate-700/50 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <h3 className="text-xl font-bold text-white mb-6">Edit Habit</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Habit Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 rounded-2xl border border-slate-700/50 bg-slate-950/50 px-4 text-sm text-slate-100 outline-none transition-all focus:border-emerald-500/50 focus:bg-slate-900/80"
              placeholder="Habit name..."
            />
          </div>

          <div className="space-y-2">
            <label className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Frequency
            </label>
            <div className="flex h-12 rounded-2xl bg-slate-950/50 border border-slate-700/50 p-1">
              {([HabitFrequency.DAILY, HabitFrequency.WEEKLY] as HabitFrequency[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`flex-1 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                    frequency === f
                      ? 'bg-emerald-500 text-slate-950 shadow-lg'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl border border-slate-700/50 bg-slate-900/50 text-sm font-bold text-slate-300 hover:bg-slate-800 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 rounded-2xl bg-linear-to-br from-emerald-400 to-sky-500 text-slate-950 text-sm font-bold shadow-lg hover:brightness-110 transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditHabitModal;
