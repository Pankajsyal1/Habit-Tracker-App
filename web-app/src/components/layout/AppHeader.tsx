import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { APP_METADATA } from '../../constants/design';

const AppHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scrollContainer = document.getElementById('main-scroll-container');
    const handleScroll = () => {
      if (scrollContainer) {
        setIsScrolled(scrollContainer.scrollTop > 20);
      }
    };
    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    if (isScrolled) {
      gsap.to(headerRef.current, {
        paddingTop: '12px',
        paddingBottom: '12px',
        borderRadius: '12px',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        marginTop: '8px',
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      gsap.to(headerRef.current, {
        paddingTop: '16px',
        paddingBottom: '16px',
        borderRadius: '24px',
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        marginTop: '0px',
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [isScrolled]);

  return (
    <header 
      ref={headerRef}
      className="header-anim sticky top-3 z-50 flex items-center justify-between gap-4 glass-panel px-5 py-3 mb-6 lg:top-4 lg:px-6 lg:py-4 lg:mb-8 transition-shadow duration-300"
      style={{ boxShadow: isScrolled ? '0 10px 30px -10px rgba(0,0,0,0.5)' : 'none' }}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-emerald-400 to-sky-500 glow-primary shadow-emerald-500/20">
          <img src="/logo.svg" alt="DailyRise Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white font-display">
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
          className="hidden items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-emerald-400 transition-all hover:bg-slate-800 sm:inline-flex"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span>Streak Safe</span>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
