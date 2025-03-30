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
    { id: 1, crop: 'Rice', predictedYield: 1800, unit: 'kg/acre', probability: 0.88 },
    { id: 2, crop: 'Wheat', predictedYield: 1500, unit: 'kg/acre', probability: 0.82 },
    { id: 3, crop: 'Cotton', predictedYield: 900, unit: 'kg/acre', probability: 0.75 },
  ],
  priceForecasts: [
    { month: 'Jan', Rice: 19.5, Wheat: 22.0, Cotton: 60.0, Sugarcane: 3.5, Maize: 18.0 },
    { month: 'Feb', Rice: 19.8, Wheat: 22.5, Cotton: 62.0, Sugarcane: 3.4, Maize: 18.5 },
    { month: 'Mar', Rice: 20.2, Wheat: 23.0, Cotton: 63.5, Sugarcane: 3.3, Maize: 19.0 },
    { month: 'Apr', Rice: 20.5, Wheat: 23.2, Cotton: 64.0, Sugarcane: 3.2, Maize: 19.5 },
    { month: 'May', Rice: 19.0, Wheat: 22.8, Cotton: 61.0, Sugarcane: 3.1, Maize: 18.8 },
    { month: 'Jun', Rice: 18.5, Wheat: 22.2, Cotton: 59.0, Sugarcane: 3.0, Maize: 18.2 },
    { month: 'Jul', Rice: 18.0, Wheat: 21.8, Cotton: 57.0, Sugarcane: 2.9, Maize: 17.8 },
    { month: 'Aug', Rice: 19.0, Wheat: 22.0, Cotton: 58.0, Sugarcane: 3.0, Maize: 18.0 },
    { month: 'Sep', Rice: 20.0, Wheat: 22.5, Cotton: 59.5, Sugarcane: 3.1, Maize: 18.5 },
    { month: 'Oct', Rice: 21.0, Wheat: 23.0, Cotton: 61.0, Sugarcane: 3.2, Maize: 19.0 },
    { month: 'Nov', Rice: 20.5, Wheat: 22.8, Cotton: 60.5, Sugarcane: 3.3, Maize: 18.8 },
    { month: 'Dec', Rice: 20.0, Wheat: 22.5, Cotton: 60.0, Sugarcane: 3.5, Maize: 18.5 },
  ],
  weatherData: {
    current: {
      temp: 28,
      humidity: 65,
      description: 'Partly cloudy',
      rainfall: 0,
      windSpeed: 10,
      windDirection: 'NE',
      pressure: 1015,
      feelsLike: 30,
      uv: 4,
      icon: 'https://openweathermap.org/img/wn/02d@2x.png',
      time: new Date().toISOString(),
    },
    forecast: [
      { day: 'Today', date: new Date().toISOString().split('T')[0], temp: 28, rainfall: 0, description: 'Partly cloudy', icon: 'https://openweathermap.org/img/wn/02d@2x.png', humidity: 65, maxTemp: 30, minTemp: 26 },
      { day: 'Tomorrow', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], temp: 29, rainfall: 0, description: 'Sunny', icon: 'https://openweathermap.org/img/wn/01d@2x.png', humidity: 60, maxTemp: 31, minTemp: 27 },
      { day: 'Wed', date: new Date(Date.now() + 2*86400000).toISOString().split('T')[0], temp: 27, rainfall: 10, description: 'Light rain', icon: 'https://openweathermap.org/img/wn/10d@2x.png', humidity: 75, maxTemp: 29, minTemp: 25 },
      { day: 'Thu', date: new Date(Date.now() + 3*86400000).toISOString().split('T')[0], temp: 26, rainfall: 15, description: 'Rain', icon: 'https://openweathermap.org/img/wn/09d@2x.png', humidity: 80, maxTemp: 28, minTemp: 24 },
      { day: 'Fri', date: new Date(Date.now() + 4*86400000).toISOString().split('T')[0], temp: 28, rainfall: 5, description: 'Light rain', icon: 'https://openweathermap.org/img/wn/10d@2x.png', humidity: 70, maxTemp: 30, minTemp: 26 },
    ],
    location: 'Default City',
    region: 'Default Region',
    country: 'Default Country',
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
    const apiKey = 'bad08676f5c5412abde204419252903'; // WeatherAPI.com key
    
    // WeatherAPI.com accepts both location names and lat,lon format
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=5&aqi=no&alerts=no`;
    
    const response = await axios.get(url);
    
    // Map the WeatherAPI.com response to our app's data structure
    if (response.data) {
      // Current weather data
      const current = response.data.current;
      const location = response.data.location;
      
      // Format forecast data
      const forecastDays = response.data.forecast.forecastday.map((day: any) => {
        // Get date information
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
          windSpeed: current.wind_kph / 3.6, // convert to m/s
          windDirection: getWindDirection(current.wind_degree),
          pressure: current.pressure_mb,
          feelsLike: current.feelslike_c,
          uv: current.uv,
          icon: current.condition.icon,
          time: current.last_updated_epoch * 1000,
        },
        forecast: forecastDays,
        location: location.name,
        region: location.region,
        country: location.country,
      };
    }
    
    throw new Error('Invalid response from weather API');
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Helper function to convert wind degrees to direction
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Reverse geocoding function to get location name from coordinates
const reverseGeocode = async (lat: number, lon: number) => {
  try {
    // Using OpenStreetMap Nominatim API (free, no key required)
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SmartKissan Farming App' // Required by Nominatim Terms of Use
        }
      }
    );
    
    if (response.data) {
      // Extract relevant location data
      const addressData = response.data.address || {};
      
      return {
        data: {
          name: response.data.display_name || '',
          city: addressData.city || addressData.town || addressData.village || '',
          region: addressData.state || addressData.county || '',
          country: addressData.country || '',
          countryCode: addressData.country_code || '',
        }
      };
    }
    
    throw new Error('Invalid response from geocoding API');
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
};

// Fetch crop recommendations based on soil and climate data
const fetchCropRecommendations = async (lat: number, lon: number) => {
  try {
    // For now, we'll simulate crop recommendations based on location
    // In a real implementation, this would call a real AI/ML service
    
    // Get weather data for the location
    const locationStr = `${lat},${lon}`;
    const weatherData = await fetchWeatherData(locationStr);
    
    // Basic logic to determine suitable crops based on temperature and rainfall
    const currentTemp = weatherData.current.temp;
    const humidity = weatherData.current.humidity;
    
    let recommendedCrops = [];
    
    // Very basic logic - would be much more sophisticated in a real app
    if (currentTemp > 25 && humidity > 60) {
      recommendedCrops = ['Rice', 'Cotton', 'Sugarcane'];
    } else if (currentTemp > 20 && currentTemp <= 25) {
      recommendedCrops = ['Wheat', 'Barley', 'Mustard'];
    } else if (currentTemp > 15 && currentTemp <= 20) {
      recommendedCrops = ['Potato', 'Peas', 'Beans'];
    } else {
      recommendedCrops = ['Cabbage', 'Cauliflower', 'Lettuce'];
    }
    
    // Create location object with default values
    const locationInfo = {
      name: `${lat}, ${lon}`,
      region: '',
      country: ''
    };
    
    // Use type assertion to safely access optional properties from weatherData
    // This works because we know the API returns these fields when successful
    const weatherDataExtended = weatherData as {
      current: typeof weatherData.current;
      forecast: typeof weatherData.forecast;
      location?: string;
      region?: string;
      country?: string;
    };
    
    if (weatherDataExtended.location) {
      locationInfo.name = weatherDataExtended.location;
    }
    if (weatherDataExtended.region) {
      locationInfo.region = weatherDataExtended.region;
    }
    if (weatherDataExtended.country) {
      locationInfo.country = weatherDataExtended.country;
    }
    
    return {
      data: {
        crops: recommendedCrops,
        confidence: 0.85,
        location: locationInfo,
        weatherSummary: {
          temperature: currentTemp,
          humidity: humidity,
          description: weatherData.current.description
        }
      }
    };
  } catch (error) {
    console.error('Error fetching crop recommendations:', error);
    // Fall back to mock data
    return { 
      data: mockData.cropRecommendations
    };
  }
};

// API service with methods for each feature
export const apiService = {
  // Add reverse geocoding to the API service
  reverseGeocode: async (lat: number, lon: number) => {
    try {
      const result = await reverseGeocode(lat, lon);
      return { success: true, data: result };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return { success: false, error: 'Failed to get location' };
    }
  },
  
  // Crop recommendations based on location and season
  getCropRecommendations: async (params: { location?: string; lat?: number; lon?: number } = {}) => {
    try {
      if (params.lat && params.lon) {
        const result = await fetchCropRecommendations(params.lat, params.lon);
        return result;
      }
      // Fallback to mock data
      return { success: true, data: mockData.cropRecommendations };
    } catch (error) {
      console.error('Error fetching crop recommendations:', error);
      return { success: false, error: 'Failed to get crop recommendations' };
    }
  },
  
  // Yield prediction
  getYieldPredictions: async (params: { crop?: string; location?: string } = {}) => {
    try {
      // In a real app, this would call a real API
      // For now, return mock data
      let filteredData = mockData.yieldPredictions;
      if (params.crop) {
        filteredData = filteredData.filter(item => 
          item.crop.toLowerCase() === params.crop?.toLowerCase()
        );
      }
      return { success: true, data: filteredData };
    } catch (error) {
      console.error('Error fetching yield predictions:', error);
      return { success: false, error: 'Failed to get yield predictions' };
    }
  },
  
  // Price forecasting
  getPriceForecasts: async (params: { crop?: string; location?: string } = {}) => {
    try {
      // In a real app, this would call a real API
      // For now, return mock data
      type PriceForecast = typeof mockData.priceForecasts[0];
      let data = [...mockData.priceForecasts];
      
      // If specific crop is requested, filter to include only that crop
      if (params.crop && params.crop !== 'all') {
        const cropName = params.crop.charAt(0).toUpperCase() + params.crop.slice(1).toLowerCase();
        if (data[0][cropName as keyof PriceForecast] !== undefined) {
          // Create a new array with just the requested crop data
          const filteredData = data.map(item => {
            const result: Record<string, any> = {
              month: item.month
            };
            result[cropName] = item[cropName as keyof PriceForecast];
            return result;
          });
          
          return { success: true, data: filteredData };
        }
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching price forecasts:', error);
      return { success: false, error: 'Failed to get price forecasts' };
    }
  },
  
  // Weather data - now using the real implementation from above
  getWeatherData: async (params: { location?: string; lat?: number; lon?: number }) => {
    try {
      let locationString;
      
      if (params.location) {
        locationString = params.location;
      } else if (params.lat !== undefined && params.lon !== undefined) {
        locationString = `${params.lat},${params.lon}`;
      } else {
        throw new Error('Either location name or coordinates must be provided');
      }
      
      const result = await fetchWeatherData(locationString);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Fall back to mock data in case of error
      return { success: true, data: mockData.weatherData, isMock: true };
    }
  },
  
  // Satellite analysis
  getSatelliteData: async (params: { location?: string; lat?: number; lon?: number }) => {
    try {
      // In a real app, this would call a real API
      // For now, return mock data
      return { success: true, data: mockData.satelliteData };
    } catch (error) {
      console.error('Error fetching satellite data:', error);
      return { success: false, error: 'Failed to get satellite data' };
    }
  },
  
  // Send chat message to AI service
  sendChatMessage: async (
    message: string,
    language: string = 'en',
    userLocation?: any,
    messageHistory?: any[],
    enhancedContext?: any
  ) => {
    try {
      // For now, return mock responses
      return {
        data: {
          response: generateMockResponse(message, language, userLocation),
          timestamp: new Date().toISOString(),
          richData: null
        }
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }
};

// Helper function to generate a mock response
const generateMockResponse = (message: string, language: string, userLocation?: any) => {
  // Simple mock responses for different types of queries
  const lowerMessage = message.toLowerCase();
  
  // Weather related
  if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('forecast')) {
    if (userLocation) {
      return language === 'hi' ? 
        `${userLocation.locationName} में आज का मौसम आंशिक रूप से बादल छाए रहने की संभावना है, तापमान 28°C, आर्द्रता 65% है।` :
        language === 'kn' ? 
        `${userLocation.locationName} ನಲ್ಲಿ ಇಂದಿನ ಹವಾಮಾನ ಭಾಗಶಃ ಮೋಡ ಕವಿದಿರುವ ಸಾಧ್ಯತೆಯಿದೆ, ತಾಪಮಾನ 28°C, ಆರ್ದ್ರತೆ 65% ಇದೆ.` :
        `Today's weather in ${userLocation.locationName} is likely to be partly cloudy with a temperature of 28°C and humidity of 65%.`;
    } else {
      return language === 'hi' ? 
        `क्षमा करें, मौसम की जानकारी देने के लिए आपके स्थान की जानकारी आवश्यक है।` :
        language === 'kn' ? 
        `ಕ್ಷಮಿಸಿ, ಹವಾಮಾನ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಲು ನಿಮ್ಮ ಸ್ಥಳದ ಮಾಹಿತಿ ಅಗತ್ಯವಿದೆ.` :
        `Sorry, I need your location information to provide weather updates.`;
    }
  }
  
  // Crop related
  else if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
    return language === 'hi' ? 
      `इस मौसम में अच्छी फसलों में शामिल हैं: चावल, गेहूं, और मक्का। क्या आप किसी विशेष फसल के बारे में जानना चाहते हैं?` :
      language === 'kn' ? 
      `ಈ ಋತುವಿನಲ್ಲಿ ಉತ್ತಮ ಬೆಳೆಗಳು: ಭತ್ತ, ಗೋಧಿ, ಮತ್ತು ಮೆಕ್ಕೆಜೋಳ. ನೀವು ಯಾವುದಾದರೂ ನಿರ್ದಿಷ್ಟ ಬೆಳೆಯ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುವಿರಾ?` :
      `Good crops for this season include: Rice, Wheat, and Maize. Would you like to know about a specific crop?`;
  }
  
  // Price/market related
  else if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('sell')) {
    return language === 'hi' ? 
      `वर्तमान बाजार मूल्य: चावल - ₹1950/क्विंटल, गेहूं - ₹2250/क्विंटल, कपास - ₹6200/क्विंटल।` :
      language === 'kn' ? 
      `ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು: ಅಕ್ಕಿ - ₹1950/ಕ್ವಿಂಟಾಲ್, ಗೋಧಿ - ₹2250/ಕ್ವಿಂಟಾಲ್, ಹತ್ತಿ - ₹6200/ಕ್ವಿಂಟಾಲ್.` :
      `Current market prices: Rice - ₹1950/quintal, Wheat - ₹2250/quintal, Cotton - ₹6200/quintal.`;
  }
  
  // General response
  else {
    return language === 'hi' ? 
      `मैं आपकी कैसे मदद कर सकता हूँ? मैं मौसम, फसल सलाह, या बाजार मूल्य के बारे में जानकारी प्रदान कर सकता हूँ।` :
      language === 'kn' ? 
      `ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? ನಾನು ಹವಾಮಾನ, ಬೆಳೆ ಸಲಹೆ, ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಬಲ್ಲೆ.` :
      `How can I help you? I can provide information about weather, crop advice, or market prices.`;
  }
};

export default apiService; 