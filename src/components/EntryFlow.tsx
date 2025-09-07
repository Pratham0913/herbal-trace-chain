import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Users, Leaf, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import AyurvedicBackground from '@/components/AyurvedicBackground';

interface EntryFlowProps {
  onConsumerPortal: () => void;
  onSupplyChainJoin: () => void;
}

const EntryFlow: React.FC<EntryFlowProps> = ({ onConsumerPortal, onSupplyChainJoin }) => {
  const { translate } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen relative">
      <AyurvedicBackground />
      <Navbar title="Blockchain-Powered Traceability" />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {translate('home.welcome')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {translate('home.subtitle')}
            </p>
          </div>

          {/* Entry Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-background/95 backdrop-blur-sm border shadow-herbal-lg hover:shadow-herbal-xl transition-all cursor-pointer group"
                  onClick={onConsumerPortal}>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <QrCode className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground">
                  {translate('home.consumer_portal')}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {translate('home.consumer_description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full herbal-gradient text-primary-foreground font-semibold py-3">
                  {translate('home.scan_qr')}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-background/95 backdrop-blur-sm border shadow-herbal-lg hover:shadow-herbal-xl transition-all cursor-pointer group"
                  onClick={onSupplyChainJoin}>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary/80 transition-colors">
                  <Users className="w-8 h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-2xl text-foreground">
                  {translate('home.supply_chain')}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {translate('home.supply_chain_description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold py-3">
                  {translate('home.join_network')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Natural & Organic</h3>
              <p className="text-muted-foreground">Verify the authenticity and organic nature of herbal products</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Blockchain Security</h3>
              <p className="text-muted-foreground">Immutable records ensure product integrity and trust</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Easy Tracking</h3>
              <p className="text-muted-foreground">Simple QR code scanning for complete supply chain visibility</p>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-16 pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm">
              Powered by blockchain technology for transparent and trustworthy herbal supply chains
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default EntryFlow;