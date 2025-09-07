import React, { useState } from 'react';
import { QrCode, ArrowLeft, Leaf, Shield, Clock, MapPin, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import QRScanner from '@/components/QRScanner';
import { QRData } from '@/components/QRGenerator';
import ThemeToggle from '@/components/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConsumerPortalProps {
  onBack: () => void;
}

interface TraceabilityStage {
  stage: string;
  actor: string;
  location: string;
  timestamp: string;
  status: 'completed' | 'current' | 'pending';
  details?: string;
}

const ConsumerPortal: React.FC<ConsumerPortalProps> = ({ onBack }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<QRData | null>(null);
  const { translate } = useLanguage();

  const handleScan = (data: QRData) => {
    setScannedData(data);
    setShowScanner(false);
  };

  const getTraceabilityData = (data: QRData): TraceabilityStage[] => {
    return [
      {
        stage: 'Farming',
        actor: `Farmer ${data.farmerId}`,
        location: data.location,
        timestamp: data.timestamp,
        status: 'completed',
        details: `${data.quantity}kg of ${data.herbName} harvested`
      },
      {
        stage: 'Collection',
        actor: 'Aggregator AG001',
        location: 'Karnataka Collection Center',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        details: 'Quality checked and collected'
      },
      {
        stage: 'Processing',
        actor: 'Processor PR001',
        location: 'Bangalore Processing Unit',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        details: 'Cleaned, dried, and certified'
      },
      {
        stage: 'Distribution',
        actor: 'Distributor DT001',
        location: 'Regional Warehouse',
        timestamp: new Date().toISOString(),
        status: 'current',
        details: 'Ready for retail distribution'
      },
      {
        stage: 'Retail',
        actor: 'Retail Store',
        location: 'Local Market',
        timestamp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        details: 'Awaiting final delivery'
      }
    ];
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: TraceabilityStage['status']) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'current': return 'bg-warning text-warning-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-white hover:bg-white/10 mr-4"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <img 
                src="/lovable-uploads/fcdc47b6-2469-4d53-9a75-20f63f9e223d.png" 
                alt="Rootra Logo"
                className="w-8 h-8 mr-3"
              />
              <h1 className="text-xl font-bold text-white">
                Consumer Portal
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {!scannedData ? (
          // Scanner Interface
          <div className="text-center py-12">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {translate('scan.qr')}
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
                Verify the authenticity and trace the journey of your herbal products
              </p>
            </div>

            <Button
              onClick={() => setShowScanner(true)}
              size="lg"
              className="bg-white text-herbal-green hover:bg-white/90 font-semibold px-8"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Open Camera
            </Button>

            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Shield className="w-8 h-8 mx-auto mb-3 text-success" />
                  <h3 className="font-semibold mb-2">Verify Authenticity</h3>
                  <p className="text-sm text-white/80">
                    Ensure your herbal products are genuine and certified
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-3 text-success" />
                  <h3 className="font-semibold mb-2">Track Journey</h3>
                  <p className="text-sm text-white/80">
                    See the complete journey from farm to your hands
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Leaf className="w-8 h-8 mx-auto mb-3 text-success" />
                  <h3 className="font-semibold mb-2">Quality Assured</h3>
                  <p className="text-sm text-white/80">
                    View quality certificates and processing details
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Traceability Results
          <div className="space-y-6 py-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setScannedData(null)}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Scan Another
              </Button>
            </div>

            {/* Product Info */}
            <Card className="bg-white/95 dark:bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-success" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{scannedData.herbName}</h3>
                    <p className="text-muted-foreground">Batch ID: {scannedData.batchId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-success">{scannedData.quantity} kg</p>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Farmer {scannedData.farmerId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{scannedData.farmerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{scannedData.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traceability Timeline */}
            <Card className="bg-white/95 dark:bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Supply Chain Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getTraceabilityData(scannedData).map((stage, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(stage.status)}`} />
                        {index < getTraceabilityData(scannedData).length - 1 && (
                          <div className="w-0.5 h-16 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{stage.stage}</h3>
                          <Badge className={getStatusColor(stage.status)}>
                            {stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {stage.actor} • {stage.location}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {formatDate(stage.timestamp)}
                        </p>
                        {stage.details && (
                          <p className="text-sm">{stage.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Certificate */}
            <Card className="bg-white/95 dark:bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  Quality Certificate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                  <div>
                    <p className="font-semibold text-success">✓ Certified Organic</p>
                    <p className="text-sm text-muted-foreground">
                      Meets all quality standards and safety requirements
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <QRScanner
        isOpen={showScanner}
        onScan={handleScan}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
};

export default ConsumerPortal;