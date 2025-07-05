import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';

const DonationModal = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { lang } = useLanguage();

  const predefinedAmounts = [
    { value: 5, label: lang.donation.amount_5 },
    { value: 10, label: lang.donation.amount_10 },
    { value: 20, label: lang.donation.amount_20 },
    { value: 50, label: lang.donation.amount_50 },
  ];

  useEffect(() => {
    if (!isOpen) {
      setSelectedAmount(null);
      setCustomAmount('');
      setError('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
      setError('');
    }
  };

  const validateAmount = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError(lang.donation.error_invalid_amount);
      return false;
    }
    if (numAmount < 1) {
      setError(lang.donation.error_min_amount);
      return false;
    }
    if (numAmount > 500) {
      setError(lang.donation.error_max_amount);
      return false;
    }
    return true;
  };

  const handleDonate = async () => {
    const finalAmount = selectedAmount || parseFloat(customAmount);
    
    if (!validateAmount(finalAmount)) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Store current page URL in localStorage before redirecting
      if (typeof window !== 'undefined') {
        localStorage.setItem('return_page_url', window.location.href);
      }

      // Call the new donation API
      const response = await fetch('/api/payment/initiate-donation-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: finalAmount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      // Redirect to the payment gateway URL
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('No redirect URL received from payment service');
      }

    } catch (error) {
      console.error('Payment initiation error:', error);
      setError(error.message);
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{lang.donation.title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-6 text-center">
            {lang.donation.support_text}
          </p>

          {/* Predefined Amounts */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount.value}
                onClick={() => handleAmountSelect(amount.value)}
                className={`p-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedAmount === amount.value
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                {amount.label}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {lang.donation.custom_amount}
            </label>
            <input
              type="text"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder={lang.donation.custom_amount_placeholder}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Donate Button */}
          <button
            onClick={handleDonate}
            disabled={isProcessing || (!selectedAmount && !customAmount)}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
              isProcessing || (!selectedAmount && !customAmount)
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isProcessing ? lang.donation.processing : lang.donation.donate_button}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal; 