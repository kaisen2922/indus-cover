import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Shield, Bot, Clipboard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BottomNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Hide Bottom Navigation on Downward Scroll, Reveal on Upward Scroll
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const currentScrollY = (target && 'scrollTop' in target && target !== document as any && target !== window as any)
        ? target.scrollTop
        : window.scrollY;

      // Ignore very small scrolls (jitter prevention)
      if (Math.abs(currentScrollY - lastScrollY.current) < 8) return;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Policies', path: '/policies', icon: Shield },
    { label: 'AI', path: '/copilot', icon: Bot, isCenter: true },
    { label: 'Claims', path: '/claims', icon: Clipboard },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1, scale: 1 },
        hidden: { y: 110, opacity: 0, scale: 0.95 }
      }}
      animate={visible ? 'visible' : 'hidden'}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed bottom-[12px] left-4 right-4 z-40 h-[72px] rounded-[24px] bg-surface-container-lowest/85 border border-white/[0.08] backdrop-blur-[24px] shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex justify-between items-center px-3 select-none pb-safe"
    >
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = currentPath === item.path || (item.path === '/dashboard' && currentPath === '/');
        
        // 1. Center Focused AI Button (Reduced size by 10%, glow by 30%)
        if (item.isCenter) {
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative -top-3.5 w-[50px] h-[50px] rounded-full flex items-center justify-center bg-gradient-to-br from-tertiary to-tertiary-container text-on-tertiary cursor-pointer border border-tertiary/30 transition-shadow ${
                isActive 
                  ? 'shadow-[0_0_16px_rgba(233,195,73,0.3)]' 
                  : 'shadow-[0_0_10px_rgba(233,195,73,0.18)] hover:shadow-[0_0_14px_rgba(233,195,73,0.25)]'
              }`}
            >
              {/* Outer Pulsing Aura Ring */}
              <span className="absolute inset-0 rounded-full border border-tertiary/20 animate-ping opacity-20" />
              <IconComponent className="w-5.5 h-5.5 text-on-tertiary animate-subtle-pulse" />
              
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator-center"
                  className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_6px_#e9c349]"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </motion.button>
          );
        }

        // 2. Standard Navigation Tabs (Min Touch Target 44px)
        return (
          <motion.button
            key={item.path}
            onClick={() => navigate(item.path)}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 relative cursor-pointer group"
          >
            <motion.div
              animate={{ 
                scale: isActive ? 1.05 : 1.0, 
                color: isActive ? '#e9c349' : 'rgba(229, 226, 225, 0.70)'
              }}
              transition={{ type: 'spring', stiffness: 450, damping: 15 }}
              className="flex flex-col items-center gap-0.5"
            >
              <IconComponent className="w-5 h-5 transition-transform group-hover:scale-105 duration-200" />
              
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 3, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 3, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="font-label-sm text-[10px] tracking-wide font-semibold text-tertiary mt-0.5"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Smoothly Sliding Active Indicator Dot */}
            {isActive && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_6px_#e9c349]"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.nav>
  );
};
