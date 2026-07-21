import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useClaimStore, usePolicyStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { SuccessState } from '../components/VisualStates';
import { PageHeader } from '../components/PageHeader';
import { 
  ChevronDown, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Check, 
  FileSearch,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ClaimFormValues {
  policyId: string;
  amount: number;
  description: string;
}

export const ClaimsCenter: React.FC = () => {
  const { claims, addClaim, advanceClaimStage } = useClaimStore();
  const { policies } = usePolicyStore();
  
  const [showFilingForm, setShowFilingForm] = useState(false);
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);
  
  // OCR and Upload States
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [ocrScanning, setOcrScanning] = useState(false);
  
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [filedClaimNo, setFiledClaimNo] = useState('');

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ClaimFormValues>();

  // React Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 2,
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles);
      triggerOcrSimulation(acceptedFiles[0]);
    }
  });

  // Simulated AI OCR Scanner
  const triggerOcrSimulation = (file: File) => {
    setOcrScanning(true);
    toast.loading('AI Copilot OCR scanning uploaded documents...', { id: 'ocr-toast' });

    setTimeout(() => {
      setOcrScanning(false);
      toast.success('OCR Scan Complete. Extracted parameters auto-filled.', { id: 'ocr-toast' });
      
      const lowerName = file.name.toLowerCase();
      if (lowerName.includes('hospital') || lowerName.includes('medical') || lowerName.includes('health')) {
        setValue('policyId', 'pol-health');
        setValue('amount', 32500);
        setValue('description', 'Cashless diagnostics reimbursement for health assessment (scanned from bill).');
      } else if (lowerName.includes('car') || lowerName.includes('porsche') || lowerName.includes('bumper') || lowerName.includes('garage')) {
        setValue('policyId', 'pol-motor');
        setValue('amount', 85000);
        setValue('description', 'Porsche Taycan front collision bumper damage repair invoice (scanned from receipt).');
      } else {
        setValue('amount', 15000);
        setValue('description', 'Extracted from uploaded statement: general maintenance liability.');
      }
    }, 2500);
  };

  const onFormSubmit = (data: ClaimFormValues) => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one supporting invoice or photo.');
      return;
    }

    const matchedPolicy = policies.find((p) => p.id === data.policyId);
    if (!matchedPolicy) return;

    addClaim({
      policyId: data.policyId,
      policyTitle: matchedPolicy.title,
      category: matchedPolicy.category,
      amount: Number(data.amount),
      description: data.description,
      bills: uploadedFiles.map((f) => f.name),
      photos: []
    });

    const newClaimNumber = `CLM-${matchedPolicy.category.substring(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setFiledClaimNo(newClaimNumber);
    setClaimSuccess(true);
    setShowFilingForm(false);
    reset();
    setUploadedFiles([]);
  };

  const handleClaimCardToggle = (id: string) => {
    setExpandedClaimId(expandedClaimId === id ? null : id);
  };

  return (
    <div className="relative min-h-screen bg-background text-on-surface pt-3 pb-8 px-5 max-w-4xl mx-auto selection:bg-primary/20">
      
      {/* Header Panel using reusable PageHeader */}
      <PageHeader
        title="Claims Center"
        subtitle="File insurance claims instantly using AI OCR document matching or track active settlements."
        showBackButton={false}
      >
        {!showFilingForm && (
          <button
            onClick={() => setShowFilingForm(true)}
            className="mt-4 button-gradient px-5 h-[52px] rounded-[16px] text-[16px] font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
          >
            <Plus className="w-4.5 h-4.5" />
            File a Claim
          </button>
        )}
      </PageHeader>

      {/* Main content split - exactly 24px (mt-6) below header */}
      <section className="mt-6">
        <AnimatePresence mode="wait">
          {showFilingForm ? (
            /* File a Claim Form Panel */
            <motion.div
              key="filing-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <GlassCard hoverEffect={false} className="p-5 space-y-4 border-white/8">
                <div className="flex justify-between items-center border-b border-white/8 pb-4">
                  <h3 className="text-[18px] font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-tertiary" />
                    AI-Assisted Claims Filing
                  </h3>
                  <button
                    onClick={() => {
                      setShowFilingForm(false);
                      reset();
                      setUploadedFiles([]);
                    }}
                    className="px-3 py-1.5 hover:bg-white/5 border border-white/8 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                {/* React Dropzone Upload Card */}
                <div className="space-y-2 text-left">
                  <label className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest block">
                    Drag & Drop Bills / Medical Certificates
                  </label>
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-[24px] p-5 text-center cursor-pointer transition-colors ${
                      isDragActive 
                        ? 'border-tertiary bg-tertiary/5' 
                        : 'border-white/8 hover:border-primary/40 bg-white/[0.01]'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <UploadCloud className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-3" />
                    <p className="text-xs text-on-surface-variant/80">
                      {isDragActive 
                        ? 'Drop the files here...' 
                        : 'Drag & drop bills here, or click to browse'}
                    </p>
                    <p className="text-[10px] text-on-surface-variant/40 mt-1.5 font-mono">Accepts PDF, PNG, JPG (Max 5MB)</p>
                  </div>
                </div>

                {/* Uploaded File List and OCR Scanner Progress */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-white/3 border border-white/8 rounded-[24px] p-5 space-y-3 text-left">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-on-surface-variant/80">Supporting Documents</span>
                      <span className="text-[10px] text-tertiary font-mono">Ready</span>
                    </div>
                    
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-white/2 p-3 rounded-xl border border-white/8">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4.5 h-4.5 text-primary" />
                          <span className="truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <span className="text-[10px] text-on-surface-variant/50 font-mono">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}

                    {/* Scanning animation bar */}
                    {ocrScanning && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] text-tertiary font-bold uppercase tracking-widest">
                          <span>AI Copilot Analysis</span>
                          <span>Scanning...</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2.2, ease: 'easeInOut' }}
                            className="h-full bg-gradient-to-r from-primary to-tertiary"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Main filing form inputs */}
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 text-left">
                  {/* Category Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest block">
                      Select Policy
                    </label>
                    <select 
                      {...register('policyId', { required: 'Please select a policy' })}
                      className="w-full bg-surface-container-low border border-white/8 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50"
                    >
                      <option value="">-- Choose verified policy --</option>
                      {policies.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.category})
                        </option>
                      ))}
                    </select>
                    {errors.policyId && (
                      <span className="text-[10px] text-error font-medium">{errors.policyId.message}</span>
                    )}
                  </div>

                  {/* Claim Amount */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest block">
                      Requested Claim Amount (₹)
                    </label>
                    <input 
                      type="number"
                      placeholder="e.g. 25000"
                      {...register('amount', { 
                        required: 'Please enter claim amount',
                        min: { value: 1, message: 'Amount must be greater than zero' }
                      })}
                      className="w-full bg-surface-container-low border border-white/8 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50"
                    />
                    {errors.amount && (
                      <span className="text-[10px] text-error font-medium">{errors.amount.message}</span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest block">
                      Case Description & Justification
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Briefly describe the hospitalization medical reason or vehicle accident details..."
                      {...register('description', { required: 'Please describe the claim incident' })}
                      className="w-full bg-surface-container-low border border-white/8 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 resize-none leading-relaxed"
                    />
                    {errors.description && (
                      <span className="text-[10px] text-error font-medium">{errors.description.message}</span>
                    )}
                  </div>

                  {/* Submit Claim Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={ocrScanning}
                      className={`w-full h-[54px] rounded-[18px] font-semibold text-[16px] text-white flex items-center justify-center gap-1.5 shadow-lg transition-transform ${
                        ocrScanning ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'button-gradient cursor-pointer active:scale-95'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                      Submit Claim to Smart Ledger
                    </button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          ) : (
            /* Active & Past Claims List */
            <motion.div
              key="claims-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {claimSuccess && (
                <GlassCard hoverEffect={false} className="border-emerald-500/20 bg-emerald-950/5 p-5">
                  <SuccessState 
                    title="Claim Filed Successfully"
                    description={`Claim request has been recorded in the bank ledger under Reference ID: ${filedClaimNo}. Smart Contract verification is complete.`}
                    actionText="Dismiss"
                    onAction={() => setClaimSuccess(false)}
                  />
                </GlassCard>
              )}

              <div className="flex justify-between items-center px-1">
                <h3 className="text-[18px] font-bold text-white/95">Filed Claims Ledger</h3>
                <span className="text-[10px] text-on-surface-variant/50 font-mono uppercase tracking-wider">
                  Total Claims: {claims.length}
                </span>
              </div>

              {claims.length === 0 ? (
                <GlassCard hoverEffect={false} className="border-white/8 py-10 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/4 flex items-center justify-center text-on-surface-variant/40">
                    <FileSearch className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">No active claims found</h4>
                    <p className="text-[10px] text-on-surface-variant/60 mt-1 max-w-xs leading-relaxed">
                      You haven't filed any claims yet. Tap "File a Claim" above to run an instant AI OCR audit.
                    </p>
                  </div>
                </GlassCard>
              ) : (
                <div className="space-y-4">
                  {claims.map((claim) => {
                    const isExpanded = expandedClaimId === claim.id;
                    const claimStages = [
                      { label: 'Filing Checked', desc: 'AI smart contract OCR matching complete' },
                      { label: 'IndusInd Audit', desc: 'Sovereign ledger validation and approvals' },
                      { label: 'Settlement Node', desc: 'Fund dispatch to registered HNW bank node' },
                    ];
                    const stageIndex = claim.status === 'Submitted' ? 0 : claim.status === 'Under Review' ? 1 : claim.status === 'Approved' ? 2 : 3;

                    return (
                      <GlassCard 
                        key={claim.id}
                        hoverEffect={false}
                        className={`border-white/8 p-5 transition-all duration-300 ${
                          isExpanded ? 'ring-1 ring-primary/20' : ''
                        }`}
                      >
                        {/* Summary Header block */}
                        <div 
                          onClick={() => handleClaimCardToggle(claim.id)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div className="space-y-1.5 text-left">
                            <span className="inline-block text-[11px] font-bold text-primary font-mono tracking-wider">
                              {claim.id.toUpperCase()}
                            </span>
                            <h4 className="text-[15px] font-bold text-white">
                              {claim.policyTitle}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/60 font-mono">
                              <span>CLAIMED: <strong className="text-white">₹{claim.amount.toLocaleString('en-IN')}</strong></span>
                              <span>•</span>
                              <span>{claim.dateFiled}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <StatusBadge status={claim.status} />
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4.5 h-4.5 text-on-surface-variant" />
                            </motion.div>
                          </div>
                        </div>

                        {/* Collapsible Details Drawer */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="pt-5 mt-4 border-t border-white/8 space-y-5 text-left text-xs leading-relaxed">
                                <div className="space-y-1">
                                  <span className="text-[9px] uppercase tracking-wider text-on-surface-variant/40 block font-label-sm">
                                    Incident Report / Description
                                  </span>
                                  <p className="text-on-surface-variant/90 leading-relaxed bg-white/2 p-3 rounded-lg border border-white/8">
                                    {claim.description}
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-[9px] uppercase tracking-wider text-on-surface-variant/40 block font-label-sm">
                                      Supporting Receipts
                                    </span>
                                    <div className="flex flex-col gap-1.5 mt-1">
                                      {claim.bills.map((bill, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 text-[10px] text-primary font-medium">
                                          <FileText className="w-3.5 h-3.5" />
                                          <span className="truncate max-w-[140px]">{bill}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="text-right flex flex-col justify-end items-end">
                                    <span className="text-[9px] uppercase tracking-wider text-on-surface-variant/40 block font-label-sm">
                                      Smart Contract Status
                                    </span>
                                    <span className="text-[10px] text-tertiary font-bold flex items-center gap-1 mt-1 uppercase font-mono">
                                      <Check className="w-3 h-3" /> Ledger Signed
                                    </span>
                                  </div>
                                </div>

                                {/* Multi-stage claim track timeline */}
                                <div className="space-y-3 pt-2">
                                  <span className="text-[9px] uppercase tracking-wider text-on-surface-variant/40 block font-label-sm">
                                    Settlement Audit Log
                                  </span>
                                  
                                  <div className="relative pl-6 space-y-4 border-l border-white/8 py-1 ml-2">
                                    {claimStages.map((stage, idx) => {
                                      const isPassed = stageIndex > idx;
                                      const isCurrent = stageIndex === idx;
                                      
                                      return (
                                        <div key={idx} className="relative text-[11px]">
                                          {/* Timeline Ring Node */}
                                          <div className={`absolute -left-[30px] top-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                                            isPassed 
                                              ? 'bg-emerald-400 border-emerald-400 text-white' 
                                              : isCurrent 
                                                ? 'bg-primary border-primary animate-pulse' 
                                                : 'bg-background border-white/10'
                                          }`}>
                                            {isPassed && <Check className="w-2.5 h-2.5 text-background stroke-[3]" />}
                                          </div>
                                          
                                          <div className="space-y-0.5">
                                            <h5 className={`font-bold ${isPassed ? 'text-emerald-400' : isCurrent ? 'text-primary' : 'text-on-surface-variant/50'}`}>
                                              {stage.label}
                                            </h5>
                                            <p className="text-[10px] text-on-surface-variant/50 leading-relaxed">{stage.desc}</p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Ledger Audit Stage advance trigger */}
                                {stageIndex < 2 && (
                                  <div className="pt-2 flex justify-end">
                                    <button
                                      onClick={() => {
                                        advanceClaimStage(claim.id);
                                        toast.success('Dispatched smart ledger validation trigger.', {
                                          description: 'Advancing claim processing node...'
                                        });
                                      }}
                                      className="px-3.5 py-1.5 border border-white/8 hover:bg-white/5 rounded-xl text-[9px] font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                                    >
                                      Simulate Audit Step
                                    </button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassCard>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Bottom Spacer to ensure filed claims scroll clear of floating bottom nav */}
      <div className="h-28 flex-shrink-0" />
    </div>
  );
};
