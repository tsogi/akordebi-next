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
import { formatCount } from '@/utils/formatCount';
import DeleteSongButton from './DeleteSongButton';
import EditSongButton from './EditSongButton';

export default function SongCard({ song, onDelete }){
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
                
                <Link href={`/resource/${song.notation_format}/${song.url}`} className={styles.songLink}>
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
                        <EditSongButton 
                            song={song} 
                            className={styles.editButton}
                        />
                        <DeleteSongButton 
                            song={song} 
                            onDelete={onDelete} 
                            className={styles.editButton}
                        />
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
                                        <span>{formatCount(song.view_count) || "0"}</span>
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