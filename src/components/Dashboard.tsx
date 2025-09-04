import React, { useState } from 'react';
import { Bell, Menu, Settings, LogOut, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import herbalChainLogo from '@/assets/herbalchain-logo.png';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import { User as UserType } from '@/components/LoginSignup';
import NotificationDropdown from '@/components/NotificationDropdown';
import ProfileSettings from '@/components/ProfileSettings';

interface DashboardProps {
  user: UserType;
  children: React.ReactNode;
  onLogout: () => void;
  onUserUpdate?: (updatedUser: UserType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, children, onLogout, onUserUpdate }) => {
  const { translate, currentLanguage, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      farmer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      aggregator: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      distributor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      processor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="bg-card border-b border-border shadow-herbal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src={herbalChainLogo} 
                alt="HerbalChain Logo" 
                className="w-8 h-8 mr-3"
              />
              <h1 className="text-xl font-bold text-foreground">
                {translate('app.name')}
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <NotificationDropdown userRole={user.role} />

              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Menu className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <div className="px-3 py-2 border-b border-border">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.phone || user.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {user.state}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuItem onSelect={() => setShowProfileSettings(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    {translate('profile')}
                  </DropdownMenuItem>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm">
                        <Globe className="w-4 h-4 mr-2" />
                        Language
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left" className="bg-popover">
                      {SUPPORTED_LANGUAGES.map((language) => (
                        <DropdownMenuItem 
                          key={language.code}
                          onSelect={() => setLanguage(language)}
                          className={currentLanguage.code === language.code ? 'bg-accent' : ''}
                        >
                          {language.nativeName}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onSelect={onLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    {translate('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Profile Settings */}
      <ProfileSettings
        user={user}
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
        onLogout={onLogout}
        onUserUpdate={onUserUpdate}
      />
    </div>
  );
};

export default Dashboard;