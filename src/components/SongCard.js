import * as React from 'react';
import Paper from '@mui/material/Paper';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { CardActionArea } from '@mui/material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Badge from '@mui/material/Badge';
import { ThumbUp } from '@mui/icons-material';
import styles from "./SongCard.module.css";
import { useRouter } from 'next/router';
import { useUser } from '@/utils/useUser';

export default function SongCard({ song }){

    const { user } = useUser();
    const router = useRouter();

    const [isFavorite, setIsFavorite] = React.useState(song.isFavorite?? false);

    React.useEffect(() => {
        if(user && localStorage.getItem("addSongToFavorites") == song.id){
            handleAddToFavorites();
            localStorage.removeItem("addSongToFavorites");
        }
    } , [user, localStorage.getItem("addSongToFavorites")]);

    const handleFavoriteClick = async () => {
        if (!user){
            // save song to local storage
            localStorage.setItem("addSongToFavorites", song.id);
            router.push("/auth");
            return;
        }
        if(isFavorite){
            try {
                await handleRemoveFromFavorites();
            } catch(error){
                console.error(error);
            }
        }
        else {
            try {
                await handleAddToFavorites();
            } catch(error){
                console.error(error);
            }
            
        }
    }

    const handleAddToFavorites = async () => {
        await fetch("/api/favorites/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ songId: song.id })
        });
        setIsFavorite(true);
    }

    const handleRemoveFromFavorites = async () => {
        await fetch("/api/favorites/remove", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ songId: song.id })
        });
        setIsFavorite(false);
    }

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
            <div className={styles.songMeta}>
                <div className={`${styles.songMetaLeft} flex items-center`}>
                    <div className={styles.votesSumWrapper}>
                        <Badge anchorOrigin={{ vertical: 'top', horizontal: 'right', }} badgeContent={song.voteSum || "0"}  style={{ color: "#9ebeff" }}>
                            <ThumbUp style={{ color: "#9ebeff" }} />
                        </Badge>
                    </div>
                    { renderDifficulty(song.difficulty) }
                    <FavoriteIcon isFavorite={isFavorite} onClick={handleFavoriteClick} />
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
                {
                    song.confirmed ?
                    <div className={styles.confirmedIcon}>
                        <TaskAltIcon style={{ color: "#15a894" }} /> 
                    </div>
                    :
                    null
                }
                </div>
            </div>
        </article>
}

function renderDifficulty(difficulty) {
    if (![1, 2, 3, 4, 5].includes(difficulty)) {
        return null;
    }

    let difficultyIcon = '';
    switch (difficulty) {
        case 1:
            difficultyIcon = '/difficulty/difficulty1.png';
            break;
        case 2:
            difficultyIcon = '/difficulty/difficulty2.png';
            break;
        case 3:
            difficultyIcon = '/difficulty/difficulty3.png';

            break;
        case 4:
            difficultyIcon = '/difficulty/difficulty4.png';

            break;
        case 5:
            difficultyIcon = '/difficulty/difficulty5.png';

            break;
        default:
            break;
    }

    return (
            <img className="ml-[10px] w-[25px] h-[18px]" src={difficultyIcon} />
    );
}

function FavoriteIcon({isFavorite, onClick}){
    return (
    <svg 
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill={isFavorite ? "#e31b23" : "transparent"}
        xmlns="http://www.w3.org/2000/svg"
        className='ml-4 cursor-pointer'
        onClick={onClick}
    >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> 
            <path 
                fill-rule="evenodd" 
                clip-rule="evenodd" 
                d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" 
                stroke="#e31b23" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
            ></path>
        </g>
    </svg>
    )
}
