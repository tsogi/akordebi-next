import styles from "./ChordsList.module.css";
import { useUser } from '@/utils/useUser';
import lang from "@/services/lang";
import { useRouter } from 'next/router';

export default function UploadSongBtn(){
    const { user, setAuthOpenedFrom } = useUser();
    const router = useRouter();

    function handleUploadSongClick(){
        if (!user){
            setAuthOpenedFrom('uploadSongBtn');
            return;
        }

        router.push('/createSong');
    }

    return <span className={styles.songLink} onClick={handleUploadSongClick}>
            <div className={styles.songItem}>
                <div className={styles.songDetails}>
                        <div style={{ padding: "15px" }} className={`${styles.songName} capital`}>{lang._uploadSong}</div>
                        <div style={{ padding: "15px" }} className={`${styles.songName} capital`}>{ uploadWebsite(process.env.NEXT_PUBLIC_DOMAIN) }</div>
                </div>
            </div>
        </span>
}

function uploadWebsite(domain){
    if(domain == "akordebi.ge") {
        return "AKORDEBI.GE-ზე";
    }

    if(domain == "chordsofsongs.com"){
        return "At CHORDSOFSONGS.COM";
    }

    return;
}