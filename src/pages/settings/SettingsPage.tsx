import React, { useState } from 'react';
import { useUser, UserPreferences } from '../../contexts/UserContext';
import useTranslation from '../../hooks/useTranslation';

const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences } = useUser();
  const { t } = useTranslation();
  const [customLocation, setCustomLocation] = useState<string>(
    preferences.defaultLocation.join(',')
  );

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const language = e.target.value as 'en' | 'hi' | 'kn';
    updatePreferences({ language });
  };

  // Handle toggle settings
  const handleToggle = (setting: keyof UserPreferences) => {
    if (setting === 'useCurrentLocation') {
      // If enabling current location, ask for permission
      if (!preferences.useCurrentLocation) {
        requestLocationPermission();
      } else {
        updatePreferences({ useCurrentLocation: false });
      }
    } else if (typeof preferences[setting] === 'boolean') {
      updatePreferences({ [setting]: !preferences[setting] } as any);
    }
  };

  // Request location permission and update map center
  const requestLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          updatePreferences({
            useCurrentLocation: true,
            defaultLocation: newLocation,
          });
          setCustomLocation(newLocation.join(','));
        },
        (error) => {
          // Permission denied or error
          console.error('Error getting location:', error);
          alert('Could not get your location. Please enable location services or enter your coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Handle manual location change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomLocation(e.target.value);
  };

  // Save custom location
  const saveCustomLocation = () => {
    try {
      const [lat, lng] = customLocation.split(',').map(coord => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid coordinates');
      }
      
      // Check if coordinates are within valid range
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error('Coordinates out of range');
      }
      
      updatePreferences({
        defaultLocation: [lat, lng],
        useCurrentLocation: false,
      });
      
      alert('Location updated successfully!');
    } catch (error) {
      alert('Invalid coordinates. Please enter valid latitude and longitude separated by a comma (e.g., 31.1471, 75.3412).');
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t('nav.settings')}</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Language Settings */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-4">{t('settings.language')}</h2>
          <div className="mb-4">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.language')}
            </label>
            <select
              id="language"
              className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={preferences.language}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Change the language of the application interface.
            </p>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-4">{t('settings.notifications')}</h2>
          <div className="flex items-center mb-4">
            <button
              type="button"
              className={`${
                preferences.notificationsEnabled 
                  ? 'bg-blue-600' 
                  : 'bg-gray-200 dark:bg-gray-700'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              role="switch"
              aria-checked={preferences.notificationsEnabled}
              onClick={() => handleToggle('notificationsEnabled')}
            >
              <span
                aria-hidden="true"
                className={`${
                  preferences.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              ></span>
            </button>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('settings.notifications')}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Receive notifications about weather, crop prices, and agricultural alerts.
          </p>
        </div>
        
        {/* Location Settings */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-4">{t('settings.locationServices')}</h2>
          
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Privacy Policy</h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                  <p>We value your privacy. Your location is <strong>never tracked automatically</strong> without your explicit permission. You can:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Enable the "Use Current Location" setting below to allow us to detect your location when maps load</li>
                    <li>Click the location button on any map to share your location just for that session</li>
                    <li>Enter a default location manually instead of sharing your actual location</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Use Current Location Toggle */}
          <div className="flex items-center mb-4">
            <button
              type="button"
              className={`${
                preferences.useCurrentLocation 
                  ? 'bg-blue-600' 
                  : 'bg-gray-200 dark:bg-gray-700'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              role="switch"
              aria-checked={preferences.useCurrentLocation}
              onClick={() => handleToggle('useCurrentLocation')}
            >
              <span
                aria-hidden="true"
                className={`${
                  preferences.useCurrentLocation ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              ></span>
            </button>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('settings.useCurrentLocation')}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            When enabled, maps will automatically center on your current location. This requires your permission to access your device's location.
          </p>
          
          {/* Manual Location Setting */}
          <div className="mt-4">
            <label htmlFor="custom-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.defaultLocation')} (Latitude, Longitude)
            </label>
            <div className="flex max-w-md">
              <input
                type="text"
                id="custom-location"
                className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., 31.1471, 75.3412"
                value={customLocation}
                onChange={handleLocationChange}
                disabled={preferences.useCurrentLocation}
              />
              <button
                type="button"
                onClick={saveCustomLocation}
                disabled={preferences.useCurrentLocation}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('action.save')}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Set a default location for maps when current location is not used.
            </p>
          </div>
        </div>
        
        {/* Dark Mode Settings */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">{t('settings.darkMode')}</h2>
          <div className="flex items-center">
            <button
              type="button"
              className={`${
                preferences.darkMode 
                  ? 'bg-blue-600' 
                  : 'bg-gray-200 dark:bg-gray-700'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              role="switch"
              aria-checked={preferences.darkMode}
              onClick={() => handleToggle('darkMode')}
            >
              <span
                aria-hidden="true"
                className={`${
                  preferences.darkMode ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              ></span>
            </button>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('settings.darkMode')}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Switch between light and dark mode for better readability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 