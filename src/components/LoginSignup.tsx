import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import AyurvedicBackground from '@/components/AyurvedicBackground';

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
  const [contactMethod, setContactMethod] = useState<'phone' | 'email'>('email');
  const [contactValue, setContactValue] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { translate, currentLanguage, setLanguage } = useLanguage();

  const handleSendOtp = async () => {
    if (!contactValue.trim()) {
      setAuthError('Please enter your contact information');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      if (contactMethod === 'email') {
        const { error } = await supabase.auth.signInWithOtp({
          email: contactValue,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "OTP Sent",
          description: `Check your email ${contactValue} for the verification code`,
        });
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          phone: contactValue,
        });
        
        if (error) throw error;
        
        toast({
          title: "OTP Sent",
          description: `Check your phone ${contactValue} for the verification code`,
        });
      }
      
      setStep('otp');
    } catch (error: any) {
      console.error('OTP send error:', error);
      setAuthError(error.message || 'Failed to send OTP. Please try again.');
      toast({
        title: "Error",
        description: error.message || 'Failed to send OTP. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setAuthError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      let verifyData;
      if (contactMethod === 'email') {
        verifyData = await supabase.auth.verifyOtp({
          email: contactValue,
          token: otp,
          type: 'email'
        });
      } else {
        verifyData = await supabase.auth.verifyOtp({
          phone: contactValue,
          token: otp,
          type: 'sms'
        });
      }

      const { data, error } = verifyData;

      if (error) throw error;

      if (data.user) {
        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (profile) {
          // User already has a profile, complete login
          const user: User = {
            id: data.user.id,
            [contactMethod]: contactValue,
            role: profile.role as UserRole,
            state: profile.state,
            language: profile.preferred_language,
            isVerified: true,
          };
          onComplete(user);
        } else {
          // New user, go to details step
          setStep('details');
        }
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setAuthError(error.message || 'Invalid OTP. Please try again.');
      toast({
        title: "Error",
        description: error.message || 'Invalid OTP. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedRole || !selectedState || !fullName.trim()) {
      setAuthError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No authenticated user found');

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          full_name: fullName,
          phone: contactMethod === 'phone' ? contactValue : null,
          role: selectedRole,
          state: selectedState,
          preferred_language: currentLanguage.code,
          is_verified: true,
        });

      if (profileError) throw profileError;

      const completedUser: User = {
        id: user.id,
        [contactMethod]: contactValue,
        role: selectedRole,
        state: selectedState,
        language: currentLanguage.code,
        isVerified: true,
      };

      toast({
        title: "Welcome to HerbalChain!",
        description: "Your account has been created successfully.",
      });

      onComplete(completedUser);
    } catch (error: any) {
      console.error('Profile creation error:', error);
      setAuthError(error.message || 'Failed to create profile. Please try again.');
      toast({
        title: "Error",
        description: error.message || 'Failed to create profile. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <AyurvedicBackground />
      <Navbar 
        showBackButton 
        onBack={onBack} 
        title="Authentication"
      />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {step === 'contact' ? 'Welcome to HerbalChain' : 
               step === 'otp' ? 'Verify Your Identity' : 
               'Complete Your Profile'}
            </h1>
            <p className="text-muted-foreground">
              {step === 'contact' ? 'Enter your contact details to get started' :
               step === 'otp' ? 'We sent you a verification code' :
               'Tell us about yourself to join the supply chain'}
            </p>
          </div>

          <Card className="bg-background/95 backdrop-blur-sm border shadow-herbal-lg">
            <CardContent className="p-6">
              {authError && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {authError}
                </div>
              )}
              
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
                    onChange={(e) => {
                      setContactValue(e.target.value);
                      setAuthError(null);
                    }}
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
                      Enter the 6-digit code sent to {contactValue}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Verification Code</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => {
                          setOtp(value);
                          setAuthError(null);
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep('contact')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6 || isLoading}
                      className="flex-1 herbal-gradient"
                    >
                      {isLoading ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                </div>
              )}

              {step === 'details' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setAuthError(null);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      State
                    </Label>
                    <Select value={selectedState} onValueChange={(value) => {
                      setSelectedState(value);
                      setAuthError(null);
                    }}>
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
                    <Select value={selectedRole} onValueChange={(value) => {
                      setSelectedRole(value as UserRole);
                      setAuthError(null);
                    }}>
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
                    disabled={!selectedRole || !selectedState || !fullName.trim() || isLoading}
                    className="w-full herbal-gradient"
                  >
                    {isLoading ? 'Creating Profile...' : 'Complete Setup'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;