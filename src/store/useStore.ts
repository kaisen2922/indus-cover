import { create } from 'zustand';
import { 
  mockUser, 
  mockPolicies, 
  mockClaims, 
  mockHabits, 
  mockNotifications, 
  mockHospitals,
  type Policy, 
  type Claim, 
  type RewardHabit, 
  type NotificationItem, 
  type CashlessHospital,
  type UserProfile
} from '../utils/mockData';

// ----------------------------------------------------
// 1. AUTH STORE
// ----------------------------------------------------
interface AuthState {
  isLoggedIn: boolean;
  phone: string;
  otpSent: boolean;
  otpCode: string;
  rememberDevice: boolean;
  biometricsEnabled: boolean;
  user: UserProfile;
  login: () => void;
  logout: () => void;
  setPhone: (phone: string) => void;
  sendOtp: () => Promise<boolean>;
  verifyOtp: (code: string) => boolean;
  toggleRememberDevice: () => void;
  toggleBiometrics: () => void;
  updateKYC: (status: 'Verified' | 'Pending' | 'Failed') => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  phone: '',
  otpSent: false,
  otpCode: '',
  rememberDevice: true,
  biometricsEnabled: false,
  user: mockUser,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false, otpSent: false, phone: '' }),
  setPhone: (phone) => set({ phone }),
  sendOtp: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[MOCK OTP SENT to ${get().phone}]: ${randomOtp}`);
    // For convenience in testing, we accept any OTP, but save the generated one in console
    set({ otpSent: true, otpCode: randomOtp });
    return true;
  },
  verifyOtp: (code) => {
    // Allow any 6-digit code for ease of demonstration, or match exactly if they type the mock code
    if (code.length === 6) {
      set({ isLoggedIn: true });
      return true;
    }
    return false;
  },
  toggleRememberDevice: () => set((state) => ({ rememberDevice: !state.rememberDevice })),
  toggleBiometrics: () => set((state) => ({ biometricsEnabled: !state.biometricsEnabled })),
  updateKYC: (status) => set((state) => ({ user: { ...state.user, kycStatus: status } })),
}));

// ----------------------------------------------------
// 2. POLICIES STORE
// ----------------------------------------------------
interface PolicyState {
  policies: Policy[];
  expandedPolicyId: string | null;
  togglePolicy: (id: string) => void;
  addPolicy: (policy: Policy) => void;
  increaseCoverage: (id: string, amount: number) => void;
}

export const usePolicyStore = create<PolicyState>((set) => ({
  policies: mockPolicies,
  expandedPolicyId: null,
  togglePolicy: (id) => set((state) => ({
    expandedPolicyId: state.expandedPolicyId === id ? null : id
  })),
  addPolicy: (policy) => set((state) => ({ policies: [...state.policies, policy] })),
  increaseCoverage: (id, amount) => set((state) => ({
    policies: state.policies.map((p) => 
      p.id === id 
        ? { ...p, sumInsured: p.sumInsured + amount, aiInsight: 'Coverage successfully optimized by AI Copilot.' } 
        : p
    )
  })),
}));

// ----------------------------------------------------
// 3. CLAIMS STORE
// ----------------------------------------------------
interface ClaimState {
  claims: Claim[];
  addClaim: (claim: Omit<Claim, 'id' | 'claimNumber' | 'dateFiled' | 'status' | 'timeline'>) => void;
  advanceClaimStage: (id: string) => void;
}

export const useClaimStore = create<ClaimState>((set) => ({
  claims: mockClaims,
  addClaim: (newClaim) => {
    const claimId = `clm-${Math.floor(100 + Math.random() * 900)}`;
    const claimNumber = `CLM-${newClaim.category.substring(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];
    
    const claim: Claim = {
      ...newClaim,
      id: claimId,
      claimNumber,
      dateFiled: today,
      status: 'Submitted',
      timeline: [
        { stage: 'Submitted', date: today, completed: true, remarks: 'Claim filed via Aegis Secure Portal.' },
        { stage: 'Under Review', date: today, completed: false, remarks: 'Reviewing uploaded bills and receipts.' },
        { stage: 'Approved', date: '', completed: false, remarks: '' },
        { stage: 'Settlement', date: '', completed: false, remarks: '' }
      ]
    };
    
    set((state) => ({ claims: [claim, ...state.claims] }));
  },
  advanceClaimStage: (id) => set((state) => ({
    claims: state.claims.map((c) => {
      if (c.id !== id) return c;
      const today = new Date().toISOString().split('T')[0];
      let newStatus: Claim['status'] = c.status;
      const newTimeline = [...c.timeline];
      
      if (c.status === 'Submitted') {
        newStatus = 'Under Review';
        newTimeline[1] = { ...newTimeline[1], completed: true, date: today };
      } else if (c.status === 'Under Review') {
        newStatus = 'Approved';
        newTimeline[2] = { ...newTimeline[2], completed: true, date: today, remarks: 'Cashless claim approved by surveyor.' };
      } else if (c.status === 'Approved') {
        newStatus = 'Settlement';
        newTimeline[3] = { ...newTimeline[3], completed: true, date: today, remarks: 'Funds released to network partner.' };
      }
      
      return { ...c, status: newStatus, timeline: newTimeline };
    })
  })),
}));

