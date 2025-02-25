import Head from 'next/head'
import Header from '@/components/Header'
import ChordsList from '@/components/ChordsList'
import Footer from '@/components/Footer'
import db from '@/services/db'
import uiDb from '@/services/data';
import { useEffect } from 'react'
import lang from '@/services/lang'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default function Home({ initialSongs }) {
  return (
    <>
      <Head>
        <title>{lang._metaTitle}</title>
        <meta name="description" content={lang._metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
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
