import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import MobileNav from './MobileNav';

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
    <div className="h-dvh bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-hidden relative">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-6 lg:pt-6">
        <AppHeader />

        <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:gap-8 min-h-0">
          <AppSidebar />

          {/* Main Area */}
          <main ref={mainRef} className="main-anim flex-1 flex flex-col min-h-0">
            <div className="flex-1 glass-panel rounded-xl relative overflow-hidden flex flex-col">
               <div id="main-scroll-container" className="flex-1 overflow-y-auto p-5 lg:p-8 custom-scrollbar">
                 {/* Key ensures GSAP re-runs on route change */}
                <div key={location.pathname} className="min-h-full flex flex-col">
                  {children}
                </div>
               </div>
            </div>
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default AppLayout;
