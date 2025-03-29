import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for user preferences
export interface UserPreferences {
  language: 'en' | 'hi' | 'kn'; // English, Hindi, Kannada
  darkMode: boolean;
  notificationsEnabled: boolean;
  useCurrentLocation: boolean;
  defaultLocation: [number, number]; // Latitude, longitude
}

// Define types for user profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  farmSize: number;
  primaryCrops: string[];
  isAuthenticated: boolean;
}

// Context interface
interface UserContextType {
  preferences: UserPreferences;
  userProfile: UserProfile;
  isLoading: boolean;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<UserProfile>) => Promise<boolean>;
  saveUserData: () => Promise<boolean>;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  language: 'en',
  darkMode: false,
  notificationsEnabled: true,
  useCurrentLocation: false,
  defaultLocation: [31.1471, 75.3412], // Default: Punjab, India
};

// Default user profile (unauthenticated)
const defaultUserProfile: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  region: '',
  farmSize: 0,
  primaryCrops: [],
  isAuthenticated: false,
};

// Create context with default values
const UserContext = createContext<UserContextType>({
  preferences: defaultPreferences,
  userProfile: defaultUserProfile,
  isLoading: true,
  updatePreferences: () => {},
  login: async () => false,
  logout: () => {},
  register: async () => false,
  saveUserData: async () => false,
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedPreferences = localStorage.getItem('userPreferences');
        const savedProfile = localStorage.getItem('userProfile');
        
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));
        }
        
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  }, [preferences, isLoading]);

  // Save user profile to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile, isLoading]);

  // Update user preferences
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  // Mock login function (in a real app, this would make an API call)
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a successful login with mock data
      const mockResponse = {
        success: true,
        user: {
          id: '12345',
          name: 'Demo Farmer',
          email: email,
          phone: '+91 98765 43210',
          region: 'Punjab',
          farmSize: 5,
          primaryCrops: ['Wheat', 'Rice'],
        }
      };
      
      if (mockResponse.success) {
        setUserProfile({
          ...mockResponse.user,
          isAuthenticated: true,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUserProfile(defaultUserProfile);
    // Keep preferences but reset authentication
  };

  // Mock register function
  const register = async (userData: Partial<UserProfile>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a successful registration
      const mockResponse = {
        success: true,
        user: {
          id: Math.random().toString(36).substr(2, 9),
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          region: userData.region || '',
          farmSize: userData.farmSize || 0,
          primaryCrops: userData.primaryCrops || [],
        }
      };
      
      if (mockResponse.success) {
        setUserProfile({
          ...mockResponse.user,
          isAuthenticated: true,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Save user data to "backend" (localStorage in this case)
  const saveUserData = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to update the user's profile
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        preferences,
        userProfile,
        isLoading,
        updatePreferences,
        login,
        logout,
        register,
        saveUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider; 