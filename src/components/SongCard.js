import * as React from 'react';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Badge from '@mui/material/Badge';
import { ThumbUp } from '@mui/icons-material';
import styles from "./SongCard.module.css";
import { useUser } from '@/utils/useUser';
import Link from 'next/link';
import Favorite from "./Favorite";
import { useLanguage } from '@/context/LanguageContext';

// Georgian to Latin transliteration mapping
const georgianToLatinMap = {
    'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z', 
    'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 
    'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u', 'ფ': 'p', 
    'ქ': 'k', 'ღ': 'gh', 'ყ': 'q', 'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 
    'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
};

// Function to convert Georgian text to Latin
const convertGeorgianToLatin = (text) => {
    if (!text) return '';
    
    return Array.from(text).map(char => {
        // Convert both lowercase and uppercase Georgian letters
        const lowerChar = char.toLowerCase();
        const latinChar = georgianToLatinMap[lowerChar];
        
        // If the character exists in our map, convert it
        // Otherwise, keep the original character
        if (latinChar) {
            // Preserve original case if possible
            return char === lowerChar ? latinChar : latinChar.toUpperCase();
        }
        return char;
    }).join('');
};

export default function SongCard({ song }){
    const { language } = useLanguage();
    const { user, setAuthOpenedFrom } = useUser();
    const [isFavorite, setIsFavorite] = React.useState(song.isFavorite?? false);

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
    const displaySongName = language === "eng" ? convertGeorgianToLatin(song.name) : song.name;
    const displayAuthors = language === "eng" 
        ? song.authors.map(author => convertGeorgianToLatin(author))
        : song.authors;

    return (
        <article key={song.id} className={"songItemWrapper"}>
            <div className={styles.songCard}>
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
                        {renderDifficultyBars(song.difficulty)}
                        
                        <div className={styles.metaIcons}>
                            {song.videoLesson && (
                                <div className={styles.videoLessonIcon}>
                                    <OndemandVideoIcon style={{ color: "#9ebeff" }} />
                                </div>
                            )}
                            
                            <div className={styles.votesSumWrapper}>
                                <div className={styles.likesCount}>
                                    <ThumbUp style={{ color: "#fff", marginRight: "5px" }} />
                                    <span>{song.voteSum || "0"}</span>
                                </div>
                            </div>
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