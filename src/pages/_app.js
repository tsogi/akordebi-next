import '@/styles/globals.css'
import React from 'react';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
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

    <Component {...pageProps} />
  </>
}
