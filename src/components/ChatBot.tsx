import React, { useState, useRef, useEffect } from 'react';
import apiService from '../services/api';
import { useUser } from '../contexts/UserContext';

// Enhanced message interface with support for rich content and statuses
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  status?: 'sending' | 'sent' | 'failed';
  type?: 'text' | 'weather' | 'crop' | 'market' | 'image' | 'location';
  richData?: any; // For structured data like weather, crop info, etc.
}

// Response shape from the API
interface AssistantResponse {
  data: {
    response: string;
    timestamp: string;
    richData?: any;
    sourceData?: {
      type: string;
      data: any;
      source: string;
    }[];
  };
}

// User location with enhanced data
interface UserLocation {
  latitude: number;
  longitude: number;
  locationName?: string;
  region?: string;
  country?: string;
  error?: string;
  lastUpdated: number;
}

// External APIs we can access
interface ExternalAPI {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  category: 'weather' | 'agriculture' | 'satellite' | 'market' | 'news';
}

// Define the structure of the reverse geocode response
interface ReverseGeocodeResponse {
  success: boolean;
  data: {
    data: {
      name: string;
      city: string;
      region: string;
      country: string;
      countryCode: string;
    }
  };
  error?: string;
}

const SmartFarmAssistant: React.FC = () => {
  const { preferences } = useUser();
  
  // Core state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  
  // Enhanced features state
  const [networkStatus, setNetworkStatus] = useState<'online'|'offline'>('online');
  const [activeApis, setActiveApis] = useState<ExternalAPI[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [localStorageAvailable, setLocalStorageAvailable] = useState(false);
  const [availableTasks, setAvailableTasks] = useState<string[]>([]);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  
  // UI Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Set up the assistant on initial load
  useEffect(() => {
    // Check for localStorage availability for offline messages
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      setLocalStorageAvailable(true);
    } catch (e) {
      setLocalStorageAvailable(false);
    }
    
    // Load previous messages if available
    if (localStorageAvailable) {
      const savedMessages = localStorage.getItem('smartFarmAssistant_messages');
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (e) {
          console.error('Failed to load saved messages', e);
        }
      }
    }
    
    // Initialize available APIs
    checkAvailableAPIs();
    
    // Set initial welcome message if no previous messages
    if (messages.length === 0) {
      const welcomeMessage = getWelcomeMessage(preferences.language);
      setMessages([{
        id: '1',
        text: welcomeMessage,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      }]);
    }
    
    // Start location detection
    detectUserLocation();
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (localStorageAvailable && messages.length > 0) {
      localStorage.setItem('smartFarmAssistant_messages', JSON.stringify(messages.slice(-50))); // Keep last 50 messages
    }
  }, [messages, localStorageAvailable]);

  // Check which external APIs are available
  const checkAvailableAPIs = async () => {
    const apis: ExternalAPI[] = [
      {
        id: 'weather',
        name: 'WeatherAPI',
        description: 'Real-time weather data and forecasts',
        isAvailable: true,
        category: 'weather'
      },
      {
        id: 'satellite',
        name: 'Satellite Imagery',
        description: 'Field health and NDVI analysis',
        isAvailable: true,
        category: 'satellite'
      },
      {
        id: 'market',
        name: 'Agri Market Data',
        description: 'Crop prices and market trends',
        isAvailable: true,
        category: 'market'
      },
      {
        id: 'news',
        name: 'Agricultural News',
        description: 'Latest farming news and updates',
        isAvailable: true,
        category: 'news'
      }
    ];
    
    // Test each API with a small request
    const testedApis = await Promise.all(apis.map(async (api) => {
      try {
        switch (api.id) {
          case 'weather':
            await apiService.getWeatherData({ location: 'Delhi' });
            break;
          default:
            // For others, we'll assume they're available
            break;
        }
        return { ...api, isAvailable: true };
      } catch (error) {
        console.warn(`API ${api.name} is not available`, error);
        return { ...api, isAvailable: false };
      }
    }));
    
    setActiveApis(testedApis);
  };

  // Attempt to get user's location with enhanced accuracy and data
  const detectUserLocation = () => {
    if ('geolocation' in navigator) {
      setIsLoadingLocation(true);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Get precise location with enhanced data
            const { latitude, longitude } = position.coords;
            
            // Create initial location object
            const newLocation: UserLocation = {
              latitude,
              longitude,
              lastUpdated: Date.now()
            };
            
            // Try to get detailed location info using reverse geocoding
            try {
              const locationData = await apiService.reverseGeocode(latitude, longitude) as ReverseGeocodeResponse;
              if (locationData && locationData.success && locationData.data) {
                const geocodeData = locationData.data.data;
                newLocation.locationName = geocodeData.name || '';
                newLocation.region = geocodeData.region || '';
                newLocation.country = geocodeData.country || '';
              }
            } catch (error) {
              console.error('Error getting location details:', error);
              // Still keep the coordinates even if reverse geocoding failed
            }
            
            // Update state with location data
            setUserLocation(newLocation);
            
            // Save to localStorage for offline use
            if (localStorageAvailable) {
              localStorage.setItem('smartFarmAssistant_location', JSON.stringify(newLocation));
            }
            
            // Inform user that we have their location (only if they haven't started chatting)
            if (messages.length <= 1) {
              const locationMessage = getLocationDetectedMessage(preferences.language, newLocation.locationName);
              addAssistantMessage(locationMessage);
            }
            
            // Pre-fetch weather data for the user's location
            try {
              await apiService.getWeatherData({ 
                lat: latitude, 
                lon: longitude 
              });
              // We don't need to use the result yet, just warming up the cache
            } catch (e) {
              console.warn('Failed to pre-fetch weather data', e);
            }
            
          } catch (error) {
            console.error('Error processing location:', error);
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              lastUpdated: Date.now()
            });
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({
            latitude: 0,
            longitude: 0,
            error: error.message,
            lastUpdated: Date.now()
          });
          setIsLoadingLocation(false);
          
          // Try to load cached location from localStorage
          if (localStorageAvailable) {
            const savedLocation = localStorage.getItem('smartFarmAssistant_location');
            if (savedLocation) {
              try {
                const parsedLocation = JSON.parse(savedLocation);
                // Only use if it's less than 24 hours old
                if (Date.now() - parsedLocation.lastUpdated < 86400000) {
                  setUserLocation(parsedLocation);
                  return;
                }
              } catch (e) {
                console.error('Failed to load saved location', e);
              }
            }
          }
        },
        { 
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 3600000 // Cache for 1 hour
        }
      );
    } else {
      setUserLocation({
        latitude: 0,
        longitude: 0,
        error: 'Geolocation is not supported by this browser.',
        lastUpdated: Date.now()
      });
    }
  };

  // Network monitoring with reconnection strategy
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus('online');
      // Notify user that connection is restored
      const message = getNetworkStatusMessage('online', preferences.language);
      addAssistantMessage(message);
      
      // Retry any failed messages
      const failedMessages = messages.filter(m => m.status === 'failed' && m.sender === 'user');
      if (failedMessages.length > 0) {
        addAssistantMessage(getFailedMessagesRetryPrompt(preferences.language, failedMessages.length));
      }
    };
    
    const handleOffline = () => {
      setNetworkStatus('offline');
      // Notify user that connection is lost
      const message = getNetworkStatusMessage('offline', preferences.language);
      addAssistantMessage(message);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial status with a more reliable check
    const checkNetworkStatus = () => {
      if (navigator.onLine) {
        // Double-check with a real request
        fetch('https://www.google.com/favicon.ico', { 
          mode: 'no-cors',
          cache: 'no-store'
        })
          .then(() => setNetworkStatus('online'))
          .catch(() => setNetworkStatus('offline'));
      } else {
        setNetworkStatus('offline');
      }
    };
    
    checkNetworkStatus();
    
    // Set up periodic network checking
    const intervalId = setInterval(checkNetworkStatus, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [preferences.language, messages]);

  // Helper function to get network status messages
  const getNetworkStatusMessage = (status: 'online' | 'offline', language: string): string => {
    if (status === 'online') {
      switch (language) {
        case 'hi':
          return 'इंटरनेट कनेक्शन पुनः स्थापित हो गया है। अब मैं आपको वास्तविक समय की जानकारी प्रदान कर सकता हूँ।';
        case 'kn':
          return 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ. ನಾನು ಈಗ ನಿಮಗೆ ನೈಜ-ಸಮಯದ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಬಲ್ಲೆ.';
        default:
          return 'Internet connection restored. I can now provide you with real-time information.';
      }
    } else {
      switch (language) {
        case 'hi':
          return 'इंटरनेट कनेक्शन खो गया है। मैं अभी भी आपकी मदद कर सकता हूँ, लेकिन वास्तविक समय की जानकारी उपलब्ध नहीं होगी।';
        case 'kn':
          return 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಕಡಿದಿದೆ. ನಾನು ಇನ್ನೂ ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ, ಆದರೆ ನೈಜ-ಸಮಯದ ಮಾಹಿತಿ ಲಭ್ಯವಿರುವುದಿಲ್ಲ.';
        default:
          return 'Internet connection lost. I can still assist you, but real-time information will not be available.';
      }
    }
  };

  // Get failed messages retry prompt
  const getFailedMessagesRetryPrompt = (language: string, count: number): string => {
    switch (language) {
      case 'hi':
        return `मैंने देखा कि आपके ${count} संदेश भेजने में विफल रहे थे। क्या आप उन्हें पुनः भेजना चाहेंगे?`;
      case 'kn':
        return `ನಿಮ್ಮ ${count} ಸಂದೇಶಗಳು ವಿಫಲವಾಗಿವೆ ಎಂದು ನಾನು ಗಮನಿಸಿದ್ದೇನೆ. ನೀವು ಅವುಗಳನ್ನು ಮತ್ತೆ ಕಳುಹಿಸಲು ಬಯಸುತ್ತೀರಾ?`;
      default:
        return `I notice you have ${count} failed message(s). Would you like to retry sending them?`;
    }
  };
  
  // Get location detected message based on language
  const getLocationDetectedMessage = (language: string, locationName?: string): string => {
    const locationStr = locationName ? ` (${locationName})` : '';
    
    switch (language) {
      case 'hi':
        return `मैंने आपका स्थान पता लगा लिया है${locationName ? ` (${locationName})` : ''}। अब मैं आपके क्षेत्र के मौसम, फसलों और बाज़ार के बारे में अधिक सटीक जानकारी प्रदान कर सकता हूँ।`;
      case 'kn':
        return `ನಾನು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಿದ್ದೇನೆ${locationName ? ` (${locationName})` : ''}. ಈಗ ನಾನು ನಿಮ್ಮ ಪ್ರದೇಶದ ಹವಾಮಾನ, ಬೆಳೆಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆಯ ಬಗ್ಗೆ ಹೆಚ್ಚು ನಿಖರವಾದ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಬಲ್ಲೆ.`;
      default:
        return `I've detected your location${locationStr}. Now I can provide more accurate information about weather, crops, and markets in your area.`;
    }
  };

  // Helper function to add an assistant message
  const addAssistantMessage = (text: string, type: Message['type'] = 'text', richData?: any) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      type,
      richData
    };
    setMessages(prev => [...prev, botMessage]);
  };

  // Get welcome message based on language
  const getWelcomeMessage = (language: string): string => {
    switch (language) {
      case 'hi':
        return 'नमस्ते! मैं आपका स्मार्ट फार्म सहायक हूँ। मैं वास्तविक समय के मौसम के आंकड़े, फसल की सिफारिशें, बाजार की जानकारी और फसल स्वास्थ्य विश्लेषण प्रदान कर सकता हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?';
      case 'kn':
        return 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮ್ ಸಹಾಯಕ. ನಾನು ನೈಜ-ಸಮಯದ ಹವಾಮಾನ ದತ್ತಾಂಶ, ಬೆಳೆ ಶಿಫಾರಸುಗಳು, ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಮತ್ತು ಬೆಳೆ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಒದಗಿಸಬಲ್ಲೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?';
      default:
        return 'Hello! I\'m your Smart Farm Assistant with real-time data access. I can provide real-time weather data, crop recommendations, market information, and crop health analysis. How can I help you today?';
    }
  };

  // Get example questions based on language
  const getExampleQuestions = () => {
    const questions = [];
    
    // Add weather-related questions if weather API is available
    if (activeApis.some(api => api.id === 'weather' && api.isAvailable)) {
      questions.push({
        id: 'weather',
        text: preferences.language === 'hi' ? 'मौसम की जानकारी' :
              preferences.language === 'kn' ? 'ಹವಾಮಾನ ಮಾಹಿತಿ' :
              'Weather Forecast',
        handler: () => handleQuickQuestionClick(
          preferences.language === 'hi' ? 'मेरे क्षेत्र में अगले 5 दिनों का मौसम कैसा रहेगा?' :
          preferences.language === 'kn' ? 'ನನ್ನ ಪ್ರದೇಶದಲ್ಲಿ ಮುಂದಿನ 5 ದಿನಗಳ ಹವಾಮಾನ ಹೇಗಿರುತ್ತದೆ?' :
          'What will the weather be like in my area for the next 5 days?'
        )
      });
    }
    
    // Add crop recommendations
    questions.push({
      id: 'crops',
      text: preferences.language === 'hi' ? 'फसल सलाह' :
            preferences.language === 'kn' ? 'ಬೆಳೆ ಸಲಹೆ' :
            'Crop Recommendations',
      handler: () => handleQuickQuestionClick(
        preferences.language === 'hi' ? 'मेरे क्षेत्र में इस मौसम में कौन सी फसल बोनी चाहिए?' :
        preferences.language === 'kn' ? 'ನನ್ನ ಪ್ರದೇಶದಲ್ಲಿ ಈ ಋತುವಿನಲ್ಲಿ ಯಾವ ಬೆಳೆಯನ್ನು ಬೆಳೆಯಬೇಕು?' :
        'What crops should I plant in my region this season?'
      )
    });
    
    // Add market information
    if (activeApis.some(api => api.id === 'market' && api.isAvailable)) {
      questions.push({
        id: 'market',
        text: preferences.language === 'hi' ? 'बाजार मूल्य' :
              preferences.language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ' :
              'Market Prices',
        handler: () => handleQuickQuestionClick(
          preferences.language === 'hi' ? 'गेहूं और चावल के वर्तमान बाजार भाव क्या हैं?' :
          preferences.language === 'kn' ? 'ಗೋಧಿ ಮತ್ತು ಅಕ್ಕಿಯ ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಯಾವುವು?' :
          'What are the current market prices for wheat and rice?'
        )
      });
    }
    
    // Add pest management
    questions.push({
      id: 'pests',
      text: preferences.language === 'hi' ? 'कीट प्रबंधन' :
            preferences.language === 'kn' ? 'ಕೀಟ ನಿರ್ವಹಣೆ' :
            'Pest Management',
      handler: () => handleQuickQuestionClick(
        preferences.language === 'hi' ? 'धान की फसल में ब्राउन प्लांट हॉपर का प्रबंधन कैसे करें?' :
        preferences.language === 'kn' ? 'ಭತ್ತದಲ್ಲಿ ಕಂದು ಸಸ್ಯ ಹಾಪರ್ ಅನ್ನು ಹೇಗೆ ನಿರ್ವಹಿಸುವುದು?' :
        'How to manage brown plant hopper in rice crop?'
      )
    });
    
    return questions.slice(0, 3); // Limit to 3 questions to avoid overcrowding
  };

  // Voice input and text-to-speech support
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      addAssistantMessage(getVoiceUnsupportedMessage(preferences.language));
      return;
    }
    
    try {
      // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = preferences.language === 'hi' ? 'hi-IN' : 
                          preferences.language === 'kn' ? 'kn-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      setIsVoiceRecording(true);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        
        // Auto-submit if confidence is high
        if (event.results[0][0].confidence > 0.8) {
          setTimeout(() => {
            handleSubmit(new Event('voice') as any);
          }, 500);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setIsVoiceRecording(false);
        addAssistantMessage(getVoiceErrorMessage(preferences.language));
      };
      
      recognition.onend = () => {
        setIsVoiceRecording(false);
      };
      
      recognition.start();
    } catch (error) {
      console.error('Error starting voice input', error);
      setIsVoiceRecording(false);
      addAssistantMessage(getVoiceErrorMessage(preferences.language));
    }
  };
  
  // Text-to-speech for assistant messages
  const speakMessage = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported');
      return;
    }
    
    // Clean text of any HTML
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = preferences.language === 'hi' ? 'hi-IN' : 
                      preferences.language === 'kn' ? 'kn-IN' : 'en-US';
    utterance.rate = 0.9; // Slightly slower than default
    
    window.speechSynthesis.speak(utterance);
  };
  
  // Get voice-related messages
  const getVoiceUnsupportedMessage = (language: string): string => {
    switch (language) {
      case 'hi':
        return 'क्षमा करें, आपके ब्राउज़र में वॉयस इनपुट समर्थित नहीं है।';
      case 'kn':
        return 'ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.';
      default:
        return 'Sorry, voice input is not supported in your browser.';
    }
  };
  
  const getVoiceErrorMessage = (language: string): string => {
    switch (language) {
      case 'hi':
        return 'वॉयस इनपुट में त्रुटि हुई। कृपया टेक्स्ट का उपयोग करें।';
      case 'kn':
        return 'ಧ್ವನಿ ಇನ್‌ಪುಟ್‌ನಲ್ಲಿ ದೋಷ. ದಯವಿಟ್ಟು ಪಠ್ಯವನ್ನು ಬಳಸಿ.';
      default:
        return 'Error in voice input. Please use text instead.';
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handle quick question click
  const handleQuickQuestionClick = async (questionText: string) => {
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      text: questionText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    // Process the message after a small delay
    setTimeout(() => {
      processUserMessage(questionText, userMessageId);
    }, 300);
  };

  // Main function to process user messages
  const processUserMessage = async (text: string, messageId: string) => {
    try {
      if (networkStatus === 'offline') {
        throw new Error('No internet connection');
      }
      
      // Analyze the message to determine what data we need
      const messageIntent = analyzeMessageType(text);
      
      // Create enhanced context with all available data
      const enhancedContext = await buildEnhancedContext(text, messageIntent);
      
      // Get chat history for context
      const messageHistory = messages
        .slice(-6) // Get last 6 messages for context
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));
      
      // Call API with all the context
      const response = await apiService.sendChatMessage(
        text, 
        preferences.language,
        userLocation || undefined,
        messageHistory,
        enhancedContext
      ) as AssistantResponse;
      
      // Format and add the response
      let responseText = response.data.response;
      
      // Check for special content types
      let messageType: Message['type'] = 'text';
      let richData = response.data.richData;
      
      // Enhance with icons if it has weather data
      if (responseText.includes('weatherapi.com/weather')) {
        responseText = enhanceWeatherText(responseText);
        messageType = 'weather';
      }
      
      // Add bot response
      const botMessage: Message = {
        id: Date.now().toString(),
        text: responseText,
        sender: 'assistant',
        timestamp: response.data.timestamp || new Date().toISOString(),
        type: messageType,
        richData: richData
      };
      
      setMessages((prev) => {
        // Update the user message status to 'sent'
        const updatedMessages = prev.map(msg => 
          msg.id === messageId ? { ...msg, status: 'sent' as const } : msg
        );
        return [...updatedMessages, botMessage];
      });
      
      // If voice mode is active, read the response aloud
      if (isVoiceModeActive) {
        speakMessage(responseText);
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Mark the user message as failed
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'failed' as const } : msg
      ));
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: getErrorMessage(networkStatus === 'offline' ? 'offline' : 'general'),
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze message type to determine what data to fetch
  const analyzeMessageType = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // Check for weather related queries
    if (
      lowerText.includes('weather') || 
      lowerText.includes('rain') || 
      lowerText.includes('temperature') || 
      lowerText.includes('forecast') ||
      lowerText.includes('मौसम') || 
      lowerText.includes('बारिश') || 
      lowerText.includes('तापमान') ||
      lowerText.includes('ಹವಾಮಾನ') || 
      lowerText.includes('ಮಳೆ') || 
      lowerText.includes('ತಾಪಮಾನ')
    ) {
      return 'weather';
    }
    
    // Check for crop related queries
    if (
      lowerText.includes('crop') || 
      lowerText.includes('plant') || 
      lowerText.includes('grow') || 
      lowerText.includes('फसल') || 
      lowerText.includes('बीज') ||
      lowerText.includes('ಬೆಳೆ') || 
      lowerText.includes('ಬೀಜ')
    ) {
      return 'crop';
    }
    
    // Check for market related queries
    if (
      lowerText.includes('price') || 
      lowerText.includes('market') || 
      lowerText.includes('sell') || 
      lowerText.includes('मूल्य') || 
      lowerText.includes('बाजार') ||
      lowerText.includes('ಬೆಲೆ') || 
      lowerText.includes('ಮಾರುಕಟ್ಟೆ')
    ) {
      return 'market';
    }
    
    // Default to general
    return 'general';
  };

  // Build enhanced context based on message type
  const buildEnhancedContext = async (text: string, messageType: string) => {
    const context: any = {};
    
    // If we have location data, add it
    if (userLocation) {
      context.location = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        name: userLocation.locationName,
        region: userLocation.region,
        country: userLocation.country
      };
      
      // For weather-related queries, fetch weather data
      if (messageType === 'weather' && activeApis.some(api => api.id === 'weather' && api.isAvailable)) {
        try {
          const weatherData = await apiService.getWeatherData({
            lat: userLocation.latitude,
            lon: userLocation.longitude
          });
          
          if (weatherData && weatherData.data) {
            context.weather = {
              current: weatherData.data.current,
              forecast: weatherData.data.forecast,
              location: weatherData.data.location
            };
          }
        } catch (error) {
          console.error('Error fetching weather data for context:', error);
        }
      }
      
      // For crop-related queries, add soil and climate data if available
      if (messageType === 'crop') {
        try {
          // In a real implementation, we would fetch soil data from a real API
          // For now, we'll use mock data
          context.soil = {
            type: 'Clay Loam',
            ph: 6.8,
            nitrogen: 'Medium',
            phosphorus: 'High',
            potassium: 'Medium',
            organicMatter: 'Medium'
          };
          
          // Add recent weather trends
          const weatherData = await apiService.getWeatherData({
            lat: userLocation.latitude,
            lon: userLocation.longitude
          });
          
          if (weatherData && weatherData.data) {
            context.climate = {
              recentTemperatures: weatherData.data.forecast.map((day: any) => ({
                date: day.date,
                avgTemp: day.temp
              })),
              rainfall: weatherData.data.forecast.reduce((sum: number, day: any) => sum + day.rainfall, 0)
            };
          }
        } catch (error) {
          console.error('Error fetching soil/climate data for context:', error);
        }
      }
      
      // For market-related queries, add market data
      if (messageType === 'market' && activeApis.some(api => api.id === 'market' && api.isAvailable)) {
        // In a real implementation, we would fetch market data from a real API
        // For now, we'll use mock data
        context.market = {
          crops: [
            { name: 'Rice', price: 1950, trend: 'stable', unit: 'per quintal' },
            { name: 'Wheat', price: 2250, trend: 'rising', unit: 'per quintal' },
            { name: 'Cotton', price: 6200, trend: 'falling', unit: 'per quintal' },
            { name: 'Sugarcane', price: 350, trend: 'stable', unit: 'per quintal' }
          ],
          location: userLocation.region || 'India',
          lastUpdated: new Date().toISOString()
        };
      }
    }
    
    return context;
  };

  // Function to enhance weather text with icons
  const enhanceWeatherText = (text: string): string => {
    // Handle WeatherAPI.com icon URLs
    const weatherApiIconRegex = /(https:\/\/cdn\.weatherapi\.com\/weather\/\d+x\d+\/(?:day|night)\/\d+\.png)/gi;
    
    // First, check for WeatherAPI.com format
    if (weatherApiIconRegex.test(text)) {
      return text.replace(weatherApiIconRegex, match => 
        `<img src="${match}" alt="Weather icon" class="inline-block h-6 w-6 align-middle" />`
      );
    }
    
    return text;
  };

  // Get error message based on error type and language
  const getErrorMessage = (errorType: 'offline' | 'general'): string => {
    if (errorType === 'offline') {
      switch (preferences.language) {
        case 'hi':
          return 'इंटरनेट कनेक्शन नहीं है। मैं ऑफ़लाइन मोड में आपकी सीमित मदद कर सकता हूँ, लेकिन वास्तविक समय की जानकारी उपलब्ध नहीं होगी।';
        case 'kn':
          return 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ. ನಾನು ಆಫ್‌ಲೈನ್ ಮೋಡ್‌ನಲ್ಲಿ ನಿಮಗೆ ಸೀಮಿತ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ, ಆದರೆ ನೈಜ-ಸಮಯದ ಮಾಹಿತಿ ಲಭ್ಯವಿರುವುದಿಲ್ಲ.';
        default:
          return 'No internet connection. I can help you in a limited way in offline mode, but real-time information will not be available.';
      }
    } else {
      switch (preferences.language) {
        case 'hi':
          return 'क्षमा करें, आपके प्रश्न का उत्तर देते समय एक त्रुटि हुई। कृपया अपना प्रश्न पुनः भेजें या बाद में प्रयास करें।';
        case 'kn':
          return 'ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸುವಾಗ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೆ ಕಳುಹಿಸಿ ಅಥವಾ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.';
        default:
          return 'Sorry, there was an error while answering your question. Please try sending your question again or try later.';
      }
    }
  };

  // Handle retrying a failed message
  const handleRetry = async (messageId: string) => {
    // Find the failed message
    const failedMessage = messages.find(msg => msg.id === messageId);
    if (!failedMessage || failedMessage.sender !== 'user') return;
    
    // Update the status to sending
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'sending' } : msg
    ));
    
    // Process the message
    processUserMessage(failedMessage.text, messageId);
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sending'
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Process the message
    processUserMessage(userMessage.text, userMessageId);
  };

  // Toggle voice mode
  const toggleVoiceMode = () => {
    setIsVoiceModeActive(prev => !prev);
    if (localStorage) {
      localStorage.setItem('voiceModeActive', JSON.stringify(!isVoiceModeActive));
    }
  };

  // Clear the chat
  const handleClearChat = () => {
    // Add confirmation message
    if (messages.length > 2) {
      setShowClearConfirmation(true);
    } else {
      // Just clear if few messages
      clearChat();
    }
  };

  const clearChat = () => {
    // Keep only the initial welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: getWelcomeMessage(preferences.language),
      sender: 'assistant',
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
    setShowClearConfirmation(false);
    
    // Clear from localStorage
    if (localStorage) {
      localStorage.setItem('chatMessages', JSON.stringify([welcomeMessage]));
    }
  };

  const cancelClearChat = () => {
    setShowClearConfirmation(false);
  };

  // Handle close chat
  const handleClose = () => {
    setIsOpen(false);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="relative">
            <div className={`w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl`}>
              <span role="img" aria-label="Assistant">🌾</span>
              {networkStatus === 'online' && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              )}
              {networkStatus === 'offline' && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              )}
            </div>
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">SmartKissan</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {networkStatus === 'online' ? 
                (userLocation ? 
                  `${preferences.language === 'hi' ? 'आपका स्थान: ' : 
                    preferences.language === 'kn' ? 'ನಿಮ್ಮ ಸ್ಥಳ: ' : 
                    'Your location: '}${userLocation.locationName}` : 
                  preferences.language === 'hi' ? 'ऑनलाइन · स्थान अज्ञात' : 
                  preferences.language === 'kn' ? 'ಆನ್‌ಲೈನ್ · ಸ್ಥಳ ಅಜ್ಞಾತ' : 
                  'Online · Location unknown') : 
                preferences.language === 'hi' ? 'ऑफलाइन मोड' : 
                preferences.language === 'kn' ? 'ಆಫ್‌ಲೈನ್ ಮೋಡ್' : 
                'Offline mode'
              }
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={toggleVoiceMode}
            className={`p-2 rounded-full ${isVoiceModeActive ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
            aria-label={isVoiceModeActive ? "Disable voice mode" : "Enable voice mode"}
            title={isVoiceModeActive ? "Disable voice mode" : "Enable voice mode"}
          >
            {isVoiceModeActive ? 
              <span role="img" aria-label="Voice on">🔊</span> : 
              <span role="img" aria-label="Voice off">🔇</span>
            }
          </button>
          <button 
            onClick={handleClearChat}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label="Clear chat"
            title="Clear chat"
          >
            <span role="img" aria-label="Clear">🗑️</span>
          </button>
          <button 
            onClick={handleClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label="Close chat"
            title="Close chat"
          >
            <span role="img" aria-label="Close">✖️</span>
          </button>
        </div>
      </div>

      {/* API status indicator */}
      {activeApis.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 flex flex-wrap gap-2 text-xs">
          {activeApis.map(api => (
            <span 
              key={api.id} 
              className={`px-2 py-1 rounded-full flex items-center ${
                api.isAvailable ? 
                'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full mr-1 ${api.isAvailable ? 'bg-green-500' : 'bg-gray-500'}`}></span>
              {api.name}
            </span>
          ))}
        </div>
      )}

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
        style={{ 
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          maxHeight: 'calc(100% - 180px)' // Adjust based on header + input heights
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-100 dark:bg-blue-900 text-gray-800 dark:text-gray-100'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
              } ${message.type === 'weather' ? 'weather-data-card' : ''}`}
            >
              {/* Message content based on type */}
              {message.type === 'weather' ? (
                <div dangerouslySetInnerHTML={{ __html: message.text }} />
              ) : (
                <div className="whitespace-pre-wrap">
                  {message.text}
                  
                  {message.status === 'failed' && message.sender === 'user' && (
                    <button
                      onClick={() => handleRetry(message.id)}
                      className="ml-2 text-xs text-red-600 dark:text-red-400 underline"
                    >
                      {preferences.language === 'hi' ? 'पुनः प्रयास करें' : 
                       preferences.language === 'kn' ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' : 
                       'Retry'}
                    </button>
                  )}
                </div>
              )}
              
              <div className={`text-xs mt-1 ${
                message.sender === 'user' 
                  ? 'text-blue-700 dark:text-blue-300' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                
                {message.sender === 'user' && message.status && (
                  <span className="ml-1">
                    {message.status === 'sending' && '⏳'}
                    {message.status === 'sent' && '✓'}
                    {message.status === 'failed' && '❌'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
              <div className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Example questions */}
      {getExampleQuestions().length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex overflow-x-auto">
          {getExampleQuestions().map((question) => (
            <button
              key={question.id}
              onClick={question.handler}
              className="flex-shrink-0 border border-gray-300 dark:border-gray-600 rounded-full px-3 py-1 mr-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              disabled={isLoading}
            >
              {question.text}
            </button>
          ))}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={
              preferences.language === 'hi' ? 'कृपया अपना प्रश्न टाइप करें...' : 
              preferences.language === 'kn' ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ...' : 
              'Type your question here...'
            }
            className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={startVoiceInput}
            className={`absolute right-16 p-2 rounded-full ${
              isVoiceRecording 
                ? 'text-red-600 dark:text-red-400 animate-pulse' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            disabled={isLoading || networkStatus === 'offline'}
            aria-label={isVoiceRecording ? "Recording voice" : "Start voice input"}
            title={isVoiceRecording ? "Recording voice" : "Start voice input"}
          >
            <span role="img" aria-label="Voice">{isVoiceRecording ? '🔴' : '🎤'}</span>
          </button>
          
          <button
            type="submit"
            className="ml-2 bg-green-500 p-2 rounded-full text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            title="Send message"
          >
            <span role="img" aria-label="Send">📤</span>
          </button>
        </div>
      </form>
      
      {/* Clear chat confirmation modal */}
      {showClearConfirmation && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {preferences.language === 'hi' ? 'चैट साफ़ करें?' : 
               preferences.language === 'kn' ? 'ಚಾಟ್ ತೆರವುಗೊಳಿಸುವುದೇ?' : 
               'Clear chat?'}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {preferences.language === 'hi' ? 'क्या आप वाकई सभी संदेश हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती है।' : 
               preferences.language === 'kn' ? 'ನೀವು ನಿಜವಾಗಿಯೂ ಎಲ್ಲಾ ಸಂದೇಶಗಳನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.' : 
               'Are you sure you want to clear all messages? This action cannot be undone.'}
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelClearChat}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {preferences.language === 'hi' ? 'रद्द करें' : 
                 preferences.language === 'kn' ? 'ರದ್ದುಮಾಡು' : 
                 'Cancel'}
              </button>
              <button
                type="button"
                onClick={clearChat}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {preferences.language === 'hi' ? 'साफ़ करें' : 
                 preferences.language === 'kn' ? 'ತೆರವುಗೊಳಿಸಿ' : 
                 'Clear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartFarmAssistant; 