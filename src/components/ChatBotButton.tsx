import React, { useState, useEffect } from 'react';
import ChatBot from './ChatBot';

const ChatBotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  const toggleChatBot = () => {
    setIsOpen(!isOpen);
    if (hasNewMessage) {
      setHasNewMessage(false);
    }
  };

  // Simulate a new message after 30 seconds if the chat is not open
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setHasNewMessage(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Control the pulsing animation
  useEffect(() => {
    // Start pulsing when component mounts
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <button
        onClick={toggleChatBot}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center transition-all duration-200 hover:scale-105 ${hasNewMessage ? 'animate-pulse' : ''}`}
        aria-label="Open SmartKissan Assistant"
      >
        {hasNewMessage && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
            1
          </span>
        )}
        
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Initial welcome message hint */}
      {!isOpen && isPulsing && !hasNewMessage && (
        <div className="fixed bottom-24 right-6 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs animate-fade-in-out">
          <p className="text-sm text-gray-700 dark:text-gray-300">Need help? Chat with SmartKissan Assistant!</p>
        </div>
      )}

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={toggleChatBot}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-gray-800">
              <div className="absolute top-0 right-0 pt-2 pr-2">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white"
                  onClick={toggleChatBot}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ChatBot />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotButton; 