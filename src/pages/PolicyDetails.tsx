import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePolicyStore, useAuthStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { PageHeader } from '../components/PageHeader';
import { 
  Heart, 
  Car, 
  Home as HomeIcon, 
  User, 
  ShieldCheck, 
  Download, 
  FileText, 
  RefreshCw, 
  AlertTriangle, 
  Phone, 
  Compass, 
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export const PolicyDetails: React.FC = () => {
  const navigate = useNavigate();
  const { policyId } = useParams<{ policyId: string }>();
  const { policies } = usePolicyStore();
  const { user } = useAuthStore();

  const policy = policies.find((p) => p.id === policyId);

  if (!policy) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-error animate-bounce mb-4" />
        <h2 className="text-xl font-bold text-white">Policy Not Found</h2>
        <p className="text-xs text-on-surface-variant/60 mt-1 max-w-xs">
          The requested asset ledger credentials could not be decrypted.
        </p>
        <button 
          onClick={() => navigate('/policies')}
          className="mt-6 px-5 py-2.5 bg-tertiary text-on-tertiary font-bold text-xs rounded-xl cursor-pointer"
        >
          Return to Wallet
        </button>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health': return <Heart className="w-5 h-5 text-tertiary" />;
      case 'Motor': return <Car className="w-5 h-5 text-tertiary" />;
      case 'Home': return <HomeIcon className="w-5 h-5 text-tertiary" />;
      case 'Life': return <User className="w-5 h-5 text-tertiary" />;
      default: return <Compass className="w-5 h-5 text-tertiary" />;
    }
  };

  const getCardGradient = (category: string) => {
    switch (category) {
      case 'Health': return 'linear-gradient(135deg, rgba(233,195,73,0.06) 0%, rgba(20,20,20,0.85) 100%)';
      case 'Motor': return 'linear-gradient(135deg, rgba(255,178,186,0.04) 0%, rgba(20,20,20,0.85) 100%)';
      case 'Home': return 'linear-gradient(135deg, rgba(233,195,73,0.04) 0%, rgba(20,20,20,0.85) 100%)';
      default: return 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(20,20,20,0.85) 100%)';
    }
  };

  const formatExpiry = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleDownloadPDF = () => {
    toast.loading('Decrypting and signing secure PDF...', { id: 'pdf-toast' });
    setTimeout(() => {
      toast.success('Signed policy PDF saved to local device ledger.', {
        id: 'pdf-toast',
        description: `Ref: ${policy.policyNumber}.pdf`
      });
    }, 1500);
  };

  const handleDialHotline = () => {
    toast.success(`Routing secure concierge call to +91 33 6111 8888...`);
  };

  const handleAutoRenewToggle = () => {
    toast.success('Policy auto-renew locked.', {
      description: 'Funds will be debited via IndusInd Vault on renewal date.'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative min-h-screen bg-background text-on-surface pt-3 pb-8 px-5 max-w-3xl mx-auto selection:bg-primary/20"
    >
      <PageHeader 
        title="Policy Details" 
        subtitle={`Audit ledger parameters for ${policy.title}`}
        onBack={() => navigate(-1)} 
      />

      <div className="mt-8 space-y-6">
        
        {/* Main Card Graphic Summary */}
        <GlassCard 
          hoverEffect={false} 
          className="rounded-[28px] p-6 border border-white/8 relative overflow-hidden"
          style={{ background: getCardGradient(policy.category) }}
        >
          {/* Subtle top gold glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-tertiary/30 to-transparent" />
          
          <div className="flex flex-col gap-6 text-left">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                  {getCategoryIcon(policy.category)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">{policy.title}</h2>
                  <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-mono mt-0.5">{policy.provider}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">ACTIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-white/5">
              <div>
                <span className="text-[9px] font-label-sm text-on-surface-variant/40 uppercase tracking-widest block">Coverage Amount</span>
                <span className="text-lg font-extrabold text-tertiary">
                  ₹{policy.sumInsured >= 10000000 
                    ? `${policy.sumInsured / 10000000} Crore` 
                    : `${policy.sumInsured / 100000} Lakh`}
                </span>
              </div>
              
              <div>
                <span className="text-[9px] font-label-sm text-on-surface-variant/40 uppercase tracking-widest block">Monthly Premium</span>
                <span className="text-lg font-extrabold text-white">₹{policy.premium.toLocaleString('en-IN')}/mo</span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="text-[9px] font-label-sm text-on-surface-variant/40 uppercase tracking-widest block">Renewal Date</span>
                <span className="text-lg font-extrabold text-on-surface-variant/80 font-mono">
                  {new Date(policy.renewalDate).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Ledger Details Grid */}
        <GlassCard hoverEffect={false} className="rounded-[24px] p-6 border border-white/8 text-left space-y-4">
          <h3 className="font-headline-md text-sm font-bold tracking-wide border-b border-white/5 pb-2 uppercase text-on-surface-variant/60">Policy Audit Records</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[9px] font-label-sm text-on-surface-variant/40 uppercase tracking-widest block">Policy Number</span>
              <span className="text-on-surface font-semibold font-mono text-sm">{policy.policyNumber}</span>
            </div>
            
            <div>
              <span className="text-[9px] font-label-sm text-on-surface-variant/40 uppercase tracking-widest block">Policy Holder</span>
              <span className="text-on-surface font-semibold text-sm">{user.name}</span>
            </div>

            <div>
              <span className="text-[9px] font-label-sm text-on-surface-variant/40 uppercase tracking-widest block">Renewal Term</span>
              <span className="text-on-surface font-semibold text-sm">Annual Auto-Debit</span>
            </div>

            <div>
              <span className="text-[9px] font-label-sm text-on-surface-variant/40 uppercase tracking-widest block">Regulatory Expiry</span>
              <span className="text-on-surface font-semibold font-mono text-sm">{formatExpiry(policy.renewalDate)}</span>
            </div>

            {/* Health insurance specific Details */}
            {policy.category === 'Health' && (
              <div className="col-span-2 pt-2 border-t border-white/5">
                <span className="text-[9px] font-label-sm text-on-surface-variant/40 uppercase tracking-widest block">Network Hospitals Count</span>
                <span className="text-tertiary font-bold text-sm">
                  {policy.details.networkHospitalsCount || 840}+ Partner Network Hospitals
                </span>
                <p className="text-[10px] text-on-surface-variant/50 mt-0.5">
                  100% Cashless support is pre-cleared across all certified facilities in Kolkata zone.
                </p>
              </div>
            )}

            {/* Home insurance specific Details */}
            {policy.category === 'Home' && policy.details.address && (
              <div className="col-span-2 pt-2 border-t border-white/5">
                <span className="text-[9px] font-label-sm text-on-surface-variant/40 uppercase tracking-widest block">Insured Asset Address</span>
                <span className="text-on-surface font-semibold text-sm">{policy.details.address}</span>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Coverage Specific Lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Covered Risks list */}
          <GlassCard hoverEffect={false} className="rounded-[24px] p-5 border border-white/8 text-left space-y-3">
            <h4 className="font-headline-md text-xs font-bold tracking-wider uppercase text-on-surface-variant/60 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Covered Benefits
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant/90 pl-1 list-none">
              {policy.details.coverage.map((cov, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500/80 mt-0.5 flex-shrink-0" />
                  <span>{cov}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Exclusive Perks list */}
          {policy.details.benefits && (
            <GlassCard hoverEffect={false} className="rounded-[24px] p-5 border border-white/8 text-left space-y-3">
              <h4 className="font-headline-md text-xs font-bold tracking-wider uppercase text-on-surface-variant/60 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-tertiary" />
                Exclusive Inclusions
              </h4>
              <ul className="space-y-2 text-xs text-on-surface-variant/90 pl-1 list-none">
                {policy.details.benefits.map((ben, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-tertiary/80 mt-0.5 flex-shrink-0" />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </div>

        {/* Dynamic Action Buttons Grid */}
        <section className="space-y-3 text-left">
          <h3 className="font-headline-md text-xs font-bold tracking-wider uppercase text-on-surface-variant/60 pl-1">Policy Controls</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            
            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              className="p-4 bg-white/2 border border-white/8 hover:border-tertiary/30 hover:bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
            >
              <Download className="w-5 h-5 text-tertiary" />
              <span className="text-on-surface-variant/80 text-[10px] uppercase tracking-wider">Download PDF</span>
            </button>

            {/* Raise Claim */}
            <button
              onClick={() => navigate('/claims')}
              className="p-4 bg-white/2 border border-white/8 hover:border-tertiary/30 hover:bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
            >
              <FileText className="w-5 h-5 text-tertiary" />
              <span className="text-on-surface-variant/80 text-[10px] uppercase tracking-wider">Raise Claim</span>
            </button>

            {/* Renew Policy */}
            <button
              onClick={handleAutoRenewToggle}
              className="p-4 bg-white/2 border border-white/8 hover:border-tertiary/30 hover:bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
            >
              <RefreshCw className="w-5 h-5 text-tertiary" />
              <span className="text-on-surface-variant/80 text-[10px] uppercase tracking-wider">Renew Policy</span>
            </button>

            {/* Emergency SOS */}
            <button
              onClick={() => navigate('/emergency')}
              className="p-4 bg-white/2 border border-white/8 hover:border-error/30 hover:bg-error-container/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer active:scale-[0.98] col-span-1"
            >
              <AlertTriangle className="w-5 h-5 text-error" />
              <span className="text-error/80 text-[10px] uppercase tracking-wider">Emergency SOS</span>
            </button>

            {/* Contact Support */}
            <button
              onClick={handleDialHotline}
              className="p-4 bg-white/2 border border-white/8 hover:border-tertiary/30 hover:bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer active:scale-[0.98] col-span-2 md:col-span-2"
            >
              <Phone className="w-5 h-5 text-tertiary" />
              <span className="text-on-surface-variant/80 text-[10px] uppercase tracking-wider">Contact support</span>
            </button>

          </div>
        </section>

      </div>
      {/* Bottom Spacer to ensure policy details scroll clear of floating bottom nav */}
      <div className="h-28 flex-shrink-0" />
    </motion.div>
  );
};
