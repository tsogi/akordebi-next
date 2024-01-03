import '@/styles/globals.css'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { MyUserContextProvider } from '@/utils/useUser';
import AuthSlideOver from '@/components/AuthSlideOver';
import Snowfall from 'react-snowfall';
import GoogleTagManager from '@/components/GoogleAnalytics';

export default function App({ Component, pageProps }) {

  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return <>
    <GoogleTagManager />

    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Snowfall snowflakeCount={50} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }} />

      <MyUserContextProvider>
        <Component {...pageProps} />
        <AuthSlideOver />
      </MyUserContextProvider>
    </SessionContextProvider>
  </>
}
