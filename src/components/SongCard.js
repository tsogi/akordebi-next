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
                <div className={`${styles.songMetaLeft} flex items-end`}>
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

function renderDifficulty(difficulty) {
    if (![1, 2, 3, 4, 5].includes(difficulty)) {
        return null;
    }

    let difficultyStyle = {};
    let transform = '';
    switch (difficulty) {
        case 1:
            difficultyStyle = {
                background: 'linear-gradient(30deg, #85CB9E 0%, #85CB9E 25%, #cecaca 25%, #cecaca 100%)',
            };
            transform = 'rotate(-60deg)';
            break;
        case 2:
            difficultyStyle = {
                background: 'linear-gradient(60deg, #FECE0C 0%, #FECE0C 37.5%, #cecaca 37.5%, #cecaca 100%)',
            };
            transform = 'rotate(-30deg)';
            break;
        case 3:
            difficultyStyle = {
                background: 'linear-gradient(90deg, blue 0%, blue 50%, #cecaca 50%, #cecaca 100%)',
            };
            transform = 'rotate(0deg)';
            break;
        case 4:
            difficultyStyle = {
                background: 'linear-gradient(120deg, orange 0%, orange 62.5%, #cecaca 62.5%, #cecaca 100%)',
            };
            transform = 'rotate(30deg)';
            break;
        case 5:
            difficultyStyle = {
                background: '#F05549',
            };
            transform = 'rotate(90deg)';
            break;
        default:
            break;
    }

    return (
        <div style={difficultyStyle} className='difficultyIcon'>
            <div style={{ transform }} className='bar' />
        </div>
    );
}
