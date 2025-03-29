import React, { useState, useEffect } from 'react';
import EnhancedMapComponent from '../../components/maps/EnhancedMapComponent';
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

const FieldMappingPage: React.FC = () => {
  const { userProfile } = useUser();
  const { t } = useTranslation();
  
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldCoordinates, setNewFieldCoordinates] = useState<[number, number] | null>(null);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldArea, setNewFieldArea] = useState('');
  const [viewSatellite, setViewSatellite] = useState(false);
  const [loading, setLoading] = useState(true);

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
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            {t('nav.fieldMapping')}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Map and manage your farm fields to get location-specific recommendations
          </p>
        </div>
      </div>

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

      {isAddingField && (
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
    </div>
  );
};

export default FieldMappingPage; 