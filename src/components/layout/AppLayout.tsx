import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
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
        <AppHeader />

        <div className="flex flex-1 flex-col gap-8 lg:flex-row">
          <AppSidebar />

          {/* Main Area */}
          <main ref={mainRef} className="main-anim flex-1 min-h-[600px]">
            <div className="h-full glass-panel rounded-4xl p-6 lg:p-8 relative overflow-hidden">
               {/* Key ensures GSAP re-runs on route change if wraped with individual page loaders */}
               <div key={location.pathname} className="h-full">
                {children}
               </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
