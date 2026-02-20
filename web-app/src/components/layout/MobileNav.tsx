import { NavLink } from 'react-router-dom';
import { Home, ListChecks, CalendarDays, Activity, Settings2 } from 'lucide-react';
import { RoutePaths } from '../../constants/enums';

const MobileNav = () => {
  const navItems = [
    { to: RoutePaths.DASHBOARD, icon: Home, label: 'Today', end: true },
    { to: RoutePaths.HABITS, icon: ListChecks, label: 'Habits' },
    { to: RoutePaths.CALENDAR, icon: CalendarDays, label: 'Plan' },
    { to: RoutePaths.ANALYTICS, icon: Activity, label: 'Stats' },
    { to: RoutePaths.SETTINGS, icon: Settings2, label: 'Set' },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 lg:hidden px-4 py-3 glass-panel rounded-2xl flex items-center justify-between shadow-2xl border-t border-slate-700/50">
      {navItems.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `
            flex flex-col items-center gap-1 transition-all duration-300
            ${isActive 
              ? 'text-emerald-400 scale-110 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' 
              : 'text-slate-500 hover:text-slate-300'}
          `}
        >
          <Icon className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
