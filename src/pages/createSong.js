import SongCreator from "@/components/SongCreator";
import styles from "./createSong.module.css";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from '@/context/LanguageContext';

export default function CreateSong(){
    const { lang } = useLanguage();

    return <>
        <Head>
            <title>{`სიმღერის ატვირთვა - Upload new song`}</title>
            <meta name="description" content={"სიმღერის აკორდების დამატება | Add new song chords"} />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <Header />
        <div className={`${styles.createSongPage} mxedruli page_container`}>
            <div className={styles.uploadLabel}>{lang.upload.publish}<a className="text-[#f2ac2b] underline" href="#videoInstruction">{lang.upload.video_Instructions}</a></div>
            {/* <div className={styles.uploadLabel2}>{lang.upload.publish2}<a target="_blank" className="text-[#f2ac2b] underline" href="https://www.canva.com/design/DAF53EzSRJA/jrIBZWmCneGThXPXUInqNA/edit?utm_content=DAF53EzSRJA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton">{lang.upload.earn_terms}</a></div> */}
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

    if(domain == "chords365.com") {
        return "https://www.youtube.com/embed/n8W9bmGs5gA?si=A09bhMPskCr3OwBa";
    }

    return "https://www.youtube.com/embed/pQt-XoSgP5U";
}