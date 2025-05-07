import * as React from 'react';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import { ThumbUp } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styles from "./SongCard.module.css";
import { useUser } from '@/utils/useUser';
import Link from 'next/link';
import Favorite from "./Favorite";
import { useLanguage } from '@/context/LanguageContext';
import { transliterateWithCapital, transliterateWithCapitalizedWords } from '@/utils/transliteration';

export default function SongCard({ song }){
    const { language, lang } = useLanguage();
    const { user, setAuthOpenedFrom } = useUser();
    const [isFavorite, setIsFavorite] = React.useState(song.isFavorite?? false);
    const [openTooltip, setOpenTooltip] = React.useState({
        video: false,
        views: false,
        difficulty: false, 
        likes: false
    });

    // Function to handle tooltip open
    const handleTooltipOpen = (tooltipName) => {
        setOpenTooltip({...openTooltip, [tooltipName]: true});
        
        // Auto-close after 1 second
        setTimeout(() => {
            setOpenTooltip(prevState => ({...prevState, [tooltipName]: false}));
        }, 1000);
    };

    React.useEffect(() => {
        setIsFavorite(song.isFavorite?? false);
    }, [song.isFavorite]);

    const handleAddToFavorites = async () => {
        try {
            // Using fetch instead of axios
            const response = await fetch('/api/favorites/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ songId: song.id }),
            });
            
            if (response.ok) {
                setIsFavorite(true);
            } else {
                console.error('Failed to add to favorites');
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    React.useEffect(() => {
        if(user && localStorage.getItem("addSongToFavorites") == song.id){
            handleAddToFavorites();
            localStorage.removeItem("addSongToFavorites");
        }
    } , [user, song.id, localStorage.getItem("addSongToFavorites")]);

    // Get song name and author(s) in either Georgian or Latin based on language
    const displaySongName = language === "eng" 
        ? transliterateWithCapital(song.name)
        : song.name;
    const displayAuthors = language === "eng" 
        ? song.authors.map(author => transliterateWithCapitalizedWords(author))
        : song.authors;

    return (
        <article key={song.id} className={"songItemWrapper"}>
            <div className={styles.songCard}>
                {song.videoLesson && (
                    <Tooltip 
                        title={lang.songCard.videoTooltip}
                        placement="top"
                        open={openTooltip.video}
                        classes={{
                            tooltip: styles.customTooltip,
                            arrow: styles.customArrow,
                        }}
                    >
                        <div 
                            className={styles.videoCornerIcon}
                            onClick={() => handleTooltipOpen('video')}
                        >
                            <OndemandVideoIcon style={{ color: "#9ebeff" }} />
                        </div>
                    </Tooltip>
                )}
                
                <Link href={`/chord/${song.url}`} className={styles.songLink}>
                    <div className={styles.songContent}>
                        <div className={styles.songDetails}>
                            <h2 className={`${styles.songName} capital`}>{displaySongName}</h2>
                            <div className={styles.authors}>
                                {displayAuthors.map(author => (
                                    <h4 key={author} className={styles.author}>{author}</h4>
                                ))}
                            </div>
                        </div>
                    </div>
                </Link>
                
                <div className={styles.songMeta}>
                    <div className={styles.songMetaLeft}>
                        {user && (user?.id == song.analyticId) && (
                            <Link href={`/edit/${song.url}`} className={styles.editButton}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </Link>
                        )}
                        <Favorite song={song} />
                    </div>
                    
                    <div className={styles.songMetaRight}>
                        <Tooltip 
                            title={lang.songCard.difficultyTooltip}
                            placement="top"
                            open={openTooltip.difficulty}
                            classes={{
                                tooltip: styles.customTooltip,
                                arrow: styles.customArrow,
                            }}
                        >
                            <div 
                                onClick={() => handleTooltipOpen('difficulty')}
                            >
                                {renderDifficultyBars(song.difficulty)}
                            </div>
                        </Tooltip>
                        
                        <div className={styles.metaIcons}>
                            <Tooltip 
                                title={lang.songCard.viewsTooltip}
                                placement="top"
                                open={openTooltip.views}
                                classes={{
                                    tooltip: styles.customTooltip,
                                    arrow: styles.customArrow,
                                }}
                            >
                                <div 
                                    className={styles.viewsCountWrapper}
                                    onClick={() => handleTooltipOpen('views')}
                                >
                                    <div className={styles.viewsCount}>
                                        <VisibilityIcon style={{ color: "#fff", marginRight: "5px" }} />
                                        <span>{song.view_count || "0"}</span>
                                    </div>
                                </div>
                            </Tooltip>
                            
                            <Tooltip 
                                title={lang.songCard.likesTooltip}
                                placement="top"
                                open={openTooltip.likes}
                                classes={{
                                    tooltip: styles.customTooltip,
                                    arrow: styles.customArrow,
                                }}
                            >
                                <div 
                                    className={styles.votesSumWrapper}
                                    onClick={() => handleTooltipOpen('likes')}
                                >
                                    <div className={styles.likesCount}>
                                        <ThumbUp style={{ color: "#fff", marginRight: "5px" }} />
                                        <span>{song.voteSum || "0"}</span>
                                    </div>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
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