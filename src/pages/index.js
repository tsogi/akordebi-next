import Head from 'next/head'
import Header from '@/components/Header'
import ChordsList from '@/components/ChordsList'
import Footer from '@/components/Footer'
import db from '@/services/db'

export default function Home({ initialSongs }) {
  return (
    <>
      <Head>
        <title>გიტარის აკორდები | gitaris akordebi</title>
        <meta name="description" content="ქართული სიმღერების გიტარის აკორდები | Guitar chords of Georgian songs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/guitar.ico" />
      </Head>
      <Header />
      <div className="songsPage">
        <ChordsList initialSongs={initialSongs} />
      </div>
      <Footer />
    </>
  )
}

export async function getStaticProps() {
    let initialSongs = await db.getAllSongs();
  
    return {
      props: {
        initialSongs
      },
    }
}