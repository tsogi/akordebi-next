import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';
import DonationModal from './DonationModal';

const DonationButton = ({ className = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { lang } = useLanguage();

  const handleDonateClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleDonateClick}
        className={`flex items-center justify-center px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${className}`}
      >
        <HeartIcon className="w-5 h-5 mr-2" />
        <span className="text-sm">{lang.donation.button}</span>
      </button>
      
      <DonationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default DonationButton; 