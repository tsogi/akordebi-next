'use client';

import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import { useState } from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';
import SubscriptionPrompt from '@/components/SubscriptionPrompt';

export default function Prices() {
  const { lang } = useLanguage();
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

  const handleSubscribe = () => {
    setShowSubscriptionPrompt(true);
  };

  const customUnauthenticatedText = 'პრემიუმ პაკეტის გასააქტიურებლად გაიარეთ მარტივი Gmail ავტორიზაცია 1 კლიკით და შემდეგ ხელახლა დააჭირეთ გააქტიურებას';
  const customAuthenticatedText = 'დააჭირეთ გადახდას და მიყევით ბანკის ინსტრუქციას';

  return (
    <>
      <Head>
        <title>{lang.price.title}</title>
        <meta name="description" content={lang.price.meta_description} />
      </Head>
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 w-full md:w-1/2 flex flex-col shadow-lg bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-500"></div>
            <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10">
              <div className="absolute inset-0 bg-green-100 dark:bg-green-900 rounded-full opacity-20"></div>
            </div>
            
            <div className="mb-8 relative">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mb-3">
                {lang.price.learning}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{lang.price.free}</h2>
              <p className="text-gray-600 dark:text-gray-300">{lang.price.start_learning}</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {lang.price.free_features && Object.entries(lang.price.free_features).map(([key, feature]) => (
                <li key={key} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button 
              className="mt-auto w-full py-4 px-6 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
              {lang.price.current_package}
            </button>
          </div>
          
          {/* Premium Plan */}
          <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 w-full md:w-1/2 flex flex-col shadow-xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-900/20 dark:via-gray-800 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/50">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10">
              <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 rounded-full opacity-20"></div>
            </div>
            
            {/* Popular badge */}
            <div className="absolute top-6 right-6">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Popular
              </span>
            </div>
            
            <div className="mb-8 relative">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mb-3">
                {lang.price.premium}
              </span>
              <div className="flex items-baseline mb-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{`${process.env.NEXT_PUBLIC_MONTHLY_COST}₾`}</h2>
                <span className="text-gray-500 dark:text-gray-400 ml-2">/{lang.price.month}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{lang.price.full_access}</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {lang.price.premium_features && Object.entries(lang.price.premium_features).map(([key, feature]) => (
                <li key={key} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={handleSubscribe}
              className="mt-auto w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg"
            >
              {lang.price.activate}
            </button>
          </div>
        </div>
      </main>
      
      {showSubscriptionPrompt && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowSubscriptionPrompt(false)}
        >
          <div 
            className="relative w-full max-w-md" 
            onClick={(e) => e.stopPropagation()}
          >
            <SubscriptionPrompt 
              unauthenticatedText={customUnauthenticatedText}
              authenticatedText={customAuthenticatedText}
              source="prices_page"
              inModal={true}
            />
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
} 