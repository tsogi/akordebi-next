import SongCreator from "@/components/SongCreator";
import styles from "./createSong.module.css";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CreateSong(){
    return <>
        <Head>
            <title>{`სიმღერის ატვირთვა - Upload new song`}</title>
            <meta name="description" content={"სიმღერის აკორდების დამატება | Add new song chords"} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/guitar.ico" />
        </Head>
        <Header />
        <div className={`${styles.createSongPage} page_container`}>
            <SongCreator  />
        </div>
        <Footer />
    </>
}