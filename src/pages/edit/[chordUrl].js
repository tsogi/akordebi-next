import SongCreator from "@/components/SongCreator";
import styles from "./id.module.css";
import Head from "next/head";
import db from "@/services/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ModifySong({ song }){
    return <>
        <Head>
            <title>{`სიმღერის შეცვლა - Edit song`}</title>
            <meta name="description" content={"სიმღერის აკორდების შეცვლა | Edit song chords"} />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <Header />
        <div className={`${styles.createSongPage} page_container`}>
            <SongCreator _songId={song.id} _songName={song.name} _songText={song.body} _videoLesson={song.videoLesson} _uploader={song.uploader} _authors={song.authors.map((author, index) => { return { id: index, name: author } })} />
        </div>
        <Footer />
    </>
}

export async function getServerSideProps({ params }) {
    let { chordUrl } = params;

    let song = await db.getSongByUrl(chordUrl);
  
    return {
      props: {
        song
      },
    }
}