// ----------------------------------------------------
// 4. EMERGENCY SOS STORE
// ----------------------------------------------------
interface EmergencyState {
  sosActive: boolean;
  liveLocationActive: boolean;
  gpsCoordinates: { lat: number; lng: number };
  medicalId: typeof mockUser;
  hospitals: CashlessHospital[];
  triggerSos: (active: boolean) => void;
  toggleLiveLocation: () => void;
}

export const useEmergencyStore = create<EmergencyState>((set) => ({
  sosActive: false,
  liveLocationActive: false,
  gpsCoordinates: { lat: 22.5726, lng: 88.3639 }, // Central Kolkata Area
  medicalId: mockUser,
  hospitals: mockHospitals,
  triggerSos: (active) => set({ sosActive: active }),
  toggleLiveLocation: () => set((state) => ({ 
    liveLocationActive: !state.liveLocationActive 
  })),
}));

// ----------------------------------------------------
// 5. REWARDS STORE
// ----------------------------------------------------
interface RewardState {
  coins: number;
  habits: RewardHabit[];
  logActivity: (id: string, value: number) => void;
  claimReward: (id: string) => void;
}

export const useRewardStore = create<RewardState>((set) => ({
  coins: 3450,
  habits: mockHabits,
  logActivity: (id, value) => set((state) => {
    const updatedHabits = state.habits.map((h) => {
      if (h.id !== id) return h;
      const newCurrent = Math.min(h.current + value, h.target);
      const newPct = (newCurrent / h.target) * 100;
      return { ...h, current: newCurrent, progressPercentage: newPct };
    });
    return { habits: updatedHabits };
  }),
  claimReward: (id) => set((state) => {
    const habit = state.habits.find((h) => h.id === id);
    if (!habit || habit.current < habit.target) return {};
    
    // Reset habit and add coins
    const updatedHabits = state.habits.map((h) => 
      h.id === id ? { ...h, current: 0, progressPercentage: 0 } : h
    );
    
    return {
      coins: state.coins + habit.coinsReward,
      habits: updatedHabits
    };
  }),
}));

