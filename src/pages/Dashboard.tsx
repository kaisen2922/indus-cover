import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore, usePolicyStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { 
  Plus, 
  FileText, 
  AlertTriangle, 
  RefreshCw, 
  ChevronRight, 
  Heart, 
  Car, 
  Home as HomeIcon, 
  Plane, 
  Bot,
  Compass
} from 'lucide-react';
import { toast } from 'sonner';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { policies } = usePolicyStore();

  // Radius for SVG circle: 100, Circumference: 2 * PI * r = 628

  const handleStartSimulation = () => {
    toast.info('Simulating multi-region security hedge...', { duration: 2500 });
    setTimeout(() => {
      toast.success('Hedge evaluation complete. Portfolio risk reduced.', {
        description: 'New recommended travel policy is active.',
      });
      navigate('/policies');
    }, 2000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Maps policy category to React icon
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Health': return <Heart className="w-6 h-6" />;
      case 'Motor': return <Car className="w-6 h-6" />;
      case 'Home': return <HomeIcon className="w-6 h-6" />;
      case 'Travel': return <Plane className="w-6 h-6" />;
      default: return <Compass className="w-6 h-6" />;
    }
  };


  return (
    <div className="relative min-h-screen bg-background text-on-surface pt-3 pb-8 px-5 max-w-6xl mx-auto space-y-5 selection:bg-primary/20">
      
      {/* Dynamic User Greetings */}
      <section className="flex flex-col gap-y-4 items-center">
        
        {/* Left Side: Welcome Info */}
        <div className="w-full flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col text-left"
          >
            <h1 className="text-[28px] font-bold tracking-tight leading-[34px] text-white">
              {getGreeting()} <span className="text-primary">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-[14px] leading-[20px] text-on-surface-variant/80 max-w-lg mt-1.5">
              Your sovereign assets are secure under the IndusInd Bank Vault. AI Copilot suggests reviewing your property coverage.
            </p>
          </motion.div>

          {/* Quick Actions Grid (2x2) */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08, ease: 'easeOut' }}
            className="grid grid-cols-2 gap-2.5 mt-3.5"
          >
            <button 
              onClick={() => navigate('/buy')}
              className="button-gradient px-3.5 h-11 rounded-[16px] font-semibold text-[13px] text-white flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Buy Protection
            </button>
            <button 
              onClick={() => navigate('/claims')}
              className="glass-card px-3.5 h-11 rounded-[16px] font-semibold text-[13px] text-on-surface/90 flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              File Claim
            </button>
            <button 
              onClick={() => navigate('/emergency')}
              className="glass-card px-3.5 h-11 rounded-[16px] font-semibold text-[13px] text-error flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-[0.98] transition-all border-error/20 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 animate-pulse" />
              Emergency SOS
            </button>
            <button 
              onClick={() => {
                toast.success('Scanning active policies for auto-renewal...', { id: 'renew-toast' });
                setTimeout(() => toast.success('All policies are locked with auto-renewal.', { id: 'renew-toast' }), 1200);
              }}
              className="glass-card px-3.5 h-11 rounded-[16px] font-semibold text-[13px] text-on-surface/90 flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Renew Auto
            </button>
          </motion.div>
        </div>

        {/* Right Side: Protection Score Circular Progress SVG */}
        <div className="w-full flex justify-center mt-1">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.1 }}
            className="relative w-56 h-56 flex items-center justify-center glass-card rounded-full border-white/5"
          >
            {/* Ambient gold glow under score */}
            <div className="absolute inset-8 bg-tertiary/5 rounded-full blur-2xl pointer-events-none" />

            <svg className="w-48 h-48">
              {/* Background Track Circle */}
              <circle
                className="text-white/5"
                cx="96"
                cy="96"
                r="82"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="10"
              />
              {/* Animated Progress Circle */}
              <circle
                className="text-primary progress-ring__circle"
                cx="96"
                cy="96"
                r="82"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="515"
                strokeDashoffset={515 - (515 * user.protectionScore) / 100}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Content Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest">Vault Shield</span>
              <div className="flex items-baseline gap-1 my-0.5">
                <span className="text-4xl font-extrabold text-white tracking-tight">{user.protectionScore}</span>
                <span className="text-xs text-on-surface-variant/40">/100</span>
              </div>
              <span className="text-xs font-semibold text-primary">Optimal Coverage</span>

              <div className="mt-2 px-2.5 py-0.5 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                <span className="font-label-sm text-[10px] text-tertiary tracking-wider font-semibold">AI Monitoring</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Protection Cards */}
      <section className="space-y-3">
        <h2 className="text-[28px] font-semibold tracking-tight text-white/90">Active Protection Portfolios</h2>
        <div className="grid grid-cols-2 gap-3">
          {policies.slice(0, 4).map((policy, idx) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.04 * idx, ease: 'easeOut' }}
              onClick={() => navigate('/policies')}
              className="group"
            >
              <GlassCard 
                hoverEffect={true} 
                className="h-full flex flex-col justify-between p-4 rounded-[24px] border-white/[0.08] group-hover:border-primary/40"
              >
                <div>
                  <div className="w-10 h-10 rounded-[14px] bg-white/5 flex items-center justify-center mb-3 transition-transform group-hover:scale-105 text-primary">
                    {getCategoryIcon(policy.category)}
                  </div>
                  <h3 className="text-[20px] font-semibold text-white group-hover:text-primary transition-colors">{policy.category}</h3>
                  <p className="text-[13px] text-on-surface-variant/70 mt-1 uppercase tracking-wide truncate">
                    {policy.category === 'Motor' ? 'Porsche Taycan' : policy.category === 'Home' ? 'Worli Penthouse' : 'Premium Coverage'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="text-tertiary font-bold text-[13px]">₹{(policy.sumInsured / 100000).toLocaleString('en-IN')}L Cover</span>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activity & AI Insights */}
      <section className="grid grid-cols-1 gap-6">
        
        {/* Recent Activities */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <h2 className="text-[28px] font-semibold tracking-tight text-white/90">Sovereign Audit Log</h2>
            <button 
              onClick={() => navigate('/notifications')}
              className="font-label-md text-xs text-primary hover:underline cursor-pointer"
            >
              View Timeline
            </button>
          </div>
          <div className="glass-card rounded-[24px] overflow-hidden border-white/[0.08] divide-y divide-white/5">
            {/* Log Item 1 */}
            <div className="p-4 flex items-start gap-3.5 hover:bg-white/[0.02] transition-colors">
              <div className="w-1.5 h-9 bg-primary rounded-full mt-1 flex-shrink-0" />
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <p className="text-[16px] font-semibold text-white">Premium Payment Verified</p>
                  <span className="text-[13px] text-on-surface-variant/50">2h ago</span>
                </div>
                <p className="text-[13px] text-on-surface-variant/80 mt-1 leading-normal">₹4,200 premium debited for Global Health Elite. Cover locked.</p>
              </div>
            </div>
            {/* Log Item 2 */}
            <div className="p-4 flex items-start gap-3.5 hover:bg-white/[0.02] transition-colors">
              <div className="w-1.5 h-9 bg-tertiary rounded-full mt-1 flex-shrink-0" />
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <p className="text-[16px] font-semibold text-white">AI Risk Index Evaluation</p>
                  <span className="text-[13px] text-on-surface-variant/50">Yesterday</span>
                </div>
                <p className="text-[13px] text-on-surface-variant/80 mt-1 leading-normal">Real estate pricing indices processed for Worli property. Coverage gap alerted (+₹1 Cr recommended).</p>
              </div>
            </div>
            {/* Log Item 3 */}
            <div className="p-4 flex items-start gap-3.5 hover:bg-white/[0.02] transition-colors">
              <div className="w-1.5 h-9 bg-emerald-500 rounded-full mt-1 flex-shrink-0" />
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <p className="text-[16px] font-semibold text-white">Claim Settlement Finalized</p>
                  <span className="text-[13px] text-on-surface-variant/50">Jul 09</span>
                </div>
                <p className="text-[13px] text-on-surface-variant/80 mt-1 leading-normal">Bumper replacement claim CLM-MTR-2026-9801 settled for ₹1,20,000 cashlessly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Copilot Mini Card */}
        <div className="space-y-3">
          <h2 className="text-[28px] font-semibold tracking-tight text-white/90">AI Assistant</h2>
          <div className="glass-card rounded-[24px] p-5 relative overflow-hidden flex flex-col justify-between border-tertiary/20">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-tertiary/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="w-10 h-10 rounded-[14px] bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/20">
                <Bot className="w-5 h-5" />
              </div>
              <p className="text-[15px] italic text-tertiary-fixed-dim leading-relaxed">
                "Joydip, I've noticed you have property assets in high-growth Worli zones. Would you like me to simulate a multi-region protection hedge evaluation?"
              </p>
            </div>
            <div className="pt-4 grid grid-cols-2 gap-3 relative z-10">
              <button 
                onClick={handleStartSimulation}
                className="h-11 rounded-[16px] bg-tertiary text-on-tertiary font-semibold text-[13px] hover:bg-tertiary-fixed transition-colors active:scale-[0.98] cursor-pointer"
              >
                Start Simulation
              </button>
              <button 
                onClick={() => toast.success('Assistant insight dismissed.')}
                className="h-11 rounded-[16px] border border-white/10 text-on-surface-variant hover:bg-white/5 text-[13px] transition-colors active:scale-[0.98] cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Spacer to ensure full scroll clearance above floating bottom nav */}
      <div className="h-24 flex-shrink-0" />
    </div>
  );
};
