import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  onBack,
  children
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full flex items-start gap-3.5 text-left select-none mb-5"
    >
      {/* Back Button */}
      {showBackButton && (
        <motion.button
          onClick={onBack}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/[0.08] shadow-sm cursor-pointer flex-shrink-0 mt-0.5"
          title="Go Back"
        >
          <ChevronLeft className="w-4.5 h-4.5 text-white" />
        </motion.button>
      )}

      {/* Title & Subtitle block */}
      <div className="flex-grow flex flex-col items-start">
        <motion.h1 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="text-[28px] font-bold leading-[34px] text-white tracking-tight mb-1.5"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.25, ease: 'easeOut' }}
            className="text-[14px] leading-[20px] text-on-surface-variant/75 max-w-sm"
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <div className="w-full mt-3.5">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
};
