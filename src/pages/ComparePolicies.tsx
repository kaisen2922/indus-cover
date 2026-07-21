import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { toast } from 'sonner';

interface PlanDetail {
  id: string;
  name: string;
  shortName: string;
  tag?: string;
  fitScore: string;
  coverage: string;
  premium: string;
  waiting: string;
  hospitals: string;
  copay: string;
  roomRent: string;
  claimRatio: string;
  aiScore: string;
  recommended: boolean;
  colorTheme: string; 
}

export const ComparePolicies: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const plans: PlanDetail[] = [
    {
      id: 'aegis-elite',
      name: 'Aegis Global Health Elite',
      shortName: 'Aegis Global Elite',
      tag: 'AI RECOMMENDED',
      fitScore: '98%',
      coverage: '₹2.5 Crore (Global)',
      premium: '₹4,200/month',
      waiting: '2 Years (Accidents Waived)',
      hospitals: '840+ Premium Networks',
      copay: '0% Co-pay',
      roomRent: 'No capping (Single suite)',
      claimRatio: '98.9% (Instant AI)',
      aiScore: '98% (Excellent Fit)',
      recommended: true,
      colorTheme: 'radial-gradient(circle at top left, #3d0511 0%, #151515 80%)'
    },
    {
      id: 'hdfc-optima',
      name: 'HDFC Ergo Optima Secure',
      shortName: 'HDFC Optima Secure',
      fitScore: '82%',
      coverage: '₹1.0 Crore (Domestic)',
      premium: '₹3,900/month',
      waiting: '3 Years standard',
      hospitals: '720+ Networks',
      copay: '0% Co-pay',
      roomRent: 'Single Private Room',
      claimRatio: '96.5% standard',
      aiScore: '82% (Good Fit)',
      recommended: false,
      colorTheme: 'radial-gradient(circle at top left, #231c05 0%, #151515 80%)'
    },
    {
      id: 'icici-lombard',
      name: 'ICICI Lombard Shield',
      shortName: 'ICICI Lombard Shield',
      fitScore: '74%',
      coverage: '₹75 Lakhs (Domestic)',
      premium: '₹3,500/month',
      waiting: '4 Years standard',
      hospitals: '650+ Networks',
      copay: '10% Senior Co-pay',
      roomRent: 'Shared Room capping',
      claimRatio: '94.2% standard',
      aiScore: '74% (Moderate Fit)',
      recommended: false,
      colorTheme: 'radial-gradient(circle at top left, #121212 0%, #171717 80%)'
    }
  ];

  const features = [
    { name: 'Coverage Limit', key: 'coverage', rating: ['gold', 'green', 'red'] },
    { name: 'Monthly Premium', key: 'premium', rating: ['gold', 'green', 'green'] },
    { name: 'Waiting Period', key: 'waiting', rating: ['green', 'red', 'red'] },
    { name: 'Cashless Hospitals', key: 'hospitals', rating: ['gold', 'green', 'red'] },
    { name: 'Co-Payment Clause', key: 'copay', rating: ['green', 'green', 'red'] },
    { name: 'Room Rent Capping', key: 'roomRent', rating: ['green', 'gold', 'red'] },
    { name: 'Claim Ratio', key: 'claimRatio', rating: ['gold', 'green', 'red'] },
    { name: 'AI Fit Match Score', key: 'aiScore', rating: ['gold', 'green', 'red'] }
  ];

  const handleSelectPlan = (planName: string) => {
    toast.success(`Locking premium for ${planName}...`);
    navigate('/buy');
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const centerPoint = scrollLeft + containerWidth / 2;
    
    let closestIndex = 0;
    let minDiff = Infinity;
    
    const children = container.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const diff = Math.abs(centerPoint - childCenter);
      
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    
    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  const getIndicatorColor = (rating: string) => {
    switch (rating) {
      case 'gold': return 'text-tertiary font-bold';
      case 'green': return 'text-emerald-400 font-semibold';
      case 'red': return 'text-rose-400';
      default: return 'text-on-surface-variant';
    }
  };

  const getIndicatorDot = (rating: string) => {
    switch (rating) {
      case 'gold': return 'bg-tertiary shadow-[0_0_6px_#e9c349]';
      case 'green': return 'bg-emerald-400';
      case 'red': return 'bg-rose-400';
      default: return 'bg-white/20';
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-on-surface pt-3 pb-8 px-5 max-w-4xl mx-auto selection:bg-primary/20">
      
      {/* Reusable PageHeader - Title & Back arrow aligned, exactly 24px below app header wrapper */}
      <PageHeader 
        title="Policy Comparison" 
        subtitle="Choose the best plan for your needs" 
        onBack={() => navigate(-1)} 
      />

      {/* Swipe Guide: exactly 24px (mt-6) below subtitle */}
      <div className="mt-6 flex justify-between items-center text-[10px] text-on-surface-variant/40 uppercase tracking-widest px-2 select-none">
        <span>Focus selected plan detail below</span>
        <span className="flex items-center gap-1">Swipe ← →</span>
      </div>

      {/* Centered card swipe carousel: exactly 16px (mt-4) below swipe hint */}
      <section className="mt-4 relative w-full overflow-hidden">
        <div
          onScroll={handleScroll}
          className="w-full flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-[9%] py-3"
          style={{ 
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {plans.map((plan, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.div
                key={plan.id}
                onClick={(e) => {
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
                animate={{
                  scale: isActive ? 1.0 : 0.92,
                  opacity: isActive ? 1.0 : 0.90,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className={`w-[280px] h-[190px] snap-center flex-shrink-0 rounded-[24px] p-5 relative overflow-hidden border shadow-xl flex flex-col justify-between transition-all duration-300 ${
                  isActive 
                    ? 'border-tertiary shadow-[0_0_25px_rgba(233,195,73,0.32)] z-10' 
                    : 'border-white/8 z-0'
                }`}
                style={{
                  background: plan.colorTheme,
                }}
              >
                {/* Background watermark */}
                <div className="absolute -bottom-6 -right-6 opacity-3 text-white/5 pointer-events-none scale-150">
                  <ShieldCheck className="w-12 h-12" />
                </div>

                <div className="space-y-1.5 text-left">
                  {plan.recommended && (
                    <span className="inline-flex items-center gap-1 text-tertiary font-bold tracking-widest text-[8px] px-2 py-0.5 rounded bg-tertiary/10 border border-tertiary/20">
                      <Sparkles className="w-2 h-2" />
                      {plan.tag}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white/90 truncate leading-snug">
                    {plan.name}
                  </h3>
                  <div className="text-[10px] text-on-surface-variant/60 font-mono">
                    AI SCORE: <strong className="text-tertiary">{plan.fitScore} Fit</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-between items-end text-left">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-on-surface-variant/40 block">Coverage</span>
                    <span className="text-xs font-bold text-white">{plan.coverage.split(' ')[0]} Cr</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] uppercase tracking-wider text-on-surface-variant/40 block">Premium</span>
                    <span className="text-xs font-bold text-primary">{plan.premium.split('/')[0]}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Comparison Matrix Table - exactly 24px (mt-6) below carousel */}
      <section className="mt-6 space-y-4">
        <h2 className="font-headline-lg text-xs font-bold tracking-widest uppercase text-on-surface-variant/65 px-1 text-left">
          Comparison Matrix
        </h2>

        <div className="glass-card rounded-[24px] overflow-hidden border border-white/8 divide-y divide-white/8 shadow-2xl">
          {features.map((feat) => (
            <div 
              key={feat.key} 
              className="grid grid-cols-4 gap-4 items-center p-5 text-[11px] hover:bg-white/[0.01] transition-colors"
            >
              {/* Feature Title */}
              <div className="font-bold text-on-surface-variant/80 pr-2 leading-tight text-left">
                {feat.name}
              </div>

              {/* Providers values */}
              {plans.map((plan, i) => {
                const val = plan[feat.key as keyof PlanDetail] as string;
                const rating = feat.rating[i];
                const isActive = i === activeIndex;

                return (
                  <div 
                    key={plan.id}
                    className={`flex items-start gap-1.5 py-1.5 px-1 transition-all ${
                      isActive 
                        ? 'bg-tertiary/[0.02] border-l border-tertiary/10 font-medium text-white' 
                        : 'text-on-surface-variant/75'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${getIndicatorDot(rating)}`} />
                    
                    <div className="flex flex-col text-left">
                      <span className={`leading-relaxed ${getIndicatorColor(rating)}`}>
                        {val}
                      </span>
                      {feat.key === 'coverage' && plan.recommended && (
                        <span className="text-[8px] font-bold text-tertiary uppercase tracking-wider mt-0.5 flex items-center gap-0.5">
                          <Sparkles className="w-2 h-2" /> Global Shield
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* AI Recommendation Section at the bottom - exactly 24px (mt-6) below matrix */}
      <section className="mt-6 relative group select-none">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-tertiary via-primary to-tertiary-container rounded-[24px] blur opacity-25 group-hover:opacity-40 transition duration-1000 animate-pulse pointer-events-none" />
        
        <div className="relative glass-card rounded-[24px] p-5 border border-white/8 bg-gradient-to-br from-background to-surface-container-lowest flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-tertiary rounded-full animate-ping" />
              <span className="font-label-sm text-[10px] text-on-surface-variant/40 tracking-widest uppercase font-semibold">
                AI Recommendation
              </span>
            </div>
            
            <div>
              <div className="flex items-baseline gap-2.5">
                <h3 className="font-headline-md text-base font-extrabold text-white">
                  Aegis Global Elite
                </h3>
                <span className="text-[10px] text-tertiary font-bold px-2 py-0.5 rounded bg-tertiary/10 border border-tertiary/20">
                  98% Match
                </span>
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider mt-1">
                Best Overall Protection
              </p>
            </div>
            
            <p className="text-xs text-on-surface-variant/85 leading-relaxed max-w-lg">
              Protects against major medical expenses, offers the highest cashless hospital network, zero co-pay, and premium room eligibility.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelectPlan('Aegis Global Health Elite')}
            className="gold-glow-button px-6 h-[54px] rounded-[18px] text-[16px] font-semibold text-on-tertiary shadow-lg cursor-pointer flex-shrink-0 text-center flex items-center justify-center"
          >
            Choose This Plan
          </motion.button>
        </div>
      </section>

      {/* Footer disclaimer */}
      <section className="text-center pt-2 mt-4">
        <p className="text-[9px] font-label-sm text-on-surface-variant/40 tracking-wider uppercase leading-relaxed max-w-md mx-auto">
          Pricing based on HNW regional parameters for Maharashtra. All benefits subject to Aegis Smart Ledger terms.
        </p>
      </section>

      {/* Bottom Spacer to ensure policy comparison cards scroll clear of floating bottom nav */}
      <div className="h-28 flex-shrink-0" />
    </div>
  );
};
