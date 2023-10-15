import Head from 'next/head'
import Header from '@/components/Header'
import ChordsList from '@/components/ChordsList'
import Footer from '@/components/Footer'
import db from '@/services/db'
import uiDb from '@/services/data';
import { useEffect } from 'react'

export default function Home({ initialSongs }) {
  useEffect(() => {
    uiDb.logEvent("homepage");
  }, [])

  return (
    <>
      <Head>
        <title>გიტარის აკორდები | gitaris akordebi</title>
        <meta name="description" content="ქართული სიმღერების გიტარის აკორდები | Guitar chords of Georgian songs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8346425726826566" crossOrigin="anonymous"></script>
      </Head>
      <Header />
      <div className="songsPage">
        <ChordsList initialSongs={initialSongs} />
      </div>
      <Footer />
    </>
  )
}

export async function getServerSideProps() {
    let initialSongs = await db.getAllSongsSorted();
  
    return {
      props: {
        initialSongs
      },
    }
}