// ----------------------------------------------------
// 6. AI COPILOT CHAT STORE
// ----------------------------------------------------
export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  isLoading?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (text: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello Joydip! 👋\nI've analyzed your protection portfolio. What would you like to review today?",
      time: 'Just now'
    }
  ],
  isTyping: false,
  sendMessage: (text) => {
    const userMsgId = `msg-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      time: 'Just now'
    };
    
    set((state) => ({ 
      messages: [...state.messages, userMsg],
      isTyping: true 
    }));
    
    // Simulate AI thinking and response
    setTimeout(() => {
      let responseText = '';
      
      const query = text.toLowerCase();
      if (query.includes('explain') || query.includes('policy')) {
        responseText = `Certainly. Your **Global Health Elite** policy (No: \`IND-HLTH-8829-GE\`) provides ₹2.5 Crore coverage. Key parameters in plain English:\n- **Cashless Treatment**: Available at 840 premium network hospitals globally.\n- **Room Capping**: None. You are eligible for luxury suites.\n- **Organ Donor Costs**: Fully covered.\n- **Waiting Period**: pre-existing conditions covered after 2 years (waived for accident emergencies).`;
      } else if (query.includes('review') || query.includes('coverage') || query.includes('what insurance') || query.includes('need') || query.includes('gap')) {
        responseText = `Based on my analysis of your asset registry and profile, you have two primary coverage gaps:\n\n1. **Pet Insurance**: Your golden retriever, Shadow (3 years old), is currently uninsured. A medical emergency could cost up to ₹5 Lakhs. I recommend activating **Aegis Pet Shield** (Premium: ₹8,000/year).\n2. **Under-Insurance on Estate**: Due to real estate price trends in Worli (+8% growth), your **Sovereign Estate Plus** policy is currently under-insured. I recommend raising the sum insured by ₹1 Crore.`;
      } else if (query.includes('hospital') || query.includes('cashless') || query.includes('find')) {
        responseText = `I've scanned the network ledger near Worli, Mumbai. Here are your nearest premium **cashless partner hospitals** covered under your **Global Health Elite** policy:\n\n1. **Breach Candy Hospital** (2.4 km) - Multi-specialty, 100% cashless check-in.\n2. **Jaslok Hospital & Research Centre** (3.1 km) - Advanced cardiology & oncology.\n3. **Sir H.N. Reliance Foundation Hospital** (5.8 km) - Premium tertiary care.\n\nWould you like me to pre-authorize a cashless admission pass or guide you with navigation?`;
      } else if (query.includes('estimate') || query.includes('claim')) {
        responseText = `Under your **Prestige Motor Guard** policy, a cashless payout of ₹1,20,000 was settled for your Porsche Taycan's bumper repair at Porsche Centre Worli.\n\nFor new claims, such as minor fender-benders or home water seepage, you can upload bills via the **Claims Center** for instant AI-driven OCR appraisal. Typically, cashless claims are estimated and approved within 15 minutes.`;
      } else if (query.includes('renew')) {
        responseText = `You have **1 upcoming renewal**:\n- **Sovereign Estate Plus** (Policy No: \`IND-EST-4920-SE\`)\n- **Expiry**: In 30 days (August 17, 2026)\n- **Premium due**: ₹45,000\n\nI recommend renewing now to avoid any lapse in coverage. Would you like me to initiate the secure auto-payment from your linked vault?`;
      } else if (query.includes('emergency') || query.includes('sos')) {
        responseText = `⚠️ **EMERGENCY SOS MODE PRE-ACTIVATED** ⚠️\n\nI've queued emergency protocols. If you are facing an active crisis:\n1. Tap the **SOS button** on the Emergency page immediately.\n2. We will dispatch ambulance services and broadcast your GPS coordinates (Worli Sea Link Area) to your primary emergency contacts.\n3. A dedicated claims concierge will be assigned to you instantly.\n\nStay calm, assistance is ready.`;
      } else if (query.includes('family') || query.includes('add')) {
        responseText = `To add a family member (e.g. Shadow or new members) to your protection plan:\n1. Go to the **Family Protection** page.\n2. Tap **Add Member**.\n3. Input Aadhaar details (or Breed details for Pets).\n4. Select policy customization (e.g., Global Health Rider).`;
      } else {
        responseText = `I have logged your request: "${text}". As your Sovereign AI advisor, I confirm that your active assets are currently secured under the IndusInd Bank vault. Is there any specific policy adjustment or cashless hospital verification you require?`;
      }
      
      const aiMsgId = `msg-${Date.now() + 1}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: responseText,
        time: 'Just now'
      };
      
      set((state) => ({
        messages: [...state.messages, aiMsg],
        isTyping: false
      }));
    }, 1500);
  }
}));

// ----------------------------------------------------
// 7. NOTIFICATIONS STORE
// ----------------------------------------------------
interface NotificationState {
  notifications: NotificationItem[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: mockNotifications,
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),
  addNotification: (n) => {
    const newNot: NotificationItem = {
      ...n,
      id: `not-${Date.now()}`,
      time: 'Just now',
      read: false
    };
    set((state) => ({ notifications: [newNot, ...state.notifications] }));
  }
}));
