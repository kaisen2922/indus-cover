import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRewardStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { PageHeader } from '../components/PageHeader';
import { 
  Coins, 
  Footprints, 
  Heart, 
  Award,
  Gift
} from 'lucide-react';
import { toast } from 'sonner';

export const Rewards: React.FC = () => {
  const navigate = useNavigate();
  const { coins, habits, logActivity } = useRewardStore();

  const handleSimulateSteps = (id: string) => {
    logActivity(id, 1000);
    toast.success('Activity Synced: Synced +1,000 steps from Apple Health.', {
      duration: 1200
    });
  };

  const handleSimulateDrive = (id: string) => {
    logActivity(id, 5);
    toast.success('Commute Synced: Safe speed logging verified (+5 score points).', {
      duration: 1200
    });
  };

  const handleRedeem = (item: string, cost: number) => {
    if (coins < cost) {
      toast.error('Insufficient Aegis coins to authorize redemption.', {
        description: `You need ${cost - coins} more coins.`
      });
      return;
    }
    
    useRewardStore.setState((state) => ({ coins: state.coins - cost }));
    
    toast.success(`Redeemed successfully: ${item}.`, {
      description: 'Your premium offset coupon is credited to registered account.'
    });
  };

  const getHabitIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints': return <Footprints className="w-5 h-5 text-primary" />;
      case 'ShieldCheck': return <Award className="w-5 h-5 text-primary" />;
      default: return <Heart className="w-5 h-5 text-primary" />;
    }
  };

  const redeemDeals = [
    { name: '10% Health Premium Offset Coupon', coins: 1500, description: 'Reduces your Global Health Elite monthly renewal premium by 10%.' },
    { name: '₹500 Roadside Concierge Cash Voucher', coins: 800, description: 'Redeemable against additional vehicle service repairs.' },
    { name: 'Free Comprehensive Cyber Risk Scan', coins: 1200, description: 'A detailed dark-web server scan for family domain names.' }
  ];

  return (
    <div className="relative min-h-screen bg-background text-on-surface pt-3 pb-8 px-5 max-w-4xl mx-auto selection:bg-primary/20">
      
      {/* Reusable PageHeader - Title & Back arrow aligned, exactly 24px below app header wrapper */}
      <PageHeader 
        title="Aegis Rewards" 
        subtitle="Sync healthy habits to earn Aegis Coins. Offset premium renewals from the rewards shop." 
        onBack={() => navigate(-1)} 
      />

      {/* Balance Indicator Card - exactly 24px (mt-6) below header */}
      <section className="mt-6">
        <div className="glass-card rounded-[24px] p-5 relative overflow-hidden bg-gradient-to-br from-tertiary/10 via-background to-background border border-white/8 shadow-lg">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-tertiary/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-center relative z-10">
            <div className="space-y-1.5 text-left">
              <span className="font-label-sm text-[10px] text-tertiary tracking-widest uppercase font-semibold">Active Coins Balance</span>
              <div className="flex items-center gap-2">
                <Coins className="w-8 h-8 text-tertiary animate-spin [animation-duration:10s]" />
                <span className="text-2xl md:text-3xl font-extrabold text-on-surface">
                  {coins.toLocaleString()} <span className="text-sm font-normal text-on-surface-variant/60 font-medium">Coins</span>
                </span>
              </div>
            </div>
            
            <span className="text-xs text-on-surface-variant/60 font-mono text-right">
              1 Coin = ₹1.00 Value
            </span>
          </div>
        </div>
      </section>

      {/* Habit tracking lists - exactly 24px (mt-6) below balance card */}
      <section className="mt-6 space-y-4">
        <h2 className="font-headline-lg text-xs font-bold tracking-widest uppercase text-on-surface-variant/65 px-1 text-left">Habits Sync & Logging</h2>
        <div className="grid grid-cols-1 gap-4">
          {habits.map((habit) => {
            const isCompleted = habit.current >= habit.target;
            
            return (
              <GlassCard key={habit.id} hoverEffect={false} className="border-white/8 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Habit info details */}
                  <div className="space-y-2 flex-grow text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        {getHabitIcon(habit.iconName)}
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold">{habit.title}</h3>
                        <p className="text-[10px] text-on-surface-variant/50 font-mono mt-0.5">
                          Target: {habit.target.toLocaleString()} {habit.metric} • Reward: {habit.coinsReward} Coins
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress slider bar */}
                    <div className="space-y-1 pt-1 max-w-md">
                      <div className="flex justify-between text-[9px] text-on-surface-variant/70 font-mono">
                        <span>Current: {habit.current.toLocaleString()}</span>
                        <span>{habit.progressPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-tertiary rounded-full transition-all duration-500" 
                          style={{ width: `${habit.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Simulation & Claim CTAs */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {!isCompleted ? (
                      <button
                        onClick={() => 
                          habit.id === 'hbt-steps' 
                            ? handleSimulateSteps(habit.id) 
                            : handleSimulateDrive(habit.id)
                        }
                        className="px-4 py-2 border border-white/8 hover:bg-white/5 rounded-xl text-[10px] font-bold text-on-surface transition-all cursor-pointer"
                      >
                        Sync Progress
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          toast.success(`Claimed +${habit.coinsReward} Aegis Coins!`);
                        }}
                        className="px-4 py-2 bg-tertiary text-on-tertiary rounded-xl text-[10px] font-bold transition-all cursor-pointer hover:brightness-105"
                      >
                        Claimed
                      </button>
                    )}
                  </div>

                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Coins Redemptions Shop - exactly 24px (mt-6) below habits */}
      <section className="mt-6 space-y-4">
        <h2 className="font-headline-lg text-xs font-bold tracking-widest uppercase text-on-surface-variant/65 px-1 text-left">Redeem Shop</h2>
        <div className="space-y-4">
          {redeemDeals.map((deal, idx) => (
            <GlassCard key={idx} hoverEffect={true} className="border-white/8 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Deal Details */}
                <div className="space-y-1.5 text-left">
                  <h3 className="text-[18px] font-bold flex items-center gap-2">
                    <Gift className="w-4 h-4 text-primary" />
                    {deal.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant/75 max-w-lg leading-relaxed">{deal.description}</p>
                </div>

                {/* Redeem Buttons */}
                <button
                  onClick={() => handleRedeem(deal.name, deal.coins)}
                  className="px-5 py-3 border border-tertiary/20 hover:bg-tertiary/10 text-tertiary rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center whitespace-nowrap"
                >
                  <Coins className="w-3.5 h-3.5" />
                  Redeem {deal.coins} Coins
                </button>

              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Bottom Spacer to ensure rewards cards scroll clear of floating bottom nav */}
      <div className="h-28 flex-shrink-0" />
    </div>
  );
};
