import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/utils/useUser';
import { supabase } from '@/utils/supabase-client';

export default function SubscriptionModal({ open, setOpen }) {
  const [isActivated, setIsActivated] = useState(false);
  const { user } = useUser();

  const handleActivateClick = async () => {
    if (!user) return;
    
    try {
      // Update user's subscription status
      const { data, error } = await supabase
        .from('users')
        .update({
          payment_date: new Date().toISOString(),
          payment_confirmed: false
        })
        .eq('email', user.email);
        
      if (error) {
        console.error('Error updating subscription:', error);
        return;
      }
      
      // Change to activated state
      setIsActivated(true);
      
      // Optional: You could also refresh user data or trigger other actions here
    } catch (err) {
      console.error('Error processing activation:', err);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={setOpen}>
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
                    onClick={() => setOpen(false)}
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
                      className="w-full rounded-md bg-[#5286ed] px-3.5 py-2.5 text-center text-base font-semibold text-white shadow-sm hover:bg-[#3a5d97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5286ed]"
                      onClick={handleActivateClick}
                    >
                      გააქტიურება
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-full rounded-md bg-green-500 px-3.5 py-2.5 text-center text-base font-semibold text-white shadow-sm hover:bg-green-600"
                      onClick={() => setOpen(false)}
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