import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePolicyStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { PageHeader } from '../components/PageHeader';
import { 
  Heart, 
  Car, 
  Home as HomeIcon, 
  User, 
  ChevronRight,
  Compass
} from 'lucide-react';

export const MyActivePolicies: React.FC = () => {
  const navigate = useNavigate();
  const { policies } = usePolicyStore();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health': return <Heart className="w-5 h-5 text-tertiary" />;
      case 'Motor': return <Car className="w-5 h-5 text-tertiary" />;
      case 'Home': return <HomeIcon className="w-5 h-5 text-tertiary" />;
      case 'Life': return <User className="w-5 h-5 text-tertiary" />;
      default: return <Compass className="w-5 h-5 text-tertiary" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'Health': return 'Health Insurance';
      case 'Motor': return 'Motor Insurance';
      case 'Home': return 'Home Insurance';
      case 'Life': return 'Life Insurance';
      default: return `${category} Insurance`;
    }
  };

  const formatExpiry = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // We only display active policies
  const activePolicies = policies.filter(p => p.status === 'ACTIVE');

  // Page animation settings
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 18 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative min-h-screen bg-background text-on-surface pt-3 pb-8 px-5 max-w-4xl mx-auto selection:bg-primary/20"
    >
      <PageHeader 
        title="My Active Policies" 
        subtitle="Manage and monitor all your active insurance policies." 
        onBack={() => navigate(-1)} 
      />

      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-6 space-y-4"
      >
        {activePolicies.map((policy) => (
          <motion.div 
            key={policy.id} 
            variants={itemVariants}
            onClick={() => navigate(`/policy-details/${policy.id}`)}
            className="cursor-pointer group"
          >
            <GlassCard 
              hoverEffect={true} 
              className="rounded-[24px] p-5 border border-white/[0.08] bg-white/[0.01] hover:border-tertiary/30 hover:bg-white/[0.03] transition-all duration-250 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {/* Category Icon */}
                  <div className="w-11 h-11 rounded-[14px] bg-white/5 border border-white/[0.08] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                    {getCategoryIcon(policy.category)}
                  </div>
                  
                  {/* Name and Category */}
                  <div className="text-left">
                    <h3 className="text-[20px] font-semibold text-white tracking-tight group-hover:text-tertiary transition-colors">
                      {policy.title}
                    </h3>
                    <p className="text-[13px] text-on-surface-variant/60 uppercase tracking-wider font-semibold mt-0.5">
                      {getCategoryLabel(policy.category)}
                    </p>
                  </div>
                </div>

                {/* Active Status Badge */}
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">ACTIVE</span>
                </div>
              </div>

              {/* Stats Footer Section */}
              <div className="mt-5 pt-3.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-5 text-xs text-left">
                  <div>
                    <span className="text-[10px] font-label-sm text-on-surface-variant/40 uppercase tracking-widest block">Coverage</span>
                    <span className="text-tertiary font-bold text-[14px]">
                      ₹{policy.sumInsured >= 10000000 
                        ? `${policy.sumInsured / 10000000} Crore` 
                        : `${policy.sumInsured / 100000} Lakh`}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-label-sm text-on-surface-variant/40 uppercase tracking-widest block">Premium</span>
                    <span className="text-on-surface font-semibold text-[14px]">₹{policy.premium.toLocaleString('en-IN')}/mo</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-label-sm text-on-surface-variant/40 uppercase tracking-widest block">Expiry</span>
                    <span className="text-on-surface-variant/80 font-mono text-[13px]">{formatExpiry(policy.renewalDate)}</span>
                  </div>
                </div>

                {/* Chevron Navigation Button */}
                <div className="flex items-center gap-2 text-xs font-semibold text-tertiary group-hover:text-tertiary transition-colors">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/policy-details/${policy.id}`);
                    }}
                    className="px-3.5 h-9 bg-white/5 border border-white/[0.08] group-hover:border-tertiary/30 hover:bg-tertiary hover:text-on-tertiary rounded-[16px] transition-all duration-200 active:scale-[0.98] cursor-pointer text-[11px] font-bold uppercase tracking-wider flex items-center justify-center"
                  >
                    View Details
                  </button>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.section>
    </motion.div>
  );
};
