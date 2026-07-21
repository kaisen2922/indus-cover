import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const normStatus = status.toUpperCase();
  
  let bgColor = 'bg-white/5 border-white/10 text-on-surface-variant';
  let dotColor = 'bg-on-surface-variant';
  let pulse = false;

  switch (normStatus) {
    case 'ACTIVE':
    case 'VERIFIED':
    case 'FULLY COVERED':
    case 'SUCCESS':
    case 'APPROVED':
      bgColor = 'bg-tertiary/10 border-tertiary/20 text-tertiary';
      dotColor = 'bg-tertiary';
      pulse = true;
      break;
    case 'SOS':
    case 'EMERGENCY':
    case 'REJECTED':
    case 'FAILED':
      bgColor = 'bg-error-container/20 border-error/20 text-error';
      dotColor = 'bg-error';
      pulse = true;
      break;
    case 'PENDING':
    case 'UNDER REVIEW':
    case 'GAPS DETECTED':
      bgColor = 'bg-secondary/15 border-secondary/35 text-secondary-fixed-dim';
      dotColor = 'bg-secondary';
      pulse = true;
      break;
    case 'SETTLEMENT':
    case 'SETTLED':
      bgColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      dotColor = 'bg-emerald-400';
      pulse = false;
      break;
    default:
      break;
  }

  const paddingClass = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3.5 py-1 text-xs';
  const dotSizeClass = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span className={`inline-flex items-center gap-1.5 font-label-sm uppercase tracking-wider border rounded-full ${bgColor} ${paddingClass}`}>
      <span className={`rounded-full ${dotSizeClass} ${dotColor} ${pulse ? 'animate-pulse scale-110' : ''}`} />
      {status}
    </span>
  );
};
