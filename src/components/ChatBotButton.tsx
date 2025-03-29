import React, { useState, useEffect } from 'react';
import ChatBot from './ChatBot';
import { useUser } from '../contexts/UserContext';

const ChatBotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'online'|'offline'>('online');
  const { preferences } = useUser();

  // Monitor internet connection
  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial status
    setNetworkStatus(navigator.onLine ? 'online' : 'offline');

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  // Handle new message (would be called by the chat system)
  const handleNewMessage = () => {
    if (!isOpen) {
      setHasNewMessage(true);
    }
  };

  // Get button text based on language
  const getButtonText = () => {
    switch(preferences.language) {
      case 'hi':
        return 'कृषि सहायक';
      case 'kn':
        return 'ಕೃಷಿ ಸಹಾಯಕ';
      default:
        return 'Farm Assistant';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80 md:w-96 animate-fade-in">
          <ChatBot />
          <button
            onClick={toggleChat}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center relative transition-all duration-300 transform hover:scale-105"
          aria-label="Open chat"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="ml-2 hidden md:inline">{getButtonText()}</span>
          </div>
          {hasNewMessage && (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full"></span>
          )}
          {networkStatus === 'offline' && (
            <span className="absolute bottom-0 right-0 transform translate-x-1/3 translate-y-1/3 w-3 h-3 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
          )}
        </button>
      )}
    </div>
  );
};

export default ChatBotButton; 