import React, { useState, useEffect } from 'react';

const BankTransferModal = ({ isOpen, onClose, userEmail }) => {
  const [copiedItems, setCopiedItems] = useState(new Set());
  const [isNotifying, setIsNotifying] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [notificationError, setNotificationError] = useState(false);

  const copyToClipboard = (text, itemId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItems(prev => new Set(prev).add(itemId));
      // Reset the color after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    });
  };

  const handleTransferCompleted = async () => {
    setIsNotifying(true);
    setNotificationError(false);
    
    try {
      const response = await fetch('/api/bank-transfer-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotificationSent(true);
      } else {
        setNotificationError(true);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setNotificationError(true);
    } finally {
      setIsNotifying(false);
    }
  };

  // Reset notification state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNotificationSent(false);
      setNotificationError(false);
      setIsNotifying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">გადმორიცხვით გადახდა</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Amount */}
          {/* <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-600">{process.env.NEXT_PUBLIC_MONTHLY_COST} ლარი</div>
            <div className="text-blue-500/80 text-sm mt-1">თვიური გამოწერის ღირებულება</div>
          </div> */}
          
          {/* Process */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">რა უნდა გააკეთოთ:</h4>
            <div className="space-y-3 mxedruli">
              <div className="flex items-start text-sm text-gray-600">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">1</div>
                <div className="flex-1">
                  <div className="mb-2">გადმორიცხეთ <span className="font-semibold">{process.env.NEXT_PUBLIC_MONTHLY_COST} ლარი</span> ამ ანგარიშზე:</div>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded border font-mono text-sm text-blue-600 font-semibold flex items-center justify-between">
                      <span>GE16BG0000000366014987</span>
                      <button
                        onClick={() => copyToClipboard('GE16BG0000000366014987', 'account-number')}
                        className={`p-1 hover:bg-blue-100 rounded transition-colors duration-200 ${
                          copiedItems.has('account-number') ? 'text-green-500' : 'text-blue-500'
                        }`}
                        title="ანგარიშის კოპირება"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      ანგარიშის მფლობელი: <span className="font-medium">ნიკა ცოგიაიძე</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-start text-sm text-gray-600">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">2</div>
                <div className="flex-1">
                  <div className="mb-2">დანიშნულების ველში მიუთითეთ თქვენი ელ-ფოსტა:</div>
                  {userEmail && (
                    <div className="p-2 bg-blue-50 rounded border font-mono text-sm text-blue-600 font-semibold flex items-center justify-between">
                      <span>{userEmail}</span>
                      <button
                        onClick={() => copyToClipboard(userEmail, 'email')}
                        className={`p-1 hover:bg-blue-100 rounded transition-colors duration-200 ${
                          copiedItems.has('email') ? 'text-green-500' : 'text-blue-500'
                        }`}
                        title="ელ-ფოსტის კოპირება"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">3</div>
                <span>გადახდის შემდეგ დააჭირეთ ქვემოთ ღილაკს</span>
              </div>
            </div>
          </div>

          {/* Transfer Completed Button */}
          {!notificationSent ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="text-center">
                <div className="mb-3">
                  <svg className="w-8 h-8 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                {/* <h4 className="font-semibold text-green-800 mb-2 mxedruli">გადახდა დასრულდა?</h4> */}
                <p className="text-sm text-green-700 mb-4 mxedruli">
                  დააჭირეთ ღილაკს რომელიც გამოგვიგზავნის შეტყობინებას და მინიმალურ დროში გაგიაქტიურებთ პრემიუმს
                </p>
                <button
                  onClick={handleTransferCompleted}
                  disabled={isNotifying}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isNotifying ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>იგზავნება შეტყობინება...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>გადახდა დასრულებულია</span>
                    </>
                  )}
                </button>
                {notificationError && (
                  <p className="text-sm text-red-600 mt-2 mxedruli">
                    შეცდომა შეტყობინების გაგზავნისას. გთხოვთ სცადოთ ხელახლა.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
              <div className="mb-3">
                <svg className="w-8 h-8 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-semibold text-blue-800 mb-2 mxedruli">შეტყობინება გაიგზავნა!</h4>
              <p className="text-sm text-blue-700 mxedruli">
                ჩვენ მივიღეთ თქვენი შეტყობინება. პრემიუმი რამდენიმე წუთში გაგიაქტიურდებათ.
              </p>
            </div>
          )}
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            დახურვა
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankTransferModal; 