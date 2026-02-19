import { APP_METADATA } from '../../constants/design';
import { Moon } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="header-anim flex items-center justify-between gap-4 glass-panel rounded-3xl px-6 py-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-sky-500 glow-primary shadow-emerald-500/20">
          <span className="text-2xl font-black text-slate-950">H</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-display">
            {APP_METADATA.TITLE}
          </h1>
          <p className="text-xs font-medium text-slate-400">
            {APP_METADATA.TAGLINE}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="hidden items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-emerald-400 transition-all hover:bg-slate-800 sm:inline-flex"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span>Streak Safe</span>
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/80 text-slate-200 shadow-lg hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
          aria-label="Toggle theme"
        >
          <Moon className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
