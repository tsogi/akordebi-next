'use client';

import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import { useState } from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';

export default function Prices() {
  const { lang } = useLanguage();
  const [isAnnual, setIsAnnual] = useState(false);

  const handleSubscribe = () => {
    alert("გადახდები დროებით გათიშულია, გთხოვთ სცადოთ მოგვიანებით");
  };

  return (
    <>
      <Head>
        <title>ფასები - Akordebi.ge</title>
        <meta name="description" content="Akordebi.ge პაკეტები და ფასები" />
      </Head>
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">ჩვენი პაკეტები</h1>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {/* Free Plan */}
          <div className="relative rounded-xl overflow-hidden p-6 md:p-8 w-full md:w-1/2 max-w-md flex flex-col transition-all duration-300 hover:translate-y-[-4px] shadow-lg bg-gradient-to-br from-[#f7f7f7] via-white to-[#f0f0f0] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
            {/* Background music-themed pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="music-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M10 1 A9 9 0 1 0 10 19 A9 9 0 1 0 10 1" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#music-pattern)" />
              </svg>
            </div>
            
            {/* Green accent element */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
            
            <div className="mb-6 relative text-center">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mb-3">
                სასწავლო
              </span>
              {/* <h2 className="text-2xl font-bold mb-2">სასწავლო</h2> */}
              <p className="text-xl font-bold text-green-600">უფასო</p>
              <p className="text-gray-500 mt-2">დაიწყე სწავლა დღესვე</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow text-[#16a34a] mxedruli">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>ყველა სიმღერა ნახევრად</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>ყველა ტაბი ნახევრად</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>ფავორიტებში შენახვა</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>გიტარის მასწავლებლები</span>
              </li>
            </ul>
            
            <button 
              className="mt-auto w-full py-3 px-4 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm"
            >
              მიმდინარე პაკეტი
            </button>
          </div>
          
          {/* Premium Plan */}
          <div className="relative rounded-xl overflow-hidden p-6 md:p-8 w-full md:w-1/2 max-w-md flex flex-col transition-all duration-300 hover:translate-y-[-4px] shadow-xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200">
            {/* Premium badge */}
            {/* <div className="absolute -right-12 top-5 rotate-45 bg-blue-600 text-white py-1.5 w-44 text-center font-medium text-sm shadow-md z-10">
              რეკომენდებული
            </div> */}
            
            {/* Background music-themed pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="guitar-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 5 L25 15 L20 25 L15 15 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M5 20 L15 25 L25 20 L15 15 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#guitar-pattern)" />
              </svg>
            </div>
            
            {/* Blue accent element */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
            
            <div className="mb-6 relative text-center">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mb-3">
                პრემიუმი
              </span>
              {/* <h2 className="text-2xl font-bold mb-2">პრემიუმი</h2> */}
              <p className="text-xl font-bold text-blue-600">5 ლარი / თვეში</p>
              <p className="text-gray-500 mt-2">სრული წვდომა ყველა ფუნქციაზე</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow text-[#2563eb] mxedruli">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>ყველაფერი უფასოში</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>სიმღერები სრულად</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>ტაბები სრულად</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>გიტარის შემრჩევი AI</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>არანაირი რეკლამა</span>
              </li>
            </ul>
            
            <button 
              onClick={handleSubscribe}
              className="mt-auto w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
            >
              გააქტიურება
            </button>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-600">
          <p>კითხვები? <a href="mailto:tsogiaidze1@gmail.com" className="text-blue-600 hover:underline">დაგვიკავშირდით</a></p>
        </div>
      </main>
      <Footer />
    </>
  );
} 