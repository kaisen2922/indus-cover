import React from 'react';

interface AppIconProps {
  size?: number;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2AF" />
          <stop offset="50%" stopColor="#E9C349" />
          <stop offset="100%" stopColor="#B38F1B" />
        </linearGradient>
        <linearGradient id="innerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(233, 195, 73, 0.2)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="rgba(233, 195, 73, 0)" />
        </linearGradient>
      </defs>
      
      {/* Outer Premium Shield */}
      <path
        d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        fill="url(#innerGlow)"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Inner Shield Lining */}
      <path
        d="M12 18.5C12 18.5 17 15.5 17 11V6.5L12 4.5L7 6.5V11C7 15.5 12 18.5 12 18.5Z"
        stroke="url(#goldGradient)"
        strokeWidth="0.8"
        strokeOpacity="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stylized Core Shield Spark */}
      <path
        d="M12 8V14M10 11H14"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

interface BrandWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | string;
  className?: string;
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-[17px]',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const selectedSize = sizeClasses[size as keyof typeof sizeClasses] || size;

  return (
    <span className={`font-bold tracking-tight text-white/90 select-none ${selectedSize} ${className}`}>
      Indus
      <span className="text-tertiary">
        Cover
      </span>
    </span>
  );
};

interface BrandHeaderProps {
  iconSize?: number;
  wordmarkSize?: 'sm' | 'md' | 'lg' | 'xl' | string;
  subtitleSize?: string;
  className?: string;
  onClick?: () => void;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  iconSize = 28,
  wordmarkSize = 'md',
  subtitleSize = 'text-[9px]',
  className = '',
  onClick
}) => {
  return (
    <div 
      className={`flex items-center gap-3 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <AppIcon size={iconSize} />
      <div className="flex flex-col text-left">
        <BrandWordmark size={wordmarkSize} />
        <span className={`${subtitleSize} text-on-surface-variant/45 font-label-sm uppercase tracking-[0.2em] mt-0.5 select-none`}>
          AI Protection Platform
        </span>
      </div>
    </div>
  );
};
