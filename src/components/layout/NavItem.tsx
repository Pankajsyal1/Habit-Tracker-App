import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  icon: React.FC;
  end?: boolean;
}

const NavItem = ({ to, children, icon: Icon, end = false }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
        ${isActive 
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 glow-primary active-nav' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-700/50 border border-transparent'}
      `}
    >
      <Icon />
      <span className="font-medium">{children}</span>
      <div className="ml-auto opacity-0 group-[.active-nav]:opacity-100 transition-opacity">
         <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>
    </NavLink>
  );
};

export default NavItem;
