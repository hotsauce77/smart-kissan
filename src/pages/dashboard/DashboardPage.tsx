import React, { useState, useEffect } from 'react';
import DataCard from '../../components/ui/DataCard';
import LineChart from '../../components/charts/LineChart';
import apiService from '../../services/api';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const DashboardPage: React.FC = () => {
  const { preferences } = useUser();
  const [cropRecommendations, setCropRecommendations] = useState<any[]>([]);
  const [yieldPredictions, setYieldPredictions] = useState<any[]>([]);
  const [priceForecasts, setPriceForecasts] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [satelliteData, setSatelliteData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherLocation, setWeatherLocation] = useState('');
  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    // Try to get user's location for more accurate weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default location
          setUserLocation('Punjab, India');
        }
      );
    } else {
      // Fallback to default location
      setUserLocation('Punjab, India');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userLocation) return;
      
      try {
        setLoading(true);
        
        // Use the user's actual location for weather data if available
        const locationToUse = userLocation || 'Punjab, India';
        
        // Fetch data in parallel
        const [
          cropRecommendationsRes,
          yieldPredictionsRes,
          priceForecastsRes,
          weatherDataRes,
          satelliteDataRes
        ] = await Promise.all([
          apiService.getCropRecommendations({}),
          apiService.getYieldPredictions({}),
          apiService.getPriceForecasts({ crop: 'Rice' }),
          apiService.getWeatherData({ location: locationToUse }),
          apiService.getSatelliteData({ location: locationToUse })
        ]);

        setCropRecommendations(cropRecommendationsRes.data);
        setYieldPredictions(yieldPredictionsRes.data);
        setPriceForecasts(priceForecastsRes.data);
        setWeatherData(weatherDataRes.data);
        
        // Check if location property exists in the weather data
        if ('location' in weatherDataRes.data) {
          setWeatherLocation(weatherDataRes.data.location);
        } else if (locationToUse) {
          // Fallback to the location we used for the API call
          setWeatherLocation(locationToUse);
        }
        setSatelliteData(satelliteDataRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userLocation]);

  // Function to determine appropriate weather icon class
  const getWeatherIconClass = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) {
      return 'text-blue-500';
    } else if (desc.includes('cloud')) {
      return 'text-gray-500';
    } else if (desc.includes('sun') || desc.includes('clear')) {
      return 'text-yellow-500';
    } else if (desc.includes('snow')) {
      return 'text-blue-200';
    } else if (desc.includes('thunder') || desc.includes('storm')) {
      return 'text-purple-500';
    }
    return 'text-gray-400';
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/field-mapping" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Map Your Fields
          </Link>
        </div>
      </div>

      {/* Weather Analytics */}
      <div className="mt-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
          Real-time Weather Analytics{weatherLocation ? ` for ${weatherLocation}` : ''}
        </h3>
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          {loading ? (
            <div className="p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="grid grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : weatherData ? (
            <div>
              {/* Current weather */}
              <div className="p-6 md:flex md:items-center md:justify-between border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  {weatherData.current.icon && (
                    <img 
                      src={weatherData.current.icon.startsWith('//') ? `https:${weatherData.current.icon}` : weatherData.current.icon} 
                      alt={weatherData.current.description} 
                      className="w-16 h-16 mr-4"
                    />
                  )}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {weatherData.current.temp}°C, {weatherData.current.description}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Feels like {weatherData.current.feelsLike}°C • Humidity: {weatherData.current.humidity}% • 
                      Wind: {weatherData.current.windSpeed} km/h {weatherData.current.windDirection}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Last updated: {weatherData.current.time}
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-4">
                  <div className="text-sm text-center">
                    <div className="text-primary-600 dark:text-primary-400 font-medium">Rainfall</div>
                    <div className="flex items-center justify-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">{weatherData.current.rainfall} mm</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 5-day forecast */}
              <div className="p-4">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">5-Day Forecast</h5>
                <div className="grid grid-cols-5 gap-2 text-sm">
                  {weatherData.forecast.map((day: any, i: number) => (
                    <div key={i} className="text-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="font-medium text-gray-900 dark:text-white">{day.day}</div>
                      {day.icon && (
                        <img 
                          src={day.icon.startsWith('//') ? `https:${day.icon}` : day.icon} 
                          alt={day.description} 
                          className="w-10 h-10 mx-auto my-1"
                        />
                      )}
                      <div className="font-semibold text-gray-800 dark:text-gray-100">{day.temp}°C</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        <span className="text-primary-500 dark:text-primary-400">{day.rainfall} mm</span> • {day.humidity}%
                      </div>
                      <div className="text-xs mt-1 truncate text-gray-600 dark:text-gray-300" title={day.description}>
                        {day.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Agricultural Weather Impact */}
              <div className="p-4 bg-primary-50 dark:bg-primary-900/10 border-t border-primary-100 dark:border-primary-900/20">
                <h5 className="text-sm font-medium text-primary-800 dark:text-primary-300 mb-2">Impact on Farming</h5>
                <ul className="text-sm text-primary-700 dark:text-primary-300 space-y-1">
                  {weatherData.current.rainfall > 5 ? (
                    <li>• Heavy rainfall may affect harvesting. Consider scheduling field work accordingly.</li>
                  ) : weatherData.current.rainfall > 0 ? (
                    <li>• Light rainfall is good for crop growth. Monitor soil moisture levels.</li>
                  ) : (
                    <li>• Dry conditions. Check irrigation needs for your crops.</li>
                  )}
                  {weatherData.current.windSpeed > 20 ? (
                    <li>• High winds may affect spraying operations and could damage tall crops.</li>
                  ) : (
                    <li>• Wind conditions are favorable for field operations.</li>
                  )}
                  <li>• {weatherData.forecast[0].temp > 30 ? 'High' : weatherData.forecast[0].temp < 15 ? 'Low' : 'Moderate'} temperatures expected. {weatherData.forecast[0].temp > 30 ? 'Ensure adequate irrigation.' : weatherData.forecast[0].temp < 15 ? 'Watch for frost-sensitive crops.' : 'Optimal for most crop growth.'}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Weather data unavailable. Please check your connection and try again.
            </div>
          )}
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Crop Recommendation */}
        <DataCard
          title="Top Crop Recommendation"
          value={cropRecommendations?.[0]?.name || '-'}
          loading={loading}
          footer={
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                View all recommendations
              </a>
            </div>
          }
        >
          {cropRecommendations?.[0] && (
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Confidence:</span>
                <span className="font-medium">{(cropRecommendations[0].confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Soil Type:</span>
                <span className="font-medium">{cropRecommendations[0].soilType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Season:</span>
                <span className="font-medium">{cropRecommendations[0].season}</span>
              </div>
            </div>
          )}
        </DataCard>

        {/* Yield Prediction */}
        <DataCard
          title="Expected Yield"
          value={yieldPredictions?.[0] ? `${yieldPredictions[0].predictedYield} ${yieldPredictions[0].unit}` : '-'}
          loading={loading}
          footer={
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                View all predictions
              </a>
            </div>
          }
        >
          {yieldPredictions?.[0] && (
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Crop:</span>
                <span className="font-medium">{yieldPredictions[0].crop}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Probability:</span>
                <span className="font-medium">{(yieldPredictions[0].probability * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </DataCard>

        {/* Satellite Analysis Summary */}
        <DataCard
          title="Satellite Analysis"
          value={satelliteData?.healthStatus || '-'}
          loading={loading}
          footer={
            <div className="text-sm">
              <Link to="/field-mapping?mode=satellite" className="font-medium text-primary-600 hover:text-primary-500">
                View detailed analysis
              </Link>
            </div>
          }
        >
          {satelliteData && (
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">NDVI:</span>
                <span className="font-medium">{satelliteData.ndvi}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Soil Moisture:</span>
                <span className="font-medium">{satelliteData.soilMoisture}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Updated:</span>
                <span className="font-medium">{new Date(satelliteData.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </DataCard>
      </div>

      {/* Charts Row */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Price Forecast Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">Rice Price Forecast</h3>
          {loading ? (
            <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ) : (
            <LineChart
              title=""
              labels={priceForecasts.map(item => item.month)}
              datasets={[
                {
                  label: 'Price (₹/quintal)',
                  data: priceForecasts.map(item => item.price),
                },
              ]}
              yAxisLabel="Price (₹)"
              xAxisLabel="Month"
            />
          )}
        </div>

        {/* Satellite Data */}
        <DataCard
          title="Satellite Analysis"
          className="p-6 h-full"
          loading={loading}
          footer={
            <div className="text-sm">
              <Link to="/field-mapping?mode=satellite" className="font-medium text-primary-600 hover:text-primary-500">
                View detailed analysis
              </Link>
            </div>
          }
        >
          {satelliteData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">NDVI (Vegetation Index)</p>
                  <p className="text-lg font-medium dark:text-white">{satelliteData.ndvi}</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${satelliteData.ndvi * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Soil Moisture</p>
                  <p className="text-lg font-medium dark:text-white">{satelliteData.soilMoisture}%</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${satelliteData.soilMoisture}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Health Status</p>
                <p className="text-lg font-medium dark:text-white">{satelliteData.healthStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="text-sm dark:text-gray-300">{new Date(satelliteData.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DataCard>
      </div>
    </div>
  );
};

export default DashboardPage; 