import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { supabase } from "@/utils/supabase-client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useUser } from "@/utils/useUser";
import { useLanguage } from '@/context/LanguageContext';

export default function AuthSlideOver() {
  const { authOpenedFrom, setAuthOpenedFrom } = useUser();
  const [open, setOpen] = useState(!!authOpenedFrom);
  const { lang } = useLanguage();

  useEffect(() => {
    setOpen(!!authOpenedFrom);
  }, [authOpenedFrom]);

  return (
    <Transition.Root show={!!open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={()=> setAuthOpenedFrom(null)}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          {
                            lang._auth.login
                          }
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setAuthOpenedFrom(null)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="">
                          <span className="mxedruli block text-sm font-medium text-gray-900 mt-[12px] mb-[58px]">
                            {
                              whyLoginText(authOpenedFrom)
                            }
                            
                          </span>
                        <Auth
                          supabaseClient={supabase}
                          appearance={{ theme: ThemeSupa }}
                          providers={["google"]}
                          theme=""
                          onlyThirdPartyProviders
                          redirectTo={
                            typeof window !== "undefined" ? window.location.href : "/"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function whyLoginText(authOpenedFrom){
  const { lang } = useLanguage();

  if(authOpenedFrom == "header"){
    return lang._auth.enterBtn;
  }

  if(authOpenedFrom == "favorites"){
    return lang._auth.addFavorites;
  }

  if(authOpenedFrom == "uploadSongBtn"){
    return lang._auth.uploadSongBtn;
  }

  if(authOpenedFrom == "favoritesFilter"){
    return lang._auth.favoritesBtn;
  }
 
  return lang._auth.enterBtn;
}