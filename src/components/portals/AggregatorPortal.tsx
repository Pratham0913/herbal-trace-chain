import React, { useState } from 'react';
import { QrCode, Users, Package, Phone, MapPin, Truck, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import QRScanner from '@/components/QRScanner';
import { QRData } from '@/components/QRGenerator';
import { User } from '@/components/LoginSignup';
import { useToast } from '@/hooks/use-toast';
import MetaMaskPayment from '@/components/MetaMaskPayment';

interface AggregatorPortalProps {
  user: User;
}

interface FarmerBatch {
  id: string;
  farmerId: string;
  farmerPhone: string;
  herbName: string;
  quantity: number;
  location: string;
  uploadDate: string;
  status: 'available' | 'collected' | 'in-transit';
  distance: string;
}

interface Collection {
  id: string;
  batchIds: string[];
  totalQuantity: number;
  collectionDate: string;
  status: 'planned' | 'in-progress' | 'completed';
  route: string;
}

const AggregatorPortal: React.FC<AggregatorPortalProps> = ({ user }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [scannedData, setScannedData] = useState<QRData | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    recipientName: string;
    amount: number;
    description: string;
  } | null>(null);
  const { toast } = useToast();

  const [availableBatches] = useState<FarmerBatch[]>([
    {
      id: 'HB-TUR001',
      farmerId: 'F001',
      farmerPhone: '+91 98765 43210',
      herbName: 'Turmeric',
      quantity: 50,
      location: 'Mysore, Karnataka',
      uploadDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'available',
      distance: '15 km'
    },
    {
      id: 'HB-GIN002',
      farmerId: 'F002',
      farmerPhone: '+91 98765 43211',
      herbName: 'Ginger',
      quantity: 30,
      location: 'Hassan, Karnataka',
      uploadDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'available',
      distance: '22 km'
    },
    {
      id: 'HB-NEE003',
      farmerId: 'F003',
      farmerPhone: '+91 98765 43212',
      herbName: 'Neem',
      quantity: 25,
      location: 'Bangalore Rural, Karnataka',
      uploadDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: 'available',
      distance: '35 km'
    }
  ]);

  const [collections] = useState<Collection[]>([
    {
      id: 'COL001',
      batchIds: ['HB-TUL004', 'HB-ASH005'],
      totalQuantity: 75,
      collectionDate: new Date().toISOString(),
      status: 'in-progress',
      route: 'Mysore → Hassan → Collection Center'
    }
  ]);

  const handleScan = (data: QRData) => {
    setScannedData(data);
    setShowScanner(false);
    
    toast({
      title: "QR Code Scanned",
      description: `Batch ${data.batchId} details loaded`,
    });
  };

  const handleBatchSelection = (batchId: string) => {
    setSelectedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  const planCollection = () => {
    if (selectedBatches.length === 0) {
      toast({
        title: "No Batches Selected",
        description: "Please select batches to plan collection",
        variant: "destructive",
      });
      return;
    }

    const totalQuantity = availableBatches
      .filter(batch => selectedBatches.includes(batch.id))
      .reduce((sum, batch) => sum + batch.quantity, 0);

    toast({
      title: "Collection Planned",
      description: `Collection route planned for ${selectedBatches.length} batches (${totalQuantity} kg)`,
    });

    setSelectedBatches([]);
  };

  const getStatusColor = (status: FarmerBatch['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'collected': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getCollectionStatusColor = (status: Collection['status']) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const handlePaymentClick = (batch: FarmerBatch) => {
    setPaymentDetails({
      recipientName: `Farmer ${batch.farmerId}`,
      amount: batch.quantity * 0.3, // 0.3 MATIC per kg
      description: `Payment for ${batch.herbName} batch ${batch.id} (${batch.quantity} kg)`
    });
    setShowPayment(true);
  };

  const handlePaymentSuccess = (txHash: string) => {
    toast({
      title: "Payment Successful",
      description: `Payment sent successfully. Transaction: ${txHash.slice(0, 10)}...`,
    });
  };

  const handlePaymentFailure = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Batches</p>
                <p className="text-2xl font-bold">{availableBatches.filter(b => b.status === 'available').length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Farmers</p>
                <p className="text-2xl font-bold">{new Set(availableBatches.map(b => b.farmerId)).size}</p>
              </div>
              <Users className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Quantity</p>
                <p className="text-2xl font-bold">{availableBatches.reduce((sum, b) => sum + b.quantity, 0)} kg</p>
              </div>
              <Package className="w-8 h-8 text-herbal-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collections</p>
                <p className="text-2xl font-bold">{collections.length}</p>
              </div>
              <Truck className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button 
          onClick={() => setShowScanner(true)}
          className="herbal-gradient"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Scan Batch QR
        </Button>
        <Button 
          onClick={planCollection}
          variant="outline"
          disabled={selectedBatches.length === 0}
        >
          <Truck className="w-4 h-4 mr-2" />
          Plan Collection ({selectedBatches.length})
        </Button>
      </div>

      {/* Scanned Batch Details */}
      {scannedData && (
        <Card className="portal-card">
          <CardHeader>
            <CardTitle>Scanned Batch Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Batch Information</Label>
                <div className="mt-2 space-y-1">
                  <p><strong>Batch ID:</strong> {scannedData.batchId}</p>
                  <p><strong>Herb:</strong> {scannedData.herbName}</p>
                  <p><strong>Quantity:</strong> {scannedData.quantity} kg</p>
                  <p><strong>Stage:</strong> {scannedData.stage}</p>
                </div>
              </div>
              <div>
                <Label>Farmer Information</Label>
                <div className="mt-2 space-y-1">
                  <p><strong>Farmer ID:</strong> {scannedData.farmerId}</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{scannedData.farmerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{scannedData.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="herbal-gradient">
                Mark as Collected
              </Button>
              <Button 
                onClick={() => handlePaymentClick({
                  id: scannedData.batchId,
                  farmerId: scannedData.farmerId,
                  farmerPhone: scannedData.farmerPhone,
                  herbName: scannedData.herbName,
                  quantity: scannedData.quantity,
                  location: scannedData.location,
                  uploadDate: scannedData.timestamp,
                  status: 'available',
                  distance: '0 km'
                })}
                variant="outline"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Make Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Batches */}
      <Card className="portal-card">
        <CardHeader>
          <CardTitle>Available Batches for Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableBatches.map((batch) => (
              <div 
                key={batch.id} 
                className={`border border-border rounded-lg p-4 cursor-pointer transition-herbal ${
                  selectedBatches.includes(batch.id) ? 'bg-primary/10 border-primary' : 'hover:bg-accent/50'
                }`}
                onClick={() => handleBatchSelection(batch.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{batch.herbName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Batch ID: {batch.id} • {batch.quantity} kg
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Farmer {batch.farmerId}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {batch.farmerPhone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {batch.location} ({batch.distance})
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(batch.status)}>
                      {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(batch.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Collections */}
      <Card className="portal-card">
        <CardHeader>
          <CardTitle>Current Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collections.map((collection) => (
              <div key={collection.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Collection {collection.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {collection.batchIds.length} batches • {collection.totalQuantity} kg
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Route: {collection.route}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getCollectionStatusColor(collection.status)}>
                      {collection.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(collection.collectionDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Route
                  </Button>
                  <Button size="sm" variant="outline">
                    Update Status
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      const batch = availableBatches.find(b => collection.batchIds.includes(b.id));
                      if (batch) handlePaymentClick(batch);
                    }}
                    className="herbal-gradient"
                  >
                    <Wallet className="w-3 h-3 mr-1" />
                    Pay Farmer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <QRScanner
        isOpen={showScanner}
        onScan={handleScan}
        onClose={() => setShowScanner(false)}
      />

      {paymentDetails && (
        <MetaMaskPayment
          isOpen={showPayment}
          onClose={() => {
            setShowPayment(false);
            setPaymentDetails(null);
          }}
          recipientName={paymentDetails.recipientName}
          amount={paymentDetails.amount}
          description={paymentDetails.description}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}
    </div>
  );
};

export default AggregatorPortal;