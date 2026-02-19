import { useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { HabitProvider } from './context/HabitContext';
import { RoutePaths } from './constants/enums';

// Layout
import AppLayout from './components/layout/AppLayout';

// Lazy Loaded Pages
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const HabitsPage = lazy(() => import('./pages/Habits'));
const CalendarViewPage = lazy(() => import('./pages/CalendarView'));
const AnalyticsPage = lazy(() => import('./pages/Analytics'));
const SettingsPage = lazy(() => import('./pages/Settings'));

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
       <Suspense fallback={
         <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
         </div>
       }>
        {children}
      </Suspense>
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
