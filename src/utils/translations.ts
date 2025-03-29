type Language = 'en' | 'hi' | 'kn';

interface Translation {
  [key: string]: {
    en: string;
    hi: string;
    kn: string;
  };
}

// Common translations throughout the app
const translations: Translation = {
  // Navigation
  'nav.dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
  },
  'nav.fieldMapping': {
    en: 'Field Mapping',
    hi: 'क्षेत्र मानचित्रण',
    kn: 'ಕ್ಷೇತ್ರ ಮ್ಯಾಪಿಂಗ್',
  },
  'nav.satelliteAnalysis': {
    en: 'Satellite Analysis',
    hi: 'उपग्रह विश्लेषण',
    kn: 'ಉಪಗ್ರಹ ವಿಶ್ಲೇಷಣೆ',
  },
  'nav.settings': {
    en: 'Settings',
    hi: 'सेटिंग्स',
    kn: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
  },
  'nav.help': {
    en: 'Help',
    hi: 'सहायता',
    kn: 'ಸಹಾಯ',
  },
  'nav.profile': {
    en: 'Profile',
    hi: 'प्रोफ़ाइल',
    kn: 'ಪ್ರೊಫೈಲ್',
  },

  // Actions
  'action.save': {
    en: 'Save',
    hi: 'सहेजें',
    kn: 'ಉಳಿಸಿ',
  },
  'action.cancel': {
    en: 'Cancel',
    hi: 'रद्द करें',
    kn: 'ರದ್ದುಮಾಡಿ',
  },
  'action.confirm': {
    en: 'Confirm',
    hi: 'पुष्टि करें',
    kn: 'ದೃಢೀಕರಿಸಿ',
  },
  'action.edit': {
    en: 'Edit',
    hi: 'संपादित करें',
    kn: 'ಸಂಪಾದಿಸಿ',
  },
  'action.delete': {
    en: 'Delete',
    hi: 'हटाएं',
    kn: 'ಅಳಿಸಿ',
  },
  'action.login': {
    en: 'Login',
    hi: 'लॉगिन करें',
    kn: 'ಲಾಗಿನ್',
  },
  'action.logout': {
    en: 'Logout',
    hi: 'लॉगआउट करें',
    kn: 'ಲಾಗ್ ಔಟ್',
  },
  'action.register': {
    en: 'Register',
    hi: 'पंजीकरण करें',
    kn: 'ನೋಂದಣಿ',
  },
  'action.addField': {
    en: 'Add Field',
    hi: 'क्षेत्र जोड़ें',
    kn: 'ಕ್ಷೇತ್ರ ಸೇರಿಸಿ',
  },

  // Settings
  'settings.language': {
    en: 'Language',
    hi: 'भाषा',
    kn: 'ಭಾಷೆ',
  },
  'settings.darkMode': {
    en: 'Dark Mode',
    hi: 'डार्क मोड',
    kn: 'ಡಾರ್ಕ್ ಮೋಡ್',
  },
  'settings.notifications': {
    en: 'Notifications',
    hi: 'सूचनाएं',
    kn: 'ಅಧಿಸೂಚನೆಗಳು',
  },
  'settings.locationServices': {
    en: 'Location Services',
    hi: 'स्थान सेवाएं',
    kn: 'ಸ್ಥಳ ಸೇವೆಗಳು',
  },
  'settings.useCurrentLocation': {
    en: 'Use Current Location',
    hi: 'वर्तमान स्थान का उपयोग करें',
    kn: 'ಪ್ರಸ್ತುತ ಸ್ಥಾನವನ್ನು ಬಳಸಿ',
  },
  'settings.defaultLocation': {
    en: 'Default Location',
    hi: 'डिफ़ॉल्ट स्थान',
    kn: 'ಡೀಫಾಲ್ಟ್ ಸ್ಥಳ',
  },

  // Auth
  'auth.email': {
    en: 'Email',
    hi: 'ईमेल',
    kn: 'ಇಮೇಲ್',
  },
  'auth.password': {
    en: 'Password',
    hi: 'पासवर्ड',
    kn: 'ಪಾಸ್‌ವರ್ಡ್',
  },
  'auth.name': {
    en: 'Name',
    hi: 'नाम',
    kn: 'ಹೆಸರು',
  },
  'auth.phone': {
    en: 'Phone',
    hi: 'फोन',
    kn: 'ಫೋನ್',
  },
  'auth.region': {
    en: 'Region',
    hi: 'क्षेत्र',
    kn: 'ಪ್ರದೇಶ',
  },
  'auth.farmSize': {
    en: 'Farm Size (hectares)',
    hi: 'खेत का आकार (हेक्टेयर)',
    kn: 'ಕೃಷಿ ಗಾತ್ರ (ಹೆಕ್ಟೇರ್)',
  },
  'auth.primaryCrops': {
    en: 'Primary Crops',
    hi: 'प्राथमिक फसलें',
    kn: 'ಪ್ರಾಥಮಿಕ ಬೆಳೆಗಳು',
  },
  
  // Notifications
  'notification.weatherAlert': {
    en: 'Weather Alert',
    hi: 'मौसम अलर्ट',
    kn: 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ',
  },
  'notification.cropPrice': {
    en: 'Crop Price Update',
    hi: 'फसल मूल्य अपडेट',
    kn: 'ಬೆಳೆ ಬೆಲೆ ನವೀಕರಣ',
  },
  'notification.pestsAlert': {
    en: 'Pests & Disease Alert',
    hi: 'कीट और रोग अलर्ट',
    kn: 'ಕೀಟ ಮತ್ತು ರೋಗ ಎಚ್ಚರಿಕೆ',
  },
  
  // Map
  'map.satellite': {
    en: 'Satellite View',
    hi: 'उपग्रह दृश्य',
    kn: 'ಉಪಗ್ರಹ ನೋಟ',
  },
  'map.standard': {
    en: 'Standard Map',
    hi: 'मानक नक्शा',
    kn: 'ಸ್ಟ್ಯಾಂಡರ್ಡ್ ಮ್ಯಾಪ್',
  },
  'map.locationPermission': {
    en: 'Please allow location access to see your current position on the map',
    hi: 'नक्शे पर अपना वर्तमान स्थान देखने के लिए कृपया स्थान एक्सेस की अनुमति दें',
    kn: 'ನಕ್ಷೆಯಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಾನವನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ಸ್ಥಳ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ',
  },
};

// Helper function to get a translation
export const getTranslation = (key: string, language: Language = 'en'): string => {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  return translations[key][language] || translations[key].en; // Fallback to English
};

export default translations; 