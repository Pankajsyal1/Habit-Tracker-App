import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { STORAGE_KEYS } from '../constants/design';

const SettingsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.set-header-anim', { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out' })
      .from('.set-section-anim', { 
        y: 20, 
        opacity: 0, 
        duration: 0.8, 
        ease: 'expo.out', 
        stagger: 0.2 
      }, '-=0.6');
  }, { scope: containerRef });

  const handleExport = () => {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS_V1);
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'habit-flow-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    // GSAP Shake animation on confirm if possible, but keep it simple for now
    if (!window.confirm('This will permanently delete all your tracking data. Continue?')) return;
    localStorage.removeItem(STORAGE_KEYS.HABITS_V1);
    window.location.reload();
  };

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-8">
      <div className="set-header-anim">
        <h2 className="text-2xl font-bold tracking-tight text-white font-display">
          System Preferences
        </h2>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Manage your data ecosystem and application state.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="set-section-anim glass-card rounded-[2rem] p-8 flex flex-col gap-6">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400">
                <span className="i-lucide-database h-6 w-6" />
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
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-slate-900 border border-slate-700/50 h-14 text-xs font-bold uppercase tracking-widest text-white hover:bg-slate-800 hover:border-sky-500/50 transition-all active:scale-95 group"
          >
            <span className="i-lucide-download h-5 w-5 text-sky-400 group-hover:animate-bounce" />
            <span>Export Cloud Snapshot</span>
          </button>
        </section>

        <section className="set-section-anim glass-card rounded-[2rem] p-8 bg-gradient-to-br from-rose-500/5 to-transparent border-rose-500/20 flex flex-col gap-6">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400">
                <span className="i-lucide-alert-triangle h-6 w-6" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Danger Zone</h3>
                <p className="text-xs text-slate-500 mt-0.5">Destructive system actions</p>
             </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-300">
            Resetting your workspace will purge all habit definitions and streak history from this browser's local storage. This action is irreversible.
          </p>

          <button
            type="button"
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 h-14 text-xs font-bold uppercase tracking-widest text-rose-400 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all active:scale-95 group"
          >
            <span className="i-lucide-trash-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            <span>Factory Reset App</span>
          </button>
        </section>
      </div>

      <div className="set-section-anim mt-auto glass-card rounded-[2rem] p-6 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
            Habit Flow v1.0 • Running on Local Storage Persistence
         </p>
      </div>
    </div>
  );
};

export default SettingsPage;
