import React, { useState } from 'react';

const BankTransferModal = ({ isOpen, onClose, userEmail }) => {
  const [copiedItems, setCopiedItems] = useState(new Set());

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
          
          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              საბანკო ანგარიშის დეტალები:
            </h3>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600 mxedruli">ანგარიშის ნომერი:</div>
                    <div className="font-mono font-semibold text-gray-800">GE16BG0000000366014987</div>
                  </div>
                                     <button
                     onClick={() => copyToClipboard('GE16BG0000000366014987', 'account-number')}
                     className={`p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 ${
                       copiedItems.has('account-number') ? 'text-green-500' : 'text-blue-500'
                     }`}
                     title="კოპირება"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                     </svg>
                   </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mxedruli">ანგარიშის მფლობელის სახელი:</div>
                <div className="font-semibold text-gray-800">ნიკა ცოგიაიძე</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mxedruli">რაოდენობა:</div>
                <div className="font-semibold text-gray-800">{process.env.NEXT_PUBLIC_MONTHLY_COST} ლარი</div>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="text-yellow-800">
                <div className="font-semibold mb-2">მნიშვნელოვანი ინსტრუქცია:</div>
                <p className="text-sm leading-relaxed mxedruli">
                  დანიშნულების ველში <strong>აუცილებლად</strong> მიუთითეთ თქვენი ელ-ფოსტა:
                </p>
                                 <div className="mt-2 p-2 bg-white rounded border font-mono text-sm text-blue-600 font-semibold flex items-center justify-between">
                   <span>{userEmail || 'თქვენი@ელფოსტა.com'}</span>
                   {userEmail && (
                     <button
                       onClick={() => copyToClipboard(userEmail, 'email')}
                       className={`p-1 hover:bg-blue-50 rounded transition-colors duration-200 ${
                         copiedItems.has('email') ? 'text-green-500' : 'text-blue-500'
                       }`}
                       title="ელ-ფოსტის კოპირება"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                       </svg>
                     </button>
                   )}
                 </div>
              </div>
            </div>
          </div>
          
          {/* Process */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">რა მოხდება შემდეგ:</h4>
            <div className="space-y-2 mxedruli">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">1</div>
                <span>გადმორიცხეთ თანხა ნებისმიერი ბანკიდან</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">2</div>
                <span>რამდენიმე წუთში გაგიაქტიურდებათ პრემიუმი</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">3</div>
                <span>მიიღებთ დადასტურების ელ-ფოსტას</span>
              </div>
            </div>
          </div>
          
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