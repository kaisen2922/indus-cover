export interface UserProfile {
  name: string;
  avatar: string;
  protectionScore: number;
  kycStatus: 'Verified' | 'Pending' | 'Failed';
  aadhaarNumber: string; // e.g. XXXX-XXXX-1234
  panNumber: string;     // e.g. ABCDE1234F
  drivingLicense: string;
  vehicleRC: string;
  fastagId: string;
  email: string;
  phone: string;
  address: string;
  bloodGroup: string;
  medicalConditions: string[];
  allergies: string[];
}

export interface Policy {
  id: string;
  category: 'Health' | 'Motor' | 'Travel' | 'Home' | 'Life' | 'Pet' | 'Cyber' | 'Accident';
  title: string;
  policyNumber: string;
  provider: string;
  sumInsured: number; // in INR
  premium: number;    // monthly in INR
  renewalDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'GRACE_PERIOD';
  details: {
    description: string;
    coverage: string[];
    waitingPeriod?: string;
    networkHospitalsCount?: number;
    benefits: string[];
    address?: string;
    vehicles?: string[];
    beneficiaries?: string[];
  };
  aiInsight?: string;
}

export interface CashlessHospital {
  name: string;
  distance: string;
  address: string;
  phone: string;
  specialties: string[];
  cashlessSupport: boolean;
  latitude: number;
  longitude: number;
}

