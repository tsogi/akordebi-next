import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Head from 'next/head';
import Footer from '@/components/Footer';

export default function PaymentSuccess() {
  const router = useRouter();
  const [returnUrl, setReturnUrl] = useState(null);

  useEffect(() => {
    // Check if there's a pre-payment page URL in localStorage
    const return_page_url = localStorage.getItem('return_page_url');
    if (return_page_url) {
      setReturnUrl(return_page_url);
      // Clear it after retrieving
      localStorage.removeItem('return_page_url');
    }
  }, []);

  const goToReturnPage = () => {
    if (returnUrl) {
      window.location.href = returnUrl;
    }
  };

  const goToHomePage = () => {
    router.push('/');
  };

  return (
    <> {/* Wrap content in your site's Layout component */}
      <Head>
        <title>გიტარის მაღაზია | აკორდები.გე</title>
        <meta name="description" content="მაღალი ხარისხის გიტარები და აქსესუარები. შეიძინეთ კლასიკური და აკუსტიკური გიტარები." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="w-[90%] mx-auto my-16 p-6 bg-white rounded-lg shadow-md text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">გადახდა წარმატებით დასრულდა!</h1>
        <p className="text-gray-600 mb-6 mxedruli">
          გმადლობთ გამოწერისთვის. ახლა უკვე შეგიძლიათ ისარგებლოთ ყველა ჩვენი სერვისით სრულად.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {returnUrl && (
            <button 
              onClick={goToReturnPage}
              className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
            >
              წინა გვერდზე დაბრუნება
            </button>
          )}
          <button 
            onClick={goToHomePage}
            className="px-6 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
          >
            მთავარ გვერდზე გადასვლა
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
} 