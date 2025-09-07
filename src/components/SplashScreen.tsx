import React, { useEffect, useState } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { translate } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade-out animation
    }, 3500); // Show for 3.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-hero transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className={`text-center ${isVisible ? 'animate-fade-in-scale' : 'animate-fade-out-scale'}`}>
        <div className="mb-8 flex justify-center">
          <img 
            src="/lovable-uploads/fcdc47b6-2469-4d53-9a75-20f63f9e223d.png" 
            alt="Rootra Logo"
            className="w-32 h-32 animate-bounce-gentle"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          {translate('app.name')}
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 font-medium max-w-md mx-auto leading-relaxed">
          {translate('splash.quote')}
        </p>
        
        <div className="mt-8 flex justify-center">
          <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="w-full h-full bg-white rounded-full animate-pulse-soft"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;