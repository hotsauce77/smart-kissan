import { useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { getTranslation } from '../utils/translations';

// Custom hook to get translations based on user's language preference
const useTranslation = () => {
  const { preferences } = useUser();
  
  // Function to get translated text for a key, preserving numbers
  const t = useCallback((key: string): string => {
    const translatedText = getTranslation(key, preferences.language);
    
    // If the language is English, just return the original translation
    if (preferences.language === 'en') {
      return translatedText;
    }
    
    // Otherwise, preserve numbers in the translated text
    // This regex replaces numbers in the translated text with the corresponding numbers from English
    const englishText = getTranslation(key, 'en');
    
    // Extract all numbers from the English text
    const numbersInEnglish = englishText.match(/\d+(\.\d+)?/g) || [];
    
    // If there are no numbers, just return the translated text
    if (numbersInEnglish.length === 0) {
      return translatedText;
    }
    
    // Replace numbers in the translated text with the corresponding numbers from English
    let result = translatedText;
    const numbersInTranslation = translatedText.match(/\d+(\.\d+)?/g) || [];
    
    // Only proceed if the number of numbers matches
    if (numbersInEnglish.length === numbersInTranslation.length) {
      for (let i = 0; i < numbersInTranslation.length; i++) {
        result = result.replace(numbersInTranslation[i], numbersInEnglish[i]);
      }
    }
    
    return result;
  }, [preferences.language]);
  
  return { t };
};

export default useTranslation; 