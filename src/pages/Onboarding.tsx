import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Home, 
  Car, 
  Heart, 
  Scan, 
  TrendingUp, 
  Coins, 
  Activity,
  MapPin,
  Hospital,
  Plus
} from 'lucide-react';
import { AppIcon, BrandWordmark } from '../components/Branding';
import hero3d from '../assets/3d_insurance_document.png';
import heroGap from '../assets/real_time_coverage_gap_detection.png';

interface Slide {
  badge: string;
  title: string;
  description: string;
  orbitingIcons: React.ReactNode[];
}

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Splash Loading Simulation
  useEffect(() => {
    if (!showSplash) return;
    const interval = setInterval(() => {
      setSplashProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowSplash(false), 500);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [showSplash]);

  const slides: Slide[] = [
    {
      badge: 'AI-POWERED SECURITY',
      title: 'Manage all your insurance\nin one place.',
      description: 'Store your health, motor, travel and home insurance in one secure AI-powered vault. Receive smart reminders, instant claims support and personalized protection insights.',
      orbitingIcons: [
        <Shield key="1" className="w-5 h-5 text-primary" />,
        <FileText key="2" className="w-5 h-5 text-tertiary" />,
        <Home key="3" className="w-5 h-5 text-primary" />,
        <Car key="4" className="w-5 h-5 text-tertiary" />,
        <Heart key="5" className="w-5 h-5 text-primary" />
      ]
    },
    {
      badge: 'SOVEREIGN INTELLIGENCE',
      title: 'Real-time Coverage Gap Detection',
      description: 'Our AI continuously analyzes your insurance portfolio, detects protection gaps, estimates potential risks, and recommends the right coverage before you need it.',
      orbitingIcons: [
        <Scan key="1" className="w-5 h-5 text-primary" />,
        <TrendingUp key="2" className="w-5 h-5 text-tertiary" />,
        <Coins key="3" className="w-5 h-5 text-primary" />,
        <Shield key="4" className="w-5 h-5 text-tertiary" />,
        <Home key="5" className="w-5 h-5 text-primary" />
      ]
    },
    {
      badge: 'INSTANT PROTECTION',
      title: 'Emergency SOS &\nCashless Hospitals',
      description: 'Get instant emergency support with one tap. Find nearby cashless hospitals, request an ambulance, track assistance live, and begin your insurance claim in seconds.',
      orbitingIcons: [
        <Hospital key="1" className="w-5 h-5 text-tertiary" />,
        <Car key="2" className="w-5 h-5 text-primary animate-ambulance-move" />,
        <MapPin key="3" className="w-5 h-5 text-tertiary" />,
        <Plus key="4" className="w-5 h-5 text-primary animate-icon-glow" />,
        <Shield key="5" className="w-5 h-5 text-tertiary" />,
        <Heart key="6" className="w-5 h-5 text-primary" />
      ]
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-background text-on-surface overflow-hidden flex flex-col justify-between select-none">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-tertiary/5 rounded-full blur-[100px]" />

      <AnimatePresence>
        {showSplash ? (
          /* Splash Screen */
          <motion.div
            key="splash"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center maroon-gradient"
          >
            <div className="relative mb-10 animate-float">
              <div className="absolute inset-0 bg-tertiary/10 blur-3xl rounded-full scale-150" />
              <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center glass-card rounded-[24px] border border-white/8 gold-glow">
                <AppIcon size={64} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary rounded-full shadow-[0_0_8px_#e9c349] animate-pulse" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-tertiary/50 rounded-full animate-ping" />
              </div>
            </div>

            <div className="space-y-3 max-w-lg mb-16">
              <BrandWordmark size="xl" className="block" />
              <p className="font-headline-md text-headline-md text-on-surface-variant/70 font-medium tracking-wide">
                AI Protection Platform
              </p>
              <p className="text-[10px] text-on-surface-variant/45 font-label-sm uppercase tracking-[0.2em]">
                Powered by IndusInd Bank
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-container via-tertiary to-primary-container transition-all duration-100 ease-out" 
                  style={{ width: `${splashProgress}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-label-sm text-on-surface-variant/60 uppercase tracking-[0.2em] text-[10px]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
                Sovereign Intelligence Active
              </div>
            </div>
          </motion.div>
        ) : (
          /* Onboarding Carousel */
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-grow flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
          >
            <style>{`
              @keyframes floatAndScale {
                0%, 100% {
                  transform: translateY(0px) scale(1);
                }
                50% {
                  transform: translateY(-8px) scale(1.02);
                }
              }
              .animate-float-scale {
                animation: floatAndScale 5s infinite ease-in-out;
              }

              @keyframes floatAndScale6 {
                0%, 100% {
                  transform: translateY(0px) scale(1);
                }
                50% {
                  transform: translateY(-6px) scale(1.015);
                }
              }
              .animate-float-scale-6 {
                animation: floatAndScale6 5s infinite ease-in-out;
              }

              @keyframes shadowPulse {
                0%, 100% {
                  transform: scale(1);
                  opacity: 0.6;
                  filter: blur(8px);
                }
                50% {
                  transform: scale(0.85);
                  opacity: 0.3;
                  filter: blur(12px);
                }
              }
              .animate-shadow {
                animation: shadowPulse 5s infinite ease-in-out;
              }

              @keyframes orbit-1 {
                0% { transform: rotate(0deg) translate(140px) rotate(0deg); }
                100% { transform: rotate(360deg) translate(140px) rotate(-360deg); }
              }
              @keyframes orbit-2 {
                0% { transform: rotate(72deg) translate(140px) rotate(-72deg); }
                100% { transform: rotate(432deg) translate(140px) rotate(-432deg); }
              }
              @keyframes orbit-3 {
                0% { transform: rotate(144deg) translate(140px) rotate(-144deg); }
                100% { transform: rotate(504deg) translate(140px) rotate(-504deg); }
              }
              @keyframes orbit-4 {
                0% { transform: rotate(216deg) translate(140px) rotate(-216deg); }
                100% { transform: rotate(576deg) translate(140px) rotate(-576deg); }
              }
              @keyframes orbit-5 {
                0% { transform: rotate(288deg) translate(140px) rotate(-288deg); }
                100% { transform: rotate(648deg) translate(140px) rotate(-648deg); }
              }
              @keyframes orbit-6 {
                0% { transform: rotate(300deg) translate(140px) rotate(-300deg); }
                100% { transform: rotate(660deg) translate(140px) rotate(-660deg); }
              }

              .animate-orbit-1 { animation: orbit-1 40s infinite linear; }
              .animate-orbit-2 { animation: orbit-2 45s infinite linear; }
              .animate-orbit-3 { animation: orbit-3 50s infinite linear; }
              .animate-orbit-4 { animation: orbit-4 55s infinite linear; }
              .animate-orbit-5 { animation: orbit-5 60s infinite linear; }
              .animate-orbit-6 { animation: orbit-6 65s infinite linear; }

              @keyframes dash {
                to { stroke-dashoffset: -40; }
              }
              @keyframes dashReverse {
                to { stroke-dashoffset: 40; }
              }
              .animate-dash {
                animation: dash 8s linear infinite;
              }
              .animate-dash-reverse {
                animation: dashReverse 10s linear infinite;
              }
              @keyframes pulseSlow {
                0%, 100% { opacity: 0.05; }
                50% { opacity: 0.08; }
              }
              .animate-pulse-slow {
                animation: pulseSlow 4s ease-in-out infinite;
              }
              @keyframes pingSlow {
                0% { transform: scale(1); opacity: 0.4; }
                50% { transform: scale(1.5); opacity: 0.8; }
                100% { transform: scale(1); opacity: 0.4; }
              }
              .animate-ping-slow {
                animation: pingSlow 3s ease-in-out infinite;
              }

              @keyframes glowPulse {
                0%, 100% {
                  transform: scale(1) translate(-50%, -50%);
                  opacity: 0.8;
                }
                50% {
                  transform: scale(1.08) translate(-50%, -50%);
                  opacity: 1;
                }
              }
              .animate-glow-pulse {
                animation: glowPulse 3s infinite ease-in-out;
              }

              @keyframes ambulanceMove {
                0%, 100% { transform: translateX(0px); }
                50% { transform: translateX(6px); }
              }
              .animate-ambulance-move {
                animation: ambulanceMove 5s infinite ease-in-out;
              }

              @keyframes iconGlow {
                0%, 100% { filter: drop-shadow(0 0 1px rgba(233,195,73,0.3)); }
                50% { filter: drop-shadow(0 0 6px rgba(233,195,73,0.8)); }
              }
              .animate-icon-glow {
                animation: iconGlow 3s infinite ease-in-out;
              }
            `}</style>

            {/* Subtle background radial gradient behind illustration */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-primary/2 via-transparent to-tertiary/2 blur-3xl pointer-events-none z-0" />

            <div className="flex flex-col items-center text-center w-full max-w-[420px] mx-auto z-10">
              
              {/* App Logo */}
              <div className="flex items-center gap-2">
                <AppIcon size={32} />
                <BrandWordmark size="md" className="font-bold text-[18px]" />
              </div>

              {/* Badge */}
              <span className="text-[12px] font-semibold text-tertiary tracking-[1.5px] uppercase px-3.5 py-1 rounded-full border border-tertiary/20 bg-tertiary/5 mt-6">
                {slides[currentSlide].badge}
              </span>

              {/* Title */}
              <h2 className="text-[36px] text-white leading-tight font-bold whitespace-pre-line mt-5 px-2">
                {slides[currentSlide].title}
              </h2>

              {/* Description */}
              <p className="text-[16px] font-medium text-on-surface-variant/75 px-4 leading-relaxed mt-3">
                {slides[currentSlide].description}
              </p>

              {/* Hero Illustration */}
              <div className={`relative w-[300px] flex flex-col items-center justify-center transition-all duration-500 ${
                currentSlide === 2 ? 'mt-10 h-[440px]' : 'mt-8 h-[300px]'
              }`}>
                {/* Soft gold glow */}
                <div 
                  className={`absolute w-[220px] h-[220px] rounded-full pointer-events-none z-0 transition-all duration-500 ${
                    currentSlide === 1 
                      ? 'bg-[rgba(234,179,8,0.12)] blur-[90px]' 
                      : currentSlide === 2
                      ? 'bg-[rgba(234,179,8,0.15)] blur-[100px] animate-glow-pulse'
                      : 'bg-[rgba(234,179,8,0.18)] blur-[80px]'
                  }`}
                  style={{
                    transform: 'translate(-50%, -50%)',
                    top: '50%',
                    left: '50%'
                  }}
                />

                {/* AI Network grid and connections only for Slide 1 */}
                {currentSlide === 1 && (
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[24px]">
                    {/* Grid Pattern (5-8% opacity animated) */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.06] animate-pulse-slow" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(233,195,73,0.3)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>

                    {/* Network Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      {/* Pulsing connection paths */}
                      <path 
                        d="M 50 150 Q 150 50 250 150" 
                        fill="none" 
                        stroke="rgba(233,195,73,0.25)" 
                        strokeWidth="1.5" 
                        strokeDasharray="6 4"
                        className="animate-dash"
                        filter="url(#glow-filter)"
                      />
                      <path 
                        d="M 30 100 T 270 200" 
                        fill="none" 
                        stroke="rgba(255,178,186,0.2)" 
                        strokeWidth="1" 
                        strokeDasharray="5 5"
                        className="animate-dash-reverse"
                      />
                      <path 
                        d="M 80 250 Q 150 180 220 250" 
                        fill="none" 
                        stroke="rgba(233,195,73,0.15)" 
                        strokeWidth="1.2" 
                        strokeDasharray="8 6"
                        className="animate-dash"
                      />
                      
                      {/* Node circles */}
                      <circle cx="50" cy="150" r="3" fill="#e9c349" className="opacity-40 animate-ping-slow" />
                      <circle cx="250" cy="150" r="3" fill="#e9c349" className="opacity-40 animate-ping-slow" />
                      <circle cx="150" cy="98" r="4" fill="#ffb2ba" className="opacity-50" />
                    </svg>
                  </div>
                )}

                {/* Orbiting Icons */}
                <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                  {slides[currentSlide].orbitingIcons.map((icon, idx) => (
                    <div
                      key={idx}
                      className={`absolute transition-opacity duration-300 animate-orbit-${idx + 1}`}
                      style={{ opacity: currentSlide === 2 ? 0.15 : 0.25 }}
                    >
                      <div className="glass-card p-2.5 rounded-full border border-white/5 shadow-md flex items-center justify-center bg-background/40">
                        {icon}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3D Phone Mockup for Slide 2 */}
                {currentSlide === 2 ? (
                  <div className="w-[230px] h-[400px] rounded-[36px] border-[4px] border-[#2c2c2c] bg-[#0d0d0d] rotate-[12deg] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] z-10 animate-float-scale-6 flex flex-col justify-between overflow-hidden relative border-t-white/10 border-b-white/5">
                    {/* Screen content */}
                    <div className="rounded-[32px] overflow-hidden bg-[#131313] h-full flex flex-col justify-between p-4 border border-white/5 relative select-none">
                      {/* Status bar */}
                      <div className="flex justify-between items-center w-full px-1 text-[9px] text-white/40 font-mono tracking-wide">
                        <span>12:38</span>
                        <div className="flex items-center gap-1">
                          <span>5G</span>
                          <span className="w-3.5 h-1.5 border border-white/20 rounded-xs flex items-center p-0.5"><span className="h-full w-2/3 bg-white/40 block rounded-3xs" /></span>
                          <span>78%</span>
                        </div>
                      </div>

                      {/* Emergency Indicator Icon */}
                      <div className="w-11 h-11 rounded-2xl bg-error/15 border border-error/20 flex items-center justify-center text-error mx-auto mt-4 shadow-[0_0_12px_rgba(239,68,68,0.1)]">
                        <Activity className="w-5.5 h-5.5 animate-pulse" />
                      </div>

                      {/* Header Title */}
                      <div className="text-center mt-2.5">
                        <span className="text-[8px] font-bold text-on-surface-variant/40 tracking-[2.5px] uppercase">Aegis SOS Dock</span>
                        <h4 className="text-[15px] font-black text-white tracking-wider mt-0.5 leading-none">EMERGENCY</h4>
                      </div>

                      {/* Gold SOS Pulsing Button */}
                      <div className="my-auto flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          {/* Pulsing gold glow ring */}
                          <div className="absolute inset-0 rounded-full bg-tertiary/20 animate-ping" style={{ animationDuration: '3s' }} />
                          {/* Outer ring */}
                          <div className="absolute inset-1 rounded-full border border-tertiary/20 bg-tertiary/5 blur-[1px]" />
                          {/* Main Button */}
                          <div className="relative w-18 h-18 rounded-full bg-gradient-to-b from-tertiary via-tertiary-fixed to-tertiary text-on-tertiary font-display font-black text-[18px] tracking-wider flex flex-col items-center justify-center shadow-lg shadow-tertiary/25 border border-tertiary/40">
                            <span>SOS</span>
                            <span className="text-[8px] uppercase tracking-widest font-semibold mt-0.5 opacity-70">TAP</span>
                          </div>
                        </div>
                      </div>

                      {/* Black Bottom Navigation Bar */}
                      <div className="w-full flex flex-col items-center gap-2 mt-auto">
                        <div className="flex justify-between items-center w-full px-2.5 py-1.5 bg-[#080808]/90 rounded-xl border border-white/5 text-[8.5px] text-white/50">
                          <span className="flex items-center gap-1 font-semibold">📞 Call Support</span>
                          <span className="text-[7.5px] text-tertiary">📍 GPS Live</span>
                        </div>
                        {/* Home indicator bar */}
                        <div className="w-14 h-0.5 bg-white/20 rounded-full" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 3D Image for Slides 0 and 1 */
                  <img 
                    className={`w-full h-auto object-contain z-10 pointer-events-none select-none transition-all duration-500 ${
                      currentSlide === 1 
                        ? 'animate-float-scale-6 max-w-[280px]' 
                        : 'animate-float-scale max-w-[300px]'
                    }`}
                    src={currentSlide === 1 ? heroGap : hero3d} 
                    alt="Secure Insurance Vault" 
                  />
                )}

                {/* Shadow */}
                <div className={`h-[10px] bg-black/60 rounded-full blur-md z-0 transition-all duration-500 ${
                  currentSlide === 2 ? 'w-[140px] mt-2' : 'w-[180px] mt-4'
                }`} />
              </div>

              {/* Pagination Dots */}
              <div className={`flex items-center justify-center gap-2.5 h-2 transition-all duration-500 ${
                currentSlide === 2 ? 'mt-10' : 'mt-8'
              }`}>
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === index 
                        ? 'w-8 bg-tertiary' 
                        : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Primary Button */}
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full h-14 rounded-[18px] bg-gradient-to-r from-tertiary via-tertiary-fixed to-tertiary text-on-tertiary flex items-center justify-center gap-2.5 font-semibold text-[16px] shadow-lg shadow-tertiary/10 cursor-pointer transition-all duration-500 ${
                  currentSlide === 2 ? 'mt-8' : 'mt-6'
                }`}
              >
                <span>
                  {currentSlide === slides.length - 1 ? 'Get Started' : 'Next \u2192'}
                </span>
              </motion.button>

              {/* Secondary Link */}
              <button 
                onClick={handleSkip}
                className="font-label-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-xs underline decoration-dotted decoration-white/20 mt-4"
              >
                {currentSlide === slides.length - 1 ? 'Learn about security' : 'Skip'}
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
