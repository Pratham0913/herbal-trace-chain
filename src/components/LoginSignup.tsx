import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Mail, Phone, MapPin, Globe } from 'lucide-react';
import herbalChainLogo from '@/assets/herbalchain-logo.png';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/contexts/LanguageContext';
import ThemeToggle from '@/components/ThemeToggle';

export type UserRole = 'farmer' | 'aggregator' | 'distributor' | 'processor' | 'admin';

export interface User {
  id: string;
  phone?: string;
  email?: string;
  role: UserRole;
  state: string;
  language: string;
  isVerified: boolean;
}

interface LoginSignupProps {
  onBack: () => void;
  onComplete: (user: User) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
];

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'farmer', label: 'Farmer', description: 'Grow and harvest herbal products' },
  { value: 'aggregator', label: 'Aggregator', description: 'Collect and consolidate from farmers' },
  { value: 'distributor', label: 'Distributor', description: 'Transport and distribute products' },
  { value: 'processor', label: 'Processor', description: 'Process and package herbal products' },
  { value: 'admin', label: 'Admin', description: 'Manage and oversee operations' },
];

const LoginSignup: React.FC<LoginSignupProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<'contact' | 'otp' | 'details'>('contact');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email'>('phone');
  const [contactValue, setContactValue] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { translate, currentLanguage, setLanguage } = useLanguage();

  const handleSendOtp = async () => {
    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setStep('details');
    }, 1500);
  };

  const handleComplete = () => {
    if (!selectedRole || !selectedState) return;
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      [contactMethod]: contactValue,
      role: selectedRole,
      state: selectedState,
      language: currentLanguage.code,
      isVerified: true,
    };

    onComplete(user);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <img 
              src={herbalChainLogo} 
              alt="HerbalChain Logo" 
              className="w-12 h-12"
            />
            
            <ThemeToggle />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            {translate('login.title')}
          </h1>
        </div>

        <Card className="bg-white/95 dark:bg-card/95 backdrop-blur-sm">
          <CardContent className="p-6">
            {step === 'contact' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Contact Method</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={contactMethod === 'phone' ? 'default' : 'outline'}
                      onClick={() => setContactMethod('phone')}
                      className="flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Phone
                    </Button>
                    <Button
                      variant={contactMethod === 'email' ? 'default' : 'outline'}
                      onClick={() => setContactMethod('email')}
                      className="flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    {contactMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                  </Label>
                  <Input
                    type={contactMethod === 'phone' ? 'tel' : 'email'}
                    placeholder={contactMethod === 'phone' ? '+91 12345 67890' : 'your@email.com'}
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleSendOtp}
                  disabled={!contactValue || isLoading}
                  className="w-full herbal-gradient"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter the OTP sent to {contactValue}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>OTP</Label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6 || isLoading}
                  className="w-full herbal-gradient"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            )}

            {step === 'details' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    State
                  </Label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Preferred Language
                  </Label>
                  <Select 
                    value={currentLanguage.code} 
                    onValueChange={(code) => {
                      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
                      if (language) setLanguage(language);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          {language.nativeName} ({language.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Role in Supply Chain</Label>
                  <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="text-left">
                            <div className="font-medium">{role.label}</div>
                            <div className="text-xs text-muted-foreground">{role.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleComplete}
                  disabled={!selectedRole || !selectedState}
                  className="w-full herbal-gradient"
                >
                  Complete Setup
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginSignup;