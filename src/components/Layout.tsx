import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import useTranslation from '../hooks/useTranslation';
import NotificationCenter from './NotificationCenter';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, logout } = useUser();
  const { t } = useTranslation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300';
  };

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(prev => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="bg-white shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600 dark:text-blue-400">
                Farming Advisor
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/dashboard" className={`${isActive('/dashboard')} hover:text-primary-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium`}>
                  {t('nav.dashboard')}
                </Link>
                <Link to="/field-mapping" className={`${isActive('/field-mapping')} hover:text-primary-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium`}>
                  {t('nav.fieldMapping')}
                </Link>
                <Link to="/satellite-analysis" className={`${isActive('/satellite-analysis')} hover:text-primary-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium`}>
                  {t('nav.satelliteAnalysis')}
                </Link>
                <Link to="/settings" className={`${isActive('/settings')} hover:text-primary-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium`}>
                  {t('nav.settings')}
                </Link>
                <Link to="/help" className={`${isActive('/help')} hover:text-primary-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium`}>
                  {t('nav.help')}
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification Center */}
              <NotificationCenter />
              
              {/* User Profile Menu */}
              <div className="relative">
                <button
                  type="button"
                  className="flex text-sm bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={toggleProfileMenu}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary-600 text-white dark:bg-blue-500">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>
                
                {/* User Dropdown */}
                {isProfileMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      {t('nav.profile')}
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-1"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      {t('nav.settings')}
                    </Link>
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-2"
                      onClick={handleLogout}
                    >
                      {t('action.logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>

      <footer className="bg-white shadow mt-auto dark:bg-gray-800 dark:border-t dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © 2024 Farming Advisor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 