import Head from 'next/head'
import Header from '@/components/Header'
import ChordsList from '@/components/ChordsList'
import Footer from '@/components/Footer'
import db from '@/services/db'
import { useLanguage } from '@/context/LanguageContext';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default function Home({ initialSongs }) {
  const { lang } = useLanguage();

  return (
    <>
      <Head>
        <title>{lang._metaTitle}</title>
        <meta name="description" content={lang._metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        
        {/* Open Graph meta tags for better social sharing */}
        <meta property="og:title" content={lang._metaTitle} />
        <meta property="og:description" content={lang._metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_DOMAIN} />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={lang._metaTitle} />
        <meta name="twitter:description" content={lang._metaDescription} />
        
        {/* Canonical URL to prevent duplicate content issues */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_DOMAIN} />
        
        {/* Additional meta tags for better SEO */}
        <meta name="keywords" content="გიტარა, ფანდური, აკორდები, ტაბები, ნოტები, გაკვეთილები | gitara, fanduri, akordebi, tabebi, notebi, gakvetilebi" />
        <meta name="author" content="Akordebi.ge" />
      </Head>
      <Header />
      <div className="songsPage">
        <ChordsList initialSongs={initialSongs} />
      </div>
      <Footer />
    </>
  )
}


export async function getServerSideProps(ctx) {
  const supabase = createPagesServerClient(ctx);
  const {data} = await supabase.auth.getSession();
  const userID = data?.session?.user?.id ?? null;

  let initialSongs = await db.getAllSongsSorted(userID);

  return {
    props: {
      initialSongs,
    },
  };
}
