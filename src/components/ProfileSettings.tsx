import React, { useState } from 'react';
import { X, Phone, Globe, Palette, LogOut, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User } from '@/components/LoginSignup';
import { useToast } from '@/hooks/use-toast';

interface ProfileSettingsProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onUserUpdate?: (updatedUser: User) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  user,
  isOpen,
  onClose,
  onLogout,
  onUserUpdate
}) => {
  const { currentLanguage, setLanguage, translate } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [newPhone, setNewPhone] = useState(user.phone || '');
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const handlePhoneUpdate = () => {
    if (!newPhone || newPhone === user.phone) {
      toast({
        title: "No Change",
        description: "Phone number is same as current",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingPhone(true);
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setIsVerifyingPhone(false);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${newPhone}`,
      });
    }, 1500);
  };

  const handleOtpVerification = () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    // Simulate OTP verification
    setTimeout(() => {
      const updatedUser = { ...user, phone: newPhone };
      onUserUpdate?.(updatedUser);
      setOtpSent(false);
      setOtp('');
      toast({
        title: "Phone Updated",
        description: "Phone number updated successfully",
      });
    }, 1000);
  };

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme as 'light' | 'dark');
    if (newTheme !== 'system') {
      // For now, we only support light/dark toggle
      if ((newTheme === 'dark' && theme === 'light') || (newTheme === 'light' && theme === 'dark')) {
        toggleTheme();
      }
    }
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${newTheme}`,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto portal-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Profile Settings</CardTitle>
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
          {/* User Info */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">User Information</Label>
            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <span className="font-medium">Role:</span> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
              <p className="text-sm">
                <span className="font-medium">State:</span> {user.state}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
          </div>

          {/* Phone Number Update */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <Label className="text-sm font-medium">Phone Number</Label>
            </div>
            
            {!otpSent ? (
              <div className="flex gap-2">
                <Input
                  type="tel"
                  placeholder="Enter new phone number"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handlePhoneUpdate}
                  disabled={isVerifyingPhone}
                  className="herbal-gradient"
                >
                  {isVerifyingPhone ? 'Sending...' : 'Update'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit OTP sent to {newPhone}
                </p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleOtpVerification}
                    disabled={otp.length !== 6}
                    className="herbal-gradient"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Verify
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Language Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <Label className="text-sm font-medium">Preferred Language</Label>
            </div>
            <Select
              value={currentLanguage.code}
              onValueChange={(code) => {
                const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
                if (language) {
                  setLanguage(language);
                  toast({
                    title: "Language Updated",
                    description: `Language changed to ${language.nativeName}`,
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    <div className="flex items-center gap-2">
                      <span>{language.nativeName}</span>
                      <span className="text-muted-foreground">({language.name})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Theme Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              <Label className="text-sm font-medium">Theme Preference</Label>
            </div>
            <Select
              value={selectedTheme}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Button
              onClick={onLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;