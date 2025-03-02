import * as React from 'react';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Badge from '@mui/material/Badge';
import { ThumbUp } from '@mui/icons-material';
import styles from "./SongCard.module.css";
import { useUser } from '@/utils/useUser';
import Link from 'next/link';
import Favorite from "./Favorite";


export default function SongCard({ song }){
    const { user, setAuthOpenedFrom } = useUser();
    const [isFavorite, setIsFavorite] = React.useState(song.isFavorite?? false);

    React.useEffect(() => {
        setIsFavorite(song.isFavorite?? false);
    }, [song.isFavorite]);

    React.useEffect(() => {
        if(user && localStorage.getItem("addSongToFavorites") == song.id){
            handleAddToFavorites();
            localStorage.removeItem("addSongToFavorites");
        }
    } , [user, localStorage.getItem("addSongToFavorites")]);

    return <article key={song.id} className={"songItemWrapper"}>
            <a className={styles.songLink} href={`/chord/${song.url}`}>
                <div className={styles.songItem}>
                    <div className={styles.songDetails}>
                        <h2 className={`${styles.songName} capital`}>{ song.name }</h2>
                        <div className={styles.authors}>
                            {
                                song.authors.map(author => {
                                    return <h4 key={author} className={styles.author}>
                                        {
                                            author
                                        }
                                    </h4>
                                })
                            }
                        </div>
                    </div>
                </div>
            </a>
            <div className={styles.songMetaTop}>
                <div className={`${styles.songMetaLeft} flex items-center`}>
                    {
                        user && (user?.id == song.analyticId) ?
                        <Link href={`/edit/${song.url}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </Link>
                        :
                        null
                    }
                </div>
                <div className={styles.songMetaRight}>
                    {
                        song.videoLesson ?
                        <div className={styles.videoLessonIcon}>
                            <OndemandVideoIcon style={{ color: "#9ebeff" }} />
                        </div>
                        :
                        null
                    }
                    {/* {
                        song.confirmed ?
                        <div className={styles.confirmedIcon}>
                            <TaskAltIcon style={{ color: "#15a894" }} /> 
                        </div>
                        :
                        null
                    } */}
                </div>
            </div>
            <div className={styles.songMetaBottom}>
                <Favorite song={song} />
                <div className={styles.songMetaRight}>
                    { renderDifficultyBars(song.difficulty) }
                    <div className={styles.votesSumWrapper}>
                        <div className={styles.likesCount}>
                            <ThumbUp style={{ color: "#fff", marginRight: "5px" }} />
                            <span>{song.voteSum || "0"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
}

function renderDifficultyBars(difficulty) {
    if (![1, 2, 3, 4, 5].includes(difficulty)) {
        return null;
    }

    return (
        <div className={styles.difficultyBars}>
            {[1, 2, 3, 4, 5].map((level) => (
                <div 
                    key={level} 
                    className={`${styles.difficultyBar} ${level <= difficulty ? styles.active : ''}`}
                ></div>
            ))}
        </div>
    );
}