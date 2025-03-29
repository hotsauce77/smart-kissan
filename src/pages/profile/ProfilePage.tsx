import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import useTranslation from '../../hooks/useTranslation';

const ProfilePage: React.FC = () => {
  const { userProfile, saveUserData, logout } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    region: userProfile.region,
    farmSize: userProfile.farmSize.toString(),
    primaryCrops: userProfile.primaryCrops.join(', '),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!userProfile.isAuthenticated) {
      navigate('/login');
    }
  }, [userProfile.isAuthenticated, navigate]);

  // Update form data when user profile changes
  useEffect(() => {
    setFormData({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      region: userProfile.region,
      farmSize: userProfile.farmSize.toString(),
      primaryCrops: userProfile.primaryCrops.join(', '),
    });
  }, [userProfile]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(prev => !prev);
    setError('');
    setSuccessMessage('');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    
    try {
      // Process crops as an array
      const processedCrops = formData.primaryCrops
        .split(',')
        .map(crop => crop.trim())
        .filter(crop => crop);
      
      // Update user profile in context
      const updatedProfile = {
        ...userProfile,
        name: formData.name,
        phone: formData.phone,
        region: formData.region,
        farmSize: parseFloat(formData.farmSize) || 0,
        primaryCrops: processedCrops,
      };
      
      // Save to "backend"
      await saveUserData();
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!userProfile.isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {t('nav.profile')}
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {isEditing ? (
            <button
              type="button"
              onClick={toggleEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              {t('action.cancel')}
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              {t('action.edit')}
            </button>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {t('action.logout')}
          </button>
        </div>
      </div>
      
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.name')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.name}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                    {userProfile.name}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.email')}
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                  {userProfile.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email cannot be changed
                </p>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.phone')}
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                    {userProfile.phone || "-"}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Farm Information
            </h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.region')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="region"
                    id="region"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.region}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                    {userProfile.region || "-"}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.farmSize')}
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="farmSize"
                    id="farmSize"
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.farmSize}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                    {userProfile.farmSize} hectares
                  </p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="primaryCrops" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.primaryCrops')}
                </label>
                {isEditing ? (
                  <>
                    <textarea
                      id="primaryCrops"
                      name="primaryCrops"
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.primaryCrops}
                      onChange={handleChange}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Separate crops by commas
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                    {userProfile.primaryCrops.length > 0 
                      ? userProfile.primaryCrops.join(', ') 
                      : "-"}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {isEditing && (
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-right">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  t('action.save')
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 