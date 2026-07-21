import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Search, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';

// ----------------------------------------------------
// 1. LOADING SKELETON
// ----------------------------------------------------
interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'chat';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 3 }) => {
  const items = Array.from({ length: count });

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border border-white/5 bg-white/[0.01] rounded-2xl animate-pulse">
            <div className="w-12 h-12 bg-white/10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded w-1/3" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
            <div className="w-16 h-6 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chat') {
    return (
      <div className="space-y-4 py-4">
        <div className="flex gap-2 max-w-[70%] animate-pulse">
          <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl rounded-tl-none flex-grow">
            <div className="h-3 bg-white/10 rounded w-5/6" />
            <div className="h-3 bg-white/10 rounded w-2/3" />
          </div>
        </div>
        <div className="flex gap-2 max-w-[70%] ml-auto animate-pulse">
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl rounded-tr-none flex-grow">
            <div className="h-3 bg-white/10 rounded w-4/5" />
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, i) => (
        <GlassCard key={i} hoverEffect={false} className="animate-pulse space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-24" />
                <div className="h-3 bg-white/5 rounded w-12" />
              </div>
            </div>
            <div className="w-4 h-4 bg-white/10 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-5/6" />
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-between">
            <div className="h-4 bg-white/10 rounded w-16" />
            <div className="h-4 bg-white/10 rounded w-24" />
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

// ----------------------------------------------------
// 2. EMPTY STATE
// ----------------------------------------------------
interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-white/5 bg-white/[0.01] min-h-[300px]"
    >
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant/40 mb-4">
        {icon || <Search className="w-8 h-8" />}
      </div>
      <h3 className="font-headline-md text-headline-md font-semibold mb-2">{title}</h3>
      <p className="font-body-md text-on-surface-variant max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="button-gradient px-6 py-3 rounded-xl font-label-md text-white hover:scale-[1.02] active:scale-95 transition-all shadow-md cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
};

// ----------------------------------------------------
// 3. ERROR STATE
// ----------------------------------------------------
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'An unexpected error occurred while processing financial data.',
  onRetry,
}) => {
  return (
    <GlassCard hoverEffect={false} className="flex flex-col items-center justify-center p-8 text-center border-error/20 bg-error-container/5">
      <div className="w-14 h-14 rounded-full bg-error-container/20 flex items-center justify-center text-error mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="font-headline-md text-headline-md font-semibold text-error mb-2">System Interruption</h3>
      <p className="font-body-md text-on-surface-variant max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 border border-outline/30 text-on-surface hover:bg-white/5 rounded-xl font-label-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      )}
    </GlassCard>
  );
};

// ----------------------------------------------------
// 4. SUCCESS STATE (MODAL/CONTAINER)
// ----------------------------------------------------
interface SuccessStateProps {
  title: string;
  description: string;
  details?: string;
  actionText?: string;
  onAction?: () => void;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  description,
  details,
  actionText = 'Return to Dashboard',
  onAction,
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-md p-8 glass-card rounded-[32px] text-center border-tertiary/20 shadow-xl relative overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-tertiary/5 rounded-full blur-2xl" />
      <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary mx-auto mb-6">
        <CheckCircle className="w-10 h-10" />
      </div>
      <h3 className="font-headline-lg text-headline-lg font-bold mb-3">{title}</h3>
      <p className="font-body-md text-on-surface-variant mb-6">{description}</p>
      
      {details && (
        <div className="bg-white/3 border border-white/5 p-4 rounded-2xl mb-8 text-left text-sm font-mono text-on-surface-variant/80">
          {details}
        </div>
      )}

      {onAction && (
        <button
          onClick={onAction}
          className="gold-glow-button w-full py-4 rounded-xl font-label-md text-on-tertiary font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
};
