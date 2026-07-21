import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HeaderBar } from './components/HeaderBar';
import { BottomNavigationBar } from './components/BottomNavigationBar';
import { Onboarding } from './pages/Onboarding';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PoliciesWallet } from './pages/PoliciesWallet';
import { ComparePolicies } from './pages/ComparePolicies';
import { BuyInsurance } from './pages/BuyInsurance';
import { AICopilot } from './pages/AICopilot';
import { ClaimsCenter } from './pages/ClaimsCenter';
import { EmergencySOS } from './pages/EmergencySOS';
import { FamilyProtection } from './pages/FamilyProtection';
import { Rewards } from './pages/Rewards';
import { ProfileSettings } from './pages/ProfileSettings';
import { Notifications } from './pages/Notifications';
import { MyActivePolicies } from './pages/MyActivePolicies';
import { PolicyDetails } from './pages/PolicyDetails';
import { Toaster } from 'sonner';

// Layout Wrapper to conditionally show Header, BottomNav and Mobile Viewport Frame
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Hide global layout items for Splash/Onboarding and Login screens
  const hideLayout = currentPath === '/' || currentPath === '/login';

  return (
    <div className="desktop-viewport-canvas">
      {/* Mobile Device Viewport Frame (Centered on Desktop) */}
      <div className="mobile-device-viewport">
        {/* Inner Mobile Viewport App Canvas */}
        <div className="w-full h-full overflow-y-auto overflow-x-hidden relative no-scrollbar flex flex-col bg-background text-on-surface">
          {!hideLayout && <HeaderBar />}
          
          <main className={`flex-grow ${!hideLayout ? 'pt-[88px] pb-[120px]' : ''}`}>
            {children}
          </main>

          {!hideLayout && <BottomNavigationBar />}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Toaster 
        theme="dark" 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'rgba(23, 23, 23, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#e5e2e1',
          }
        }} 
      />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/policies" element={<PoliciesWallet />} />
          <Route path="/compare" element={<ComparePolicies />} />
          <Route path="/buy" element={<BuyInsurance />} />
          <Route path="/copilot" element={<AICopilot />} />
          <Route path="/claims" element={<ClaimsCenter />} />
          <Route path="/emergency" element={<EmergencySOS />} />
          <Route path="/family" element={<FamilyProtection />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/active-policies" element={<MyActivePolicies />} />
          <Route path="/policy-details/:policyId" element={<PolicyDetails />} />
          {/* Catch-all redirect to Onboarding */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
