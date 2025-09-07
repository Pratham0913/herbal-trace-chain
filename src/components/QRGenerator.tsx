import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface QRData {
  batchId: string;
  farmerId: string;
  farmerPhone: string;
  herbName: string;
  quantity: number;
  timestamp: string;
  stage: string;
  location: string;
}

interface QRGeneratorProps {
  data: QRData;
  size?: number;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ data, size = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (canvasRef.current) {
      generateQR();
    }
  }, [data]);

  const generateQR = async () => {
    if (!canvasRef.current) return;

    try {
      const qrData = JSON.stringify(data);
      await QRCode.toCanvas(canvasRef.current, qrData, {
        width: size,
        margin: 2,
        color: {
          dark: '#22c55e', // Rootra green
          light: '#ffffff',
        },
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQR = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `Rootra-${data.batchId}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
    
    toast({
      title: "QR Code Downloaded",
      description: "QR code saved successfully",
    });
  };

  const copyQRData = () => {
    const qrData = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(qrData);
    
    toast({
      title: "QR Data Copied",
      description: "QR code data copied to clipboard",
    });
  };

  return (
    <Card className="portal-card">
      <CardHeader>
        <CardTitle className="text-center">Batch QR Code</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex justify-center">
          <canvas 
            ref={canvasRef}
            className="border border-border rounded-lg shadow-herbal"
          />
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Batch ID:</strong> {data.batchId}</p>
          <p><strong>Herb:</strong> {data.herbName}</p>
          <p><strong>Quantity:</strong> {data.quantity} kg</p>
          <p><strong>Stage:</strong> {data.stage}</p>
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button onClick={downloadQR} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={copyQRData} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRGenerator;