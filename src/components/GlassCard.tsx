import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
  glowOnHover?: boolean;
  glowColor?: string; // e.g. rgba(233,195,73,0.15) for Gold, or primary for maroon
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  glowOnHover = false,
  glowColor = 'rgba(123, 17, 44, 0.15)', // Default subtle maroon glow
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4 } : undefined}
      whileTap={hoverEffect ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`glass-card rounded-[24px] p-5 relative overflow-hidden border border-white/[0.08] transition-all duration-250 ${className}`}
      style={{
        boxShadow: glowOnHover ? `0 10px 40px ${glowColor}` : undefined,
        ...props.style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
