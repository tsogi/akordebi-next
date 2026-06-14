import '@/styles/globals.css'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { MyUserContextProvider } from '@/utils/useUser';
import AuthSlideOver from '@/components/AuthSlideOver';
import GoogleTagManager from '@/components/GoogleAnalytics';
import NewsModal from '@/components/NewsModal';
import TeachersNews from '@/components/TeachersNews';
import { LanguageProvider } from '@/context/LanguageContext';
import GoogleAdSense from '@/components/GoogleAdSense';
import { ShoppingCartProvider } from '@/context/ShoppingCartContext';
import MobileBottomNav from '@/components/MobileBottomNav';
import SmartAppBanner from '@/components/SmartAppBanner';

// Song pages — where the iOS app promo banner is most relevant.
const SONG_ROUTES = ['/chord/[chordUrl]', '/resource/[notationFormat]/[chordUrl]'];

export default function App({ Component, pageProps }) {

  const [supabaseClient] = useState(() => createPagesBrowserClient())
  const router = useRouter()
  const isSongPage = SONG_ROUTES.includes(router.pathname)

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
          <MobileBottomNav />
          {isSongPage && <SmartAppBanner />}
        </LanguageProvider>
      </MyUserContextProvider>
    </SessionContextProvider>
  </>
}
