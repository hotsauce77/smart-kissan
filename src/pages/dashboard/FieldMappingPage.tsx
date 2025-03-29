import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EnhancedMapComponent from '../../components/maps/EnhancedMapComponent';
import DataCard from '../../components/ui/DataCard';
import LineChart from '../../components/charts/LineChart';
import { useUser } from '../../contexts/UserContext';
import useTranslation from '../../hooks/useTranslation';

// Field interface
interface Field {
  id: string;
  name: string;
  area: number; // in hectares
  coordinates: [number, number];
  crop?: string;
  soilType?: string;
  lastPlanted?: string;
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

const FieldMappingPage: React.FC = () => {
  const { userProfile } = useUser();
  const { t } = useTranslation();
  const location = useLocation();
  
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldCoordinates, setNewFieldCoordinates] = useState<[number, number] | null>(null);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldArea, setNewFieldArea] = useState('');
  const [viewSatellite, setViewSatellite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analysisMode, setAnalysisMode] = useState(false);

  // Check URL for mode parameter to set initial mode
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'satellite') {
      setAnalysisMode(true);
      setViewSatellite(true);
    }
  }, [location]);

  // Mock data fetching for fields
  useEffect(() => {
    const mockFields: Field[] = [
      {
        id: '1',
        name: 'North Field',
        area: 2.5,
        coordinates: [31.1471, 75.3412],
        crop: 'Rice',
        soilType: 'Clay Loam',
        lastPlanted: '2024-03-01',
      },
      {
        id: '2',
        name: 'South Field',
        area: 1.8,
        coordinates: [31.1371, 75.3512],
        crop: 'Wheat',
        soilType: 'Silt Loam',
        lastPlanted: '2024-02-15',
      },
    ];

    // Get user-specific fields if authenticated
    if (userProfile.isAuthenticated) {
      // In a real app, you would fetch fields specific to this user
      // For demo, we'll add a field with the user's name
      if (userProfile.name) {
        mockFields.push({
          id: '3',
          name: `${userProfile.name}'s Field`,
          area: 3.2,
          coordinates: [31.1271, 75.3612],
          crop: 'Cotton',
          soilType: 'Sandy Loam',
          lastPlanted: '2024-04-01',
        });
      }
    }

    setFields(mockFields);
    setLoading(false);
  }, [userProfile]);

  // Fetch analysis data when a field is selected
  useEffect(() => {
    if (selectedField && analysisMode) {
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
  }, [selectedField, analysisMode]);

  // Convert fields to markers for the map
  const fieldMarkers = fields.map(field => ({
    position: field.coordinates,
    title: field.name,
    popup: `${field.area} hectares | ${field.crop || 'No crop'}`
  }));

  // Handle map click for adding a new field
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (isAddingField) {
      const { lat, lng } = e.latlng;
      setNewFieldCoordinates([lat, lng]);
    }
  };

  // Add a new field
  const handleAddField = () => {
    if (newFieldCoordinates && newFieldName && newFieldArea) {
      const area = parseFloat(newFieldArea);
      if (isNaN(area)) {
        alert('Please enter a valid area');
        return;
      }

      const newField: Field = {
        id: Date.now().toString(),
        name: newFieldName,
        area,
        coordinates: newFieldCoordinates,
      };

      setFields([...fields, newField]);
      
      // Reset form
      setNewFieldCoordinates(null);
      setNewFieldName('');
      setNewFieldArea('');
      setIsAddingField(false);
    }
  };

  // Delete a field
  const handleDeleteField = (id: string) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      setFields(fields.filter(field => field.id !== id));
      if (selectedField?.id === id) {
        setSelectedField(null);
        setAnalysisData(null);
      }
    }
  };

  // View satellite analysis for a field
  const handleViewAnalysis = (field: Field) => {
    setSelectedField(field);
    setAnalysisMode(true);
    setViewSatellite(true);
  };

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

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            {analysisMode ? t('nav.satelliteAnalysis') : t('nav.fieldMapping')}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {analysisMode 
              ? 'Monitor your fields with satellite data for improved crop management'
              : 'Map and manage your farm fields to get location-specific recommendations'
            }
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => {
              setAnalysisMode(!analysisMode);
              if (!analysisMode) {
                setViewSatellite(true);
              } else {
                setAnalysisData(null);
              }
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            {analysisMode ? 'Field Mapping Mode' : 'Satellite Analysis Mode'}
          </button>
        </div>
      </div>

      {!analysisMode && (
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setViewSatellite(!viewSatellite)}
            className={`px-3 py-1 rounded-md text-sm ${
              viewSatellite 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'
            }`}
          >
            {viewSatellite ? t('map.satellite') : t('map.standard')}
          </button>
          <button
            onClick={() => setIsAddingField(!isAddingField)}
            className={`px-3 py-1 rounded-md text-sm ${
              isAddingField 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'
            }`}
          >
            {isAddingField ? t('action.cancel') : t('action.addField')}
          </button>
        </div>
      )}

      {isAddingField && !analysisMode && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-4">
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Add New Field</h3>
          {newFieldCoordinates ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Field Name</label>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="North Field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Area (hectares)</label>
                <input
                  type="text"
                  value={newFieldArea}
                  onChange={(e) => setNewFieldArea(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Coordinates</label>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Lat: {newFieldCoordinates[0].toFixed(6)}, Lng: {newFieldCoordinates[1].toFixed(6)}
                </p>
              </div>
              <button
                onClick={handleAddField}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                {t('action.save')}
              </button>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-sm">Click on the map to set field location</p>
          )}
        </div>
      )}

      {analysisMode ? (
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
                      onClick={() => {
                        setSelectedField(field);
                        setAnalysisData(null);
                        setLoading(true);
                      }}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{field.name}</div>
                      {field.area && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">{field.area} hectares</div>
                      )}
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
                        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Health Trend</h3>
                        <LineChart
                          title=""
                          labels={analysisData.healthTrend.map(item => new Date(item.date).toLocaleDateString())}
                          datasets={[
                            {
                              label: 'NDVI',
                              data: analysisData.healthTrend.map(item => item.ndvi),
                            },
                          ]}
                          yAxisLabel="NDVI"
                          xAxisLabel="Date"
                        />
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Moisture Trend</h3>
                        <LineChart
                          title=""
                          labels={analysisData.soilMoistureTrend.map(item => new Date(item.date).toLocaleDateString())}
                          datasets={[
                            {
                              label: 'Soil Moisture %',
                              data: analysisData.soilMoistureTrend.map(item => item.moisture),
                            },
                          ]}
                          yAxisLabel="%"
                          xAxisLabel="Date"
                        />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Recommendations</h3>
                      <ul className="space-y-2">
                        {analysisData.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400">Click 'Analyze Field' to get satellite data</p>
                    <button
                      onClick={() => {
                        setAnalysisData(null);
                        setLoading(true);
                      }}
                      className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Analyze Field
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                <p className="text-gray-500 dark:text-gray-400">Select a field to view satellite analysis</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="h-[600px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <EnhancedMapComponent
                markers={fieldMarkers}
                onMapClick={handleMapClick}
                showSatellite={viewSatellite}
                height="600px"
                showCurrentLocationButton={true}
              />
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <h3 className="text-lg font-medium p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">Your Fields</h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {fields.length === 0 ? (
                <li className="p-4 text-gray-500 dark:text-gray-400">No fields added yet</li>
              ) : (
                fields.map((field) => (
                  <li key={field.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{field.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {field.area} hectares | {field.crop || 'No crop planted'}
                        </p>
                        {field.soilType && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">Soil Type: {field.soilType}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="text-primary-600 hover:text-primary-900 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => handleViewAnalysis(field)}
                        >
                          Analyze
                        </button>
                        <button 
                          className="text-primary-600 hover:text-primary-900 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => setSelectedField(field)}
                        >
                          {t('action.edit')}
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDeleteField(field.id)}
                        >
                          {t('action.delete')}
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default FieldMappingPage; 