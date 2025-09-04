import React, { useState } from 'react';
import { QrCode, FileText, Upload, AlertTriangle, CheckCircle, Calendar, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import QRScanner from '@/components/QRScanner';
import { QRData } from '@/components/QRGenerator';
import { User } from '@/components/LoginSignup';
import { useToast } from '@/hooks/use-toast';
import MetaMaskPayment from '@/components/MetaMaskPayment';

interface ProcessorPortalProps {
  user: User;
}

interface ProcessingBatch {
  id: string;
  herbName: string;
  quantity: number;
  receivedDate: string;
  processingStage: 'received' | 'cleaning' | 'drying' | 'grinding' | 'packaging' | 'completed';
  qualityCertificate?: {
    id: string;
    uploadDate: string;
    expiryDate: string;
    status: 'active' | 'expiring' | 'expired';
  };
  progress: number;
}

const ProcessorPortal: React.FC<ProcessorPortalProps> = ({ user }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<QRData | null>(null);
  const [showUploadForm, setShowUploadForm] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    recipientName: string;
    amount: number;
    description: string;
  } | null>(null);
  const { toast } = useToast();

  const [batches, setBatches] = useState<ProcessingBatch[]>([
    {
      id: 'HB-TUR001',
      herbName: 'Turmeric',
      quantity: 50,
      receivedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      processingStage: 'grinding',
      progress: 75,
      qualityCertificate: {
        id: 'QC-TUR001',
        uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      }
    },
    {
      id: 'HB-GIN002',
      herbName: 'Ginger',
      quantity: 30,
      receivedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      processingStage: 'drying',
      progress: 45,
    },
    {
      id: 'HB-NEE003',
      herbName: 'Neem',
      quantity: 25,
      receivedDate: new Date().toISOString(),
      processingStage: 'received',
      progress: 10,
      qualityCertificate: {
        id: 'QC-NEE003',
        uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'expiring'
      }
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

  const updateProcessingStage = (batchId: string, newStage: ProcessingBatch['processingStage']) => {
    setBatches(prev => 
      prev.map(batch => 
        batch.id === batchId 
          ? { 
              ...batch, 
              processingStage: newStage,
              progress: getProgressForStage(newStage)
            }
          : batch
      )
    );

    toast({
      title: "Stage Updated",
      description: `Batch ${batchId} moved to ${newStage} stage`,
    });
  };

  const uploadCertificate = (batchId: string) => {
    // Simulate certificate upload
    setTimeout(() => {
      setBatches(prev => 
        prev.map(batch => 
          batch.id === batchId 
            ? { 
                ...batch, 
                qualityCertificate: {
                  id: `QC-${batchId}`,
                  uploadDate: new Date().toISOString(),
                  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                  status: 'active'
                }
              }
            : batch
        )
      );

      setShowUploadForm(null);
      toast({
        title: "Certificate Uploaded",
        description: `Quality certificate uploaded for batch ${batchId}`,
      });
    }, 1500);
  };

  const getProgressForStage = (stage: ProcessingBatch['processingStage']): number => {
    const stageProgress = {
      'received': 10,
      'cleaning': 25,
      'drying': 45,
      'grinding': 75,
      'packaging': 90,
      'completed': 100
    };
    return stageProgress[stage];
  };

  const getStageColor = (stage: ProcessingBatch['processingStage']) => {
    switch (stage) {
      case 'received': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'drying': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'grinding': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'packaging': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getCertificateStatusColor = (status: 'active' | 'expiring' | 'expired') => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'expiring': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const expiringSoon = batches.filter(b => 
    b.qualityCertificate?.status === 'expiring'
  ).length;

  const missingCertificates = batches.filter(b => 
    !b.qualityCertificate && b.processingStage !== 'received'
  ).length;

  const handlePaymentClick = (batch: ProcessingBatch) => {
    setPaymentDetails({
      recipientName: `Distributor - Processing Fee`,
      amount: batch.quantity * 0.15, // 0.15 MATIC per kg
      description: `Payment for processing ${batch.herbName} batch ${batch.id} (${batch.quantity} kg)`
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
                <p className="text-sm text-muted-foreground">Processing Batches</p>
                <p className="text-2xl font-bold">
                  {batches.filter(b => !['received', 'completed'].includes(b.processingStage)).length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">
                  {batches.filter(b => b.processingStage === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Certificates Expiring</p>
                <p className="text-2xl font-bold text-warning">{expiringSoon}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Missing Certificates</p>
                <p className="text-2xl font-bold text-destructive">{missingCertificates}</p>
              </div>
              <Upload className="w-8 h-8 text-destructive" />
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
                <h3 className="font-semibold mb-2">Processing Actions</h3>
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="herbal-gradient">
                    Log Processing Step
                  </Button>
                  <Button size="sm" variant="outline">
                    Upload Certificate
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Batches */}
      <Card className="portal-card">
        <CardHeader>
          <CardTitle>Processing Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {batches.map((batch) => (
              <div key={batch.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{batch.herbName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Batch ID: {batch.id} • {batch.quantity} kg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Received: {formatDate(batch.receivedDate)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStageColor(batch.processingStage)}>
                      {batch.processingStage.toUpperCase().replace('-', ' ')}
                    </Badge>
                    {batch.qualityCertificate && (
                      <Badge className={getCertificateStatusColor(batch.qualityCertificate.status)}>
                        Certificate {batch.qualityCertificate.status}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Processing Progress</span>
                    <span className="text-sm text-muted-foreground">{batch.progress}%</span>
                  </div>
                  <Progress value={batch.progress} className="h-2" />
                </div>

                {/* Certificate Status */}
                {batch.qualityCertificate ? (
                  <div className="bg-muted/30 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Quality Certificate</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {batch.qualityCertificate.id} • 
                          Expires: {formatDate(batch.qualityCertificate.expiryDate)}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-destructive/10 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-destructive">
                          Certificate Required
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Upload quality certificate to proceed
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => setShowUploadForm(batch.id)}
                        className="herbal-gradient"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                )}

                {/* Processing Actions */}
                <div className="flex gap-2">
                  {batch.processingStage === 'received' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateProcessingStage(batch.id, 'cleaning')}
                      className="herbal-gradient"
                    >
                      Start Cleaning
                    </Button>
                  )}
                  {batch.processingStage === 'cleaning' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateProcessingStage(batch.id, 'drying')}
                      className="herbal-gradient"
                    >
                      Move to Drying
                    </Button>
                  )}
                  {batch.processingStage === 'drying' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateProcessingStage(batch.id, 'grinding')}
                      className="herbal-gradient"
                    >
                      Start Grinding
                    </Button>
                  )}
                  {batch.processingStage === 'grinding' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateProcessingStage(batch.id, 'packaging')}
                      className="herbal-gradient"
                    >
                      Start Packaging
                    </Button>
                  )}
                  {batch.processingStage === 'packaging' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateProcessingStage(batch.id, 'completed')}
                      className="herbal-gradient"
                    >
                      Mark Complete
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  {batch.processingStage === 'completed' && (
                    <Button 
                      size="sm" 
                      onClick={() => handlePaymentClick(batch)}
                      className="herbal-gradient"
                    >
                      <Wallet className="w-3 h-3 mr-1" />
                      Pay Distributor
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificate Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Upload Quality Certificate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload quality certificate for batch {showUploadForm}
              </p>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Click to upload certificate PDF
                </p>
                <Button variant="outline">
                  Choose File
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => uploadCertificate(showUploadForm)}
                  className="herbal-gradient flex-1"
                >
                  Upload Certificate
                </Button>
                <Button 
                  onClick={() => setShowUploadForm(null)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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

export default ProcessorPortal;