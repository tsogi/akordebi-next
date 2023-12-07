import '@/styles/globals.css'
import Script from 'next/script';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'

export default function App({ Component, pageProps }) {

  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return <>
    <Script 
      src="https://www.googletagmanager.com/gtag/js?id=G-EQH6P2B20Z">
      strategy="afterInteractive"
    </Script>
    <Script strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments)}
        gtag('js', new Date());

        gtag('config', 'G-EQH6P2B20Z');
      `}
    </Script>

    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >

      <Component {...pageProps} />
    </SessionContextProvider>
  </>
}
