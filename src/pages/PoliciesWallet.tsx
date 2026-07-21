import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup, useScroll, useTransform } from 'framer-motion';
import { usePolicyStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { 
  Heart, 
  Car, 
  Home as HomeIcon, 
  ChevronLeft, 
  ChevronRight,
  Download, 
  Share2, 
  FileCheck,
  Compass,
  Activity,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

// ----------------------------------------------------
// ANIMATED COUNTER COMPONENT
// ----------------------------------------------------
const Counter: React.FC<{ value: number; duration?: number; prefix?: string; suffix?: string }> = ({ 
  value, 
  duration = 1.2, 
  prefix = '', 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMilliseconds = duration * 1000;
    const incrementTime = Math.abs(Math.floor(totalMilliseconds / end));
    const step = Math.max(Math.floor(end / 45), 1);

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, Math.max(incrementTime, 16));

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
};

// Premium spring configuration matching Apple Wallet spec
const walletSpring = { type: 'spring' as const, stiffness: 280, damping: 28, mass: 0.8 };
const detailSpring = { duration: 0.45, ease: 'easeInOut' as const };

export const PoliciesWallet: React.FC = () => {
  const navigate = useNavigate();
  const { policies, increaseCoverage } = usePolicyStore();
  
  // Interaction States
  const [activeDetailPolicy, setActiveDetailPolicy] = useState<typeof policies[0] | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Compute Statistics
  const activeCount = policies.filter(p => p.status === 'ACTIVE').length;
  const totalCoverageSum = policies.reduce((acc, p) => acc + p.sumInsured, 0);
  const totalPremiumSum = policies.reduce((acc, p) => acc + p.premium, 0);
  const protectionScoreVal = 92;

  // Scroll Parallax Hooks (translateY: 0, -15, -30, -45)
  const { scrollY } = useScroll();
  const cardParallaxes = [
    useTransform(scrollY, [0, 600], [0, 0]),
    useTransform(scrollY, [0, 600], [0, -15]),
    useTransform(scrollY, [0, 600], [0, -30]),
    useTransform(scrollY, [0, 600], [0, -45])
  ];

  const handleDownloadPDF = (polNo: string) => {
    toast.loading(`Downloading certificate for ${polNo}...`, { id: 'pdf-toast' });
    setTimeout(() => {
      toast.success(`PDF saved: ${polNo}.pdf`, { id: 'pdf-toast' });
    }, 1500);
  };

  const handleShareLedger = (polNo: string) => {
    navigator.clipboard.writeText(`Aegis Policy Ledger Reference: ${polNo}`);
    toast.success('Secure blockchain ledger hash copied.');
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Health': return <Heart className="w-5 h-5 text-primary" />;
      case 'Motor': return <Car className="w-5 h-5 text-primary" />;
      case 'Home': return <HomeIcon className="w-5 h-5 text-primary" />;
      default: return <Compass className="w-5 h-5 text-primary" />;
    }
  };

  const getCardGradient = (cat: string) => {
    switch (cat) {
      case 'Health': return 'radial-gradient(circle at top left, #3a0813 0%, #151515 75%)';
      case 'Motor': return 'radial-gradient(circle at top left, #440715 0%, #151515 75%)';
      case 'Home': return 'radial-gradient(circle at top left, #332909 0%, #151515 75%)';
      default: return 'radial-gradient(circle at top left, #292107 0%, #151515 75%)';
    }
  };

  const getCardBorder = (cat: string) => {
    switch (cat) {
      case 'Health': return 'border border-primary/15 hover:border-primary/40';
      case 'Motor': return 'border border-secondary/15 hover:border-secondary/40';
      case 'Home': return 'border border-tertiary/15 hover:border-tertiary/40';
      default: return 'border border-white/8 hover:border-white/20';
    }
  };

  // Entrance Stagger Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 200, damping: 22 }
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-on-surface pt-3 pb-8 px-5 max-w-4xl mx-auto space-y-5 selection:bg-primary/20">
      
      {/* Light sweep keyframes */}
      <style>{`
        @keyframes lightSweep {
          0% { transform: translate3d(-150%, 0, 0) skewX(-20deg); }
          20% { transform: translate3d(200%, 0, 0) skewX(-20deg); }
          100% { transform: translate3d(200%, 0, 0) skewX(-20deg); }
        }
        .animate-sweep {
          animation: lightSweep 6s infinite ease-in-out;
        }
      `}</style>

      {/* Header Info */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="space-y-1 text-left"
        >
          <h1 className="text-[28px] font-bold leading-[34px] tracking-tight text-white">
            Digital Protection Wallet
          </h1>
          <p className="text-[14px] leading-[20px] text-on-surface-variant/75 max-w-lg">
            Manage every insurance policy from one secure AI-powered wallet.
          </p>
        </motion.div>
      </section>

      {/* 4 Animated Stats Cards */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3"
      >
        <motion.div variants={itemVariants}>
          <GlassCard 
            hoverEffect={true} 
            className="p-4 border-white/5 flex flex-col justify-between h-28 cursor-pointer group hover:border-tertiary/30"
            onClick={() => navigate('/active-policies')}
          >
            <span className="text-[9px] font-label-sm text-on-surface-variant/45 uppercase tracking-widest block">Active Policies</span>
            <p className="text-base font-extrabold text-white mt-2">
              {activeCount} Active Policies
            </p>
            <div className="flex items-center gap-1 text-[9px] text-tertiary font-bold uppercase tracking-wider group-hover:text-tertiary transition-colors">
              <span>Tap to View</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard hoverEffect={true} className="p-4 border-white/5 flex flex-col justify-between h-28">
            <span className="text-[9px] font-label-sm text-on-surface-variant/45 uppercase tracking-widest block">Total Coverage</span>
            <p className="text-xl md:text-2xl font-extrabold text-primary mt-2 truncate">
              <Counter value={Math.round(totalCoverageSum / 10000000)} prefix="₹" suffix=" Cr" />
            </p>
            <span className="text-[9px] text-on-surface-variant/50 font-mono">₹{(totalCoverageSum).toLocaleString('en-IN')}</span>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard hoverEffect={true} className="p-4 border-white/5 flex flex-col justify-between h-28">
            <span className="text-[9px] font-label-sm text-on-surface-variant/45 uppercase tracking-widest block">Monthly Premium</span>
            <p className="text-xl md:text-2xl font-extrabold text-white mt-2">
              <Counter value={totalPremiumSum} prefix="₹" />
            </p>
            <span className="text-[9px] text-on-surface-variant/50">4 Payments Auto-Pay</span>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard hoverEffect={true} className="p-4 border-white/5 flex flex-col justify-between h-28">
            <span className="text-[9px] font-label-sm text-on-surface-variant/45 uppercase tracking-widest block">Protection Score</span>
            <p className="text-xl md:text-2xl font-extrabold text-tertiary mt-2">
              <Counter value={protectionScoreVal} suffix="%" />
            </p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse" />
              <span className="text-[9px] text-tertiary">Sovereign Tier</span>
            </div>
          </GlassCard>
        </motion.div>
      </motion.section>

      {/* Stacked Wallet Section */}
      <LayoutGroup id="apple-wallet-group">
        <section className="space-y-4 pt-4">
          <h2 className="font-headline-lg text-xs font-bold tracking-widest uppercase text-on-surface-variant/65">
            Digital Protection Stack
          </h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full h-[470px] select-none pt-4"
          >
            {policies.map((policy, idx) => {
              const cardScale = 1 - idx * 0.03; // 1.0, 0.97, 0.94, 0.91
              const baseOpacity = 1 - idx * 0.05; // 100%, 95%, 90%, 85%
              
              const isHovered = hoveredCardId === policy.id;
              const isAnyCardHovered = hoveredCardId !== null;
              const isOtherCardHovered = isAnyCardHovered && !isHovered;

              const isSelected = activeDetailPolicy?.id === policy.id;
              const isOtherSelected = activeDetailPolicy !== null && !isSelected;

              // Top card or hovered card gets gold shimmer sweep
              const isActiveCardForSweep = isHovered || (!isAnyCardHovered && idx === 0);

              return (
                <motion.div
                  key={policy.id}
                  style={{
                    position: 'absolute',
                    top: `${idx * 70}px`,
                    width: '100%',
                    zIndex: isSelected ? 50 : idx,
                    y: cardParallaxes[idx] || 0,
                  }}
                  className="origin-top"
                >
                  <motion.div
                    layoutId={`card-wrapper-${policy.id}`}
                    initial={{ y: 250, opacity: 0 }}
                    animate={{ 
                      y: isOtherSelected ? 650 : 0,
                      scale: isSelected ? 1 : (isHovered ? 1.03 : cardScale),
                      opacity: isOtherSelected ? 0 : (isOtherCardHovered ? baseOpacity * 0.65 : baseOpacity),
                      filter: isOtherCardHovered ? 'brightness(0.68)' : 'brightness(1)',
                    }}
                    transition={walletSpring}
                    whileTap={{ scale: isSelected ? 1 : cardScale - 0.01 }}
                    onHoverStart={() => !activeDetailPolicy && setHoveredCardId(policy.id)}
                    onHoverEnd={() => setHoveredCardId(null)}
                    onClick={() => !activeDetailPolicy && setActiveDetailPolicy(policy)}
                    className="w-full cursor-pointer origin-top"
                  >
                    <div 
                      className={`rounded-[24px] p-6 relative overflow-hidden shadow-2xl transition-all duration-300 ${getCardBorder(policy.category)}`}
                      style={{
                        background: getCardGradient(policy.category),
                      }}
                    >
                      {/* Luxury sweep overlay */}
                      {isActiveCardForSweep && (
                        <div className="absolute inset-0 overflow-hidden rounded-[24px] pointer-events-none z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tertiary/10 to-transparent -skew-x-12 -translate-x-full animate-sweep" />
                        </div>
                      )}

                      {/* Faint Background Watermark Icon */}
                      <div className="absolute -bottom-8 -right-8 opacity-4 text-white/5 pointer-events-none scale-150">
                        {getCategoryIcon(policy.category)}
                      </div>

                      {/* Header Row */}
                      <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-3.5">
                          <motion.div 
                            whileHover={{ rotate: 6 }}
                            className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                          >
                            {getCategoryIcon(policy.category)}
                          </motion.div>
                          <div>
                            <h3 className="text-sm font-bold tracking-tight text-white/90">{policy.title}</h3>
                            <p className="text-[10px] text-on-surface-variant/45 uppercase tracking-widest">{policy.provider}</p>
                          </div>
                        </div>

                        {/* Gold status badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/30">
                          <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse" />
                          <span className="text-[9px] font-bold text-tertiary tracking-wider uppercase">ACTIVE</span>
                        </div>
                      </div>

                      {/* Core Coverage details */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                        <div>
                          <p className="text-[8px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest mb-0.5">Sum Insured</p>
                          <p className="text-base font-extrabold text-primary">
                            ₹{(policy.sumInsured / 10000000).toLocaleString('en-IN')} Cr
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest mb-0.5">Premium</p>
                          <p className="text-base font-extrabold text-white">
                            ₹{policy.premium.toLocaleString('en-IN')}/mo
                          </p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-[8px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest mb-0.5">Renewal Date</p>
                          <p className="text-base font-bold text-on-surface-variant/85">
                            {new Date(policy.renewalDate).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Bottom reference */}
                      <div className="mt-6 flex justify-between items-center text-[9px] font-mono text-on-surface-variant/40">
                        <span>LEDGER REF: {policy.policyNumber}</span>
                        <span className="text-tertiary flex items-center gap-1 uppercase tracking-widest font-bold">
                          Inspect Card <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>

                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Expanded Policy Detail Overlay */}
        <AnimatePresence>
          {activeDetailPolicy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={detailSpring}
              className="fixed inset-0 bg-background/96 z-50 overflow-y-auto no-scrollbar pb-16 backdrop-blur-md"
            >
              <div className="max-w-3xl mx-auto px-6 pt-20 space-y-8">
                
                {/* Back Header */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-between border-b border-white/5 pb-4"
                >
                  <button
                    onClick={() => setActiveDetailPolicy(null)}
                    className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Wallet
                  </button>
                  <span className="text-xs text-on-surface-variant/60 font-mono">Secure Ledger Card details</span>
                </motion.div>

                {/* Shared Layout Expanded Card Header */}
                <motion.div 
                  layoutId={`card-wrapper-${activeDetailPolicy.id}`}
                  className="rounded-[24px] p-6 relative overflow-hidden border border-white/8"
                  style={{ background: getCardGradient(activeDetailPolicy.category) }}
                  transition={walletSpring}
                >
                  <div className="absolute top-0 right-0 p-6 opacity-3 text-white/5 pointer-events-none scale-150">
                    {getCategoryIcon(activeDetailPolicy.category)}
                  </div>
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        {getCategoryIcon(activeDetailPolicy.category)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">{activeDetailPolicy.title}</h2>
                        <p className="text-xs text-on-surface-variant/70 uppercase tracking-widest">{activeDetailPolicy.provider}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/30">
                      <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse" />
                      <span className="text-[9px] font-bold text-tertiary tracking-wider uppercase">ACTIVE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                    <div>
                      <span className="text-[9px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest block mb-0.5">Sum Insured</span>
                      <span className="text-lg font-extrabold text-primary">₹{(activeDetailPolicy.sumInsured).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest block mb-0.5">Premium Cost</span>
                      <span className="text-lg font-extrabold text-white">₹{activeDetailPolicy.premium.toLocaleString('en-IN')}/mo</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest block mb-0.5">Renewal Date</span>
                      <span className="text-lg font-bold text-on-surface-variant/80">{new Date(activeDetailPolicy.renewalDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Details Content Grid */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs"
                >
                  {/* Left Panel: Description and services */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-label-sm text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-bold">Policy Summary</h4>
                      <p className="font-body-md text-on-surface-variant/90 leading-relaxed">
                        {activeDetailPolicy.details.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-label-sm text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-bold">Coverage Breakdown</h4>
                      <ul className="space-y-2 text-on-surface-variant">
                        {activeDetailPolicy.details.coverage.map((cov, i) => (
                          <li key={i} className="flex items-start gap-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />
                            <span>{cov}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {activeDetailPolicy.details.benefits && (
                      <div className="space-y-2">
                        <h4 className="font-label-sm text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-bold">Included Benefits</h4>
                        <ul className="space-y-2 text-on-surface-variant">
                          {activeDetailPolicy.details.benefits.map((ben, i) => (
                            <li key={i} className="flex items-start gap-2 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1 flex-shrink-0" />
                              <span>{ben}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Panel: Hospital networks, AI Insight, Emergency contacts */}
                  <div className="space-y-6">
                    {activeDetailPolicy.aiInsight && (
                      <div className="bg-surface-container-low/60 border border-tertiary/10 rounded-2xl p-4 space-y-2.5">
                        <h4 className="font-label-sm text-[9px] text-tertiary tracking-widest uppercase font-semibold flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-tertiary" />
                          AI Assistant Evaluation
                        </h4>
                        <p className="italic text-tertiary-fixed-dim leading-relaxed">
                          "{activeDetailPolicy.aiInsight}"
                        </p>
                        {activeDetailPolicy.category === 'Home' && activeDetailPolicy.sumInsured < 160000000 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              increaseCoverage(activeDetailPolicy.id, 10000000);
                              setActiveDetailPolicy({
                                ...activeDetailPolicy,
                                sumInsured: activeDetailPolicy.sumInsured + 10000000,
                                aiInsight: 'Coverage successfully optimized by AI Copilot.'
                              });
                              toast.success('Sum insured increased by ₹1 Crore securely.');
                            }}
                            className="px-4 py-2 bg-tertiary text-on-tertiary rounded-lg text-[10px] font-bold hover:brightness-105 transition-all cursor-pointer active:scale-95"
                          >
                            Apply Suggested Upgrade
                          </button>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-label-sm text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-bold">Network Partners</h4>
                      <div className="p-3 bg-white/2 border border-white/5 rounded-xl flex justify-between items-center">
                        <span>Cashless Network coverage:</span>
                        <span className="font-bold text-white">
                          {activeDetailPolicy.details.networkHospitalsCount || 420}+ Partners
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 p-3 bg-white/2 border border-white/5 rounded-xl">
                      {activeDetailPolicy.details.waitingPeriod && (
                        <p><span className="text-on-surface-variant/50 font-semibold uppercase">Waiting Period:</span> {activeDetailPolicy.details.waitingPeriod}</p>
                      )}
                      {activeDetailPolicy.details.address && (
                        <p><span className="text-on-surface-variant/50 font-semibold uppercase">Primary Address:</span> {activeDetailPolicy.details.address}</p>
                      )}
                      {activeDetailPolicy.details.vehicles && (
                        <p><span className="text-on-surface-variant/50 font-semibold uppercase">Insured Fleet:</span> {activeDetailPolicy.details.vehicles.join(', ')}</p>
                      )}
                      {activeDetailPolicy.details.beneficiaries && (
                        <p><span className="text-on-surface-variant/50 font-semibold uppercase">Trustees:</span> {activeDetailPolicy.details.beneficiaries.join(', ')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-label-sm text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-bold">Emergency Contacts</h4>
                      <div className="p-3 bg-error-container/5 border border-error/15 rounded-xl flex items-center justify-between">
                        <span className="text-error font-semibold uppercase tracking-wider">Aegis SOS Hotline</span>
                        <span className="font-bold text-error font-mono">+91 22 6111 8888</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons row */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-6 border-t border-white/5 flex flex-wrap gap-4 justify-end"
                >
                  <button
                    onClick={() => handleDownloadPDF(activeDetailPolicy.policyNumber)}
                    className="flex items-center gap-1.5 px-5 py-3 border border-white/8 hover:bg-white/5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Download Policy Document
                  </button>
                  <button
                    onClick={() => handleShareLedger(activeDetailPolicy.policyNumber)}
                    className="flex items-center gap-1.5 px-5 py-3 border border-white/8 hover:bg-white/5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Ledger Hash
                  </button>
                  <button
                    onClick={() => {
                      navigate('/claims');
                      setActiveDetailPolicy(null);
                    }}
                    className="flex items-center gap-1.5 px-5 py-3 bg-primary-container text-on-primary-container hover:brightness-110 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <FileCheck className="w-4 h-4" />
                    File Coverage Claim
                  </button>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>

      {/* AI Insight Gap Card (with animated glowing border) */}
      <motion.section 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="relative group select-none pt-4"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-tertiary via-primary to-tertiary-container rounded-[24px] blur opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse pointer-events-none" />
        
        <div className="relative glass-card rounded-[24px] p-5 border-tertiary/20 bg-gradient-to-br from-background to-surface-container-lowest flex flex-col gap-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-tertiary rounded-full animate-ping" />
              <span className="font-label-sm text-[10px] text-tertiary tracking-widest uppercase font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-tertiary" />
                AI Protection Insight
              </span>
            </div>
            
            <h3 className="font-headline-md text-base font-bold leading-snug text-white">
              "We found 2 protection gaps in your portfolio."
            </h3>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-on-surface-variant/70 font-mono pt-0.5">
              <span>RISK INDEX: <strong className="text-primary">High</strong></span>
              <span className="text-white/20">•</span>
              <span>CONFIDENCE: <strong className="text-tertiary">94%</strong></span>
              <span className="text-white/20">•</span>
              <span>RECOMMENDATION: <strong className="text-white">Critical Illness & Motor Top-up</strong></span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/compare')}
            className="gold-glow-button w-full py-3.5 px-4 rounded-xl font-semibold text-xs text-on-tertiary shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all mt-1"
          >
            <span>Review Protection</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.section>

      {/* Recent Activity Timeline */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/4 flex items-center justify-center text-primary">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="font-headline-lg text-base font-semibold tracking-wide text-on-surface-variant/85">
            Audit Activity Timeline
          </h2>
        </div>

        <div className="relative pl-6 space-y-6 border-l border-white/5 ml-4.5">
          {/* Item 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" 
            />
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white/90">Policy Auto-Renewal Lock</span>
                <span className="text-[9px] text-on-surface-variant/40 font-mono">Yesterday</span>
              </div>
              <p className="text-on-surface-variant/75 leading-relaxed">
                Global Health Elite premium debit cleared. Coverage parameters successfully updated for Joydip & dependents.
              </p>
            </div>
          </motion.div>

          {/* Item 2 */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative"
          >
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-tertiary border-2 border-background animate-pulse" 
            />
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white/90">Motor Claim CLM-MTR-2026 Settled</span>
                <span className="text-[9px] text-on-surface-variant/40 font-mono">5 days ago</span>
              </div>
              <p className="text-on-surface-variant/75 leading-relaxed">
                ₹1,20,000 cashless settlement authorized directly to Porsche Centre Worli. Zero-depreciation coverage certified.
              </p>
            </div>
          </motion.div>

          {/* Item 3 */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative"
          >
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
              className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-white/20 border-2 border-background" 
            />
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white/90">Premium Payment Verified</span>
                <span className="text-[9px] text-on-surface-variant/40 font-mono">Jul 02</span>
              </div>
              <p className="text-on-surface-variant/75 leading-relaxed">
                Sovereign Estate Plus premium payment of ₹12,450 cleared. Blockchain ledger record confirmed.
              </p>
            </div>
          </motion.div>

          {/* Item 4 */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="relative"
          >
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.4 }}
              className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-white/20 border-2 border-background" 
            />
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white/90">Renewal Dispatch Reminder</span>
                <span className="text-[9px] text-on-surface-variant/40 font-mono">Jun 28</span>
              </div>
              <p className="text-on-surface-variant/75 leading-relaxed">
                Heritage Legacy Term policy renewal warning. Sync verified with the Sterling Family Trust.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Spacer to ensure stacked cards scroll clear of bottom navigation bar */}
      <div className="h-28 flex-shrink-0" />
    </div>
  );
};
