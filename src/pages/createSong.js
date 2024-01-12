import SongCreator from "@/components/SongCreator";
import styles from "./createSong.module.css";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import lang from '@/services/lang'

export default function CreateSong(){
    return <>
        <Head>
            <title>{`სიმღერის ატვირთვა - Upload new song`}</title>
            <meta name="description" content={"სიმღერის აკორდების დამატება | Add new song chords"} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <Header />
        <div className={`${styles.createSongPage} page_container`}>
            <div className={styles.uploadLabel}>{lang.upload.publish}<a className="text-[#f2ac2b] underline" href="#videoInstruction">{lang.upload.video_Instructions}</a></div>
            <SongCreator  />
            <div id="videoInstruction" className={styles.videoInstruction}>
                 <iframe width="100%" height="500px" src={getYoutubeSrc()} title={lang.upload.video_ifream_title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        </div>
        <Footer />
    </>
}

function getYoutubeSrc(){
    let domain = process.env.NEXT_PUBLIC_DOMAIN;

    if(domain == "chordsofsongs.com") {
        return "https://www.youtube.com/embed/R_h7mSX0KGk?si=Fmq68zapOB1F8OGO";
    }

    return "https://www.youtube.com/embed/HuO8oZXFKgg";
}