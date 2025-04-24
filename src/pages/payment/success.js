import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PaymentSuccess() {
  const router = useRouter();

  // Redirect to home after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 15000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white rounded-lg shadow-md text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">გადახდა წარმატებით დასრულდა!</h1>
        <p className="text-gray-600 mb-6">
          გმადლობთ გამოწერისთვის. ახლა უკვე შეგიძლიათ ისარგებლოთ ჩვენი სერვისით სრულად.
        </p>
        <p className="text-sm text-gray-500">
          რამდენიმე წამში გადამისამართდებით მთავარ გვერდზე...
        </p>
      </div>
  );
} 