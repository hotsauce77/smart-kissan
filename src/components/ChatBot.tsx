import React, { useState, useRef, useEffect } from 'react';
import apiService from '../services/api';
import { useUser } from '../contexts/UserContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  failed?: boolean;
}

// Define the expected response shape from the API
interface ChatResponse {
  data: {
    response: string;
    timestamp: string;
  };
}

const ChatBot: React.FC = () => {
  const { preferences } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'online'|'offline'>('online');
  const [retryingMessageId, setRetryingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set initial welcome message based on language
  useEffect(() => {
    // Reset messages when language changes
    const welcomeMessage = getWelcomeMessage(preferences.language);
    setMessages([{
      id: '1',
      text: welcomeMessage,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    }]);
  }, [preferences.language]);

  // Monitor internet connection
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus('online');
      // Notify user that connection is restored
      if (preferences.language === 'hi') {
        addBotMessage('इंटरनेट कनेक्शन पुनः स्थापित हो गया है। आप अब प्रश्न पूछ सकते हैं।');
      } else if (preferences.language === 'kn') {
        addBotMessage('ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ. ನೀವು ಈಗ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು.');
      } else {
        addBotMessage('Internet connection restored. You can now ask questions.');
      }
    };
    
    const handleOffline = () => {
      setNetworkStatus('offline');
      // Notify user that connection is lost
      if (preferences.language === 'hi') {
        addBotMessage('इंटरनेट कनेक्शन खो गया है। ऑनलाइन होने पर आप फिर से प्रयास कर सकते हैं।');
      } else if (preferences.language === 'kn') {
        addBotMessage('ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಕಡಿದಿದೆ. ನೀವು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದಾಗ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಬಹುದು.');
      } else {
        addBotMessage('Internet connection lost. You can try again when you are online.');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial status
    setNetworkStatus(navigator.onLine ? 'online' : 'offline');

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [preferences.language]);

  // Helper function to add a bot message
  const addBotMessage = (text: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, botMessage]);
  };
  
  // Focus input when chat loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Get welcome message based on language
  const getWelcomeMessage = (language: string): string => {
    switch (language) {
      case 'hi':
        return 'नमस्ते! मैं आपका SmartKissan सहायक हूँ। आज मैं आपकी कृषि आवश्यकताओं में कैसे मदद कर सकता हूँ?';
      case 'kn':
        return 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ SmartKissan ಸಹಾಯಕ. ಇಂದು ನಿಮ್ಮ ಕೃಷಿ ಅಗತ್ಯಗಳಿಗೆ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?';
      default:
        return 'Hello! I am your SmartKissan Assistant. How can I help with your farming needs today?';
    }
  };

  // Common farming questions based on season and language
  const getCommonQuestions = () => {
    if (preferences.language === 'hi') {
      return [
        {
          text: "फसलों के लिए उचित कीटनाशक क्या हैं?",
          handler: () => handleQuickQuestionClick("mere fasal ke liye sabse achhe keetnaashak kya hain?")
        },
        {
          text: "मेरे क्षेत्र में वर्तमान मौसम कैसा है?",
          handler: () => handleQuickQuestionClick("mere kshetra mein aaj ka mausam kaisa hai?")
        },
        {
          text: `${getCurrentSeasonName()} में कौन सी फसल उगानी चाहिए?`,
          handler: () => handleQuickQuestionClick(`${getCurrentSeasonName()} mein kaun si fasal ugaani chaahiye?`)
        },
      ];
    } else if (preferences.language === 'kn') {
      return [
        {
          text: "ನನ್ನ ಬೆಳೆಗಳಿಗೆ ಸೂಕ್ತವಾದ ಕೀಟನಾಶಕಗಳು ಯಾವುವು?",
          handler: () => handleQuickQuestionClick("nanna belegalige sukthavada keetanashakagalu yavuvu?")
        },
        {
          text: "ನನ್ನ ಪ್ರದೇಶದಲ್ಲಿ ಪ್ರಸ್ತುತ ಹವಾಮಾನ ಹೇಗಿದೆ?",
          handler: () => handleQuickQuestionClick("nanna pradeshaddalli prasthuta havamaana hegide?")
        },
        {
          text: `${getCurrentSeasonName()} ದಲ್ಲಿ ಯಾವ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಯಬೇಕು?`,
          handler: () => handleQuickQuestionClick(`${getCurrentSeasonName()} dalli yaava belegalannu beleyabeku?`)
        },
      ];
    } else {
      return [
        {
          text: "What are appropriate pesticides for my crops?",
          handler: () => handleQuickQuestionClick("What are the best organic pesticides for my crops?")
        },
        {
          text: "What's the current weather in my region?",
          handler: () => handleQuickQuestionClick("What's the weather forecast for farming this week?")
        },
        {
          text: `What crops should I plant in ${getCurrentSeasonName()}?`,
          handler: () => handleQuickQuestionClick(`What are the best crops to plant in ${getCurrentSeasonName()}?`)
        },
      ];
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get localized season name based on current date
  function getCurrentSeasonName(): string {
    const month = new Date().getMonth() + 1; // 1-12
    
    if (preferences.language === 'hi') {
      if (month >= 3 && month <= 5) return "गर्मी";
      if (month >= 6 && month <= 9) return "मानसून";
      if (month >= 10 && month <= 11) return "पोस्ट-मानसून";
      return "सर्दी";
    } else if (preferences.language === 'kn') {
      if (month >= 3 && month <= 5) return "ಬೇಸಿಗೆ";
      if (month >= 6 && month <= 9) return "ಮುಂಗಾರು";
      if (month >= 10 && month <= 11) return "ಹಿಂಗಾರು";
      return "ಚಳಿಗಾಲ";
    } else {
      if (month >= 3 && month <= 5) return "Summer";
      if (month >= 6 && month <= 9) return "Monsoon";
      if (month >= 10 && month <= 11) return "Post-Monsoon";
      return "Winter";
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handle retrying a failed message
  const handleRetry = async (messageId: string) => {
    // Find the failed message
    const failedMessage = messages.find(msg => msg.id === messageId);
    if (!failedMessage || failedMessage.sender !== 'user') return;
    
    setRetryingMessageId(messageId);
    
    try {
      if (networkStatus === 'offline') {
        throw new Error('No internet connection');
      }
      
      // Call API with type assertion
      const response = await apiService.sendChatMessage(failedMessage.text, preferences.language) as ChatResponse;
      
      // Add bot response
      const botMessage: Message = {
        id: Date.now().toString(),
        text: response.data.response,
        sender: 'bot',
        timestamp: response.data.timestamp || new Date().toISOString(),
      };
      
      // Remove the "failed" flag from the user message
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, failed: false } : msg
      ));
      
      // Add the new bot response
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error retrying message:', error);
    } finally {
      setRetryingMessageId(null);
    }
  };

  const handleQuickQuestionClick = async (questionText: string) => {
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      text: questionText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    // Small delay to show the user's selected question
    setTimeout(async () => {
      try {
        if (networkStatus === 'offline') {
          throw new Error('No internet connection');
        }
        
        // Call API with type assertion
        const response = await apiService.sendChatMessage(questionText, preferences.language) as ChatResponse;
        
        // Add bot response
        const botMessage: Message = {
          id: Date.now().toString(),
          text: response.data.response,
          sender: 'bot',
          timestamp: response.data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error('Error sending quick question:', error);
        // Mark the user message as failed
        setMessages(prev => prev.map(msg => 
          msg.id === userMessageId ? { ...msg, failed: true } : msg
        ));
        // Add error message
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: getErrorMessage(),
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const getErrorMessage = (): string => {
    if (networkStatus === 'offline') {
      switch (preferences.language) {
        case 'hi':
          return 'इंटरनेट कनेक्शन नहीं है। कृपया अपने कनेक्शन की जांच करें और पुनः प्रयास करें।';
        case 'kn':
          return 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.';
        default:
          return 'No internet connection. Please check your connection and try again.';
      }
    } else {
      switch (preferences.language) {
        case 'hi':
          return 'क्षमा करें, मुझे एक त्रुटि मिली। कृपया बाद में पुन: प्रयास करें।';
        case 'kn':
          return 'ಕ್ಷಮಿಸಿ, ನಾನು ದೋಷವನ್ನು ಎದುರಿಸಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.';
        default:
          return 'Sorry, I encountered an error. Please try again later.';
      }
    }
  };

  const getInputPlaceholder = (): string => {
    switch (preferences.language) {
      case 'hi':
        return "हिंदी में प्रश्न पूछें (देवनागरी या रोमन लिपि में)...";
      case 'kn':
        return "ಕನ್ನಡದಲ್ಲಿ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ (ಕನ್ನಡ ಅಥವಾ ರೋಮನ್ ಲಿಪಿಯಲ್ಲಿ)...";
      default:
        return "Type your question...";
    }
  };

  const getSendButtonText = (): string => {
    switch (preferences.language) {
      case 'hi':
        return "भेजें";
      case 'kn':
        return "ಕಳುಹಿಸಿ";
      default:
        return "Send";
    }
  };

  const getRetryText = (): string => {
    switch (preferences.language) {
      case 'hi':
        return "पुनः प्रयास करें";
      case 'kn':
        return "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ";
      default:
        return "Retry";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (networkStatus === 'offline') {
        throw new Error('No internet connection');
      }
      
      // Call API with type assertion
      const response = await apiService.sendChatMessage(userMessage.text, preferences.language) as ChatResponse;

      // Add bot response
      const botMessage: Message = {
        id: Date.now().toString(),
        text: response.data.response,
        sender: 'bot',
        timestamp: response.data.timestamp || new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Mark the user message as failed
      setMessages(prev => prev.map(msg => 
        msg.id === userMessageId ? { ...msg, failed: true } : msg
      ));
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: getErrorMessage(),
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Focus input again
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow h-[500px]">
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {preferences.language === 'hi' ? 'SmartKissan सहायक' : 
             preferences.language === 'kn' ? 'SmartKissan ಸಹಾಯಕ' : 
             'SmartKissan Assistant'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {preferences.language === 'hi' ? 
              'कृषि पद्धतियों, फसल अनुशंसाओं, या मौसम जानकारी के बारे में प्रश्न पूछें।' : 
             preferences.language === 'kn' ?
              'ಕೃಷಿ ಪದ್ಧತಿಗಳು, ಬೆಳೆ ಶಿಫಾರಸುಗಳು ಅಥವಾ ಹವಾಮಾನ ಮಾಹಿತಿಯ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.' :
              'Ask questions about farming practices, crop recommendations, or weather insights.'}
          </p>
        </div>
        {networkStatus === 'offline' && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 px-2 py-1 text-xs rounded-md">
            {preferences.language === 'hi' ? 'ऑफ़लाइन' : 
             preferences.language === 'kn' ? 'ಆಫ್‌ಲೈನ್' : 
             'Offline'}
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-sm p-3 rounded-lg ${
                message.sender === 'user'
                  ? message.failed 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' 
                    : 'bg-green-600 text-white dark:bg-green-700'
                  : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {message.failed && (
                  <button
                    onClick={() => handleRetry(message.id)}
                    disabled={retryingMessageId === message.id || networkStatus === 'offline'}
                    className="text-xs ml-2 px-2 py-0.5 bg-white text-red-600 rounded hover:bg-red-50 dark:bg-gray-700 dark:text-red-300 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    {retryingMessageId === message.id ? '...' : getRetryText()}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick question chips */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex space-x-2">
          {getCommonQuestions().map((q, index) => (
            <button
              key={index}
              onClick={q.handler}
              disabled={isLoading || networkStatus === 'offline'}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {q.text}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={getInputPlaceholder()}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-full disabled:opacity-50 hover:bg-green-700 transition-colors"
            disabled={isLoading || !input.trim() || networkStatus === 'offline'}
          >
            {getSendButtonText()}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot; 