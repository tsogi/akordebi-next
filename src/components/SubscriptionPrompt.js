import React, { useState } from 'react';
import { useUser } from '@/utils/useUser';
import { supabase } from '@/utils/supabase-client';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import SubscriptionModal from './SubscriptionModal';
import lang from '@/services/lang';

const SubscriptionPrompt = ({ onSubscribe }) => {
  const { user, setAuthOpenedFrom } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginClick = () => {
    setAuthOpenedFrom('subscription');
  };

  const handleSubscribeClick = () => {
    setIsModalOpen(true);
    if (onSubscribe) onSubscribe();
  };

  return (
    <>
      <div className="absolute top-20 left-0 right-0 z-10 flex justify-center pointer-events-all">
        <div className="bg-white p-5 rounded-lg shadow-lg border-2 border-[#5286ed] text-center w-full max-w-xs sm:max-w-sm mx-4">
          <h3 className="text-xl font-bold text-gray-800 mb-3 capital">{lang.subscriptionPrompt.title}</h3>
          
          {!user ? (
            <>
              <p className="text-gray-600 mb-4 text-sm">
                აკორდების/ტაბების სრულად სანახავად გაიარეთ მარტივი ავტორიზაცია 1 კლიკით და შემდეგ გამოიწერეთ akordebi.ge
              </p>
              <div className="mt-4">
                <Auth
                  supabaseClient={supabase}
                  appearance={{ 
                    theme: ThemeSupa,
                    style: {
                      button: {
                        fontSize: '14px',
                        padding: '8px 10px'
                      }
                    }
                  }}
                  providers={["google"]}
                  theme=""
                  onlyThirdPartyProviders
                  redirectTo={
                    typeof window !== "undefined" ? window.location.href : "/"
                  }
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4 text-sm">
                აკორდების/ტაბების სრულად სანახავად გამოიწერეთ akordebi.ge
              </p>
              
              <div className="bg-gray-100 p-3 rounded-md mb-4">
                <div className="text-lg font-bold text-[#5286ed]">5 ლარი / თვეში</div>
              </div>
              
              <div className="mb-4">
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    სრული აკორდები/ტაბები
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    არანაირი რეკლამა
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    სრული ფუნქციონალი
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={handleSubscribeClick}
                className="bg-[#5286ed] hover:bg-[#4a6da7] text-white font-medium py-2 px-6 rounded-md transition-colors w-full"
              >
                გამოწერა
              </button>
            </>
          )}
        </div>
      </div>
      
      <SubscriptionModal 
        open={isModalOpen} 
        setOpen={setIsModalOpen} 
      />
    </>
  );
};

export default SubscriptionPrompt; 