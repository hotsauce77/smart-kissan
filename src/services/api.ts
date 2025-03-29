import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with real API endpoint in production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
      // In a real application, we would make an API call:
      // const response = await api.get('/weather', { params });
      // return response.data;
      
      // For now, return mock data
      return { data: mockData.weatherData };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
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

  // Chat with AI Assistant
  sendChatMessage: async (message: string) => {
    try {
      // In a real application, we would post to an API:
      // const response = await api.post('/chat', { message });
      // return response.data;
      
      // For now, return a mock response
      return { 
        data: { 
          response: `This is a mock response to your message: "${message}". In a real implementation, this would come from an AI model.`,
          timestamp: new Date().toISOString()
        } 
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },
};

export default apiService; 