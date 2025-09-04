import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, X, Flashlight } from 'lucide-react';
import { QRData } from './QRGenerator';

interface QRScannerProps {
  onScan: (data: QRData) => void;
  onClose: () => void;
  isOpen: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  // Simulate QR scanning (in real app, use a proper QR scanning library)
  const simulateScan = () => {
    const mockQRData: QRData = {
      batchId: 'HB-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      farmerId: 'F001',
      farmerPhone: '+91 98765 43210',
      herbName: 'Turmeric',
      quantity: 50,
      timestamp: new Date().toISOString(),
      stage: 'Harvested',
      location: 'Karnataka, India'
    };
    
    onScan(mockQRData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Scan QR Code</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasPermission === null && (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p>Requesting camera permission...</p>
            </div>
          )}

          {hasPermission === false && (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <p className="text-destructive mb-4">Camera access denied</p>
              <Button onClick={startCamera} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {hasPermission === true && (
            <>
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full aspect-square object-cover rounded-lg bg-black"
                  playsInline
                  muted
                />
                <div className="absolute inset-0 border-2 border-primary rounded-lg">
                  <div className="absolute inset-4 border border-white/50 rounded-lg qr-scanner-overlay">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
                  </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Position the QR code within the frame
                </p>
                <Button onClick={simulateScan} className="herbal-gradient">
                  Simulate Scan (Demo)
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;