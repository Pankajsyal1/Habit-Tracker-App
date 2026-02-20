import { Home, ListChecks, CalendarDays, Activity, Settings2 } from 'lucide-react';
import { RoutePaths } from '../../constants/enums';
import NavItem from './NavItem';

const AppSidebar = () => {
  return (
    <aside className="sidebar-anim lg:w-64 hidden lg:block">
      <nav className="sticky top-32 flex flex-col gap-8 z-40">
        <div className="space-y-3">
          <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Daily Rhythm
          </p>
          <div className="flex flex-col gap-2">
            <NavItem to={RoutePaths.DASHBOARD} icon={Home} end>Today</NavItem>
            <NavItem to={RoutePaths.HABITS} icon={ListChecks}>Habits</NavItem>
          </div>
        </div>

        <div className="space-y-3">
          <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Insights
          </p>
          <div className="flex flex-col gap-2">
            <NavItem to={RoutePaths.CALENDAR} icon={CalendarDays}>Calendar</NavItem>
            <NavItem to={RoutePaths.ANALYTICS} icon={Activity}>Analytics</NavItem>
            <NavItem to={RoutePaths.SETTINGS} icon={Settings2}>Settings</NavItem>
          </div>
        </div>

        {/* Progress Card */}
        <div className="mt-4 glass-card rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 transition-opacity group-hover:opacity-40">
            <Activity className="h-5 w-5" />
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
  );
};

export default AppSidebar;
