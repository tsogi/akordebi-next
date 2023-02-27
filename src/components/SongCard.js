import * as React from 'react';
import Paper from '@mui/material/Paper';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { CardActionArea, Tooltip } from '@mui/material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Badge from '@mui/material/Badge';
import { ThumbUp } from '@mui/icons-material';
import styles from "./SongCard.module.css";

export default function SongCard({ song }){
    return <div key={song.id} className={"songItemWrapper"}>
            <a className={styles.songLink} href={`/song/${song.id}`}>
                <Paper elevation={2} style={{ height: "100%" }}>
                    <CardActionArea style={{ height: "100%" }}>
                <div className={styles.songItem}>
                    <div className={styles.songDetails}>
                        <div style={{ padding: "15px" }} className={`${styles.songName} capital`}>{ song.name }</div>
                        <div className={styles.authors}>
                            {
                                song.authors.map(author => {
                                    return <div key={author} className={styles.author}>
                                        {
                                            author
                                        }
                                    </div>
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
                        <Tooltip style={{ color: "#15a894" }} placement="top" title="ვიდეო გაკვეთილი">
                            <OndemandVideoIcon style={{ color: "#9ebeff" }} />
                        </Tooltip>
                    </div>
                    :
                    null
                }
                {
                    song.confirmed ?
                    <div className={styles.confirmedIcon}>
                        <Tooltip style={{ color: "#15a894" }} placement="top" title="სისწორე დადასტურებულია">
                            <TaskAltIcon /> 
                        </Tooltip>
                    </div>
                    :
                    null
                }
                </div>
            </div>
        </div>
}