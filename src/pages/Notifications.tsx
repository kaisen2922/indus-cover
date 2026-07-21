import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { PageHeader } from '../components/PageHeader';
import { 
  Calendar, 
  FileText, 
  Sparkles, 
  Bell, 
  BookmarkCheck
} from 'lucide-react';
import { toast } from 'sonner';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<'all' | 'renewal' | 'claim' | 'ai'>('all');

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const handleMarkAllRead = () => {
    markAllAsRead();
    toast.success('All notifications marked as read.');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'renewal': return <Calendar className="w-4 h-4 text-primary" />;
      case 'claim': return <FileText className="w-4 h-4 text-primary" />;
      case 'ai': return <Sparkles className="w-4 h-4 text-tertiary" />;
      default: return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-on-surface pt-3 pb-8 px-5 max-w-4xl mx-auto selection:bg-primary/20">
      
      {/* Reusable PageHeader - Title & Back arrow aligned, exactly 24px below app header wrapper */}
      <PageHeader 
        title="Secure Audit Feed" 
        subtitle="Unified ledger log of policy notifications, claims tracking updates, and risk mitigation advice." 
        onBack={() => navigate(-1)} 
      >
        <button
          onClick={handleMarkAllRead}
          className="mt-4 flex items-center gap-1.5 px-4 py-2 border border-white/8 hover:bg-white/5 rounded-xl text-[10px] font-bold text-on-surface cursor-pointer active:scale-95 transition-all"
        >
          <BookmarkCheck className="w-4 h-4 text-tertiary" />
          Mark All Read
        </button>
      </PageHeader>

      {/* Tabs Row - exactly 24px (mt-6) below header */}
      <section className="mt-6 flex gap-2 border-b border-white/8 pb-2 overflow-x-auto no-scrollbar">
        {(['all', 'renewal', 'claim', 'ai'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              activeTab === tab 
                ? 'bg-primary-container text-on-primary-container scale-105' 
                : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5'
            }`}
          >
            {tab === 'ai' ? 'AI Insights' : tab === 'all' ? 'All Logs' : `${tab}s`}
          </button>
        ))}
      </section>

      {/* Timeline Notifications List - exactly 24px (mt-6) below tabs */}
      <section className="mt-6 space-y-4">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty-notifs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard hoverEffect={false} className="p-5 text-center border-white/8">
                <Bell className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-4" />
                <h3 className="text-[18px] font-bold">Audit feed is clear</h3>
                <p className="text-xs text-on-surface-variant/60 mt-1">There are no pending alerts in this category.</p>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div 
              key="notifs-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filtered.map((notif) => (
                <GlassCard
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  hoverEffect={true}
                  className={`p-5 flex items-start gap-4 border-white/8 cursor-pointer hover:border-primary/25 transition-all text-left ${
                    !notif.read ? 'bg-primary-container/5 border-primary/25 shadow-md shadow-primary/3' : ''
                  }`}
                >
                  {/* Left category icon */}
                  <div className="w-9 h-9 rounded-lg bg-white/4 flex items-center justify-center flex-shrink-0">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Body Copy */}
                  <div className="flex-grow space-y-1 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className={`text-[18px] font-bold ${!notif.read ? 'text-on-surface' : 'text-on-surface-variant/90'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[9px] font-mono text-on-surface-variant/40 whitespace-nowrap pt-0.5">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-on-surface-variant/80 leading-relaxed text-[15px]">
                      {notif.message}
                    </p>
                  </div>

                  {/* Unread indicators */}
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 self-center animate-pulse" />
                  )}
                </GlassCard>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Bottom Spacer to ensure audit log feed scrolls clear of floating bottom nav */}
      <div className="h-28 flex-shrink-0" />
    </div>
  );
};
