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

  // Help Page
  'help.title': {
    en: 'Help & FAQ',
    hi: 'सहायता और अक्सर पूछे जाने वाले प्रश्न',
    kn: 'ಸಹಾಯ ಮತ್ತು ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು',
  },
  'help.faq1.question': {
    en: 'How are crop recommendations generated?',
    hi: 'फसल की सिफारिशें कैसे तैयार की जाती हैं?',
    kn: 'ಬೆಳೆ ಶಿಫಾರಸುಗಳನ್ನು ಹೇಗೆ ರಚಿಸಲಾಗುತ್ತದೆ?',
  },
  'help.faq1.answer': {
    en: 'Our AI system analyzes various factors including soil conditions, weather patterns, and historical crop data to provide personalized recommendations for your farm.',
    hi: 'हमारी AI प्रणाली मिट्टी की स्थिति, मौसम के पैटर्न और ऐतिहासिक फसल डेटा सहित विभिन्न कारकों का विश्लेषण करके आपके खेत के लिए व्यक्तिगत सिफारिशें प्रदान करती है।',
    kn: 'ನಮ್ಮ AI ವ್ಯವಸ್ಥೆಯು ನಿಮ್ಮ ಕೃಷಿಗೆ ವೈಯಕ್ತಿಕ ಶಿಫಾರಸುಗಳನ್ನು ಒದಗಿಸಲು ಮಣ್ಣಿನ ಪರಿಸ್ಥಿತಿಗಳು, ಹವಾಮಾನ ಮಾದರಿಗಳು ಮತ್ತು ಐತಿಹಾಸಿಕ ಬೆಳೆ ಡೇಟಾ ಸೇರಿದಂತೆ ವಿವಿಧ ಅಂಶಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ.',
  },
  'help.faq2.question': {
    en: 'How accurate are the yield predictions?',
    hi: 'उपज भविष्यवाणियां कितनी सटीक हैं?',
    kn: 'ಇಳುವರಿ ಮುನ್ಸೂಚನೆಗಳು ಎಷ್ಟು ನಿಖರವಾಗಿವೆ?',
  },
  'help.faq2.answer': {
    en: 'Yield predictions are based on machine learning models trained on extensive agricultural data. The accuracy typically ranges from 80-90% depending on data availability.',
    hi: 'उपज भविष्यवाणियां मशीन लर्निंग मॉडल पर आधारित हैं जो व्यापक कृषि डेटा पर प्रशिक्षित हैं। सटीकता आमतौर पर डेटा उपलब्धता के आधार पर 80-90% के बीच होती है।',
    kn: 'ಇಳುವರಿ ಮುನ್ಸೂಚನೆಗಳು ವ್ಯಾಪಕವಾದ ಕೃಷಿ ಡೇಟಾದಲ್ಲಿ ತರಬೇತಿ ಪಡೆದ ಮಷೀನ್ ಲರ್ನಿಂಗ್ ಮಾದರಿಗಳನ್ನು ಆಧರಿಸಿವೆ. ಡೇಟಾ ಲಭ್ಯತೆಯನ್ನು ಅವಲಂಬಿಸಿ ನಿಖರತೆಯು ಸಾಮಾನ್ಯವಾಗಿ 80-90% ವ್ಯಾಪ್ತಿಯಲ್ಲಿರುತ್ತದೆ.',
  },
  'help.faq3.question': {
    en: 'How often is the weather data updated?',
    hi: 'मौसम डेटा कितनी बार अपडेट किया जाता है?',
    kn: 'ಹವಾಮಾನ ದತ್ತಾಂಶವನ್ನು ಎಷ್ಟು ಬಾರಿ ನವೀಕರಿಸಲಾಗುತ್ತದೆ?',
  },
  'help.faq3.answer': {
    en: 'Weather forecasts are updated every 3 hours using data from multiple meteorological sources to ensure accuracy.',
    hi: 'मौसम का पूर्वानुमान सटीकता सुनिश्चित करने के लिए कई मौसम विज्ञान स्रोतों से डेटा का उपयोग करके हर 3 घंटे में अपडेट किया जाता है।',
    kn: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗಳನ್ನು ನಿಖರತೆಯನ್ನು ಖಚಿತಪಡಿಸಲು ಬಹು ಹವಾಮಾನ ಮೂಲಗಳಿಂದ ಡೇಟಾವನ್ನು ಬಳಸಿಕೊಂಡು ಪ್ರತಿ 3 ಗಂಟೆಗಳಿಗೊಮ್ಮೆ ನವೀಕರಿಸಲಾಗುತ್ತದೆ.',
  },
  'help.faq4.question': {
    en: 'Can I get notifications for important updates?',
    hi: 'क्या मुझे महत्वपूर्ण अपडेट के लिए सूचनाएं मिल सकती हैं?',
    kn: 'ಪ್ರಮುಖ ನವೀಕರಣಗಳಿಗೆ ನಾನು ಅಧಿಸೂಚನೆಗಳನ್ನು ಪಡೆಯಬಹುದೇ?',
  },
  'help.faq4.answer': {
    en: 'Yes, you can enable notifications in the Settings page to receive alerts about weather changes, optimal planting times, and other important farming updates.',
    hi: 'हां, आप मौसम परिवर्तन, बुवाई के अनुकूल समय और अन्य महत्वपूर्ण कृषि अपडेट के बारे में अलर्ट प्राप्त करने के लिए सेटिंग्स पेज में सूचनाएं सक्षम कर सकते हैं।',
    kn: 'ಹೌದು, ಹವಾಮಾನ ಬದಲಾವಣೆಗಳು, ಅನುಕೂಲ ಬೀಜ ಬಿತ್ತನೆ ಸಮಯಗಳು ಮತ್ತು ಇತರ ಪ್ರಮುಖ ಕೃಷಿ ನವೀಕರಣಗಳ ಬಗ್ಗೆ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸ್ವೀಕರಿಸಲು ನೀವು ಸೆಟ್ಟಿಂಗ್‌ಗಳ ಪುಟದಲ್ಲಿ ಅಧಿಸೂಚನೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಬಹುದು.',
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