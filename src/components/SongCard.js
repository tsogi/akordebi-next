import * as React from 'react';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Badge from '@mui/material/Badge';
import { ThumbUp } from '@mui/icons-material';
import styles from "./SongCard.module.css";
import { useRouter } from 'next/router';
import { useUser } from '@/utils/useUser';
import { HeartIcon } from '@heroicons/react/20/solid';

export default function SongCard({ song }){

    const { user, setAuthOpenedFrom } = useUser();
    const router = useRouter();

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

    const handleFavoriteClick = async () => {
        if (!user){
            // save song to local storage
            localStorage.setItem("addSongToFavorites", song.id);
            setAuthOpenedFrom('favorites');
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
            <div className={styles.songMetaTop}>
                <div className={`${styles.songMetaLeft} flex items-center`}>

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
            <div className={styles.songMetaBottom}>
                <div className={`${styles.songMetaLeft} flex items-center`}>
                    <FavoriteIcon isFavorite={isFavorite} onClick={handleFavoriteClick} />
                </div>
                <div className={styles.songMetaRight}>
                    { renderDifficulty(song.difficulty) }
                    <div className={styles.votesSumWrapper}>
                        <Badge anchorOrigin={{ vertical: 'top', horizontal: 'right', }} badgeContent={song.voteSum || "0"}  style={{ color: "#9ebeff" }}>
                            <ThumbUp style={{ color: "#9ebeff" }} />
                        </Badge>
                    </div>
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
            <img className="mr-[10px] w-[25px] h-[18px]" src={difficultyIcon} />
    );
}

function FavoriteIcon({isFavorite, onClick}){
    return (
        <>
            <HeartIcon 
                style={{ fill: isFavorite ? "red" : "transparent", stroke: isFavorite ? "red" : "white" }} 
                className={`w-[26px] h-[26px] cursor-pointer`}  
                onClick={onClick} 
            />
        </>
    )
}