import React from 'react';
import useTranslation from '../../hooks/useTranslation';

const HelpPage: React.FC = () => {
  const { t } = useTranslation();
  
  // FAQ data structure with translation keys
  const faqs = [
    {
      questionKey: 'help.faq1.question',
      answerKey: 'help.faq1.answer'
    },
    {
      questionKey: 'help.faq2.question',
      answerKey: 'help.faq2.answer'
    },
    {
      questionKey: 'help.faq3.question',
      answerKey: 'help.faq3.answer'
    },
    {
      questionKey: 'help.faq4.question',
      answerKey: 'help.faq4.answer'
    }
  ];

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            {t('help.title')}
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
                    {t(faq.questionKey)}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {t(faq.answerKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 