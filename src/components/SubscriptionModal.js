import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';

export default function SubscriptionModal({ open, setOpen }) {
  const [isActivated, setIsActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const router = useRouter();

  const handleActivateClick = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Send request to the API endpoint
      const response = await fetch('/api/subscription/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to activate subscription');
      }
      
      // Success - change to activated state
      setIsActivated(true);
      
      // Force a refresh after a successful activation to update the UI
      // This will reload the page and fetch fresh user details
      setTimeout(() => {
        router.reload();
      }, 1500);
      
    } catch (err) {
      console.error('Error processing activation:', err);
      setError(err.message || 'An error occurred while activating your subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    
    // If activated, reload the page to ensure the user sees the full content
    if (isActivated) {
      router.reload();
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 w-full mx-4 max-w-md">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="mt-3 sm:mt-0 sm:text-left">
                  <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 text-center sm:text-left">
                    {isActivated ? 'გამოწერა გააქტიურებულია' : 'გამოწერა'}
                  </Dialog.Title>
                  
                  <div className="mt-6">
                    {!isActivated ? (
                      <>
                        <p className="text-gray-700 text-base leading-6 mb-6">
                          გამოწერა არის ძალიან მარტივი და გაგიაქტიურდებათ მომენტალურად. გადარიცხეთ თანხა ნებისმიერი ბანკიდან საქართველოს ბანკის ანგარიშზე <span className="font-medium text-[#5286ed]">GE16BG0000000315160700</span>. დანიშნულებაში აუცილებლად ჩაწერეთ თქვენი მეილი akordebi.ge-ზე. თანხის გადარიცხვის შემდეგ დააჭირეთ ღილაკს გააქტიურება.
                        </p>
                        
                        <div className="mt-8 bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">თქვენი ელ-ფოსტა:</span>
                            <span className="font-medium">{user?.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">გადასახდელი თანხა:</span>
                            <span className="font-medium">5 ლარი</span>
                          </div>
                        </div>
                        
                        {error && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                            {error}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-700 text-base leading-6 mb-6">
                        გამოწერა გააქტიურებულია, ამიერიდან შეგიძლიათ ისარგებლოთ akordebi.ge-ს სრული ფუნქციონალით. თუ გადარიცხვა არ დადასტურდა გამოწერა გაგიუქმდებათ.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 sm:mt-6">
                  {!isActivated ? (
                    <button
                      type="button"
                      className="w-full rounded-md bg-[#5286ed] px-3.5 py-2.5 text-center text-base font-semibold text-white shadow-sm hover:bg-[#3a5d97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5286ed] disabled:opacity-70 disabled:cursor-not-allowed"
                      onClick={handleActivateClick}
                      disabled={isLoading}
                    >
                      {isLoading ? 'მიმდინარეობს...' : 'გააქტიურება'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-full rounded-md bg-green-500 px-3.5 py-2.5 text-center text-base font-semibold text-white shadow-sm hover:bg-green-600"
                      onClick={handleClose}
                    >
                      დახურვა
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 