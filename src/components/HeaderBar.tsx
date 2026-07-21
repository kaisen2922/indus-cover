import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/useStore';
import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { BrandHeader } from './Branding';

export const HeaderBar: React.FC = () => {
  const navigate = useNavigate();
  const { notifications } = useNotificationStore();
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-5 h-[72px] border-b border-white/[0.06] bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-250"
    >
      {/* Left: Brand Identity */}
      <BrandHeader 
        iconSize={28}
        wordmarkSize="md"
        onClick={() => navigate('/dashboard')}
      />

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => toast.info('Secure search query interface active.')}
          className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant/75 hover:text-tertiary hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
          title="Search Vault"
        >
          <Search className="w-5 h-5" />
        </button>

        <button 
          onClick={() => navigate('/notifications')}
          className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant/75 hover:text-tertiary hover:bg-white/5 active:scale-95 transition-all cursor-pointer relative"
          title="Audit Log Feed"
        >
          <Bell className="w-5 h-5" />
          {hasUnread && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full animate-ping border border-[#0d0d0d]" />
          )}
          {hasUnread && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border border-[#0d0d0d]" />
          )}
        </button>
      </div>
    </motion.header>
  );
};
