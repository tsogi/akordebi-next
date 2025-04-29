import styles from "./ChordsList.module.css";
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/router';

export default function UploadSongBtn(){
    const { user, setAuthOpenedFrom } = useUser();
    const router = useRouter();
    const { lang } = useLanguage();

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
                        <div style={{ padding: "15px" }} className={`${styles.songName} capital`}>{lang._earn_money}</div>
                </div>
            </div>
        </span>
}