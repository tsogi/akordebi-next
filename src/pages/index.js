import Head from 'next/head'
import Header from '@/components/Header'
import ChordsList from '@/components/ChordsList'
import Footer from '@/components/Footer'
import db from '@/services/db'
import { useEffect } from 'react'

export default function Home({ initialSongs }) {
  // useEffect(() => {
  //   let songs = initialSongs.map(song => { return song.url });
  //   console.log(songs);
  // }, [])
  return (
    <>
      <Head>
        <title>გიტარის აკორდები | gitaris akordebi</title>
        <meta name="description" content="ქართული სიმღერების გიტარის აკორდები | Guitar chords of Georgian songs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8346425726826566" crossorigin="anonymous"></script>
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
    let initialSongs = await db.getAllSongs();

    const compare = (a, b) => {
      // First, check if both have videoLesson and confirmed=1
      if (a.videoLesson && a.confirmed === 1 && b.videoLesson && b.confirmed === 1) {
        return b.voteSum - a.voteSum; // Sort by voteSum
      } else if (a.videoLesson && a.confirmed === 1) {
        return -1; // a comes before b
      } else if (b.videoLesson && b.confirmed === 1) {
        return 1; // b comes before a
      } else if(a.confirmed && b.confirmed) {
        return b.voteSum - a.voteSum;
      } else if(a.confirmed) {
        return -1;
      } else if(b.confirmed) {
        return 1;
      } else {
        return b.voteSum - a.voteSum;
      } 
    };
    
    initialSongs.sort(compare);
  
    return {
      props: {
        initialSongs
      },
    }
}