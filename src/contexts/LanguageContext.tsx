import React, { createContext, useContext, useState } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic translations for demo - in real app this would come from translation files
const translations: Record<string, Record<string, string>> = {
  en: {
    'app.name': 'Rootra',
    'splash.quote': 'From Roots to Remedies → Verified with Blockchain',
    'entry.consumer': 'Continue as Consumer',
    'entry.supply': 'Join Supply Chain',
    'scan.qr': 'Scan QR Code',
    'login.title': 'Welcome to Rootra',
    'notifications': 'Notifications',
    'profile': 'Profile Settings',
    'logout': 'Logout',
  },
  hi: {
    'app.name': 'हर्बलचेन',
    'splash.quote': 'जड़ों से उपचार तक → ब्लॉकचेन के साथ सत्यापित',
    'entry.consumer': 'उपभोक्ता के रूप में जारी रखें',
    'entry.supply': 'आपूर्ति श्रृंखला में शामिल हों',
    'scan.qr': 'QR कोड स्कैन करें',
    'login.title': 'हर्बलचेन में आपका स्वागत है',
    'notifications': 'अधिसूचनाएं',
    'profile': 'प्रोफ़ाइल सेटिंग्स',
    'logout': 'लॉग आउट',
  },
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('rootra-language', language.code);
  };

  const translate = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations.en[key] || key;
  };

  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('rootra-language');
    if (savedLanguage) {
      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};