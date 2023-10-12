import * as React from 'react';
import Paper from '@mui/material/Paper';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { CardActionArea } from '@mui/material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Badge from '@mui/material/Badge';
import { ThumbUp } from '@mui/icons-material';
import styles from "./SongCard.module.css";

export default function SongCard({ song }){
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
                <div className={`${styles.songMetaLeft} flex`}>
                    <div className={styles.votesSumWrapper}>
                        <Badge anchorOrigin={{ vertical: 'top', horizontal: 'right', }} badgeContent={song.voteSum || "0"}  style={{ color: "#9ebeff" }}>
                            <ThumbUp style={{ color: "#9ebeff" }} />
                        </Badge>
                    </div>
                    { renderDifficulty(song.difficulty) }
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

function renderDifficulty(difficulty){
    if(![1,2,3].includes(difficulty)) {
        return null;
    }

    let difCol = "green";

    return <div className='difficulty flex opacity-[0.9]'>
        <div className='w-px bg-[#39466f] ml-4 mr-2'></div>
        <svg xmlns="http://www.w3.org/2000/svg" fill={difficulty >= 1 ? difCol : "transparent"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="green" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill={difficulty >= 2 ? difCol : "transparent"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="green" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill={difficulty >= 3 ? difCol : "transparent"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="green" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
    </div>
}