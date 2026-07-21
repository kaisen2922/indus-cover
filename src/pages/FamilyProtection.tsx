import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockFamily, type FamilyMember } from '../utils/mockData';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { PageHeader } from '../components/PageHeader';
import { UserPlus, ShieldAlert, X, Shield } from 'lucide-react';
import { toast } from 'sonner';

export const FamilyProtection: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<FamilyMember[]>(mockFamily);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Add member form states
  const [name, setName] = useState('');
  const [relation, setRelation] = useState<'Father' | 'Mother' | 'Spouse' | 'Child' | 'Pet'>('Spouse');
  const [age, setAge] = useState('');
  const [aadhaar, setAadhaar] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !age) {
      toast.error('Please enter name and age.');
      return;
    }

    if (relation !== 'Pet' && aadhaar.length !== 12) {
      toast.error('Aadhaar number must be exactly 12 digits for verification.');
      return;
    }

    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      name,
      relation,
      age: Number(age),
      protectionStatus: relation === 'Pet' ? 'Uninsured' : 'Fully Covered',
      policiesConnected: relation === 'Pet' ? [] : ['Global Health Elite'],
      avatar: relation === 'Pet'
        ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=150'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      recommendation: relation === 'Pet' 
        ? 'Aegis Pet Shield covers up to ₹5 Lakhs. Recommend immediate activation.' 
        : undefined
    };

    setMembers([...members, newMember]);
    setShowAddModal(false);
    toast.success(`${name} added to security group.`, {
      description: 'KYC verified via Aadhaar secure link.'
    });

    setName('');
    setRelation('Spouse');
    setAge('');
    setAadhaar('');
  };

  return (
    <div className="relative min-h-screen bg-background text-on-surface pt-3 pb-8 px-5 max-w-4xl mx-auto selection:bg-primary/20">
      
      {/* Reusable PageHeader - Title & Back arrow aligned, exactly 24px below app header wrapper */}
      <PageHeader
        title="Family Protection"
        subtitle="Audit the security score of your dependents. Link profiles to your Global Health Elite policy."
        onBack={() => navigate(-1)}
      >
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 button-gradient px-4 h-11 rounded-[16px] text-[13px] font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </PageHeader>

      {/* Dependency Coverage Grid - exactly 24px (mt-6) below header */}
      <section className="mt-6 grid grid-cols-1 gap-3.5">
        {members.map((member) => (
          <GlassCard key={member.id} hoverEffect={true} className="border-white/8 p-4 flex flex-col justify-between text-left rounded-[20px]">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{member.name}</h3>
                  <p className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider mt-0.5">
                    {member.relation} • Age: {member.age}
                  </p>
                </div>
                <StatusBadge status={member.protectionStatus} />
              </div>

              {/* Connected Policies */}
              <div className="space-y-1.5 text-xs text-on-surface-variant pt-1 border-t border-white/5">
                <span className="text-[9px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest block font-medium">Connected Coverages</span>
                {member.policiesConnected.length === 0 ? (
                  <span className="text-[10px] text-on-surface-variant/40 italic">No policies linked.</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {member.policiesConnected.map((pol, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] text-primary font-semibold">
                        {pol}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI suggestion panel if present */}
            {member.recommendation ? (
              <div className="mt-3 pt-3 border-t border-white/8 space-y-2.5">
                <div className="bg-surface-container-low/60 border border-white/8 rounded-xl p-3 flex gap-2.5 items-start">
                  <ShieldAlert className="w-4 h-4 text-tertiary flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] italic text-tertiary-fixed-dim leading-relaxed">
                    "{member.recommendation}"
                  </p>
                </div>
                
                <button
                  onClick={() => navigate('/buy')}
                  className="w-full py-2.5 bg-tertiary text-on-tertiary font-bold text-xs rounded-xl hover:brightness-105 transition-all cursor-pointer text-center shadow-md active:scale-95"
                >
                  Activate Suggested Policy
                </button>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-white/8 flex justify-between items-center text-[10px] text-on-surface-variant/60 font-mono">
                <span>KYC Verification: Active</span>
                <span className="text-emerald-400 font-bold">100% SECURE</span>
              </div>
            )}
          </GlassCard>
        ))}
      </section>

      {/* Add Member Sheet Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-6 select-none"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md bg-surface-container-lowest border border-white/8 rounded-[24px] p-5 space-y-4 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/8 text-left">
                <h3 className="text-[18px] font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Link Dependents Vault
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-on-surface-variant cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-4 text-xs text-left">
                {/* Name */}
                <div className="space-y-1">
                  <label className="font-label-sm text-[10px] text-on-surface-variant/60 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full bg-surface-container-low border border-white/8 rounded-xl py-3 px-4 outline-none text-on-surface focus:border-tertiary"
                  />
                </div>

                {/* Relation */}
                <div className="space-y-1">
                  <label className="font-label-sm text-[10px] text-on-surface-variant/60 uppercase tracking-wide">
                    Relation
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value as any)}
                    className="w-full bg-surface-container-low border border-white/8 rounded-xl py-3 px-4 outline-none text-on-surface focus:border-tertiary"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Child">Child</option>
                    <option value="Pet">Pet / Canine</option>
                  </select>
                </div>

                {/* Age */}
                <div className="space-y-1">
                  <label className="font-label-sm text-[10px] text-on-surface-variant/60 uppercase tracking-wide">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter age"
                    className="w-full bg-surface-container-low border border-white/8 rounded-xl py-3 px-4 outline-none text-on-surface focus:border-tertiary"
                  />
                </div>

                {/* Aadhaar Input (Conditionally required if relation !== Pet) */}
                {relation !== 'Pet' && (
                  <div className="space-y-1">
                    <label className="font-label-sm text-[10px] text-on-surface-variant/60 uppercase tracking-wide">
                      Dependent Aadhaar Number (12 Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      required
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123456789012"
                      className="w-full bg-surface-container-low border border-white/8 rounded-xl py-3 px-4 outline-none text-on-surface tracking-widest focus:border-tertiary"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-[54px] rounded-[18px] text-[16px] font-semibold text-white flex items-center justify-center gap-1.5 shadow-lg button-gradient cursor-pointer active:scale-95 transition-all"
                >
                  Verify KYC & Link Member
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Spacer to ensure family protection cards scroll clear of floating bottom nav */}
      <div className="h-28 flex-shrink-0" />
    </div>
  );
};
