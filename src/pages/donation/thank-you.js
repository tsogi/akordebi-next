import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { HeartIcon, HomeIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DonationThankYou() {
  const router = useRouter();

  useEffect(() => {
    // Try to get the return URL from localStorage
    const returnUrl = localStorage.getItem('return_page_url');
    
    // Set a timer to redirect after 10 seconds if user doesn't click anything
    // const timer = setTimeout(() => {
    //   if (returnUrl) {
    //     localStorage.removeItem('return_page_url');
    //     window.location.href = returnUrl;
    //   } else {
    //     router.push('/');
    //   }
    // }, 10000);

    // return () => clearTimeout(timer);
  }, [router]);

  const handleReturnClick = () => {
    const returnUrl = localStorage.getItem('return_page_url');
    if (returnUrl) {
      localStorage.removeItem('return_page_url');
      window.location.href = returnUrl;
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <Head>
        <title>მადლობა შემოწირულობისთვის - Akordebi.ge</title>
        <meta name="description" content="მადლობა თქვენი შემოწირულობისთვის. თქვენი მხარდაჭერა დაგვეხმარება საიტის განვითარებაში." />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Success Banner */}
          <div className="w-full h-2 bg-gradient-to-r from-pink-500 to-red-500"></div>
          
          <div className="p-8 text-center">
            {/* Heart Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
              <HeartIcon className="w-8 h-8 text-white" />
            </div>

            {/* Thank You Message */}
            <h1 className="text-2xl font-bold text-white mb-4">
              გმადლობთ შემოწირულობისთვის! 🎉
            </h1>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              თქვენი მხარდაჭერა ჩვენთვის ძალიან მნიშვნელოვანია და დაგვეხმარება საიტის განვითარებაში. 
              მადლობა, რომ ხელს უწყობთ ქართული მუსიკის განვითარებას.
            </p>

            {/* Additional Message */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-gray-200 text-sm">
                🎵 თქვენი დონაცია დაგვეხმარება:
              </p>
              <ul className="text-gray-300 text-sm mt-2 space-y-1">
                <li>• ახალი აკორდების დამატებაში</li>
                <li>• საიტის ტექნიკურ მხარდაჭერაში</li>
                <li>• ახალი ფუნქციების დამატებაში</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* <button
                onClick={handleReturnClick}
                className="w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <span>თქვენს გვერდზე დაბრუნება</span>
              </button> */}
              
              <Link
                href="/"
                className="w-full flex items-center justify-center py-3 px-6 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-xl transition-all duration-200 border border-gray-600"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                <span>მთავარი გვერდი</span>
              </Link>
            </div>

            {/* Auto redirect notice */}
            {/* <p className="text-gray-400 text-xs mt-4">
              10 წამში ავტომატურად დაბრუნდებით უკან
            </p> */}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
} 