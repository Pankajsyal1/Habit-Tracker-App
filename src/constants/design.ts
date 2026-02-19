export const DESIGN_TOKENS = {
  COLORS: {
    PRIMARY: 'emerald-400',
    SECONDARY: 'sky-500',
    ACCENT: 'violet-500',
    SLATE: {
      50: '#f8fafc',
      400: '#94a3b8',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
  },
  GLASS: {
    BG: 'bg-slate-950/70',
    BORDER: 'border-slate-800/80',
    BLUR: 'backdrop-blur-xl',
    SHADOW: 'shadow-[0_20px_60px_rgba(15,23,42,0.9)]',
  },
  GRADIENTS: {
    PRIMARY: 'from-emerald-400 to-sky-500',
    SURFACE: 'from-slate-900/80 via-slate-950 to-slate-950/95',
  },
  ANIMATION: {
    DURATION: 0.4,
    EASE: 'expo.out',
  },
};

export const STORAGE_KEYS = {
  HABITS_V1: 'habit-tracker:v1',
};

export const APP_METADATA = {
  TITLE: 'Habit Flow',
  TAGLINE: 'Build streaks, not stress.',
  DESCRIPTION: 'Track your habits with a modern, beautiful, and performant app.',
};
