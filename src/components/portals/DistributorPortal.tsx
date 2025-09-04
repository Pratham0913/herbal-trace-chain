import React, { useState } from 'react';
import { QrCode, Truck, Package, Clock, MapPin, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QRScanner from '@/components/QRScanner';
import { QRData } from '@/components/QRGenerator';
import { User } from '@/components/LoginSignup';
import { useToast } from '@/hooks/use-toast';

interface DistributorPortalProps {
  user: User;
}

interface Shipment {
  id: string;
  batchIds: string[];
  origin: string;
  destination: string;
  totalQuantity: number;
  status: 'assigned' | 'picked-up' | 'in-transit' | 'delivered';
  assignedDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  trackingUpdates: TrackingUpdate[];
}

interface TrackingUpdate {
  timestamp: string;
  location: string;
  status: string;
  notes?: string;
}

const DistributorPortal: React.FC<DistributorPortalProps> = ({ user }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<QRData | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<string>('');
  const [newStatus, setNewStatus] = useState('');
  const { toast } = useToast();

  const [shipments] = useState<Shipment[]>([
    {
      id: 'SHP001',
      batchIds: ['HB-TUR001', 'HB-GIN002'],
      origin: 'Karnataka Collection Center',
      destination: 'Bangalore Processing Unit',
      totalQuantity: 80,
      status: 'in-transit',
      assignedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      expectedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      trackingUpdates: [
        {
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Karnataka Collection Center',
          status: 'Picked up',
          notes: 'All batches loaded successfully'
        },
        {
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          location: 'Highway Checkpoint',
          status: 'In transit',
          notes: 'Quality documents verified'
        }
      ]
    },
    {
      id: 'SHP002',
      batchIds: ['HB-NEE003'],
      origin: 'Bangalore Processing Unit',
      destination: 'Mumbai Distribution Hub',
      totalQuantity: 25,
      status: 'assigned',
      assignedDate: new Date().toISOString(),
      expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      trackingUpdates: []
    },
    {
      id: 'SHP003',
      batchIds: ['HB-TUL004'],
      origin: 'Mumbai Distribution Hub',
      destination: 'Delhi Retail Chain',
      totalQuantity: 40,
      status: 'delivered',
      assignedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      expectedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      trackingUpdates: [
        {
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Mumbai Distribution Hub',
          status: 'Picked up'
        },
        {
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Pune Transit Point',
          status: 'In transit'
        },
        {
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Delhi Retail Chain',
          status: 'Delivered'
        }
      ]
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

  const updateShipmentStatus = () => {
    if (!selectedShipment || !newStatus) {
      toast({
        title: "Missing Information",
        description: "Please select shipment and status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Status Updated",
      description: `Shipment ${selectedShipment} status updated to ${newStatus}`,
    });

    setSelectedShipment('');
    setNewStatus('');
  };

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'picked-up': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in-transit': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getStatusIcon = (status: Shipment['status']) => {
    switch (status) {
      case 'assigned': return <Package className="w-4 h-4" />;
      case 'picked-up': return <Truck className="w-4 h-4" />;
      case 'in-transit': return <Route className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
    }
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
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
                <p className="text-sm text-muted-foreground">Active Shipments</p>
                <p className="text-2xl font-bold">
                  {shipments.filter(s => ['assigned', 'picked-up', 'in-transit'].includes(s.status)).length}
                </p>
              </div>
              <Truck className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered Today</p>
                <p className="text-2xl font-bold">
                  {shipments.filter(s => s.status === 'delivered' && 
                    new Date(s.actualDelivery || '').toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Quantity</p>
                <p className="text-2xl font-bold">
                  {shipments.reduce((sum, s) => sum + s.totalQuantity, 0)} kg
                </p>
              </div>
              <Package className="w-8 h-8 text-herbal-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Time Delivery</p>
                <p className="text-2xl font-bold text-success">98%</p>
              </div>
              <Clock className="w-8 h-8 text-success" />
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
                <h3 className="font-semibold mb-2">Batch Information</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Batch ID:</strong> {scannedData.batchId}</p>
                  <p><strong>Herb:</strong> {scannedData.herbName}</p>
                  <p><strong>Quantity:</strong> {scannedData.quantity} kg</p>
                  <p><strong>Current Stage:</strong> {scannedData.stage}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Location</h3>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{scannedData.location}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="herbal-gradient">
                Update Location
              </Button>
              <Button variant="outline">
                Mark as Delivered
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Update */}
      <Card className="portal-card">
        <CardHeader>
          <CardTitle>Update Shipment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Select value={selectedShipment} onValueChange={setSelectedShipment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shipment" />
                </SelectTrigger>
                <SelectContent>
                  {shipments.filter(s => s.status !== 'delivered').map(shipment => (
                    <SelectItem key={shipment.id} value={shipment.id}>
                      {shipment.id} - {shipment.destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="picked-up">Picked Up</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button onClick={updateShipmentStatus} className="w-full herbal-gradient">
                Update Status
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List */}
      <Card className="portal-card">
        <CardHeader>
          <CardTitle>My Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {getStatusIcon(shipment.status)}
                      Shipment {shipment.id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {shipment.batchIds.length} batches • {shipment.totalQuantity} kg
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {shipment.origin} → {shipment.destination}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(shipment.status)}>
                      {shipment.status.toUpperCase().replace('-', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Expected: {formatDateTime(shipment.expectedDelivery)}
                    </span>
                  </div>
                </div>

                {/* Tracking Updates */}
                {shipment.trackingUpdates.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recent Updates:</h4>
                    {shipment.trackingUpdates.slice(-2).map((update, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(update.timestamp)}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span>{update.location}</span>
                        <span>•</span>
                        <span className="font-medium">{update.status}</span>
                        {update.notes && (
                          <>
                            <span>•</span>
                            <span>{update.notes}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Track Route
                  </Button>
                  {shipment.status !== 'delivered' && (
                    <Button size="sm" variant="outline">
                      Update Location
                    </Button>
                  )}
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
    </div>
  );
};

export default DistributorPortal;