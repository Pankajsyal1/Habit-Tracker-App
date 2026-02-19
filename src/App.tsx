import { useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { HabitProvider } from './context/HabitContext';
import { RoutePaths } from './constants/enums';

// Layout
import AppLayout from './components/layout/AppLayout';

// Pages
import DashboardPage from './pages/Dashboard';
import HabitsPage from './pages/Habits';
import CalendarViewPage from './pages/CalendarView';
import AnalyticsPage from './pages/Analytics';
import SettingsPage from './pages/Settings';

const PageLoader = ({ children }: { children: React.ReactNode }) => {
  const container = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.fromTo(container.current, 
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
    );
  }, []);

  return (
    <div ref={container} className="h-full">
      {children}
    </div>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path={RoutePaths.DASHBOARD} element={<PageLoader><DashboardPage /></PageLoader>} />
      <Route path={RoutePaths.HABITS} element={<PageLoader><HabitsPage /></PageLoader>} />
      <Route path={RoutePaths.CALENDAR} element={<PageLoader><CalendarViewPage /></PageLoader>} />
      <Route path={RoutePaths.ANALYTICS} element={<PageLoader><AnalyticsPage /></PageLoader>} />
      <Route path={RoutePaths.SETTINGS} element={<PageLoader><SettingsPage /></PageLoader>} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <HabitProvider>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </HabitProvider>
    </BrowserRouter>
  );
};

export default App;
