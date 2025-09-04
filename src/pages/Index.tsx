import React, { useState } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import SplashScreen from '@/components/SplashScreen';
import EntryFlow from '@/components/EntryFlow';
import LoginSignup, { User } from '@/components/LoginSignup';
import Dashboard from '@/components/Dashboard';
import ConsumerPortal from '@/components/portals/ConsumerPortal';
import FarmerPortal from '@/components/portals/FarmerPortal';
import AggregatorPortal from '@/components/portals/AggregatorPortal';
import DistributorPortal from '@/components/portals/DistributorPortal';
import ProcessorPortal from '@/components/portals/ProcessorPortal';
import AdminPortal from '@/components/portals/AdminPortal';
import Chatbot from '@/components/Chatbot';

type AppState = 'splash' | 'entry' | 'consumer' | 'login' | 'dashboard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [user, setUser] = useState<User | null>(null);

  const renderPortal = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'farmer': return <FarmerPortal user={user} />;
      case 'aggregator': return <AggregatorPortal user={user} />;
      case 'distributor': return <DistributorPortal user={user} />;
      case 'processor': return <ProcessorPortal user={user} />;
      case 'admin': return <AdminPortal user={user} />;
      default: return <div>Portal not found</div>;
    }
  };

  const handleSplashComplete = () => setAppState('entry');
  const handleConsumerPortal = () => setAppState('consumer');
  const handleSupplyChainJoin = () => setAppState('login');
  const handleLoginComplete = (userData: User) => {
    setUser(userData);
    setAppState('dashboard');
  };
  const handleLogout = () => {
    setUser(null);
    setAppState('entry');
  };
  const handleBack = () => setAppState('entry');

  return (
    <ThemeProvider>
      <LanguageProvider>
        {appState === 'splash' && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
        
        {appState === 'entry' && (
          <EntryFlow 
            onConsumerPortal={handleConsumerPortal}
            onSupplyChainJoin={handleSupplyChainJoin}
          />
        )}
        
        {appState === 'consumer' && (
          <ConsumerPortal onBack={handleBack} />
        )}
        
        {appState === 'login' && (
          <LoginSignup 
            onBack={handleBack}
            onComplete={handleLoginComplete}
          />
        )}
        
        {appState === 'dashboard' && user && (
          <Dashboard user={user} onLogout={handleLogout}>
            {renderPortal()}
          </Dashboard>
        )}

        <Chatbot />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;
