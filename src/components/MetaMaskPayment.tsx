import React, { useState } from 'react';
import { Wallet, CreditCard, Smartphone, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface MetaMaskPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  amount: number;
  currency?: string;
  description: string;
  onPaymentSuccess: (txHash: string) => void;
  onPaymentFailure: (error: string) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  available: boolean;
  description: string;
}

const MetaMaskPayment: React.FC<MetaMaskPaymentProps> = ({
  isOpen,
  onClose,
  recipientName,
  amount,
  currency = 'MATIC',
  description,
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const [selectedMethod, setSelectedMethod] = useState('crypto');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'crypto',
      name: 'Crypto (MetaMask)',
      icon: <Wallet className="w-5 h-5" />,
      available: true,
      description: 'Pay with Ethereum/Polygon via MetaMask'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone className="w-5 h-5" />,
      available: false,
      description: 'Coming Soon - Pay via UPI'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <CreditCard className="w-5 h-5" />,
      available: false,
      description: 'Coming Soon - Direct bank transfer'
    }
  ];

  const connectWallet = async () => {
    setIsConnecting(true);

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });

        // Switch to Polygon testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // Polygon Mumbai testnet
          });
        } catch (switchError: any) {
          // If chain doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x13881',
                chainName: 'Polygon Mumbai Testnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/']
              }]
            });
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
      onPaymentFailure(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const processPayment = async () => {
    if (!walletConnected) {
      await connectWallet();
      return;
    }

    setIsProcessing(true);

    try {
      // Convert amount to Wei (assuming amount is in MATIC)
      const amountInWei = (amount * Math.pow(10, 18)).toString(16);

      const transactionParameters = {
        to: '0x742d35Cc6C26ABc0532d9d70B9B63BDB3B8C9B6C', // Demo recipient address
        from: walletAddress,
        value: '0x' + amountInWei,
        gas: '0x5208', // 21000 gas limit
        gasPrice: '0x09184e72a000', // 10 gwei
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      toast({
        title: "Payment Successful",
        description: `Transaction Hash: ${txHash.slice(0, 10)}...`,
      });

      onPaymentSuccess(txHash);
      onClose();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Transaction was rejected or failed",
        variant: "destructive",
      });
      onPaymentFailure(error.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceholderPayment = (method: string) => {
    toast({
      title: "Coming Soon",
      description: `${method} integration will be available soon`,
      variant: "destructive",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md portal-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Make Payment</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Recipient:</span>
              <span className="font-medium">{recipientName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="font-bold text-lg">{amount} {currency}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Description:</span>
              <span className="text-sm text-right max-w-[200px]">{description}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Payment Method</label>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem 
                    key={method.id} 
                    value={method.id}
                    disabled={!method.available}
                  >
                    <div className="flex items-center gap-2">
                      {method.icon}
                      <span>{method.name}</span>
                      {!method.available && (
                        <Badge variant="secondary" className="text-xs">
                          Soon
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedMethod && (
              <p className="text-xs text-muted-foreground">
                {paymentMethods.find(m => m.id === selectedMethod)?.description}
              </p>
            )}
          </div>

          {/* Wallet Connection Status */}
          {selectedMethod === 'crypto' && (
            <div className="space-y-3">
              {walletConnected ? (
                <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-success">Wallet Connected</p>
                    <p className="text-xs text-muted-foreground">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-warning">Wallet Not Connected</p>
                    <p className="text-xs text-muted-foreground">
                      Connect your MetaMask wallet to continue
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment Actions */}
          <div className="space-y-2">
            {selectedMethod === 'crypto' ? (
              <Button
                onClick={processPayment}
                disabled={isConnecting || isProcessing}
                className="w-full herbal-gradient"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting
                  ? 'Connecting Wallet...'
                  : isProcessing
                  ? 'Processing Payment...'
                  : walletConnected
                  ? `Pay ${amount} ${currency}`
                  : 'Connect Wallet & Pay'
                }
              </Button>
            ) : (
              <Button
                onClick={() => handlePlaceholderPayment(
                  paymentMethods.find(m => m.id === selectedMethod)?.name || 'This method'
                )}
                className="w-full"
                variant="outline"
              >
                {paymentMethods.find(m => m.id === selectedMethod)?.icon}
                <span className="ml-2">
                  Pay with {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </span>
              </Button>
            )}

            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Cancel
            </Button>
          </div>

          {/* Network Info */}
          {selectedMethod === 'crypto' && (
            <div className="text-xs text-muted-foreground text-center">
              Transactions will be processed on Polygon Mumbai Testnet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaMaskPayment;