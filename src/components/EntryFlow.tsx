import React from 'react';
import { Leaf, Users, QrCode, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import herbalChainLogo from '@/assets/herbalchain-logo.png';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

interface EntryFlowProps {
  onConsumerPortal: () => void;
  onSupplyChainJoin: () => void;
}

const EntryFlow: React.FC<EntryFlowProps> = ({ onConsumerPortal, onSupplyChainJoin }) => {
  const { translate } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-scale">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={herbalChainLogo} 
              alt="HerbalChain Logo" 
              className="w-20 h-20 mr-4"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {translate('app.name')}
              </h1>
              <p className="text-white/80 text-lg mt-2">
                Blockchain-Powered Herbal Supply Chain
              </p>
            </div>
          </div>
          
          <div className="absolute top-6 right-6">
            <ThemeToggle />
          </div>
        </div>

        {/* Entry Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Consumer Option */}
          <Card className="portal-card bg-white/95 dark:bg-card/95 backdrop-blur-sm hover:bg-white dark:hover:bg-card/100 transition-herbal group">
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-herbal">
                  <QrCode className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {translate('entry.consumer')}
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Scan QR codes to verify herbal products and view complete traceability from farm to shelf.
              </p>
              
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 mr-2 text-success" />
                  No signup required
                </div>
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Leaf className="w-4 h-4 mr-2 text-success" />
                  Instant product verification
                </div>
              </div>
              
              <Button 
                onClick={onConsumerPortal}
                size="lg"
                className="w-full herbal-gradient hover:bg-primary/90 text-white font-semibold"
              >
                Start Scanning
              </Button>
            </CardContent>
          </Card>

          {/* Supply Chain Option */}
          <Card className="portal-card bg-white/95 dark:bg-card/95 backdrop-blur-sm hover:bg-white dark:hover:bg-card/100 transition-herbal group">
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-herbal">
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                {translate('entry.supply')}
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join as a Farmer, Aggregator, Distributor, Processor, or Admin to manage the herbal supply chain.
              </p>
              
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 mr-2 text-success" />
                  Secure OTP authentication
                </div>
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Leaf className="w-4 h-4 mr-2 text-success" />
                  Role-based dashboard
                </div>
              </div>
              
              <Button 
                onClick={onSupplyChainJoin}
                variant="outline"
                size="lg"
                className="w-full border-white/20 text-foreground hover:bg-accent/20 font-semibold"
              >
                Login / Signup
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 text-center text-white/80">
          <p className="text-sm">
            Powered by blockchain technology for complete transparency and trust
          </p>
        </div>
      </div>
    </div>
  );
};

export default EntryFlow;