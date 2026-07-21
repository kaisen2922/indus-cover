import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePolicyStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { SuccessState } from '../components/VisualStates';
import { PageHeader } from '../components/PageHeader';
import { 
  Heart, 
  Car, 
  Home as HomeIcon, 
  Plane, 
  ShieldAlert, 
  PawPrint, 
  AlertCircle,
  FileText,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  defaultCover: number;
  minCover: number;
  maxCover: number;
  step: number;
  basePremiumRatio: number; 
  coveragePoints: string[];
}

export const BuyInsurance: React.FC = () => {
  const navigate = useNavigate();
  const { addPolicy } = usePolicyStore();

  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [extraField, setExtraField] = useState(''); 
  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);
  const [activatedPolicyInfo, setActivatedPolicyInfo] = useState<{ title: string; cover: string; id: string } | null>(null);

  const categories: Category[] = [
    {
      id: 'Health',
      name: 'Health Insurance',
      icon: <Heart className="w-5 h-5 text-primary" />,
      description: 'Global medical shell protecting your family against emergency room fees and cashless surgeries.',
      defaultCover: 10000000, 
      minCover: 2500000,
      maxCover: 50000000,
      step: 2500000,
      basePremiumRatio: 0.0003, 
      coveragePoints: ['Cashless international treatment', 'Air ambulance routing', 'No room rent capping'],
    },
    {
      id: 'Motor',
      name: 'Motor Insurance',
      icon: <Car className="w-5 h-5 text-primary" />,
      description: 'Zero-depreciation protection for luxury sports cars and sedans. Includes roadside assistance.',
      defaultCover: 5000000, 
      minCover: 1000000,
      maxCover: 20000000,
      step: 1000000,
      basePremiumRatio: 0.0007,
      coveragePoints: ['Zero-depreciation coverage', 'Invoice cost return', 'Engine protection shield'],
    },
    {
      id: 'Travel',
      name: 'Travel Insurance',
      icon: <Plane className="w-5 h-5 text-primary" />,
      description: 'International travel safeguard covering flight cancellation losses, medical care, and passport loss.',
      defaultCover: 7500000, 
      minCover: 2000000,
      maxCover: 15000000,
      step: 1000000,
      basePremiumRatio: 0.00015,
      coveragePoints: ['Loss of baggage cover', 'Medical repatriation cover', 'Emergency concierge support'],
    },
    {
      id: 'Home',
      name: 'Home Insurance',
      icon: <HomeIcon className="w-5 h-5 text-primary" />,
      description: 'Physical building structure damage shelter with fine art appraisal locks and cyber security riders.',
      defaultCover: 50000000, 
      minCover: 10000000,
      maxCover: 200000000,
      step: 5000000,
      basePremiumRatio: 0.0001,
      coveragePoints: ['Natural calamity shield', 'Burglary & theft cover', 'Valuable fine art locks'],
    },
    {
      id: 'Pet',
      name: 'Pet Shield',
      icon: <PawPrint className="w-5 h-5 text-primary" />,
      description: 'Exclusive veterinary cover for elite breeds protecting against surgery, illness, and liability.',
      defaultCover: 500000, 
      minCover: 100000,
      maxCover: 2000000,
      step: 100000,
      basePremiumRatio: 0.015, 
      coveragePoints: ['IPD surgery costs', 'Breed-specific illness cover', 'Third-party liability cover'],
    },
    {
      id: 'Cyber',
      name: 'Cyber Liability',
      icon: <ShieldAlert className="w-5 h-5 text-primary" />,
      description: 'Cyber theft liability shield protecting HNW corporate structures from phishing, ransomware, and identity leaks.',
      defaultCover: 2500000, 
      minCover: 500000,
      maxCover: 10000000,
      step: 500000,
      basePremiumRatio: 0.002,
      coveragePoints: ['Phishing theft reimbursement', 'Ransomware advisory support', 'Identity restoration service'],
    },
    {
      id: 'Accident',
      name: 'Personal Accident',
      icon: <AlertCircle className="w-5 h-5 text-primary" />,
      description: 'Accidental permanent disability support guaranteeing secondary home income safety.',
      defaultCover: 15000000, 
      minCover: 5000000,
      maxCover: 30000000,
      step: 2500000,
      basePremiumRatio: 0.0002,
      coveragePoints: ['Accidental dismemberment payout', 'Education allowance for children', 'Job loss compensation'],
    },
    {
      id: 'Life',
      name: 'Term Protection',
      icon: <FileText className="w-5 h-5 text-primary" />,
      description: 'HNW estate term assurance linked to family legacy trusts with maximum tax efficiency benefits.',
      defaultCover: 50000000, 
      minCover: 20000000,
      maxCover: 500000000,
      step: 10000000,
      basePremiumRatio: 0.00018,
      coveragePoints: ['Pure death benefit payout', 'Critical illness boosters', 'Trust-linked distribution'],
    }
  ];

  const handleOpenBuySheet = (cat: Category) => {
    setSelectedCat(cat);
    setSliderValue(cat.defaultCover);
    setAadhaar('');
    setPan('');
    setExtraField('');
  };

  const calculatedPremium = selectedCat 
    ? Math.round(sliderValue * selectedCat.basePremiumRatio)
    : 0;

  const handleProcessPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat) return;

    if (aadhaar.length !== 12) {
      toast.error('Aadhaar number must be exactly 12 digits.');
      return;
    }
    if (pan.length !== 10) {
      toast.error('PAN identification code must be 10 characters.');
      return;
    }
    if (!extraField) {
      toast.error(`Please provide the required details: ${getExtraFieldName(selectedCat.id)}.`);
      return;
    }

    toast.loading('Processing premium lock and KYC authorization...', { id: 'buy-toast' });
    
    setTimeout(() => {
      const policyId = `pol-${selectedCat.id.toLowerCase()}-${Date.now().toString().slice(-4)}`;
      const policyNumber = `IND-${selectedCat.id.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-IP`;

      addPolicy({
        id: policyId,
        category: selectedCat.id as any,
        title: `Aegis ${selectedCat.name}`,
        policyNumber,
        provider: 'IndusInd Premium Assurance',
        sumInsured: sliderValue,
        premium: calculatedPremium,
        renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        status: 'ACTIVE',
        details: {
          description: selectedCat.description,
          coverage: selectedCat.coveragePoints,
          benefits: selectedCat.coveragePoints,
          ...(selectedCat.id === 'Motor' ? { vehicles: [extraField] } : {}),
          ...(selectedCat.id === 'Pet' ? { description: `Breed Covered: ${extraField}. ${selectedCat.description}` } : {}),
          ...(selectedCat.id === 'Home' ? { address: extraField } : {}),
        }
      });

      toast.success('KYC Approved. Policy active.', { id: 'buy-toast' });
      setActivatedPolicyInfo({
        title: `Aegis ${selectedCat.name}`,
        cover: `₹${sliderValue.toLocaleString('en-IN')}`,
        id: policyNumber
      });
      setPurchaseSuccess(true);
      setSelectedCat(null);
    }, 2000);
  };

  const getExtraFieldName = (id: string) => {
    switch (id) {
      case 'Motor': return 'Vehicle Number (e.g. MH-12-TC-2024)';
      case 'Pet': return 'Pet Breed & Name (e.g. Golden Retriever, Shadow)';
      case 'Home': return 'Property Address (e.g. Worli Penthouse)';
      case 'Cyber': return 'Primary Device/Server Domain';
      default: return 'Primary Nominee Full Name';
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-on-surface pt-3 pb-8 px-5 max-w-4xl mx-auto selection:bg-primary/20">
      
      {/* Reusable PageHeader - Title & Back arrow aligned, exactly 24px below app header wrapper */}
      <PageHeader 
        title="Buy Insurance" 
        subtitle="Secure your wealth against vulnerabilities. Instant premium lock and digital KYC." 
        onBack={() => navigate(-1)} 
      />

      {/* Grid of Categories - exactly 24px (mt-6) below header */}
      <section className="mt-6 grid grid-cols-1 gap-3.5">
        {categories.map((cat) => (
          <GlassCard key={cat.id} hoverEffect={true} className="border-white/8 p-4 text-left rounded-[20px] space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{cat.name}</h3>
                  <p className="text-[10px] text-on-surface-variant/50 font-mono">Instant Underwriting Lock</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/compare')}
                className="text-[10px] text-tertiary border border-tertiary/25 bg-tertiary/10 px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider hover:bg-tertiary/20 transition-colors cursor-pointer flex-shrink-0"
              >
                Compare
              </button>
            </div>

            <p className="text-xs text-on-surface-variant/75 leading-relaxed">{cat.description}</p>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest">Premium starts from</p>
                <p className="text-sm font-extrabold text-primary">
                  ₹{Math.round(cat.minCover * cat.basePremiumRatio).toLocaleString('en-IN')}<span className="text-xs text-on-surface-variant/50 font-normal">/mo</span>
                </p>
              </div>

              <button
                onClick={() => handleOpenBuySheet(cat)}
                className="h-10 px-4 rounded-xl text-xs font-bold text-white shadow-md button-gradient cursor-pointer flex items-center justify-center transition-transform active:scale-95 flex-shrink-0"
              >
                Configure Cover
              </button>
            </div>
          </GlassCard>
        ))}
      </section>

      {/* Slide-Up Bottom Sheet Overlay */}
      <AnimatePresence>
        {selectedCat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 z-50 flex items-end justify-center select-none"
            onClick={() => setSelectedCat(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-full max-w-lg bg-surface-container-lowest border-t border-white/8 rounded-t-[28px] p-5 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar shadow-[0_-10px_35px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sheet Header */}
              <div className="flex justify-between items-center pb-2 border-b border-white/8 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {selectedCat.icon}
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold">Configure {selectedCat.name}</h3>
                    <p className="text-[10px] text-on-surface-variant/60 font-mono">Premium underwriting by IndusCover</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCat(null)}
                  className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Slider for Coverage limit */}
              <div className="space-y-4 bg-white/[0.01] border border-white/8 p-5 rounded-[24px]">
                <div className="flex justify-between items-center">
                  <span className="font-label-sm text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-semibold">Coverage Value (₹)</span>
                  <span className="text-sm font-bold text-tertiary">
                    ₹{sliderValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={selectedCat.minCover}
                  max={selectedCat.maxCover}
                  step={selectedCat.step}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[9px] text-on-surface-variant/50 font-mono">
                  <span>Min: ₹{(selectedCat.minCover / 100000).toLocaleString('en-IN')}L</span>
                  <span>Max: ₹{(selectedCat.maxCover / 10000000).toLocaleString('en-IN')}Cr</span>
                </div>
              </div>

              {/* Purchase configuration form */}
              <form onSubmit={handleProcessPurchase} className="space-y-4 text-left">
                
                {/* Extra dynamic field (vehicle / pet breed / address) */}
                <div className="relative group space-y-1">
                  <label className="font-label-sm text-[10px] text-on-surface-variant/60 uppercase tracking-wide font-medium">
                    {getExtraFieldName(selectedCat.id)}
                  </label>
                  <div className="relative border-b border-outline-variant focus-within:border-tertiary transition-colors">
                    <input
                      type="text"
                      required
                      value={extraField}
                      onChange={(e) => setExtraField(e.target.value)}
                      placeholder="Input required reference parameter"
                      className="w-full bg-transparent outline-none py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/20"
                    />
                  </div>
                </div>

                {/* Aadhaar validation */}
                <div className="relative group space-y-1">
                  <label className="font-label-sm text-[10px] text-on-surface-variant/60 uppercase tracking-wide font-medium">
                    Aadhaar Number (12 Digits)
                  </label>
                  <div className="relative border-b border-outline-variant focus-within:border-tertiary transition-colors">
                    <input
                      type="text"
                      maxLength={12}
                      required
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123456789012"
                      className="w-full bg-transparent outline-none py-2.5 text-xs text-on-surface tracking-wider placeholder:text-on-surface-variant/20"
                    />
                  </div>
                </div>

                {/* PAN Validation */}
                <div className="relative group space-y-1">
                  <label className="font-label-sm text-[10px] text-on-surface-variant/60 uppercase tracking-wide font-medium">
                    PAN Card Identifier (10 Digits)
                  </label>
                  <div className="relative border-b border-outline-variant focus-within:border-tertiary transition-colors">
                    <input
                      type="text"
                      maxLength={10}
                      required
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full bg-transparent outline-none py-2.5 text-xs text-on-surface tracking-widest placeholder:text-on-surface-variant/20"
                    />
                  </div>
                </div>

                {/* Premium pricing and lock button */}
                <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider">Locked Monthly Premium</p>
                    <p className="text-xl font-bold text-primary mt-1">₹{calculatedPremium.toLocaleString('en-IN')}</p>
                  </div>
                  
                  <button
                    type="submit"
                    className="px-6 h-[54px] rounded-[18px] text-[16px] font-semibold text-white shadow-lg cursor-pointer bg-gradient-to-r from-primary-container to-primary hover:brightness-110 active:scale-95 transition-all flex items-center justify-center"
                  >
                    Lock Premium & Buy
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Payout overlay */}
      <AnimatePresence>
        {purchaseSuccess && activatedPolicyInfo && (
          <div className="fixed inset-0 bg-background/90 z-50 flex items-center justify-center p-6">
            <SuccessState
              title="Protection Locked"
              description={`Congratulations. Your digital premium for "${activatedPolicyInfo.title}" is authorized. Standard KYC verification completed.`}
              details={`Policy Ledger Hash: ${activatedPolicyInfo.id}\nLocked coverage amount: ${activatedPolicyInfo.cover}\nUnderwriter signature: IndusInd Bank Secured`}
              actionText="View Policy Wallet"
              onAction={() => {
                setPurchaseSuccess(false);
                setActivatedPolicyInfo(null);
                navigate('/policies');
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Spacer to ensure purchase wizard scrolls clear of floating bottom nav */}
      <div className="h-28 flex-shrink-0" />
    </div>
  );
};
