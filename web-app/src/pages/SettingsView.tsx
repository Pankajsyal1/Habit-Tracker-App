import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Database, AlertTriangle, LineChart, Download, Trash2 } from 'lucide-react';
import { RoutePaths } from '../constants/enums';
import { dbService } from '../db/db';

const SettingsView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.set-header-anim', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
      )
      .fromTo('.set-section-anim', 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'expo.out', 
          stagger: 0.2 
        }, '-=0.6');
  }, { scope: containerRef, dependencies: [] });

  const handleExport = async () => {
    const habits = await dbService.getHabits();
    if (habits.length === 0) return;
    
    const data = JSON.stringify({ habits }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-flow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    if (!window.confirm('This will permanently delete all your tracking data. Continue?')) return;
    await dbService.clearDatabase();
  };

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-8">
      <div className="set-header-anim">
        <h2 className="text-xl font-bold text-white font-display">
          System Preferences
        </h2>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Manage your data ecosystem and application state.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="set-section-anim glass-card rounded-xl p-5 sm:p-8 flex flex-col gap-6">
          <div className="flex items-start gap-4">
             <div className="h-12 w-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-400">
                <Database className="h-6 w-6" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Data Management</h3>
                <p className="text-xs text-slate-500 mt-0.5">Backup and mobility controls</p>
             </div>
          </div>
          
          <p className="text-xs leading-relaxed text-slate-300">
            Keep your progress safe. Export your habit data as a JSON snapshot that can be restored or analyzed externally.
          </p>

          <button
            type="button"
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-slate-900 border border-slate-700/50 h-14 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white hover:bg-slate-800 hover:border-sky-500/50 transition-all active:scale-95 group cursor-pointer"
          >
            <Download className="h-5 w-5 text-sky-400 group-hover:animate-bounce" />
            <span>Export Cloud Snapshot</span>
          </button>
        </section>

        <section className="set-section-anim glass-card rounded-xl p-5 sm:p-8 flex flex-col gap-6 bg-linear-to-br from-emerald-500/5 to-transparent border-emerald-500/10">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                <LineChart className="h-6 w-6" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Deep Insights</h3>
                <p className="text-xs text-slate-500 mt-0.5">Performance and optimization</p>
             </div>
          </div>
          
          <p className="text-xs leading-relaxed text-slate-300">
            Visualize your compounding growth and identify missing patterns in your daily systems.
          </p>

          <button
            type="button"
            onClick={() => navigate(RoutePaths.ANALYTICS)}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-slate-900 border border-slate-700/50 h-14 text-xs font-bold uppercase tracking-widest text-white hover:bg-slate-800 hover:border-emerald-500/50 transition-all active:scale-95 group cursor-pointer"
          >
            <LineChart className="h-5 w-5 text-emerald-400" />
            <span>Audit Performance</span>
          </button>
        </section>

        <section className="set-section-anim glass-card rounded-xl p-5 sm:p-8 bg-linear-to-br from-rose-500/5 to-transparent border-rose-500/20 flex flex-col gap-6">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400">
                <AlertTriangle className="h-6 w-6" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Danger Zone</h3>
                <p className="text-xs text-slate-500 mt-0.5">Destructive system actions</p>
             </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-300">
            Resetting your workspace will purge all habit definitions and streak history from the SQLite database. This action is irreversible.
          </p>

          <button
            type="button"
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-rose-950/30 border border-rose-500/30 h-14 text-xs font-bold uppercase tracking-widest text-rose-400 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all active:scale-95 group cursor-pointer"
          >
            <Trash2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            <span>Factory Reset App</span>
          </button>
        </section>
      </div>

      <div className="set-section-anim mt-auto glass-card rounded-xl p-6 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
            Habit Flow v1.0 • Running on SQLite Persistence (WASM)
         </p>
      </div>
    </div>
  );
};

export default SettingsView;
