import React, { useState, useEffect } from 'react';
import EnhancedMapComponent from '../../components/maps/EnhancedMapComponent';
import DataCard from '../../components/ui/DataCard';
import LineChart from '../../components/charts/LineChart';
import { useUser } from '../../contexts/UserContext';
import useTranslation from '../../hooks/useTranslation';

// Field interface
interface Field {
  id: string;
  name: string;
  coordinates: [number, number];
}

// Analysis data interface
interface AnalysisData {
  ndvi: number;
  soilMoisture: number;
  lastUpdated: string;
  healthStatus: string;
  healthTrend: {
    date: string;
    ndvi: number;
  }[];
  soilMoistureTrend: {
    date: string;
    moisture: number;
  }[];
  recommendations: string[];
}

const SatelliteAnalysisPage: React.FC = () => {
  const { userProfile } = useUser();
  const { t } = useTranslation();
  
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data fetching for fields
  useEffect(() => {
    const mockFields: Field[] = [
      {
        id: '1',
        name: 'North Field',
        coordinates: [31.1471, 75.3412],
      },
      {
        id: '2',
        name: 'South Field',
        coordinates: [31.1371, 75.3512],
      },
    ];

    // Add user-specific field if authenticated
    if (userProfile.isAuthenticated && userProfile.name) {
      mockFields.push({
        id: '3',
        name: `${userProfile.name}'s Field`,
        coordinates: [31.1271, 75.3612],
      });
    }

    setFields(mockFields);
    // Set the first field as selected by default
    setSelectedField(mockFields[0]);
    setLoading(false);
  }, [userProfile]);

  // Fetch analysis data when a field is selected
  useEffect(() => {
    if (selectedField) {
      setLoading(true);
      
      // Mock API response for satellite data
      setTimeout(() => {
        const mockAnalysisData: AnalysisData = {
          ndvi: 0.72,
          soilMoisture: 65,
          lastUpdated: '2024-03-28',
          healthStatus: 'Good',
          healthTrend: [
            { date: '2024-01-01', ndvi: 0.65 },
            { date: '2024-01-15', ndvi: 0.68 },
            { date: '2024-02-01', ndvi: 0.70 },
            { date: '2024-02-15', ndvi: 0.69 },
            { date: '2024-03-01', ndvi: 0.71 },
            { date: '2024-03-15', ndvi: 0.72 },
            { date: '2024-03-28', ndvi: 0.72 },
          ],
          soilMoistureTrend: [
            { date: '2024-01-01', moisture: 60 },
            { date: '2024-01-15', moisture: 62 },
            { date: '2024-02-01', moisture: 58 },
            { date: '2024-02-15', moisture: 63 },
            { date: '2024-03-01', moisture: 67 },
            { date: '2024-03-15', moisture: 65 },
            { date: '2024-03-28', moisture: 65 },
          ],
          recommendations: [
            'Crop health is good, continue current irrigation schedule',
            'Monitor the eastern section for potential nitrogen deficiency',
            'Consider reducing water frequency if no rain in next 7 days',
          ],
        };
        
        setAnalysisData(mockAnalysisData);
        setLoading(false);
      }, 1000);
    }
  }, [selectedField]);

  // Convert health status to color
  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'bg-green-500';
      case 'Good':
        return 'bg-green-400';
      case 'Fair':
        return 'bg-yellow-500';
      case 'Poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  // Convert fields to markers
  const fieldMarkers = fields.map(field => ({
    position: field.coordinates,
    title: field.name,
    popup: `${field.name}`
  }));

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            {t('nav.satelliteAnalysis')}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor your fields with satellite data for improved crop management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <h3 className="text-lg font-medium p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">Your Fields</h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {fields.length === 0 ? (
                <li className="p-4 text-gray-500 dark:text-gray-400">No fields available</li>
              ) : (
                fields.map((field) => (
                  <li 
                    key={field.id} 
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedField?.id === field.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                    }`}
                    onClick={() => setSelectedField(field)}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{field.name}</div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          {selectedField ? (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{selectedField.name} - {t('map.satellite')}</h3>
                </div>
                <EnhancedMapComponent
                  markers={[{
                    position: selectedField.coordinates,
                    title: selectedField.name,
                    popup: selectedField.name
                  }]}
                  showSatellite={true}
                  height="400px"
                  showCurrentLocationButton={false}
                />
              </div>

              {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ) : analysisData ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DataCard
                      title="Vegetation Index (NDVI)"
                      value={analysisData.ndvi.toFixed(2)}
                    >
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${analysisData.ndvi * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          0 = No vegetation, 1 = Dense vegetation
                        </p>
                      </div>
                    </DataCard>

                    <DataCard
                      title="Soil Moisture"
                      value={`${analysisData.soilMoisture}%`}
                    >
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${analysisData.soilMoisture}%` }}
                          ></div>
                        </div>
                      </div>
                    </DataCard>

                    <DataCard
                      title="Crop Health Status"
                      value={analysisData.healthStatus}
                    >
                      <div className="mt-2 flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getHealthStatusColor(analysisData.healthStatus)}`}></span>
                        <span className="text-sm">{analysisData.healthStatus}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Last updated: {new Date(analysisData.lastUpdated).toLocaleDateString()}
                      </p>
                    </DataCard>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Vegetation Health Trend</h3>
                      <LineChart
                        title=""
                        labels={analysisData.healthTrend.map(item => new Date(item.date).toLocaleDateString())}
                        datasets={[
                          {
                            label: 'NDVI',
                            data: analysisData.healthTrend.map(item => item.ndvi),
                            borderColor: 'rgb(34, 197, 94)',
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                          },
                        ]}
                      />
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Soil Moisture Trend</h3>
                      <LineChart
                        title=""
                        labels={analysisData.soilMoistureTrend.map(item => new Date(item.date).toLocaleDateString())}
                        datasets={[
                          {
                            label: 'Moisture %',
                            data: analysisData.soilMoistureTrend.map(item => item.moisture),
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                          },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Recommendations</h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      {analysisData.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mr-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          </span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <p className="text-gray-500 dark:text-gray-400">No analysis data available</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-gray-500 dark:text-gray-400">Please select a field to view satellite analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SatelliteAnalysisPage; 