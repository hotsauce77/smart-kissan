import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with real API endpoint in production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// WebSocket for chatbot
let chatSocket: WebSocket | null = null;
let messageCallbacks: { [id: string]: (response: string) => void } = {};
let isConnecting = false;

// Function to initialize WebSocket connection with better error handling
const initChatWebSocket = () => {
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) return;
  if (isConnecting) return;
  
  isConnecting = true;
  
  try {
    chatSocket = new WebSocket('wss://backend.buildpicoapps.com/api/chatbot/chat');
    
    chatSocket.onopen = () => {
      console.log('WebSocket connection established');
      isConnecting = false;
    };
    
    chatSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.id && messageCallbacks[data.id]) {
          messageCallbacks[data.id](data.response || data.message || JSON.stringify(data));
          delete messageCallbacks[data.id];
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    chatSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      isConnecting = false;
      chatSocket = null;
    };
    
    chatSocket.onclose = () => {
      console.log('WebSocket connection closed');
      isConnecting = false;
      chatSocket = null;
      // Don't attempt to reconnect automatically - will reconnect on next message
    };
  } catch (error) {
    console.error('Error creating WebSocket:', error);
    isConnecting = false;
    chatSocket = null;
  }
};

// Mock data for development
const mockData = {
  cropRecommendations: [
    { id: 1, name: 'Rice', confidence: 0.92, soilType: 'Clay Loam', season: 'Kharif' },
    { id: 2, name: 'Wheat', confidence: 0.85, soilType: 'Clay Loam', season: 'Rabi' },
    { id: 3, name: 'Cotton', confidence: 0.78, soilType: 'Clay Loam', season: 'Kharif' },
  ],
  yieldPredictions: [
    { id: 1, crop: 'Rice', predictedYield: 4.5, unit: 'tons/ha', probability: 0.88 },
    { id: 2, crop: 'Wheat', predictedYield: 3.8, unit: 'tons/ha', probability: 0.82 },
    { id: 3, crop: 'Cotton', predictedYield: 2.2, unit: 'tons/ha', probability: 0.75 },
  ],
  priceForecasts: [
    { month: 'Jan', price: 1800 },
    { month: 'Feb', price: 1850 },
    { month: 'Mar', price: 1900 },
    { month: 'Apr', price: 1920 },
    { month: 'May', price: 1800 },
    { month: 'Jun', price: 1750 },
    { month: 'Jul', price: 1700 },
    { month: 'Aug', price: 1800 },
    { month: 'Sep', price: 1900 },
    { month: 'Oct', price: 2000 },
    { month: 'Nov', price: 1950 },
    { month: 'Dec', price: 1900 },
  ],
  weatherData: {
    current: {
      temp: 28,
      humidity: 65,
      description: 'Partly cloudy',
      rainfall: 0,
    },
    forecast: [
      { day: 'Today', temp: 28, rainfall: 0, description: 'Partly cloudy' },
      { day: 'Tomorrow', temp: 29, rainfall: 0, description: 'Sunny' },
      { day: 'Wednesday', temp: 27, rainfall: 10, description: 'Light rain' },
      { day: 'Thursday', temp: 26, rainfall: 15, description: 'Rain' },
      { day: 'Friday', temp: 28, rainfall: 5, description: 'Light rain' },
    ],
  },
  satelliteData: {
    ndvi: 0.72, // Normalized Difference Vegetation Index
    soilMoisture: 65, // percentage
    lastUpdated: '2024-03-28',
    healthStatus: 'Good',
    imageUrl: 'https://example.com/satellite-image.jpg',
  },
};

