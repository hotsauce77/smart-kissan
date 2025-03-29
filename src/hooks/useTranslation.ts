import { useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { getTranslation } from '../utils/translations';

// Custom hook to get translations based on user's language preference
const useTranslation = () => {
  const { preferences } = useUser();
  
  // Function to get translated text for a key
  const t = useCallback((key: string): string => {
    return getTranslation(key, preferences.language);
  }, [preferences.language]);
  
  return { t };
};

export default useTranslation; 