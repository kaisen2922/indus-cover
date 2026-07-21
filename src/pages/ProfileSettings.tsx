import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Download, 
  LogOut, 
  HelpCircle, 
  ShieldCheck,
  Eye,
  CreditCard,
  Key,
  Users,
  Gift,
  Bell,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

export const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, rememberDevice, biometricsEnabled, toggleRememberDevice, toggleBiometrics, logout } = useAuthStore();

  // Collapsible States
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out securely. Key credentials erased.');
    navigate('/');
  };

  const handleViewDocument = (docName: string) => {
    toast.info(`Retrieving ledger reference for ${docName}...`, {
      description: 'Signing cryptographic credentials...'
    });
  };

  const handleDownloadDocument = (docName: string) => {
    toast.loading(`Downloading verified copy of ${docName}...`, { id: 'doc-toast' });
    setTimeout(() => {
      toast.success(`${docName} saved to local device vault.`, { id: 'doc-toast' });
    }, 1500);
  };

  const documents = [
    { name: 'Aadhaar Card (UIDAI)', id: user.aadhaarNumber },
    { name: 'PAN Card (Income Tax)', id: user.panNumber },
    { name: 'Driving License', id: user.drivingLicense },
    { name: 'FASTag ID', id: user.fastagId },
    { name: 'Vehicle Registration Certificate (RC)', id: user.vehicleRC },
  ];

  return (
    <div className="relative min-h-screen bg-background text-on-surface pt-3 pb-8 px-5 max-w-4xl mx-auto selection:bg-primary/20">
      
      {/* Reusable PageHeader - Title & Back arrow aligned, exactly 24px below app header wrapper */}
      <PageHeader 
        title="Profile & Settings" 
        subtitle="Secure biometrics vault, ledger documents, and account credentials." 
        onBack={() => navigate(-1)} 
      />

      {/* Profile Card: exactly 24px (mt-6) below subtitle */}
      <section className="mt-6">
        <GlassCard hoverEffect={false} className="border-white/[0.08] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/40 flex-shrink-0 flex items-center justify-center bg-white/[0.04]">
                {user.avatar ? (
                  <img className="w-full h-full object-cover" src={user.avatar} alt={user.name} />
                ) : (
                  <span className="font-bold text-sm tracking-wider text-tertiary">
                    {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-left">
                <h2 className="text-[20px] font-semibold text-white tracking-tight">{user.name}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-tertiary font-bold tracking-wider uppercase">KYC Verified</span>
                  <span className="text-[10px] text-on-surface-variant/50 font-bold uppercase tracking-widest">• Signature Member</span>
                </div>
              </div>
            </div>

            {/* Collapsible Trigger */}
            <button
              onClick={() => setPersonalInfoOpen(!personalInfoOpen)}
              className="flex items-center gap-1.5 px-3 h-8 border border-white/[0.08] hover:bg-white/5 rounded-[16px] text-[10px] font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer transition-all active:scale-[0.98]"
            >
              Contact
              <motion.div
                animate={{ rotate: personalInfoOpen ? 180 : 0 }}
                transition={{ duration: 0.18 }}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.div>
            </button>
          </div>

          {/* Collapsible Personal Info Section */}
          <AnimatePresence>
            {personalInfoOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-3.5 border-t border-white/8 grid grid-cols-1 gap-2 text-xs text-on-surface-variant/90 leading-relaxed">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{user.address}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </section>

      {/* 4 Stats Cards */}
      <section className="mt-5 grid grid-cols-2 gap-3">
        <GlassCard hoverEffect={true} className="p-5 border-white/8 flex flex-col justify-between h-24">
          <span className="text-[8px] font-label-sm text-on-surface-variant/45 uppercase tracking-widest">Protection</span>
          <p className="text-base font-extrabold text-tertiary mt-1">92%</p>
          <span className="text-[8px] text-on-surface-variant/50">Optimal Score</span>
        </GlassCard>

        <GlassCard hoverEffect={true} className="p-5 border-white/8 flex flex-col justify-between h-24">
          <span className="text-[8px] font-label-sm text-on-surface-variant/45 uppercase tracking-widest">Policies</span>
          <p className="text-base font-extrabold text-white mt-1">4 Active</p>
          <span className="text-[8px] text-on-surface-variant/50">All Wallet-stacked</span>
        </GlassCard>

        <GlassCard hoverEffect={true} className="p-5 border-white/8 flex flex-col justify-between h-24">
          <span className="text-[8px] font-label-sm text-on-surface-variant/45 uppercase tracking-widest">Claims</span>
          <p className="text-base font-extrabold text-white mt-1">2 Filed</p>
          <span className="text-[8px] text-on-surface-variant/50">1 Fully Settled</span>
        </GlassCard>

        <GlassCard hoverEffect={true} className="p-5 border-white/8 flex flex-col justify-between h-24">
          <span className="text-[8px] font-label-sm text-on-surface-variant/45 uppercase tracking-widest">Aegis Coins</span>
          <p className="text-base font-extrabold text-primary mt-1">850</p>
          <span className="text-[8px] text-on-surface-variant/50">Next Reward: 1k</span>
        </GlassCard>
      </section>

      {/* Quick Action Grid - exactly 24px (mt-6) below stats */}
      <section className="mt-6 space-y-4">
        <h2 className="font-headline-lg text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 px-1 text-left">
          Vault & Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {/* Action 1: Documents */}
          <GlassCard
            onClick={() => setShowDocsModal(true)}
            hoverEffect={true}
            className="p-4 border-white/8 flex flex-col justify-between cursor-pointer group hover:border-primary/30 transition-all rounded-[20px] min-h-[148px]"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform flex-shrink-0">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div className="text-left mt-3">
              <h4 className="text-[13px] font-bold text-white group-hover:text-primary transition-colors leading-snug">Encrypted Vault</h4>
              <p className="text-[11px] text-on-surface-variant/70 leading-snug mt-1">
                Manage Aadhaar, PAN, DL, FASTag & Vehicle RC certs.
              </p>
            </div>
          </GlassCard>

          {/* Action 2: Payments */}
          <GlassCard
            onClick={() => toast.info('Accessing premium transactional auto-pay ledger...')}
            hoverEffect={true}
            className="p-4 border-white/8 flex flex-col justify-between cursor-pointer group hover:border-primary/30 transition-all rounded-[20px] min-h-[148px]"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform flex-shrink-0">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
            <div className="text-left mt-3">
              <h4 className="text-[13px] font-bold text-white group-hover:text-primary transition-colors leading-snug">Sovereign Payments</h4>
              <p className="text-[11px] text-on-surface-variant/70 leading-snug mt-1">
                Review payment history & manage auto-pay mandates.
              </p>
            </div>
          </GlassCard>

          {/* Action 3: Security */}
          <GlassCard
            onClick={() => setShowSecurityModal(true)}
            hoverEffect={true}
            className="p-4 border-white/8 flex flex-col justify-between cursor-pointer group hover:border-primary/30 transition-all rounded-[20px] min-h-[148px]"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform flex-shrink-0">
              <Key className="w-4.5 h-4.5" />
            </div>
            <div className="text-left mt-3">
              <h4 className="text-[13px] font-bold text-white group-hover:text-primary transition-colors leading-snug">Biometrics & Keys</h4>
              <p className="text-[11px] text-on-surface-variant/70 leading-snug mt-1">
                Manage FaceID, TouchID & dual-key OTP security.
              </p>
            </div>
          </GlassCard>

          {/* Action 4: Dependents */}
          <GlassCard
            onClick={() => navigate('/family')}
            hoverEffect={true}
            className="p-4 border-white/8 flex flex-col justify-between cursor-pointer group hover:border-primary/30 transition-all rounded-[20px] min-h-[148px]"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform flex-shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div className="text-left mt-3">
              <h4 className="text-[13px] font-bold text-white group-hover:text-primary transition-colors leading-snug">Dependents Vault</h4>
              <p className="text-[11px] text-on-surface-variant/70 leading-snug mt-1">
                Inspect beneficiary structures & family coverages.
              </p>
            </div>
          </GlassCard>

          {/* Action 5: Rewards */}
          <GlassCard
            onClick={() => navigate('/rewards')}
            hoverEffect={true}
            className="p-4 border-white/8 flex flex-col justify-between cursor-pointer group hover:border-tertiary/30 transition-all rounded-[20px] min-h-[148px]"
          >
            <div className="w-9 h-9 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary group-hover:scale-105 transition-transform flex-shrink-0">
              <Gift className="w-4.5 h-4.5" />
            </div>
            <div className="text-left mt-3">
              <h4 className="text-[13px] font-bold text-white group-hover:text-tertiary transition-colors leading-snug">Aegis Wellness</h4>
              <p className="text-[11px] text-on-surface-variant/70 leading-snug mt-1">
                Track active step counters & redeem reward coins.
              </p>
            </div>
          </GlassCard>

          {/* Action 6: Notifications */}
          <GlassCard
            onClick={() => navigate('/notifications')}
            hoverEffect={true}
            className="p-4 border-white/8 flex flex-col justify-between cursor-pointer group hover:border-primary/30 transition-all rounded-[20px] min-h-[148px]"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform flex-shrink-0">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <div className="text-left mt-3">
              <h4 className="text-[13px] font-bold text-white group-hover:text-primary transition-colors leading-snug">Audit Feed</h4>
              <p className="text-[11px] text-on-surface-variant/70 leading-snug mt-1">
                Timeline of risk alerts, claim updates & receipts.
              </p>
            </div>
          </GlassCard>

          {/* Action 7: Support */}
          <GlassCard
            onClick={() => toast.success('Concierge hotline dialing...')}
            hoverEffect={true}
            className="p-4 border-white/8 flex flex-col justify-between cursor-pointer group hover:border-primary/30 transition-all rounded-[20px] min-h-[148px]"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform flex-shrink-0">
              <HelpCircle className="w-4.5 h-4.5" />
            </div>
            <div className="text-left mt-3">
              <h4 className="text-[13px] font-bold text-white group-hover:text-primary transition-colors leading-snug">Concierge Support</h4>
              <p className="text-[11px] text-on-surface-variant/70 leading-snug mt-1">
                24/7 dedicated HNW phone hotline & chat support.
              </p>
            </div>
          </GlassCard>

          {/* Action 8: Settings (Log out) */}
          <GlassCard
            onClick={handleLogout}
            hoverEffect={true}
            className="p-4 border-error/20 hover:bg-error-container/10 flex flex-col justify-between cursor-pointer group transition-all rounded-[20px] min-h-[148px]"
          >
            <div className="w-9 h-9 rounded-xl bg-error/10 border border-error/20 flex items-center justify-center text-error group-hover:scale-105 transition-transform flex-shrink-0">
              <LogOut className="w-4.5 h-4.5" />
            </div>
            <div className="text-left mt-3">
              <h4 className="text-[13px] font-bold text-error leading-snug">Secure Lockout</h4>
              <p className="text-[11px] text-on-surface-variant/70 leading-snug mt-1">
                Log out & purge biometric keys, hashes & sessions.
              </p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Encrypted Vault Modal */}
      <AnimatePresence>
        {showDocsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 z-50 overflow-y-auto no-scrollbar flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              className="w-full max-w-lg bg-surface-container-low border border-white/8 rounded-[28px] p-6 space-y-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-tertiary" />
                  Encrypted Documents Vault
                </h3>
                <button
                  onClick={() => setShowDocsModal(false)}
                  className="px-3 py-1.5 border border-white/8 hover:bg-white/5 rounded-xl text-[10px] font-bold text-on-surface-variant uppercase cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="space-y-3">
                {documents.map((doc, idx) => (
                  <div key={idx} className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white/90">{doc.name}</h4>
                      <p className="text-[9px] text-on-surface-variant/50 font-mono mt-0.5">{doc.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDocument(doc.name)}
                        className="p-2 border border-white/8 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownloadDocument(doc.name)}
                        className="p-2 border border-white/8 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Configurations Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 z-50 overflow-y-auto no-scrollbar flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              className="w-full max-w-lg bg-surface-container-low border border-white/8 rounded-[28px] p-6 space-y-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-tertiary" />
                  Security Credentials
                </h3>
                <button
                  onClick={() => setShowSecurityModal(false)}
                  className="px-3 py-1.5 border border-white/8 hover:bg-white/5 rounded-xl text-[10px] font-bold text-on-surface-variant uppercase cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="divide-y divide-white/5 text-xs space-y-4">
                {/* Remember Device */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="space-y-0.5 pr-6">
                    <h4 className="font-bold text-on-surface">Remember This Device</h4>
                    <p className="text-[10px] text-on-surface-variant/50 leading-relaxed">Save encryption key hashes locally to skip SMS validations.</p>
                  </div>
                  <button
                    onClick={toggleRememberDevice}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer flex-shrink-0 ${
                      rememberDevice ? 'bg-primary' : 'bg-white/10'
                    }`}
                  >
                    <div 
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                        rememberDevice ? 'translate-x-5' : 'translate-x-0'
                      }`} 
                    />
                  </button>
                </div>

                {/* Biometrics */}
                <div className="pt-4 flex items-center justify-between">
                  <div className="space-y-0.5 pr-6">
                    <h4 className="font-bold text-on-surface">Secure Biometrics Vault</h4>
                    <p className="text-[10px] text-on-surface-variant/50 leading-relaxed">Use Face ID / Touch ID signatures for rapid claims verification.</p>
                  </div>
                  <button
                    onClick={toggleBiometrics}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer flex-shrink-0 ${
                      biometricsEnabled ? 'bg-primary' : 'bg-white/10'
                    }`}
                  >
                    <div 
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                        biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`} 
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Spacer to ensure profile quick action cards scroll clear of floating bottom nav */}
      <div className="h-28 flex-shrink-0" />
    </div>
  );
};
