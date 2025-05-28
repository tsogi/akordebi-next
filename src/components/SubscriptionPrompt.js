import React, { useState, useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { supabase } from '@/utils/supabase-client';
import SubscriptionModal from './SubscriptionModal';
import { useLanguage } from '@/context/LanguageContext';
import dataClient from '@/services/data';

// Custom button component that will replace the Google sign-in button
const GoogleSignInButton = ({ onClick }) => {
  const { lang } = useLanguage();

  return (
    <button
      onClick={(e) => {
        dataClient.logEvent('google_signin_click', 'From subscription prompt');
        if (onClick) onClick(e);
      }}
      className="flex text-black items-center justify-center w-full p-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
        <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.2212 19.9895 10.1871Z" fill="#4285F4"/>
        <path d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9466L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z" fill="#34A853"/>
        <path d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z" fill="#FBBC05"/>
        <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335"/>
      </svg>
      <span className="font-medium">Gmail-ით შესვლა</span>
    </button>
  );
};

const SubscriptionPrompt = ({
  unauthenticatedText = 'აკორდების/ტაბების სრულად სანახავად გაიარეთ მარტივი ავტორიზაცია 1 კლიკით და შემდეგ გამოიწერეთ akordebi.ge',
  authenticatedText = 'აკორდების/ტაბების სრულად სანახავად გამოიწერეთ akordebi.ge',
  source = 'subscription_prompt',
  inModal = false
}) => {
  const { user, setAuthOpenedFrom } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCustomAuth, setShowCustomAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const { lang } = useLanguage();

  const handleLoginClick = () => {
    setAuthOpenedFrom('subscription');
  };

  const handleSubscribeClick = async () => {
    // Log the subscribe click event
    await dataClient.logEvent('subscribe_click', `From ${source}`);
    
    // Check if user email is the special test email
    if (user) {
      try {
        setIsLoading(true);
        setPaymentError(null);
        
        // Store current page URL in localStorage before redirecting
        if (typeof window !== 'undefined') {
          localStorage.setItem('return_page_url', window.location.href);
        }
        
        // Call our new API route to initiate the BOG payment
        const response = await fetch('/api/payment/initiate-bog-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
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
        setPaymentError(error.message);
      } finally {
        // setIsLoading(false);
      }
    } else {
      // For all other users, just show the modal
      setIsModalOpen(true);
    }
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
      <div className={`${inModal ? '' : 'absolute top-20 left-0 right-0'} z-10 flex justify-center pointer-events-all px-4 sm:px-6`}>
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 text-center w-full max-w-xs sm:max-w-sm animate-fadeIn">
          <div className="relative overflow-hidden rounded-t-2xl">
            {/* Premium Banner */}
            <div className="w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div className="py-6 px-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 capital">{lang.subscriptionPrompt.title}</h3>
              
              {!user ? (
                <>
                  <p className="text-gray-600 mb-6 leading-relaxed mxedruli">
                    {unauthenticatedText}
                  </p>
                  <div className="mt-4">
                    {!showCustomAuth ? (
                      <div className="h-10"></div>
                    ) : (
                      <GoogleSignInButton onClick={handleGoogleSignIn} />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-6 leading-relaxed mxedruli text-sm">
                    {authenticatedText}
                  </p>
                  
                  {/* Price Tag */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl mb-6 transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="text-2xl font-bold text-blue-600">3 ლარი / თვეში</div>
                    <div className="text-blue-500/80 text-sm mt-1">ნებისმიერი ბანკის ბარათით</div>
                  </div>
                  
                  {/* Benefits */}
                  <div className="mb-6">
                    <ul className="text-left space-y-3">
                      {[
                        'სრული აკორდები',
                        'სრული ტაბები',
                        'არანაირი რეკლამა',
                        'სრული ფუნქციონალი'
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-center bg-gray-50 p-3 rounded-lg transform hover:scale-[1.02] transition-transform duration-200">
                          <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 font-medium">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={handleSubscribeClick}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-white 
                      ${isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] active:scale-[0.98]'
                      } 
                      transition-all duration-200 shadow-lg hover:shadow-xl`}
                  >
                    {isLoading ? 'გთხოვთ მოიცადოთ...' : 'გადახდა'}
                  </button>
                  
                  {paymentError && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-red-600 text-sm">
                        დაფიქსირდა შეცდომა: {paymentError}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <SubscriptionModal 
        open={isModalOpen} 
        setOpen={setIsModalOpen} 
      />
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default SubscriptionPrompt; 