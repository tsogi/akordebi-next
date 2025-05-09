import { useLanguage } from '@/context/LanguageContext';
import { transliterateWithCapital, transliterateWithCapitalizedWords } from '@/utils/transliteration';
import Link from 'next/link';
import styles from './RelatedSongs.module.css';

export default function RelatedSongs({ songs }) {
  const { language, lang } = useLanguage();

  if (!songs || songs.length === 0) {
    return null;
  }

  // Function to format view counts with proper formatting (e.g., 1000 -> 1K)
  const formatViewCount = (count) => {
    if (!count) return 0;
    
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`.replace('.0K', 'K');
    }
    
    return count;
  };

  return (
    <div className={styles.relatedSongsContainer}>
      <h3 className={styles.relatedSongsTitle}>{lang.chord.relatedSongs || 'Related Songs'}</h3>
      <div className={styles.scrollContainer}>
        {songs.map((song) => {
          if (!song || !song.name) return null;

          const displaySongName = language === "eng" 
            ? transliterateWithCapital(song?.name)
            : song?.name;
          
          const displayAuthors = language === "eng" && song?.authors && song.authors.length > 0
            ? song.authors.map(author => transliterateWithCapitalizedWords(author))
            : song?.authors;

          return (
            <Link href={`/chord/${song.url}`} key={song.id} className={styles.songCard}>
              <div className={styles.songCardInner}>
                <h4 className={styles.songName}>{displaySongName}</h4>
                {displayAuthors && displayAuthors.length > 0 && (
                  <div className={styles.songAuthors}>
                    {displayAuthors.map((author, index) => (
                      <span key={index} className={styles.songAuthor}>
                        {author}
                        {index < displayAuthors.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
                <div className={styles.songMeta}>
                  <span className={styles.viewCount} title={lang.songCard.viewsTooltip || "Views"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.viewIcon}>
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                    </svg>
                    {formatViewCount(song.view_count)}
                  </span>

                  {song.videoLesson && (
                    <span className={styles.videoLesson} title={lang.songCard.videoTooltip || "Video tutorial"}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}

                  {song.confirmed && (
                    <span className={styles.confirmed} title={lang.songCard.verifiedTooltip || "Verified"}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 