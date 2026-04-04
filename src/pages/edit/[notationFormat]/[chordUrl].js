import SongCreator from "@/components/SongCreator";
import styles from "./id.module.css";
import Head from "next/head";
import db from "@/services/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from 'react';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useRouter } from 'next/router';

export default function ModifySong({ song }){
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileWarning, setShowMobileWarning] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                || window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setShowMobileWarning(true);
            }
        };
        checkMobile();
    }, []);

    const handleMobileWarningClose = () => {
        setShowMobileWarning(false);
        router.push('/');
    };

    return <>
        <Head>
            <title>{`სიმღერის შეცვლა - Edit song`}</title>
            <meta name="description" content={"სიმღერის აკორდების შეცვლა | Edit song chords"} />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <Header />
        
        {isMobile ? (
            <div className={`${styles.createSongPage} page_container`}>
                <div className="text-center py-12 mxedruli">
                    <h1 className="text-xl font-bold text-gray-100 mb-4">რესურსების რედაქტირება მობილურიდან შეუძლებელია</h1>
                    <p className="text-gray-400">გთხოვთ გამოიყენოთ კომპიუტერი</p>
                </div>
            </div>
        ) : (
            <div className={`${styles.createSongPage} page_container`}>
                <SongCreator _songId={song.id} _songName={song.name} _songText={song.body} _videoLesson={song.videoLesson} _uploader={song.uploader} _authors={song.authors.map((author, index) => { return { id: index, name: author } })} _notationFormat={song.notation_format} />
            </div>
        )}
        
        <ConfirmDialog
            open={showMobileWarning}
            setOpen={setShowMobileWarning}
            message="რესურსების რედაქტირება შესაძლებელია მხოლოდ კომპიუტერიდან. გთხოვთ შეხვიდეთ საიტზე კომპიუტერის გამოყენებით."
            type="error"
            onConfirm={handleMobileWarningClose}
        />
        
        <Footer />
    </>
}

export async function getServerSideProps({ params }) {
    let { chordUrl, notationFormat } = params;

    let song = await db.getSongByUrlAndNotation(chordUrl, notationFormat);
  
    return {
      props: {
        song
      },
    }
}