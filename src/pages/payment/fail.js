import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PaymentFail() {
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
          <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">გადახდა ვერ შესრულდა</h1>
        <p className="text-gray-600 mb-6">
          სამწუხაროდ, გადახდის პროცესი შეწყდა ან ვერ დასრულდა. გთხოვთ სცადოთ მოგვიანებით.
        </p>
        <p className="text-sm text-gray-500">
          რამდენიმე წამში გადამისამართდებით მთავარ გვერდზე...
        </p>
      </div>
  );
} 