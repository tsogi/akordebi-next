import SongCreator from "@/components/SongCreator";
import styles from "./id.module.css";
import Head from "next/head";
import db from "@/services/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ModifySong({ song }){
    return <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/guitar.ico" />
        </Head>
        <Header />
        <div className={`${styles.createSongPage} page_container`}>
            <SongCreator _songId={song.id} _songName={song.name} _songText={song.body} _videoLesson={song.videoLesson} _uploader={song.uploader} _authors={song.authors.map((author, index) => { return { id: index, name: author } })} />
        </div>
        <Footer />
    </>
}

export async function getStaticProps({ params }) {
    let { id } = params;
    let song = await db.getSong(id);
  
    return {
      props: {
        song
      },
    }
}