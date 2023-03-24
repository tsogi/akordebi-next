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
                <Paper elevation={2} style={{ height: "100%" }}>
                    <CardActionArea style={{ height: "100%" }}>
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
                </CardActionArea>
                </Paper>
            </a>
            <div className={styles.songMeta}>
                <div className={styles.songMetaLeft}>
                    <div className={styles.votesSumWrapper}>
                        <Badge anchorOrigin={{ vertical: 'top', horizontal: 'right', }} badgeContent={song.voteSum || "0"}  style={{ color: "#9ebeff" }}>
                            <ThumbUp style={{ color: "#9ebeff" }} />
                        </Badge>
                    </div>
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