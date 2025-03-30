import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import DataCard from '../ui/DataCard';

// Register the chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface NdviDashboardProps {
  location?: { lat: number; lng: number } | null;
  fieldName?: string;
}

interface NdviDataPoint {
  date: string;
  ndvi: number;
  temperature?: number;
  precipitation?: number; // mm of rain
}

const NdviDashboard: React.FC<NdviDashboardProps> = ({ location, fieldName }) => {
  const [ndviData, setNdviData] = useState<NdviDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentNdvi, setCurrentNdvi] = useState<number | null>(null);
  const [cropHealth, setCropHealth] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Simulate fetching NDVI data from Earth Engine API
  useEffect(() => {
    const fetchNdviData = async () => {
      if (!location) {
        setError('No location provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate mock NDVI data for the past 6 months
        const mockData: NdviDataPoint[] = [];
        const today = new Date();
        
        // Generate realistic NDVI values with seasonal fluctuations
        for (let i = 180; i >= 0; i -= 10) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          
          // Create seasonal pattern with some random variation
          const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
          const seasonalComponent = Math.sin(dayOfYear / 365 * 2 * Math.PI) * 0.2 + 0.6; // Range from 0.4 to 0.8
          const randomVariation = (Math.random() * 0.1) - 0.05; // -0.05 to +0.05
          
          let ndviValue = seasonalComponent + randomVariation;
          
          // Ensure within valid NDVI range (0-1)
          ndviValue = Math.max(0, Math.min(1, ndviValue));
          
          // Generate realistic temperature based on date
          const tempBase = 20 + Math.sin(dayOfYear / 365 * 2 * Math.PI) * 10;
          const temperature = tempBase + (Math.random() * 4 - 2);
          
          // Generate realistic precipitation (more in rainy season)
          const isPeakRainySeason = dayOfYear > 150 && dayOfYear < 250; // Roughly June-September
          const basePrecipitation = isPeakRainySeason ? 12 : 3;
          const precipitation = Math.max(0, basePrecipitation + (Math.random() * 10 - 5));
          
          mockData.push({
            date: date.toISOString().split('T')[0],
            ndvi: Number(ndviValue.toFixed(2)),
            temperature: Number(temperature.toFixed(1)),
            precipitation: Number(precipitation.toFixed(1))
          });
        }

        setNdviData(mockData);
        
        // Set current NDVI (most recent value)
        const latestNdvi = mockData[mockData.length - 1].ndvi;
        setCurrentNdvi(latestNdvi);
        
        // Determine crop health status based on NDVI value
        if (latestNdvi >= 0.7) {
          setCropHealth('Excellent');
          setRecommendations([
            'Maintain current irrigation schedule',
            'Continue regular monitoring for pests',
            'Prepare for optimal harvest timing'
          ]);
        } else if (latestNdvi >= 0.5) {
          setCropHealth('Good');
          setRecommendations([
            'Consider slight increase in irrigation frequency',
            'Monitor for early signs of nutrient deficiency',
            'Apply foliar fertilizer if leaves show yellowing'
          ]);
        } else if (latestNdvi >= 0.3) {
          setCropHealth('Fair');
          setRecommendations([
            'Increase irrigation immediately',
            'Apply balanced NPK fertilizer',
            'Check for pest infestations or disease',
            'Consider soil testing for deficiencies'
          ]);
        } else {
          setCropHealth('Poor');
          setRecommendations([
            'Urgent intervention required',
            'Check irrigation system for failures',
            'Test soil for salinity or contamination',
            'Consider consultation with agricultural extension'
          ]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching NDVI data:', err);
        setError('Failed to fetch NDVI data. Please try again later.');
        setLoading(false);
      }
    };

    fetchNdviData();
  }, [location]);

  const getHealthColor = (ndviValue: number | null) => {
    if (ndviValue === null) return 'bg-gray-400';
    if (ndviValue >= 0.7) return 'bg-green-500';
    if (ndviValue >= 0.5) return 'bg-green-400';
    if (ndviValue >= 0.3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getChartData = () => {
    return {
      labels: ndviData.map(d => d.date),
      datasets: [
        {
          label: 'NDVI',
          data: ndviData.map(d => d.ndvi),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
          fill: 'origin',
          yAxisID: 'y'
        },
        {
          label: 'Temperature (°C)',
          data: ndviData.map(d => d.temperature),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.3,
          yAxisID: 'y1'
        },
        {
          label: 'Precipitation (mm)',
          data: ndviData.map(d => d.precipitation),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          pointRadius: 0,
          borderWidth: 1,
          fill: 'origin',
          yAxisID: 'y2'
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        min: 0,
        max: 1,
        title: {
          display: true,
          text: 'NDVI'
        }
      },
      y1: {
        type: 'linear' as const,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      },
      y2: {
        type: 'linear' as const,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Precipitation (mm)'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label === 'NDVI') {
              return `NDVI: ${value.toFixed(2)}`;
            } else if (label === 'Temperature (°C)') {
              return `Temp: ${value.toFixed(1)}°C`;
            } else if (label === 'Precipitation (mm)') {
              return `Precip: ${value.toFixed(1)} mm`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
          NDVI Analysis {fieldName ? `for ${fieldName}` : ''}
        </h3>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500 dark:text-red-400">
            {error}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <DataCard
                title="Current NDVI"
                value={currentNdvi !== null ? currentNdvi.toFixed(2) : 'N/A'}
              >
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getHealthColor(currentNdvi)}`} 
                      style={{ width: `${(currentNdvi || 0) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-red-500 dark:text-red-400">Poor</span>
                    <span className="text-yellow-500 dark:text-yellow-400">Fair</span>
                    <span className="text-green-400 dark:text-green-300">Good</span>
                    <span className="text-green-500 dark:text-green-500">Excellent</span>
                  </div>
                </div>
              </DataCard>
              
              <DataCard
                title="Crop Health"
                value={cropHealth}
              >
                <div className="mt-2 flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getHealthColor(currentNdvi)}`}></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{cropHealth} Condition</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Last updated: {ndviData.length ? ndviData[ndviData.length - 1].date : 'N/A'}
                </p>
              </DataCard>
              
              <DataCard
                title="Latest Metrics"
                value={`Temp: ${ndviData.length ? `${ndviData[ndviData.length - 1].temperature}°C` : 'N/A'}`}
              >
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Precipitation:</span>
                    <span className="font-medium text-blue-500 dark:text-blue-400">
                      {ndviData.length ? `${ndviData[ndviData.length - 1].precipitation} mm` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">30-day Avg NDVI:</span>
                    <span className="font-medium">
                      {ndviData.length 
                        ? (ndviData.slice(-3).reduce((sum, point) => sum + point.ndvi, 0) / 3).toFixed(2) 
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </DataCard>
            </div>
            
            {/* NDVI Chart */}
            <div className="p-2 mb-6">
              <h4 className="text-md font-medium mb-4 text-gray-800 dark:text-gray-200">NDVI, Temperature & Precipitation Trend</h4>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-2 h-72">
                <Line data={getChartData()} options={chartOptions} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic text-center">
                Data shown for the past 6 months. NDVI values range from 0 (no vegetation) to 1 (dense vegetation).
              </p>
            </div>
            
            {/* Recommendations */}
            <div className="bg-primary-50 dark:bg-primary-900/10 rounded-lg p-4 border border-primary-100 dark:border-primary-900/20">
              <h4 className="text-md font-medium mb-2 text-primary-800 dark:text-primary-300">Recommendations</h4>
              <ul className="space-y-2 text-sm text-primary-700 dark:text-primary-300">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-primary-100 dark:border-primary-900/20">
                <p className="text-xs text-primary-600 dark:text-primary-400">
                  <strong>How NDVI works:</strong> The Normalized Difference Vegetation Index measures the difference between 
                  near-infrared (which vegetation strongly reflects) and red light (which vegetation absorbs). This provides 
                  insights into the density and health of plants in a given area.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NdviDashboard; 