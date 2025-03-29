import React from 'react';

const HelpPage: React.FC = () => {
  const faqs = [
    {
      question: 'How are crop recommendations generated?',
      answer: 'Our AI system analyzes various factors including soil conditions, weather patterns, and historical crop data to provide personalized recommendations for your farm.'
    },
    {
      question: 'How accurate are the yield predictions?',
      answer: 'Yield predictions are based on machine learning models trained on extensive agricultural data. The accuracy typically ranges from 80-90% depending on data availability.'
    },
    {
      question: 'How often is the weather data updated?',
      answer: 'Weather forecasts are updated every 3 hours using data from multiple meteorological sources to ensure accuracy.'
    },
    {
      question: 'Can I get notifications for important updates?',
      answer: 'Yes, you can enable notifications in the Settings page to receive alerts about weather changes, optimal planting times, and other important farming updates.'
    }
  ];

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Help & FAQ
          </h2>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Need more help?
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              <p>
                Contact our support team for personalized assistance with your farming needs.
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="btn-primary"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 