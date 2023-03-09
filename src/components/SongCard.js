import * as React from 'react';
import Paper from '@mui/material/Paper';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { CardActionArea, Tooltip } from '@mui/material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Badge from '@mui/material/Badge';
import { ThumbUp } from '@mui/icons-material';
import styles from "./SongCard.module.css";

export default function SongCard({ song }){
    function generateChordUrl(song){
        let name = song.name.replaceAll(" ", "-");

        let authorsUrl = "";
        for(let author of song.authors) {
            authorsUrl += author + "~";
        }

        if(authorsUrl) { authorsUrl = authorsUrl.slice(0, -1); }
        
        authorsUrl = authorsUrl.replaceAll(" ", "-");

        let url = `${name}_${authorsUrl}`;
        if(url[url.length - 1] == "_") {
            url = url.slice(0, -1);
        }

        return url;
    }

    return <article key={song.id} className={"songItemWrapper"}>
            <a className={styles.songLink} href={`/chord/${generateChordUrl(song)}`}>
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
        </article>
}