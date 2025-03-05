import '@/styles/globals.css'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { MyUserContextProvider } from '@/utils/useUser';
import AuthSlideOver from '@/components/AuthSlideOver';
import GoogleTagManager from '@/components/GoogleAnalytics';
import NewsModal from '@/components/NewsModal';
import SampleNews from '@/components/SampleNews';

export default function App({ Component, pageProps }) {

  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return <>
    <GoogleTagManager />

    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <MyUserContextProvider>
        <Component {...pageProps} />
        <AuthSlideOver />
        <NewsModal 
          title="საიტი განახლდა"
          duration={0}
          name="new_features_2024_01"
        >
          <SampleNews />
        </NewsModal>
      </MyUserContextProvider>
    </SessionContextProvider>
  </>
}