// Weather API service implementation for real-time weather data
const fetchWeatherData = async (location: string) => {
  try {
    const apiKey = 'bad08676f5c5412abde204419252903'; // WeatherAPI key
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=5&aqi=no&alerts=no`
    );
    
    // Map the API response to our app's data structure
    if (response.data) {
      const { current, forecast } = response.data;
      
      // Format forecast data
      const forecastDays = forecast.forecastday.map((day: any) => {
        const date = new Date(day.date);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        return {
          day: weekday,
          date: day.date,
          temp: day.day.avgtemp_c,
          rainfall: day.day.totalprecip_mm,
          description: day.day.condition.text,
          icon: day.day.condition.icon,
          humidity: day.day.avghumidity,
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
        };
      });
      
      // Return formatted data
      return {
        current: {
          temp: current.temp_c,
          humidity: current.humidity,
          description: current.condition.text,
          rainfall: current.precip_mm,
          windSpeed: current.wind_kph,
          windDirection: current.wind_dir,
          pressure: current.pressure_mb,
          feelsLike: current.feelslike_c,
          uv: current.uv,
          icon: current.condition.icon,
          time: current.last_updated,
        },
        forecast: forecastDays,
        location: response.data.location.name,
        region: response.data.location.region,
        country: response.data.location.country,
      };
    }
    
    throw new Error('Invalid response from weather API');
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// API service with methods for each feature
export const apiService = {
  // Crop Recommendations
  getCropRecommendations: async (params: { soilType?: string; location?: string }) => {
    try {
      // In a real application, we would make an API call:
      // const response = await api.get('/crop-recommendations', { params });
      // return response.data;
      
      // For now, return mock data
      return { data: mockData.cropRecommendations };
    } catch (error) {
      console.error('Error fetching crop recommendations:', error);
      throw error;
    }
  },

  // Yield Predictions
  getYieldPredictions: async (params: { crop?: string; location?: string }) => {
    try {
      // In a real application, we would make an API call:
      // const response = await api.get('/yield-predictions', { params });
      // return response.data;
      
      // For now, return mock data
      return { data: mockData.yieldPredictions };
    } catch (error) {
      console.error('Error fetching yield predictions:', error);
      throw error;
    }
  },

  // Price Forecasting
  getPriceForecasts: async (params: { crop: string; period?: string }) => {
    try {
      // In a real application, we would make an API call:
      // const response = await api.get('/price-forecasts', { params });
      // return response.data;
      
      // For now, return mock data
      return { data: mockData.priceForecasts };
    } catch (error) {
      console.error('Error fetching price forecasts:', error);
      throw error;
    }
  },

  // Weather Data
  getWeatherData: async (params: { location: string }) => {
    try {
      // Try to fetch real weather data
      const realWeatherData = await fetchWeatherData(params.location);
      return { data: realWeatherData };
    } catch (error) {
      console.error('Error fetching weather data, falling back to mock data:', error);
      
      // Fallback to mock data if real API fails
      return { data: mockData.weatherData };
    }
  },

  // Satellite Analysis
  getSatelliteData: async (params: { location: string; date?: string }) => {
    try {
      // In a real application, we would make an API call:
      // const response = await api.get('/satellite-data', { params });
      // return response.data;
      
      // For now, return mock data
      return { data: mockData.satelliteData };
    } catch (error) {
      console.error('Error fetching satellite data:', error);
      throw error;
    }
  },

  // Chat with AI Assistant (WebSocket implementation)
  sendChatMessage: async (message: string, language: string = 'en') => {
    try {
      // Initialize WebSocket if needed
      if (!chatSocket || chatSocket.readyState !== WebSocket.OPEN) {
        initChatWebSocket();
        // If we're still connecting, wait a bit
        if (chatSocket && chatSocket.readyState === WebSocket.CONNECTING) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      
      // If we still don't have a connection, fall back to mock
      if (!chatSocket || chatSocket.readyState !== WebSocket.OPEN) {
        console.warn('Using mock response because WebSocket is not available');
        return getMockResponse(message, language);
      }
      
      // Add Indian farming context to the message
      const contextEnhancedMessage = {
        id: Date.now().toString(),
        message: message,
        context: {
          domain: "agriculture",
          region: "India",
          language_preference: language, // Use the user's language preference
          expertise_level: "farmer",
          crops_of_interest: ["rice", "wheat", "cotton", "pulses"],
          current_season: getCurrentSeason(),
          include_local_knowledge: true
        }
      };
      
      return new Promise((resolve) => {
        const msgId = contextEnhancedMessage.id;
        
        // Set up callback for this specific message
        messageCallbacks[msgId] = (response) => {
          resolve({
            data: {
              response: translateResponse(response, language),
              timestamp: new Date().toISOString()
            }
          });
        };
        
        // Send the message
        if (chatSocket) {
          chatSocket.send(JSON.stringify(contextEnhancedMessage));
        }
        
        // Set a timeout for fallback to mock
        setTimeout(() => {
          if (messageCallbacks[msgId]) {
            delete messageCallbacks[msgId];
            console.warn('WebSocket response timeout, using fallback');
            resolve(getMockResponse(message, language));
          }
        }, 5000); // 5-second timeout (reduced from 10)
      });
    } catch (error) {
      console.error('Error sending chat message:', error);
      return getMockResponse(message, language);
    }
  },
};

// Helper function to get mock responses for different languages
function getMockResponse(message: string, language: string) {
  // Extract key terms for context-aware responses
  const lowerMessage = message.toLowerCase();
  let responseType: 'default' | 'weather' | 'pest' | 'crop' = "default";
  
  if (lowerMessage.includes("weather") || lowerMessage.includes("rain") || 
      lowerMessage.includes("mausam") || lowerMessage.includes("barish") ||
      lowerMessage.includes("ಹವಾಮಾನ") || lowerMessage.includes("ಮಳೆ")) {
    responseType = "weather";
  } else if (lowerMessage.includes("pest") || lowerMessage.includes("insect") || 
             lowerMessage.includes("keet") || lowerMessage.includes("keetnashak") ||
             lowerMessage.includes("ಕೀಟ") || lowerMessage.includes("ಕೀಟನಾಶಕ")) {
    responseType = "pest";
  } else if (lowerMessage.includes("crop") || lowerMessage.includes("plant") || 
             lowerMessage.includes("fasal") || lowerMessage.includes("ugaana") ||
             lowerMessage.includes("ಬೆಳೆ") || lowerMessage.includes("ಬೀಜ")) {
    responseType = "crop";
  }
  
  const responses: Record<string, Record<string, string>> = {
    default: {
      en: `I understand your question about "${message}". As your farming assistant, I recommend consulting your local agricultural extension for specific advice on this topic.`,
      hi: `मैं आपके प्रश्न "${message}" को समझता हूँ। आपके कृषि सहायक के रूप में, मैं इस विषय पर विशिष्ट सलाह के लिए आपके स्थानीय कृषि विस्तार से परामर्श करने की सलाह देता हूँ।`,
      kn: `ನಾನು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ "${message}". ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕನಾಗಿ, ಈ ವಿಷಯದ ಬಗ್ಗೆ ನಿರ್ದಿಷ್ಟ ಸಲಹೆಗಾಗಿ ನಿಮ್ಮ ಸ್ಥಳೀಯ ಕೃಷಿ ವಿಸ್ತರಣೆಯನ್ನು ಸಂಪರ್ಕಿಸಲು ನಾನು ಸಲಹೆ ನೀಡುತ್ತೇನೆ.`
    },
    weather: {
      en: `Based on recent data, weather conditions in major agricultural regions of India are currently suitable for farming activities. Monsoon progress is normal in most areas with adequate rainfall for crop development.`,
      hi: `हाल के आंकड़ों के अनुसार, भारत के प्रमुख कृषि क्षेत्रों में मौसम की स्थिति वर्तमान में कृषि गतिविधियों के लिए उपयुक्त है। अधिकांश क्षेत्रों में मानसून की प्रगति फसल विकास के लिए पर्याप्त वर्षा के साथ सामान्य है।`,
      kn: `ಇತ್ತೀಚಿನ ಮಾಹಿತಿಯ ಪ್ರಕಾರ, ಭಾರತದ ಪ್ರಮುಖ ಕೃಷಿ ಪ್ರದೇಶಗಳಲ್ಲಿ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು ಪ್ರಸ್ತುತ ಕೃಷಿ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸೂಕ್ತವಾಗಿವೆ. ಹೆಚ್ಚಿನ ಪ್ರದೇಶಗಳಲ್ಲಿ ಮುಂಗಾರು ಪ್ರಗತಿಯು ಬೆಳೆ ಬೆಳವಣಿಗೆಗೆ ಸಾಕಷ್ಟು ಮಳೆಯೊಂದಿಗೆ ಸಾಮಾನ್ಯವಾಗಿದೆ.`
    },
    pest: {
      en: `For sustainable pest management, consider neem oil, beneficial insects like ladybugs, and proper crop rotation. Integrated Pest Management (IPM) techniques reduce chemical usage while protecting your crops.`,
      hi: `टिकाऊ कीट प्रबंधन के लिए, नीम तेल, लेडीबग जैसे लाभकारी कीड़े और उचित फसल चक्र पर विचार करें। एकीकृत कीट प्रबंधन (IPM) तकनीकें आपकी फसलों की रक्षा करते हुए रासायनिक उपयोग को कम करती हैं।`,
      kn: `ಸುಸ್ಥಿರ ಕೀಟ ನಿರ್ವಹಣೆಗಾಗಿ, ಬೇವಿನ ಎಣ್ಣೆ, ಲೇಡಿಬಗ್‌ಗಳಂತಹ ಲಾಭದಾಯಕ ಕೀಟಗಳು ಮತ್ತು ಸರಿಯಾದ ಬೆಳೆ ತಿರುಗುವಿಕೆಯನ್ನು ಪರಿಗಣಿಸಿ. ಸಮಗ್ರ ಕೀಟ ನಿರ್ವಹಣೆ (IPM) ತಂತ್ರಗಳು ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ರಕ್ಷಿಸುವ ಜೊತೆಗೆ ರಾಸಾಯನಿಕ ಬಳಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತವೆ.`
    },
    crop: {
      en: `Consider your local soil type and current season when selecting crops. Rice, wheat, cotton, and pulses are major crops in India with varying planting seasons. Contact your local agricultural extension for region-specific recommendations.`,
      hi: `फसलों का चयन करते समय अपने स्थानीय मिट्टी के प्रकार और वर्तमान मौसम पर विचार करें। चावल, गेहूं, कपास और दालें भारत में विभिन्न रोपण मौसम के साथ प्रमुख फसलें हैं। क्षेत्र-विशिष्ट सिफारिशों के लिए अपने स्थानीय कृषि विस्तार से संपर्क करें।`,
      kn: `ಬೆಳೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡುವಾಗ ನಿಮ್ಮ ಸ್ಥಳೀಯ ಮಣ್ಣಿನ ಪ್ರಕಾರ ಮತ್ತು ಪ್ರಸ್ತುತ ಋತುವನ್ನು ಪರಿಗಣಿಸಿ. ಭತ್ತ, ಗೋಧಿ, ಹತ್ತಿ ಮತ್ತು ಬೇಳೆಕಾಳುಗಳು ವಿವಿಧ ನೆಡುವ ಋತುಗಳೊಂದಿಗೆ ಭಾರತದಲ್ಲಿ ಪ್ರಮುಖ ಬೆಳೆಗಳಾಗಿವೆ. ಪ್ರದೇಶ-ನಿರ್ದಿಷ್ಟ ಶಿಫಾರಸುಗಳಿಗಾಗಿ ನಿಮ್ಮ ಸ್ಥಳೀಯ ಕೃಷಿ ವಿಸ್ತರಣೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.`
    }
  };
  
  // Fall back to English if the language is not supported
  const langKey = (language in responses[responseType]) ? language : 'en';
  
  return {
    data: {
      response: responses[responseType][langKey],
      timestamp: new Date().toISOString()
    }
  };
}

// Function to translate responses to the correct language if needed
function translateResponse(response: string, language: string): string {
  // If the response is already in the correct language, return it as is
  if (
    (language === 'hi' && containsHindi(response)) || 
    (language === 'kn' && containsKannada(response)) ||
    (language === 'en' && !containsHindi(response) && !containsKannada(response))
  ) {
    return response;
  }
  
  // Otherwise, use the mock response system to generate a response in the correct language
  const mockResponse = getMockResponse(response, language);
  return mockResponse.data.response;
}

// Simple detection of Hindi and Kannada scripts
function containsHindi(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

function containsKannada(text: string): boolean {
  return /[\u0C80-\u0CFF]/.test(text);
}

// Helper function to get current season in India
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return "summer";
  if (month >= 6 && month <= 9) return "monsoon";
  if (month >= 10 && month <= 11) return "post-monsoon";
  return "winter";
}

export default apiService; 