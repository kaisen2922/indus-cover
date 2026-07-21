import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmergencyStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { PageHeader } from '../components/PageHeader';
import { 
  AlertOctagon, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  Activity,
  Star,
  Search,
  SlidersHorizontal,
  Navigation,
  Compass,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export const EmergencySOS: React.FC = () => {
  const navigate = useNavigate();
  const { sosActive, liveLocationActive, gpsCoordinates, medicalId, hospitals, triggerSos, toggleLiveLocation } = useEmergencyStore();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [coords, setCoords] = useState(gpsCoordinates);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Nearby');
  const [hoveredHospital, setHoveredHospital] = useState<string | null>(null);

  // Countdown timer logic
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      triggerSos(true);
      toast.error('SOS ALARM ACTIVE. Dispatching coordinates to emergency contacts.', {
        duration: 5000,
        description: 'Ambulance dispatcher notified. Live tracking is online.'
      });
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, triggerSos]);

  // Live Location Drifting simulator
  useEffect(() => {
    if (!liveLocationActive && !sosActive) return;
    
    const interval = setInterval(() => {
      setCoords((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0001,
        lng: prev.lng + (Math.random() - 0.5) * 0.0001,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [liveLocationActive, sosActive]);

  const handleStartSOS = () => {
    if (sosActive) {
      triggerSos(false);
      toast.info('Emergency SOS alert cancelled.');
    } else {
      setCountdown(3);
    }
  };

  const handleCancelCountdown = () => {
    setCountdown(null);
    toast.info('SOS dispatch aborted.');
  };

  const handleDialNumber = (label: string, phone: string) => {
    toast.success(`Dialing ${label} secure hotline: ${phone}...`);
  };

  // Hospital-specific details resolver
  const getHospitalDetails = (name: string) => {
    switch (name) {
      case 'Apollo Multispeciality Hospitals':
        return { rating: '4.8', travelTime: '6 mins' };
      case 'AMRI Hospital Dhakuria':
        return { rating: '4.7', travelTime: '10 mins' };
      case 'Fortis Hospital Anandapur':
        return { rating: '4.8', travelTime: '15 mins' };
      case 'Medica Superspecialty Hospital':
        return { rating: '4.7', travelTime: '18 mins' };
      default:
        return { rating: '4.5', travelTime: '12 mins' };
    }
  };

  const filters = ['Nearby', 'Emergency', 'Cardiology', 'Cashless', 'ICU'];

  // Client-side filtering logic
  const filteredHospitals = hospitals.filter((hosp) => {
    const matchesSearch = 
      hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
      hosp.address.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;
    
    if (selectedFilter === 'Nearby') return true;
    if (selectedFilter === 'Emergency') return hosp.specialties.includes('Emergency Medicine') || hosp.specialties.includes('Trauma');
    if (selectedFilter === 'Cardiology') return hosp.specialties.includes('Cardiology');
    if (selectedFilter === 'Cashless') return hosp.cashlessSupport;
    if (selectedFilter === 'ICU') return hosp.specialties.includes('ICU');
    
    return true;
  });

  return (
    <div className="relative min-h-screen bg-background text-on-surface pt-3 pb-8 px-5 max-w-4xl mx-auto selection:bg-primary/20">
      
      {/* Reusable PageHeader - Title & Back arrow aligned, exactly 24px below app header wrapper */}
      <PageHeader 
        title="Emergency Support" 
        subtitle="SOS alert routing, Indian cashless network hospital locator, and digital Medical ID." 
        onBack={() => navigate(-1)} 
      />

      {/* SOS Button Area - exactly 24px (mt-6) below header */}
      <section className="mt-6 flex flex-col items-center justify-center py-6">
        <div className="relative">
          {/* Animated Background Ring glow */}
          <div className={`absolute inset-0 rounded-full blur-3xl scale-125 transition-colors duration-1000 ${
            sosActive ? 'bg-error/30 animate-pulse' : 'bg-primary/5'
          }`} />

          <button
            onClick={handleStartSOS}
            className={`relative z-10 w-44 h-44 rounded-full flex flex-col items-center justify-center border-4 select-none cursor-pointer transition-all duration-500 shadow-2xl ${
              sosActive 
                ? 'bg-error border-error-container text-white scale-105 animate-subtle-pulse' 
                : 'bg-red-950/20 border-error/30 text-error hover:border-error hover:bg-red-950/40'
            }`}
          >
            <AlertOctagon className={`w-14 h-14 ${sosActive ? 'animate-bounce' : ''}`} />
            <span className="font-headline-md text-sm font-bold tracking-widest uppercase mt-3">
              {sosActive ? 'ACTIVE SOS' : 'TAP FOR SOS'}
            </span>
            <span className="text-[9px] font-label-sm text-on-surface-variant/80 uppercase tracking-wider mt-1.5">
              {sosActive ? 'Tap to Abort' : '3s Countdown'}
            </span>
          </button>

          {/* Glowing orbital border while active */}
          {sosActive && (
            <div className="absolute inset-0 rounded-full border border-error/50 scale-110 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Cancelable countdown overlay */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/95 z-50 flex flex-col items-center justify-center space-y-6 select-none"
            >
              <h2 className="font-headline-lg text-display-lg-mobile font-bold text-error animate-pulse">DISPATCHING SOS IN</h2>
              <div className="w-36 h-36 rounded-full bg-error-container/20 border border-error flex items-center justify-center">
                <span className="font-display-lg text-display-lg font-bold text-error">{countdown}</span>
              </div>
              <p className="text-xs text-on-surface-variant/80 max-w-xs text-center leading-relaxed">
                Emergency dispatch is transmitting your secure live location and Medical ID to first responders.
              </p>
              <button
                onClick={handleCancelCountdown}
                className="px-6 py-3 border border-white/8 hover:bg-white/5 rounded-xl text-xs font-bold transition-all cursor-pointer text-on-surface"
              >
                Cancel SOS Transmission
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Coordinates & Medical ID info split - exactly 24px (mt-6) below SOS button */}
      <section className="mt-6 grid grid-cols-1 gap-4">
        
        {/* Live Coordinates Card */}
        <GlassCard hoverEffect={false} className="p-5 border-white/8 space-y-4 rounded-[24px]">
          <div className="flex justify-between items-center">
            <span className="font-label-sm text-[10px] text-on-surface-variant/60 uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <MapPin className="w-4 h-4 text-primary" />
              Live GPS Telemetry
            </span>
            <button
              onClick={toggleLiveLocation}
              className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                liveLocationActive || sosActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'border border-white/8 hover:bg-white/5 text-on-surface-variant'
              }`}
            >
              {liveLocationActive || sosActive ? 'ONLINE' : 'OFFLINE'}
            </button>
          </div>
          
          <div className="bg-white/2 border border-white/8 rounded-xl p-3 flex justify-around text-xs font-mono">
            <div className="text-center">
              <span className="text-[9px] text-on-surface-variant/50 block uppercase tracking-wider mb-0.5">Latitude</span>
              <span className="text-white font-bold">{coords.lat.toFixed(5)}</span>
            </div>
            <div className="w-px bg-white/8" />
            <div className="text-center">
              <span className="text-[9px] text-on-surface-variant/50 block uppercase tracking-wider mb-0.5">Longitude</span>
              <span className="text-white font-bold">{coords.lng.toFixed(5)}</span>
            </div>
          </div>

          <p className="text-[10px] text-on-surface-variant/60 leading-relaxed text-left">
            *Your coordinates drift slightly to simulate telemetry tracking feeds.
          </p>
        </GlassCard>

        {/* Digital Medical ID Card */}
        <GlassCard hoverEffect={false} className="p-5 border-white/8 space-y-4 relative overflow-hidden rounded-[24px]">
          <div className="absolute top-0 right-0 p-5 opacity-3 pointer-events-none">
            <Activity className="w-36 h-36 text-primary" />
          </div>
          
          <div className="flex items-center gap-3 border-b border-white/8 pb-3.5">
            <div className="w-10 h-10 rounded-xl bg-error/15 flex items-center justify-center border border-error/20 text-error flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-white">Digital Medical ID</h3>
              <p className="text-[10px] text-on-surface-variant/60 font-mono mt-0.5">Assigned to: {medicalId.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-left">
            <div>
              <span className="text-[9px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest block">Blood Group</span>
              <span className="text-white font-bold text-sm mt-0.5 block">{medicalId.bloodGroup}</span>
            </div>
            <div>
              <span className="text-[9px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest block">Emergency Contact</span>
              <span className="text-white font-semibold text-xs mt-0.5 block">Priyanjali Acharjee (Spouse)</span>
            </div>
            <div className="col-span-2">
              <span className="text-[9px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest block mb-1">Medical Conditions</span>
              <div className="flex flex-wrap gap-1.5">
                {medicalId.medicalConditions.map((cond, index) => (
                  <span key={index} className="px-2.5 py-1 bg-white/5 border border-white/8 rounded-lg text-[10px] font-mono text-on-surface-variant font-medium">
                    {cond}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <span className="text-[9px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest block mb-1">Allergies & Reactions</span>
              <div className="flex flex-wrap gap-1.5">
                {medicalId.allergies.map((all, index) => (
                  <span key={index} className="px-2.5 py-1 bg-error/10 border border-error/20 rounded-lg text-[10px] font-mono text-error font-medium">
                    {all}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-span-2 pt-3 border-t border-white/8">
              <span className="text-[9px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest block mb-1">Active Coverage Sync</span>
              <div className="flex items-center justify-between bg-white/[0.02] border border-white/8 p-3 rounded-xl">
                <span className="text-xs font-bold text-white">Global Health Elite</span>
                <span className="text-[11px] text-tertiary font-mono font-bold">₹2.5 Cr Covered</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Hotlines list */}
        <GlassCard hoverEffect={false} className="p-5 border-white/8 space-y-3.5 rounded-[24px]">
          <h3 className="font-headline-md text-sm font-bold tracking-wide text-left text-white">Emergency Call Hotlines</h3>
          <div className="space-y-2.5 text-left">
            <button
              onClick={() => handleDialNumber('IndusInd Signature Ambulance', '+91 33 6111 8888')}
              className="w-full p-4 glass-card border border-white/8 hover:border-error/40 hover:bg-error-container/10 rounded-[20px] flex items-center justify-between text-xs transition-colors cursor-pointer group gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                <div className="w-8 h-8 rounded-xl bg-error/10 flex items-center justify-center text-error flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-bold text-white group-hover:text-error transition-colors truncate">IndusInd Concierge Ambulance</span>
              </div>
              <span className="font-mono text-error font-extrabold text-[11px] whitespace-nowrap flex-shrink-0">108 / +91 33 6111 8888</span>
            </button>
            
            <button
              onClick={() => handleDialNumber('Wife (Priyanjali Acharjee)', '+91 98765 00112')}
              className="w-full p-4 glass-card border border-white/8 hover:border-primary/40 hover:bg-white/5 rounded-[20px] flex items-center justify-between text-xs transition-colors cursor-pointer group gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-white group-hover:text-primary transition-colors truncate">Primary Emergency Contact</span>
                  <span className="text-[10px] text-on-surface-variant/60 font-medium">Priyanjali Acharjee (Spouse)</span>
                </div>
              </div>
              <span className="font-mono text-primary font-bold text-[11px] whitespace-nowrap flex-shrink-0">+91 98765 00112</span>
            </button>

            <button
              onClick={() => handleDialNumber('Roadside Concierge Assistance', '+91 33 9999 0000')}
              className="w-full p-4 glass-card border border-white/8 hover:border-primary/40 hover:bg-white/5 rounded-[20px] flex items-center justify-between text-xs transition-colors cursor-pointer group gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-white group-hover:text-primary transition-colors truncate">Roadside Assistance</span>
                  <span className="text-[10px] text-on-surface-variant/60 font-medium">Porsche Guard Coverage</span>
                </div>
              </div>
              <span className="font-mono text-on-surface-variant/80 font-bold text-[11px] whitespace-nowrap flex-shrink-0">+91 33 9999 0000</span>
            </button>
          </div>
        </GlassCard>

      </section>

      {/* Cashless Network Hospitals Finder */}
      <section className="mt-8 space-y-5">
        
        {/* Title, Subtitle, and Location Badge */}
        <div className="flex flex-col gap-2 pt-6 border-t border-white/[0.05]">
          <div className="flex justify-between items-start gap-3">
            <div className="text-left">
              <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
                Nearby Cashless<br />Hospitals
              </h2>
              <p className="text-[11px] text-on-surface-variant/60 mt-1 font-medium leading-relaxed max-w-sm">
                Find trusted cashless hospitals covered by your insurance network.
              </p>
            </div>
            
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 px-2.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
              Kolkata Zone Active
            </span>
          </div>
        </div>

        {/* Search Input and Filter Action Bar */}
        <div className="space-y-4">
          {/* Premium Search Bar */}
          <div className="relative flex items-center bg-white/[0.02] border border-white/8 rounded-[16px] px-3.5 py-2.5 group focus-within:border-tertiary/30 focus-within:bg-white/[0.04] transition-all">
            <Search className="w-4.5 h-4.5 text-on-surface-variant/50 group-focus-within:text-tertiary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals or specialties..."
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none font-body-md text-xs pl-2.5 text-on-surface text-left placeholder:text-on-surface-variant/40"
            />
            <button 
              onClick={() => toast.info('Advanced search modifiers aligned.')}
              className="p-1.5 hover:bg-white/5 rounded-lg text-on-surface-variant/60 hover:text-tertiary transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontally Scrollable Filters Action Bar */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 flex-nowrap w-full">
            {filters.map((filter) => {
              const isActive = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`flex-shrink-0 px-4.5 py-2 rounded-full font-label-md text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 border ${
                    isActive
                      ? 'bg-tertiary text-on-tertiary border-tertiary shadow-[0_0_12px_rgba(233,195,73,0.25)]'
                      : 'bg-white/[0.02] border-white/8 text-on-surface-variant/80 hover:text-tertiary hover:border-tertiary/40'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Map Preview */}
        <div className="relative w-full h-[190px] rounded-[24px] overflow-hidden border border-white/8 bg-[#0d0d0d] shadow-inner group">
          {/* Vector Map SVG */}
          <svg className="w-full h-full opacity-80" viewBox="0 0 320 200" fill="none">
            <defs>
              <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Hooghly River winding path */}
            <path 
              d="M -10,30 C 50,40 60,80 50,120 C 40,160 80,180 80,210" 
              fill="none" 
              stroke="rgba(56, 189, 248, 0.06)" 
              strokeWidth="12" 
              strokeLinecap="round" 
            />
            <path 
              d="M -10,30 C 50,40 60,80 50,120 C 40,160 80,180 80,210" 
              fill="none" 
              stroke="rgba(56, 189, 248, 0.03)" 
              strokeWidth="20" 
              strokeLinecap="round" 
            />

            {/* EM Bypass */}
            <path d="M 260,-10 L 220,70 L 210,130 L 190,210" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
            <path d="M 260,-10 L 220,70 L 210,130 L 190,210" fill="none" stroke="rgba(233,195,73,0.04)" strokeWidth="1" />
            
            {/* Gariahat Road */}
            <path d="M -10,140 L 120,130 L 210,130" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="3" />
            <path d="M 110,60 L 100,140 L 90,210" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="2.5" />
            <path d="M -10,60 L 260,80" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="2" />

            {/* User Current Location (Tollygunge Area) */}
            <g transform="translate(100, 140)">
              <circle r="12" fill="rgba(233,195,73,0.15)">
                <animate attributeName="r" values="6;16;6" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle r="5" fill="#e9c349" stroke="#0d0d0d" strokeWidth="1.5" />
              <text y="-8" textAnchor="middle" fill="#e9c349" className="font-mono text-[7px] font-bold uppercase tracking-wider">You</text>
            </g>

            {/* Hospital Pins */}
            {/* Pin 1: Apollo Multispeciality Hospitals (cx=230, cy=45) */}
            <g 
              transform="translate(230, 45)" 
              cursor="pointer" 
              onClick={() => {
                const el = document.getElementById('hosp-card-0');
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setHoveredHospital('Apollo Multispeciality Hospitals');
                toast.info('Map pin: Apollo Multispeciality Hospitals focused.');
              }}
              onMouseEnter={() => setHoveredHospital('Apollo Multispeciality Hospitals')}
              onMouseLeave={() => setHoveredHospital(null)}
            >
              <circle 
                r={hoveredHospital === 'Apollo Multispeciality Hospitals' ? 14 : 10} 
                fill={hoveredHospital === 'Apollo Multispeciality Hospitals' ? 'rgba(16,185,129,0.2)' : 'rgba(233,195,73,0.1)'} 
                className="transition-all duration-300"
              />
              <circle 
                r="4.5" 
                fill={hoveredHospital === 'Apollo Multispeciality Hospitals' ? '#34d399' : '#e9c349'} 
                stroke="#0d0d0d" 
                strokeWidth="1.2" 
                className="transition-colors duration-300"
              />
              {hoveredHospital === 'Apollo Multispeciality Hospitals' && (
                <text y="-10" textAnchor="middle" fill="#34d399" className="font-bold text-[7px]">Apollo (1.8km)</text>
              )}
            </g>

            {/* Pin 2: AMRI Hospital Dhakuria (cx=90, cy=115) */}
            <g 
              transform="translate(90, 115)" 
              cursor="pointer" 
              onClick={() => {
                const el = document.getElementById('hosp-card-1');
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setHoveredHospital('AMRI Hospital Dhakuria');
                toast.info('Map pin: AMRI Hospital Dhakuria focused.');
              }}
              onMouseEnter={() => setHoveredHospital('AMRI Hospital Dhakuria')}
              onMouseLeave={() => setHoveredHospital(null)}
            >
              <circle 
                r={hoveredHospital === 'AMRI Hospital Dhakuria' ? 14 : 10} 
                fill={hoveredHospital === 'AMRI Hospital Dhakuria' ? 'rgba(16,185,129,0.2)' : 'rgba(233,195,73,0.1)'} 
                className="transition-all duration-300"
              />
              <circle 
                r="4.5" 
                fill={hoveredHospital === 'AMRI Hospital Dhakuria' ? '#34d399' : '#e9c349'} 
                stroke="#0d0d0d" 
                strokeWidth="1.2" 
                className="transition-colors duration-300"
              />
              {hoveredHospital === 'AMRI Hospital Dhakuria' && (
                <text y="-10" textAnchor="middle" fill="#34d399" className="font-bold text-[7px]">AMRI (3.2km)</text>
              )}
            </g>

            {/* Pin 3: Fortis Hospital Anandapur (cx=225, cy=105) */}
            <g 
              transform="translate(225, 105)" 
              cursor="pointer" 
              onClick={() => {
                const el = document.getElementById('hosp-card-2');
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setHoveredHospital('Fortis Hospital Anandapur');
                toast.info('Map pin: Fortis Hospital Anandapur focused.');
              }}
              onMouseEnter={() => setHoveredHospital('Fortis Hospital Anandapur')}
              onMouseLeave={() => setHoveredHospital(null)}
            >
              <circle 
                r={hoveredHospital === 'Fortis Hospital Anandapur' ? 14 : 10} 
                fill={hoveredHospital === 'Fortis Hospital Anandapur' ? 'rgba(16,185,129,0.2)' : 'rgba(233,195,73,0.1)'} 
                className="transition-all duration-300"
              />
              <circle 
                r="4.5" 
                fill={hoveredHospital === 'Fortis Hospital Anandapur' ? '#34d399' : '#e9c349'} 
                stroke="#0d0d0d" 
                strokeWidth="1.2" 
                className="transition-colors duration-300"
              />
              {hoveredHospital === 'Fortis Hospital Anandapur' && (
                <text y="-10" textAnchor="middle" fill="#34d399" className="font-bold text-[7px]">Fortis (5.9km)</text>
              )}
            </g>

            {/* Pin 4: Medica Superspecialty Hospital (cx=200, cy=165) */}
            <g 
              transform="translate(200, 165)" 
              cursor="pointer" 
              onClick={() => {
                const el = document.getElementById('hosp-card-3');
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setHoveredHospital('Medica Superspecialty Hospital');
                toast.info('Map pin: Medica Superspecialty Hospital focused.');
              }}
              onMouseEnter={() => setHoveredHospital('Medica Superspecialty Hospital')}
              onMouseLeave={() => setHoveredHospital(null)}
            >
              <circle 
                r={hoveredHospital === 'Medica Superspecialty Hospital' ? 14 : 10} 
                fill={hoveredHospital === 'Medica Superspecialty Hospital' ? 'rgba(16,185,129,0.2)' : 'rgba(233,195,73,0.1)'} 
                className="transition-all duration-300"
              />
              <circle 
                r="4.5" 
                fill={hoveredHospital === 'Medica Superspecialty Hospital' ? '#34d399' : '#e9c349'} 
                stroke="#0d0d0d" 
                strokeWidth="1.2" 
                className="transition-colors duration-300"
              />
              {hoveredHospital === 'Medica Superspecialty Hospital' && (
                <text y="-10" textAnchor="middle" fill="#34d399" className="font-bold text-[7px]">Medica (6.4km)</text>
              )}
            </g>
          </svg>

          {/* View Full Map floating button */}
          <button 
            onClick={() => toast.success('Launching Aegis Global GIS Engine...', { description: 'Syncing live telemetry with Kolkata grid...' })}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-[#0d0d0d]/90 backdrop-blur-md border border-white/8 hover:border-tertiary/40 rounded-xl text-[9px] font-bold text-tertiary uppercase tracking-wider cursor-pointer transition-all active:scale-[0.98] shadow-md z-10"
          >
            <Navigation className="w-3 h-3 text-tertiary animate-subtle-pulse" />
            View Full Map
          </button>
        </div>

        {/* Dynamic Hospitals Cards List */}
        <div className="space-y-4">
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hosp, i) => {
              const details = getHospitalDetails(hosp.name);
              const isHovered = hoveredHospital === hosp.name;
              
              return (
                <GlassCard 
                  key={i} 
                  id={`hosp-card-${i}`}
                  hoverEffect={true} 
                  onMouseEnter={() => setHoveredHospital(hosp.name)}
                  onMouseLeave={() => setHoveredHospital(null)}
                  className={`rounded-[24px] p-5 border transition-all duration-250 relative overflow-hidden flex flex-col justify-between gap-4 ${
                    isHovered 
                      ? 'border-tertiary/30 bg-white/[0.04] shadow-[0_12px_36px_rgba(0,0,0,0.4)]' 
                      : 'border-white/[0.08] bg-white/[0.01]'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    
                    {/* Header: Name & Badges */}
                    <div className="flex justify-between items-start gap-2.5">
                      <div className="text-left space-y-1.5 flex-1">
                        <h3 className="text-[20px] font-semibold text-white tracking-tight leading-snug transition-colors duration-200 group-hover:text-tertiary">{hosp.name}</h3>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Rating */}
                          <div className="flex items-center gap-1 bg-tertiary/10 border border-tertiary/20 px-2 py-0.5 rounded-full text-tertiary text-[11px] font-bold tracking-wide">
                            <Star className="w-3 h-3 fill-tertiary text-tertiary" />
                            <span>{details.rating} ★</span>
                          </div>

                          {/* Cashless Tag */}
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            CASHLESS
                          </span>

                          {/* Emergency Status */}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white/5 border-white/8 text-on-surface-variant/70">
                            EMERGENCY 24×7
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Address & Specialties */}
                    <div className="text-left space-y-2 pt-1">
                      <p className="text-[13px] text-on-surface-variant/80 flex items-start gap-1.5 leading-relaxed break-words">
                        <MapPin className="w-4 h-4 text-on-surface-variant/50 mt-0.5 flex-shrink-0" />
                        <span className="flex-1">{hosp.address}</span>
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {hosp.specialties.map((spec, specIdx) => (
                          <span key={specIdx} className="text-[10px] font-mono font-medium px-2 py-0.5 bg-white/[0.03] border border-white/5 text-on-surface-variant/70 rounded-[8px]">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Metrics Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                    
                    {/* Distance & Travel time */}
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant/70 font-mono">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-tertiary" />
                        {hosp.distance}
                      </span>
                      <span className="text-on-surface-variant/30">•</span>
                      <span className="text-tertiary font-semibold">{details.travelTime} drive</span>
                    </div>

                    {/* Button Group */}
                    <div className="flex items-center gap-2">
                      {/* Call Hotline */}
                      <button
                        onClick={() => handleDialNumber(hosp.name, hosp.phone)}
                        className="px-3 h-8 bg-white/5 hover:bg-white/10 border border-white/[0.08] rounded-[16px] text-[11px] font-semibold text-on-surface flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                        title="Call Hospital Desk"
                      >
                        <Phone className="w-3.5 h-3.5 text-tertiary" />
                        Call
                      </button>

                      {/* Get Directions */}
                      <button
                        onClick={() => toast.success(`Calculating emergency route from your location...`, {
                          description: `Driving coordinates dispatched to map engine via Gariahat Rd: ~${details.travelTime}.`
                        })}
                        className="w-8 h-8 bg-white/5 border border-white/[0.08] hover:border-tertiary/30 hover:bg-white/10 text-on-surface hover:text-tertiary rounded-[16px] flex items-center justify-center transition-all cursor-pointer active:scale-[0.98]"
                        title="Get Navigation Directions"
                      >
                        <Compass className="w-3.5 h-3.5" />
                      </button>

                      {/* View Details */}
                      <button
                        onClick={() => toast.info(`Retrieving network admission credentials...`, {
                          description: `Direct cashless pre-auth agreement confirmed for ${hosp.name}. No co-pay required.`
                        })}
                        className="px-3 h-8 bg-tertiary text-on-tertiary hover:bg-tertiary/90 rounded-[16px] text-[11px] font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1"
                      >
                        <Info className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </div>

                  </div>
                </GlassCard>
              );
            })
          ) : (
            <div className="py-12 border border-dashed border-white/8 rounded-[24px] text-center space-y-2">
              <p className="text-sm font-semibold text-on-surface-variant/80">No hospitals matched your filters</p>
              <p className="text-xs text-on-surface-variant/50">Try clearing search parameters or adjusting active filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedFilter('Nearby'); }} 
                className="mt-2 text-xs font-bold text-tertiary underline uppercase tracking-wider cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Spacer to ensure hospital cards scroll clear of floating bottom nav */}
      <div className="h-28 flex-shrink-0" />
    </div>
  );
};
