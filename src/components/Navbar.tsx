import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface NavbarProps {
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
  actions?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ 
  showBackButton = false, 
  onBack, 
  title,
  actions 
}) => {
  return (
    <nav className="relative z-20 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {showBackButton && onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-accent"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/fcdc47b6-2469-4d53-9a75-20f63f9e223d.png" 
                alt="Rootra Logo" 
                className="w-10 h-10 rounded-lg"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">
                  Rootra
                </h1>
                {title && (
                  <p className="text-sm text-muted-foreground">
                    {title}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {actions}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;