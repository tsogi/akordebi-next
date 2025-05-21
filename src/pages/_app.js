import '@/styles/globals.css'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { MyUserContextProvider } from '@/utils/useUser';
import AuthSlideOver from '@/components/AuthSlideOver';
import GoogleTagManager from '@/components/GoogleAnalytics';
import NewsModal from '@/components/NewsModal';
import TeachersNews from '@/components/TeachersNews';
import { LanguageProvider } from '@/context/LanguageContext';
import GoogleAdSense from '@/components/GoogleAdSense';
import { ShoppingCartProvider } from '@/context/ShoppingCartContext';

export default function App({ Component, pageProps }) {

  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return <>
    <GoogleTagManager />

    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <MyUserContextProvider>
        <LanguageProvider>
          <ShoppingCartProvider>
            <Component {...pageProps} />
          </ShoppingCartProvider>
          <AuthSlideOver />
          {/* <NewsModal 
            title="ახალი გვერდი - გიტარის მასწავლებლები"
            duration={5}
            name="teachers_page_launch"
          >
            {(markSeenAndClose) => (
              <TeachersNews onActionClick={markSeenAndClose} />
            )}
          </NewsModal> */}
          <GoogleAdSense />
        </LanguageProvider>
      </MyUserContextProvider>
    </SessionContextProvider>
  </>
}
