import { useRef } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { HabitProvider } from './context/HabitContext';
import { APP_METADATA } from './constants/design';
import { RoutePaths } from './constants/enums';

// Pages
import DashboardPage from './pages/Dashboard';
import HabitsPage from './pages/Habits';
import CalendarViewPage from './pages/CalendarView';
import AnalyticsPage from './pages/Analytics';
import SettingsPage from './pages/Settings';

// Icons (using lucide-like naming as in original)
const Icons = {
  Home: () => <span className="i-lucide-home h-5 w-5" />,
  Habits: () => <span className="i-lucide-list-checks h-5 w-5" />,
  Calendar: () => <span className="i-lucide-calendar-days h-5 w-5" />,
  Analytics: () => <span className="i-lucide-activity h-5 w-5" />,
  Settings: () => <span className="i-lucide-settings-2 h-5 w-5" />,
  Moon: () => <span className="i-lucide-moon h-4 w-4" />,
};

const NavItem = ({ to, children, icon: Icon, end = false }: { to: string; children: React.ReactNode; icon: React.FC; end?: boolean }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
      ${isActive 
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 glow-primary' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-700/50 border border-transparent'}
    `}
  >
    <Icon />
    <span className="font-medium">{children}</span>
    <div className="ml-auto opacity-0 group-[.active]:opacity-100 transition-opacity">
       <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
    </div>
  </NavLink>
);

const PageLoader = () => {
  const container = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.fromTo(container.current, 
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
    );
  }, []);

  return (
    <div ref={container} className="h-full">
      <Routes>
        <Route path={RoutePaths.DASHBOARD} element={<DashboardPage />} />
        <Route path={RoutePaths.HABITS} element={<HabitsPage />} />
        <Route path={RoutePaths.CALENDAR} element={<CalendarViewPage />} />
        <Route path={RoutePaths.ANALYTICS} element={<AnalyticsPage />} />
        <Route path={RoutePaths.SETTINGS} element={<SettingsPage />} />
      </Routes>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Entrance animations for layout components
    const tl = gsap.timeline();
    tl.from('.sidebar-anim', { x: -30, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1 })
      .from('.header-anim', { y: -20, opacity: 0, duration: 0.8, ease: 'expo.out' }, '-=0.6')
      .from('.main-anim', { scale: 0.98, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.4');
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        {/* Header */}
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
              <Icons.Moon />
            </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="sidebar-anim lg:w-64">
            <nav className="sticky top-6 flex flex-col gap-8">
              <div className="space-y-3">
                <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Daily Rhythm
                </p>
                <div className="flex flex-col gap-2">
                  <NavItem to={RoutePaths.DASHBOARD} icon={Icons.Home} end>Today</NavItem>
                  <NavItem to={RoutePaths.HABITS} icon={Icons.Habits}>Habits</NavItem>
                </div>
              </div>

              <div className="space-y-3">
                <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Insights
                </p>
                <div className="flex flex-col gap-2">
                  <NavItem to={RoutePaths.CALENDAR} icon={Icons.Calendar}>Calendar</NavItem>
                  <NavItem to={RoutePaths.ANALYTICS} icon={Icons.Analytics}>Analytics</NavItem>
                  <NavItem to={RoutePaths.SETTINGS} icon={Icons.Settings}>Settings</NavItem>
                </div>
              </div>

              {/* Progress Card */}
              <div className="mt-4 glass-card rounded-3xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-20 transition-opacity group-hover:opacity-40">
                  <Icons.Analytics />
                </div>
                <p className="mb-2 font-bold text-emerald-300 text-sm">
                  Weekly Goal
                </p>
                <p className="text-xs leading-relaxed text-slate-300">
                  You&apos;re <span className="text-white font-bold">2 days</span> away from your next milestone. Keep it up!
                </p>
                <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-linear-to-r from-emerald-500 to-sky-500 w-[70%]" />
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Area */}
          <main ref={mainRef} className="main-anim flex-1 min-h-[600px]">
            <div className="h-full glass-panel rounded-4xl p-6 lg:p-8 relative overflow-hidden">
               <PageLoader key={location.pathname} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <HabitProvider>
        <AppContent />
      </HabitProvider>
    </BrowserRouter>
  );
};

export default App;
