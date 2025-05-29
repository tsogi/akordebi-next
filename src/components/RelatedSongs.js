import { useLanguage } from '@/context/LanguageContext';
import { transliterateWithCapital, transliterateWithCapitalizedWords } from '@/utils/transliteration';
import { formatCount } from '@/utils/formatCount';
import Link from 'next/link';
import styles from './RelatedSongs.module.css';

export default function RelatedSongs({ songs }) {
  const { language, lang } = useLanguage();

  if (!songs || songs.length === 0) {
    return null;
  }

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
                    {formatCount(song.view_count)}
                  </span>

                  {song.vote_sum > 0 && (
                    <span className={styles.likes} title={lang.songCard.likesTooltip || "Likes"}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
                        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                      </svg>
                      {formatCount(song.vote_sum)}
                    </span>
                  )}

                  {song.videoLesson && (
                    <span className={styles.videoLesson} title={lang.songCard.videoTooltip || "Video tutorial"}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
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