export interface Claim {
  id: string;
  policyId: string;
  policyTitle: string;
  category: string;
  claimNumber: string;
  amount: number;
  dateFiled: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Settlement';
  description: string;
  timeline: {
    stage: string;
    date: string;
    completed: boolean;
    remarks?: string;
  }[];
  bills: string[];
  photos: string[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Father' | 'Mother' | 'Spouse' | 'Child' | 'Pet';
  age: number;
  protectionStatus: 'Fully Covered' | 'Gaps Detected' | 'Uninsured';
  policiesConnected: string[];
  avatar: string;
  recommendation?: string;
}

export interface RewardHabit {
  id: string;
  title: string;
  metric: string;
  current: number;
  target: number;
  coinsReward: number;
  iconName: string;
  progressPercentage: number;
}

export interface NotificationItem {
  id: string;
  type: 'renewal' | 'claim' | 'ai' | 'promo';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ----------------------------------------------------
// MOCK DATA IMPLEMENTATION
// ----------------------------------------------------

export const mockUser: UserProfile = {
  name: 'Joydip Acharjee',
  avatar: '', // Removed profile picture
  protectionScore: 92,
  kycStatus: 'Verified',
  aadhaarNumber: 'XXXX-XXXX-8924',
  panNumber: 'BIPPS9201L',
  drivingLicense: 'DL-1420210087654',
  vehicleRC: 'RC-MH12TC2024-9988',
  fastagId: 'FT-4402199-IND',
  email: 'joydip.acharjee@induscover.ai',
  phone: '+91 98765 43210',
  address: '223 Tollygunge Kolkata 700088',
  bloodGroup: 'O+ Positive',
  medicalConditions: ['Mild Hypertension'],
  allergies: ['Penicillin', 'Dust Mites'],
};

export const mockPolicies: Policy[] = [
  {
    id: 'pol-health',
    category: 'Health',
    title: 'Global Health Elite',
    policyNumber: 'IND-HLTH-8829-GE',
    provider: 'IndusInd Premium Care',
    sumInsured: 25000000, // ₹2.5 Crore
    premium: 4200, // ₹4,200/month
    renewalDate: '2026-10-12',
    status: 'ACTIVE',
    details: {
      description: 'Comprehensive global health protection including international cashless treatments, air ambulance, and premium room customization.',
      coverage: [
        'Cashless global treatments',
        'Air Ambulance coverage up to ₹50 Lakhs',
        'No room-rent capping',
        'Alternative medicines (Ayush) cover',
        'Organ donor expenses'
      ],
      waitingPeriod: '2 Years for Pre-existing conditions (Waived for Accidental)',
      networkHospitalsCount: 840,
      benefits: [
        'Maternity benefit up to ₹2 Lakhs',
        'Free annual health screening',
        'Unlimited restore of sum insured'
      ],
      beneficiaries: ['Joydip Acharjee (Proposer)', 'Priyanjali Acharjee (Spouse)', 'Aarav Acharjee (Son)']
    },
    aiInsight: 'Your current coverage exceeds standard luxury benchmarks by 15%. Consider adjusting deductible in your next renewal for ₹400/mo savings.'
  },
  {
    id: 'pol-motor',
    category: 'Motor',
    title: 'Prestige Motor Guard',
    policyNumber: 'IND-MTR-0021-PM',
    provider: 'IndusInd General Insurance',
    sumInsured: 2500000, // ₹25 Lakh
    premium: 8900, // ₹8,900/month
    renewalDate: '2027-01-24',
    status: 'ACTIVE',
    details: {
      description: 'Zero-depreciation comprehensive insurance for luxury passenger vehicles. Includes engine protection, return to invoice, and roadside concierge.',
      coverage: [
        'Zero depreciation on all parts',
        'Return to Invoice cover',
        'Engine and gearbox protection',
        'Key replacement & lock-out service',
        'Consumables cover'
      ],
      waitingPeriod: 'Instant (24h validation)',
      networkHospitalsCount: 420, // garages
      benefits: [
        'Unlimited roadside assistance within India',
        'Courtesy premium vehicle for 5 days during repairs',
        'Personal accident cover for passengers up to ₹15 Lakhs'
      ],
      vehicles: ['2025 Porsche Taycan 4S (MH-12-TC-2024)']
    },
    aiInsight: 'Safe Driving discount of 15% applied based on Aegis Safe Commute logs. Keep it up!'
  },
  {
    id: 'pol-home',
    category: 'Home',
    title: 'Estate Shield Plus',
    policyNumber: 'IND-HOME-4401-SE',
    provider: 'IndusInd Legacy Safe',
    sumInsured: 10000000, // ₹1 Crore
    premium: 12450, // ₹12,450/month (Equivalent to ₹1.49 Lakhs Annually)
    renewalDate: '2027-03-05',
    status: 'ACTIVE',
    details: {
      description: 'All-risk mansion and estate coverage securing physical structure, valuable fine art, electronic equipment, and sovereign security systems.',
      coverage: [
        'Fire, earthquake, and flood cover',
        'Burglary and theft of fine art & gold',
        'Alternative accommodation allowance',
        'Public liability cover up to ₹1 Crore',
        'Terrorism damage protection'
      ],
      benefits: [
        'Valuable jewelry and watches covered worldwide',
        'Rebuilding cost evaluation alignment',
        'Cyber-Sovereign Rider for connected home servers'
      ],
      address: '223 Tollygunge Kolkata 700088'
    },
    aiInsight: 'Worli property valuation increased by 8% this quarter. AI suggests raising the sum insured by ₹1 Crore to prevent under-insurance.'
  },
  {
    id: 'pol-life',
    category: 'Life',
    title: 'Heritage Legacy Plan',
    policyNumber: 'IND-LIFE-9005-HL',
    provider: 'IndusInd HNW Assurance',
    sumInsured: 5000000, // ₹50 Lakh
    premium: 11500, // ₹11,500/month
    renewalDate: '2026-12-31',
    status: 'ACTIVE',
    details: {
      description: 'HNW term assurance linked with trust distribution structures. Provides immediate financial backup and inheritance tax-efficiency strategies.',
      coverage: [
        'Pure term life insurance coverage',
        'Critical illness booster cover',
        'Accidental death & dismemberment benefit',
        'Terminal illness immediate payout'
      ],
      benefits: [
        'Trust-linked distribution automation',
        'Dual premium taxation benefits under Sec 80C',
        'Dedicated inheritance concierge advisor'
      ],
      beneficiaries: ['The Acharjee Family Trust (70%)', 'Global Wildlife Fund India (30%)']
    },
    aiInsight: 'Your estate and term policies are synchronized with the Sterling Family Trust. No action needed.'
  }
];

export const mockHospitals: CashlessHospital[] = [
  {
    name: 'Apollo Multispeciality Hospitals',
    distance: '1.8 km',
    address: '58 Canal Circular Road, Kolkata, West Bengal 700054',
    phone: '+91 33 2320 3040',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Emergency Medicine'],
    cashlessSupport: true,
    latitude: 22.5694,
    longitude: 88.4035
  },
  {
    name: 'AMRI Hospital Dhakuria',
    distance: '3.2 km',
    address: 'P-4 & P-5, Gariahat Road, Kolkata, West Bengal 700029',
    phone: '+91 33 6680 0000',
    specialties: ['Orthopaedics', 'Cardiology', 'General Surgery'],
    cashlessSupport: true,
    latitude: 22.5115,
    longitude: 88.3694
  },
  {
    name: 'Fortis Hospital Anandapur',
    distance: '5.9 km',
    address: '730 EM Bypass, Anandapur, Kolkata, West Bengal 700107',
    phone: '+91 33 6628 4444',
    specialties: ['Cardiology', 'Trauma', 'ICU'],
    cashlessSupport: true,
    latitude: 22.5175,
    longitude: 88.4012
  },
  {
    name: 'Medica Superspecialty Hospital',
    distance: '6.4 km',
    address: '127 Mukundapur, EM Bypass, Kolkata, West Bengal 700099',
    phone: '+91 33 6652 0000',
    specialties: ['Cardiology', 'Neurology', 'ICU', 'Trauma'],
    cashlessSupport: true,
    latitude: 22.4862,
    longitude: 88.3975
  }
];

export const mockClaims: Claim[] = [
  {
    id: 'clm-001',
    policyId: 'pol-motor',
    policyTitle: 'Prestige Motor Guard',
    category: 'Motor',
    claimNumber: 'CLM-MTR-2026-9801',
    amount: 120000, // ₹1.2 Lakhs
    dateFiled: '2026-07-02',
    status: 'Settlement',
    description: 'Front bumper and headlamp assembly replacement due to minor scrape at Worli Sea Link Toll gate.',
    timeline: [
      { stage: 'Submitted', date: '2026-07-02', completed: true, remarks: 'Claim filed securely with dashcam video proof.' },
      { stage: 'Under Review', date: '2026-07-03', completed: true, remarks: 'Surveyor assigned: Amit Sharma. Vehicle inspected at Porsche Worli.' },
      { stage: 'Approved', date: '2026-07-05', completed: true, remarks: 'Repairs approved under cashless service. Zero-depreciation fully applied.' },
      { stage: 'Settlement', date: '2026-07-09', completed: true, remarks: 'Payout of ₹1,20,000 processed directly to Porsche Centre Mumbai.' }
    ],
    bills: ['porsche_invoice_signed.pdf'],
    photos: ['bumper_damage.jpg', 'bumper_repair_completed.jpg']
  },
  {
    id: 'clm-002',
    policyId: 'pol-health',
    policyTitle: 'Global Health Elite',
    category: 'Health',
    claimNumber: 'CLM-HLT-2026-1122',
    amount: 45000, // ₹45,000
    dateFiled: '2026-06-15',
    status: 'Approved',
    description: 'Executive preventive cardiology panel and stress-test diagnostic screening at Kokilaben Ambani Hospital.',
    timeline: [
      { stage: 'Submitted', date: '2026-06-15', completed: true, remarks: 'Cashless request submitted by hospital desk.' },
      { stage: 'Under Review', date: '2026-06-15', completed: true, remarks: 'Pre-auth team reviewed medical requirements.' },
      { stage: 'Approved', date: '2026-06-16', completed: true, remarks: 'Cashless pre-auth approved. Co-pay: ₹0.' }
    ],
    bills: ['diagnostics_bill.pdf'],
    photos: []
  },
  {
    id: 'clm-003',
    policyId: 'pol-home',
    policyTitle: 'Sovereign Estate Plus',
    category: 'Home',
    claimNumber: 'CLM-HOM-2026-3021',
    amount: 350000, // ₹3.5 Lakhs
    dateFiled: '2026-07-14',
    status: 'Under Review',
    description: 'Water seepage damage to custom mahogany wall panels in private library due to AC drainage pipe rupture.',
    timeline: [
      { stage: 'Submitted', date: '2026-07-14', completed: true, remarks: 'Photos of library damage and contractor repair quote uploaded.' },
      { stage: 'Under Review', date: '2026-07-15', completed: false, remarks: 'Assigned to Home Claims Desk. Awaiting physical/virtual site survey.' }
    ],
    bills: ['mahogany_renovation_estimate.pdf'],
    photos: ['water_damage_wall.png', 'water_damage_ceiling.png']
  }
];

export const mockFamily: FamilyMember[] = [
  {
    id: 'fam-father',
    name: 'Amitabh Sen',
    relation: 'Father',
    age: 68,
    protectionStatus: 'Fully Covered',
    policiesConnected: ['Global Health Elite', 'Heritage Legacy Term'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    recommendation: 'Annual cardiac checkup is due next month under Global Health benefits.'
  },
  {
    id: 'fam-mother',
    name: 'Jaya Sen',
    relation: 'Mother',
    age: 64,
    protectionStatus: 'Fully Covered',
    policiesConnected: ['Global Health Elite'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'fam-spouse',
    name: 'Priyanjali Sen',
    relation: 'Spouse',
    age: 34,
    protectionStatus: 'Fully Covered',
    policiesConnected: ['Global Health Elite', 'Heritage Legacy Term'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    recommendation: 'Cyber protection rider has expired for her primary devices. Re-enable rider.'
  },
  {
    id: 'fam-child',
    name: 'Aarav Sen',
    relation: 'Child',
    age: 8,
    protectionStatus: 'Fully Covered',
    policiesConnected: ['Global Health Elite'],
    avatar: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'fam-pet',
    name: 'Shadow',
    relation: 'Pet',
    age: 3,
    protectionStatus: 'Uninsured',
    policiesConnected: [],
    avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150',
    recommendation: 'Aegis Pet Shield covers up to ₹5 Lakhs in veterinary expenses. Annual premium: ₹8,000. Recommend immediate activation.'
  }
];

export const mockHabits: RewardHabit[] = [
  {
    id: 'hbt-steps',
    title: 'Daily Steps Routine',
    metric: 'steps',
    current: 8420,
    target: 10000,
    coinsReward: 50,
    iconName: 'Footprints',
    progressPercentage: 84.2
  },
  {
    id: 'hbt-drive',
    title: 'Safe Commute Score',
    metric: 'score',
    current: 94,
    target: 90,
    coinsReward: 100,
    iconName: 'ShieldCheck',
    progressPercentage: 100
  },
  {
    id: 'hbt-bp',
    title: 'Bi-Weekly BP Logging',
    metric: 'logs',
    current: 1,
    target: 2,
    coinsReward: 30,
    iconName: 'HeartPulse',
    progressPercentage: 50
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'not-001',
    type: 'renewal',
    title: 'Global Health Elite Renewal',
    message: 'Your Global Health Elite premium payment of ₹4,200 is scheduled for auto-debit on Oct 12, 2026. Maintain sufficient balance.',
    time: '2 hours ago',
    read: false
  },
  {
    id: 'not-002',
    type: 'claim',
    title: 'Claim Settlement Processed',
    message: 'Claim CLM-MTR-2026-9801 for ₹1,20,000 has been paid directly to Porsche Centre Worli. Auto-repair closed.',
    time: 'Yesterday',
    read: false
  },
  {
    id: 'not-003',
    type: 'ai',
    title: 'Under-Insurance Warning',
    message: 'AI Copilot detected an 8% increase in Worli property market prices. Raise your home sum insured by ₹1 Crore.',
    time: '3 days ago',
    read: true
  },
  {
    id: 'not-004',
    type: 'promo',
    title: 'IndusInd Elite Benefits',
    message: 'Exclusive: Double Aegis Coins on renewing your vehicle coverage using IndusInd Signature Credit Card.',
    time: '1 week ago',
    read: true
  }
];

export const mockChatSuggestedPrompts = [
  'What insurance do I need?',
  'Explain my policy',
  'Can I claim this?',
  'Add family member to Health plan',
];
