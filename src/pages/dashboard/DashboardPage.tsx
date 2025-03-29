import React, { useState, useEffect } from 'react';
import DataCard from '../../components/ui/DataCard';
import LineChart from '../../components/charts/LineChart';
import apiService from '../../services/api';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [cropRecommendations, setCropRecommendations] = useState<any[]>([]);
  const [yieldPredictions, setYieldPredictions] = useState<any[]>([]);
  const [priceForecasts, setPriceForecasts] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [satelliteData, setSatelliteData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
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
          apiService.getWeatherData({ location: 'Punjab' }),
          apiService.getSatelliteData({ location: 'Punjab' })
        ]);

        setCropRecommendations(cropRecommendationsRes.data);
        setYieldPredictions(yieldPredictionsRes.data);
        setPriceForecasts(priceForecastsRes.data);
        setWeatherData(weatherDataRes.data);
        setSatelliteData(satelliteDataRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/field-mapping" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Map Your Fields
          </Link>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Weather Card */}
        <DataCard
          title="Current Weather"
          value={weatherData?.current ? `${weatherData.current.temp}°C, ${weatherData.current.description}` : '-'}
          loading={loading}
          footer={
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                View forecast
              </a>
            </div>
          }
        >
          {weatherData?.forecast && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">5-day forecast:</p>
              <div className="mt-2 grid grid-cols-5 gap-2 text-xs">
                {weatherData.forecast.map((day: any, i: number) => (
                  <div key={i} className="text-center">
                    <div className="font-medium">{day.day}</div>
                    <div>{day.temp}°C</div>
                    <div className="text-xs">{day.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DataCard>

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
      </div>

      {/* Charts Row */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Price Forecast Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Rice Price Forecast</h3>
          {loading ? (
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
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
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">NDVI (Vegetation Index)</p>
                  <p className="text-lg font-medium">{satelliteData.ndvi}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${satelliteData.ndvi * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Soil Moisture</p>
                  <p className="text-lg font-medium">{satelliteData.soilMoisture}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${satelliteData.soilMoisture}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Health Status</p>
                <p className="text-lg font-medium">{satelliteData.healthStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm">{new Date(satelliteData.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DataCard>
      </div>
    </div>
  );
};

export default DashboardPage; 