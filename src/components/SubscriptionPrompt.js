import React, { useState, useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { supabase } from '@/utils/supabase-client';
import SubscriptionModal from './SubscriptionModal';
import lang from '@/services/lang';
import dataClient from '@/services/data';

// Custom button component that will replace the Google sign-in button
const GoogleSignInButton = ({ onClick }) => {
  return (
    <button
      onClick={(e) => {
        // Log the click event
        dataClient.logEvent('google_signin_click', 'From subscription prompt');
        // Then proceed with the original click behavior
        if (onClick) onClick(e);
      }}
      className="flex text-black items-center justify-center w-full p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
        <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.2212 19.9895 10.1871Z" fill="#4285F4"/>
        <path d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9466L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z" fill="#34A853"/>
        <path d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z" fill="#FBBC05"/>
        <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335"/>
      </svg>
      Gmail-ით შესვლა
    </button>
  );
};

const SubscriptionPrompt = ({ onSubscribe }) => {
  const { user, setAuthOpenedFrom } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCustomAuth, setShowCustomAuth] = useState(false);

  const handleLoginClick = () => {
    setAuthOpenedFrom('subscription');
  };

  const handleSubscribeClick = () => {
    setIsModalOpen(true);
    if (onSubscribe) onSubscribe();
  };
  
  // Use client-side only rendering for the auth component to prevent hydration issues
  useEffect(() => {
    // Only show custom auth component on client-side to avoid hydration issues
    setShowCustomAuth(true);
  }, []);
  
  const handleGoogleSignIn = () => {
    // Trigger Google sign-in via Supabase directly
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.href : "/"
      }
    });
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
                {!showCustomAuth ? (
                  // Empty div during server render to prevent hydration mismatch
                  <div className="h-10"></div>
                ) : (
                  // Custom Google button that we can track
                  <GoogleSignInButton onClick={handleGoogleSignIn} />
                )}
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