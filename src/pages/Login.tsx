import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useStore';
import { ArrowRight, User, Lock, Phone, Key, Fingerprint, Scan, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { AppIcon, BrandWordmark } from '../components/Branding';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, sendOtp, verifyOtp, phone, setPhone } = useAuthStore();

  const [loginMode, setLoginMode] = useState<'credentials' | 'otp'>('credentials');
  const [accessId, setAccessId] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState<'Face' | 'Touch' | null>(null);

  // Countdown timer for OTP
  useEffect(() => {
    if (!otpSent || countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [otpSent, countdown]);

  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    toast.loading('Initializing secure OTP tunnel...', { id: 'otp-send' });
    const success = await sendOtp();
    if (success) {
      setOtpSent(true);
      setCountdown(60);
      toast.success('Secure OTP sent to +91 ' + cleanPhone.slice(-10), { id: 'otp-send' });
    } else {
      toast.error('Secure channel failed. Try again.', { id: 'otp-send' });
    }
  };

  const handleVerifyOtp = () => {
    if (otpCode.length !== 6) {
      toast.error('Security OTP must be 6 digits.');
      return;
    }

    const success = verifyOtp(otpCode);
    if (success) {
      toast.success('Authentication authorized.');
      navigate('/dashboard');
    } else {
      toast.error('Authorization failed. Invalid key.');
    }
  };

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessId || !encryptionKey) {
      toast.error('Please fill in both security fields.');
      return;
    }
    
    login();
    toast.success('Authentication authorized.');
    navigate('/dashboard');
  };

  const triggerBiometricScan = (type: 'Face' | 'Touch') => {
    setScanType(type);
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      login();
      toast.success(`${type} ID Authentication Approved.`);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4 overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="ambient-glow -top-48 -left-48 animate-subtle-pulse" />
      <div className="ambient-glow -bottom-48 -right-48 animate-subtle-pulse delay-1000" />

      {/* Main Container */}
      <main className="w-full max-w-md z-10 space-y-6">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-3 glass-card rounded-[24px] border border-white/8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary-container/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <AppIcon size={32} />
          </div>
          <BrandWordmark size="lg" className="mb-2" />
          <p className="font-body-md text-on-surface-variant/70 text-[15px]">
            Sovereign Intelligence for Secure Wealth.
          </p>
        </div>

        {/* Card Box */}
        <div className="glass-card rounded-[24px] p-5 space-y-4 relative border border-white/8 shadow-2xl text-left">
          
          {/* AI Active Dot */}
          <div className="absolute top-6 right-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary breathing-dot" />
            <span className="font-label-sm text-[9px] text-tertiary uppercase tracking-widest font-semibold">AI Secured</span>
          </div>

          <AnimatePresence mode="wait">
            {loginMode === 'credentials' ? (
              /* Access ID + Encryption Key Login */
              <motion.form
                key="credentials"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleCredentialSubmit}
                className="space-y-4 pt-4"
              >
                <div className="relative group space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant/60 block uppercase tracking-wider transition-colors group-focus-within:text-tertiary">
                    Access ID
                  </label>
                  <div className="relative border-b-2 border-outline-variant/40 focus-within:border-tertiary transition-colors">
                    <input
                      type="text"
                      value={accessId}
                      onChange={(e) => setAccessId(e.target.value)}
                      placeholder="Enter your identifier"
                      className="w-full bg-transparent outline-none py-3 font-body-md text-xs text-on-surface placeholder:text-on-surface-variant/20"
                    />
                    <User className="absolute right-0 top-3 w-5 h-5 text-on-surface-variant/40" />
                  </div>
                </div>

                <div className="relative group space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant/60 block uppercase tracking-wider transition-colors group-focus-within:text-tertiary">
                    Encryption Key
                  </label>
                  <div className="relative border-b-2 border-outline-variant/40 focus-within:border-tertiary transition-colors">
                    <input
                      type="password"
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent outline-none py-3 font-body-md text-xs text-on-surface placeholder:text-on-surface-variant/20"
                    />
                    <Lock className="absolute right-0 top-3 w-5 h-5 text-on-surface-variant/40" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-[54px] rounded-[18px] text-[16px] font-semibold text-white shadow-lg cursor-pointer bg-gradient-to-r from-primary-container to-primary hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Authenticate Securely
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              /* OTP Indian Mobile Login */
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4 pt-4"
              >
                {!otpSent ? (
                  <div className="space-y-4">
                    <div className="relative group space-y-1">
                      <label className="text-[11px] font-bold text-on-surface-variant/60 block uppercase tracking-wider transition-colors group-focus-within:text-tertiary">
                        Mobile Number
                      </label>
                      <div className="flex items-center border-b-2 border-outline-variant/40 focus-within:border-tertiary transition-colors">
                        <span className="font-body-md text-on-surface-variant mr-2">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full bg-transparent outline-none py-3 font-body-md text-xs text-on-surface placeholder:text-on-surface-variant/20"
                        />
                        <Phone className="w-5 h-5 text-on-surface-variant/40" />
                      </div>
                    </div>

                    <button
                      onClick={handleSendOtp}
                      className="w-full h-[54px] rounded-[18px] text-[16px] font-semibold text-white shadow-lg cursor-pointer bg-gradient-to-r from-primary-container to-primary hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      Send Authentication OTP
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative group space-y-1">
                      <label className="text-[11px] font-bold text-on-surface-variant/60 block uppercase tracking-wider transition-colors group-focus-within:text-tertiary">
                        Enter 6-Digit OTP
                      </label>
                      <div className="relative border-b-2 border-outline-variant/40 focus-within:border-tertiary transition-colors">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="123456"
                          className="w-full bg-transparent outline-none py-3 font-body-md text-center text-xs tracking-[1em] text-on-surface placeholder:text-on-surface-variant/20"
                        />
                        <Key className="absolute right-0 top-3 w-5 h-5 text-on-surface-variant/40" />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-on-surface-variant/60 pt-1">
                        <span>Awaiting Secure SMS...</span>
                        {countdown > 0 ? (
                          <span>Resend in {countdown}s</span>
                        ) : (
                          <button
                            onClick={handleSendOtp}
                            className="text-tertiary hover:underline cursor-pointer"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      className="gold-glow-button w-full h-[54px] rounded-[18px] text-[16px] font-semibold text-on-tertiary shadow-lg cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      Verify Secure Token
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="font-label-sm text-[9px] text-on-surface-variant/40 tracking-widest uppercase">Biometric Vault</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          {/* Quick Access Toggles */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => triggerBiometricScan('Face')}
              className="glass-card h-16 rounded-[24px] border border-white/8 flex flex-col items-center justify-center hover:bg-white/10 transition-all cursor-pointer group p-1"
            >
              <Scan className="w-5 h-5 text-on-surface-variant group-hover:text-tertiary transition-colors mb-1" />
              <span className="font-label-sm text-[9px] text-on-surface-variant/60">Face ID</span>
            </button>
            
            <button
              onClick={() => triggerBiometricScan('Touch')}
              className="glass-card h-16 rounded-[24px] border border-white/8 flex flex-col items-center justify-center hover:bg-white/10 transition-all cursor-pointer group p-1"
            >
              <Fingerprint className="w-5 h-5 text-on-surface-variant group-hover:text-tertiary transition-colors mb-1" />
              <span className="font-label-sm text-[9px] text-on-surface-variant/60">Touch ID</span>
            </button>

            <button
              onClick={() => {
                setOtpSent(false);
                setLoginMode(loginMode === 'credentials' ? 'otp' : 'credentials');
              }}
              className="glass-card h-16 rounded-[24px] border border-white/8 flex flex-col items-center justify-center hover:bg-white/10 transition-all cursor-pointer group p-1"
            >
              <Key className="w-5 h-5 text-on-surface-variant group-hover:text-tertiary transition-colors mb-1" />
              <span className="font-label-sm text-[9px] text-on-surface-variant/60">
                {loginMode === 'credentials' ? 'OTP SMS' : 'ID Key'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <footer className="flex flex-col items-center gap-4 text-xs">
          <div className="flex gap-6">
            <a href="#freeze" className="font-label-sm text-on-surface-variant/80 hover:text-primary transition-colors">Emergency Freeze</a>
            <a href="#concierge" className="font-label-sm text-on-surface-variant/80 hover:text-primary transition-colors">Concierge Support</a>
          </div>
          <p className="font-label-sm text-on-surface-variant/40 mt-4 flex items-center gap-2">
            Verifying environment integrity... 
            <span className="text-tertiary font-bold tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SAFE
            </span>
          </p>
        </footer>
      </main>

      {/* Biometric Scanning Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-card rounded-[24px] p-5 flex flex-col items-center max-w-xs text-center border border-white/8"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-tertiary/10 blur-xl rounded-full scale-150 animate-pulse" />
                {scanType === 'Face' ? (
                  <Scan className="w-16 h-16 text-tertiary relative animate-pulse" />
                ) : (
                  <Fingerprint className="w-16 h-16 text-tertiary relative animate-pulse" />
                )}
              </div>
              <h3 className="font-headline-md text-headline-md font-bold mb-2">Simulating {scanType} ID</h3>
              <p className="font-body-md text-on-surface-variant/75 text-sm mb-4">Verifying biometric key signatures with IndusInd Vault...</p>
              <RefreshCw className="w-5 h-5 text-tertiary animate-spin mt-2" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
