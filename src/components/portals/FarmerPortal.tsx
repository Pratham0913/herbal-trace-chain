import React, { useState } from 'react';
import { Upload, Camera, Leaf, DollarSign, Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import QRGenerator, { QRData } from '@/components/QRGenerator';
import { User } from '@/components/LoginSignup';
import { useGeolocation } from '@/hooks/useGeolocation';
import { reverseGeocode } from '@/services/locationiq';

interface FarmerPortalProps {
  user: User;
}

interface Batch {
  id: string;
  herbName: string;
  quantity: number;
  uploadDate: string;
  status: 'uploaded' | 'collected' | 'processing' | 'distributed';
  qrData: QRData;
  paymentStatus: 'pending' | 'paid';
  amount?: number;
  photo_url?: string;
  timestamp?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

const HERBS = [
  'Turmeric', 'Ginger', 'Neem', 'Tulsi', 'Ashwagandha', 'Brahmi', 
  'Aloe Vera', 'Fenugreek', 'Coriander', 'Mint', 'Moringa', 'Amla'
];

const FarmerPortal: React.FC<FarmerPortalProps> = ({ user }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedHerb, setSelectedHerb] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedLocation, setCapturedLocation] = useState<{
    latitude: number;
    longitude: number;
    timestamp: string;
    address?: string;
  } | null>(null);
  
  const { getCurrentLocation, isLoading: isLoadingLocation } = useGeolocation();
  const [batches, setBatches] = useState<Batch[]>([
    {
      id: 'HB-TUR001',
      herbName: 'Turmeric',
      quantity: 50,
      uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'collected',
      paymentStatus: 'paid',
      amount: 15000,
      qrData: {
        batchId: 'HB-TUR001',
        farmerId: user.id,
        farmerPhone: user.phone || '',
        herbName: 'Turmeric',
        quantity: 50,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        stage: 'Collected',
        location: user.state
      }
    },
    {
      id: 'HB-GIN002',
      herbName: 'Ginger',
      quantity: 30,
      uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'uploaded',
      paymentStatus: 'pending',
      qrData: {
        batchId: 'HB-GIN002',
        farmerId: user.id,
        farmerPhone: user.phone || '',
        herbName: 'Ginger',
        quantity: 30,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        stage: 'Uploaded',
        location: user.state
      }
    }
  ]);

  const { toast } = useToast();

  const captureImage = async () => {
    try {
      // Capture GPS coordinates
      toast({
        title: "Capturing Location",
        description: "Getting GPS coordinates...",
      });
      
      const locationData = await getCurrentLocation();
      
      // Get address from coordinates
      const addressData = await reverseGeocode(locationData.latitude, locationData.longitude);
      
      const location = {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timestamp: locationData.timestamp,
        address: addressData.fullAddress
      };
      
      setCapturedLocation(location);
      
      // Simulate camera capture
      setCapturedImage('/placeholder-herb-image.jpg');
      
      toast({
        title: "Image Captured with Location",
        description: `Photo captured at ${addressData.village || addressData.city || 'current location'}`,
      });
    } catch (error) {
      console.error('Failed to capture image with location:', error);
      toast({
        title: "Location Error", 
        description: "Could not get location. Photo captured without GPS data.",
        variant: "destructive",
      });
      
      // Fallback: capture image without location
      setCapturedImage('/placeholder-herb-image.jpg');
    }
  };

  const handleUpload = () => {
    if (!selectedHerb || !quantity || !capturedImage) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and capture an image",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      const batchId = `HB-${selectedHerb.slice(0, 3).toUpperCase()}${String(batches.length + 1).padStart(3, '0')}`;
      const timestamp = new Date().toISOString();
      
      const newBatch: Batch = {
        id: batchId,
        herbName: selectedHerb,
        quantity: parseInt(quantity),
        uploadDate: timestamp,
        status: 'uploaded',
        paymentStatus: 'pending',
        photo_url: capturedImage,
        timestamp: capturedLocation?.timestamp || timestamp,
        latitude: capturedLocation?.latitude,
        longitude: capturedLocation?.longitude,
        address: capturedLocation?.address,
        qrData: {
          batchId,
          farmerId: user.id,
          farmerPhone: user.phone || '',
          herbName: selectedHerb,
          quantity: parseInt(quantity),
          timestamp: capturedLocation?.timestamp || timestamp,
          stage: 'Uploaded',
          location: capturedLocation?.address || user.state
        }
      };

      setBatches(prev => [newBatch, ...prev]);
      setIsUploading(false);
      setShowUploadForm(false);
      setSelectedHerb('');
      setQuantity('');
      setCapturedImage(null);
      setCapturedLocation(null);

      toast({
        title: "Batch Uploaded Successfully",
        description: `QR code generated for batch ${batchId} with GPS location`,
      });
    }, 2000);
  };

  const getStatusColor = (status: Batch['status']) => {
    switch (status) {
      case 'uploaded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'collected': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'distributed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getPaymentStatusColor = (status: Batch['paymentStatus']) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const totalEarnings = batches
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const pendingPayments = batches
    .filter(b => b.paymentStatus === 'pending')
    .reduce((sum, b) => sum + (b.quantity * 300), 0); // Estimated ₹300 per kg

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-bold">{batches.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-success">₹{totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold text-warning">₹{pendingPayments.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {batches.filter(b => new Date(b.uploadDate).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <Leaf className="w-8 h-8 text-herbal-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button 
          onClick={() => setShowUploadForm(true)}
          className="herbal-gradient"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload New Batch
        </Button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <Card className="portal-card">
          <CardHeader>
            <CardTitle>Upload New Herb Batch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Herb</Label>
                <Select value={selectedHerb} onValueChange={setSelectedHerb}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose herb type" />
                  </SelectTrigger>
                  <SelectContent>
                    {HERBS.map(herb => (
                      <SelectItem key={herb} value={herb}>{herb}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity (kg)</Label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Capture Live Photo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {capturedImage ? (
                  <div>
                    <p className="text-success font-medium mb-2">✓ Image & Location Captured</p>
                    {capturedLocation && (
                      <p className="text-xs text-muted-foreground mb-2">
                        📍 {capturedLocation.address?.slice(0, 60)}...
                      </p>
                    )}
                    <Button 
                      onClick={captureImage} 
                      variant="outline" 
                      size="sm"
                      disabled={isLoadingLocation}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {isLoadingLocation ? 'Getting Location...' : 'Retake Photo'}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      Take a live photo with GPS location
                    </p>
                    <Button 
                      onClick={captureImage} 
                      variant="outline"
                      disabled={isLoadingLocation}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {isLoadingLocation ? 'Getting Location...' : 'Open Camera'}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleUpload}
                disabled={isUploading}
                className="herbal-gradient"
              >
                {isUploading ? 'Uploading...' : 'Upload Batch'}
              </Button>
              <Button 
                onClick={() => setShowUploadForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch List */}
      <Card className="portal-card">
        <CardHeader>
          <CardTitle>My Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {batches.map((batch) => (
              <div key={batch.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{batch.herbName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Batch ID: {batch.id} • {batch.quantity} kg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded: {new Date(batch.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(batch.status)}>
                      {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                    </Badge>
                    <Badge className={getPaymentStatusColor(batch.paymentStatus)}>
                      {batch.paymentStatus === 'paid' ? `Paid ₹${batch.amount?.toLocaleString()}` : 'Payment Pending'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <QRGenerator data={batch.qrData} size={120} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerPortal;