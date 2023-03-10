import { useEffect, useState } from "react";
import styles from "./ChordsList.module.css";
import SongCard from "./SongCard";
import Paper from '@mui/material/Paper';
import { CardActionArea } from '@mui/material';
import SearchSongs from "./SearchSongs";

export default function ChordsList({ initialSongs }){
    const[songs, setSongs] = useState([]);

    useEffect(() => {
        setSongs(initialSongs);
    }, [initialSongs]);

    return <div className={"page_container"}>
        <div className={styles.searchComponent}>
            <SearchSongs onSearch={setSongs} />
        </div>
        <main className={"songsList"}>
            <aside className={"songItemWrapper"}>
                <a className={styles.songLink} href={`/createSong`}>
                    <Paper elevation={2} style={{ height: "100%" }}>
                        <CardActionArea style={{ height: "100%" }}>
                    <div className={styles.songItem}>
                        <div className={styles.songDetails}>
                            <div style={{ padding: "15px" }} className={`${styles.songName} capital`}>სიმღერის ატვირთვა</div>
                        </div>
                    </div>
                    </CardActionArea>
                    </Paper>
                </a>
            </aside>
            {
                songs.map(song => {
                    return <SongCard key={song.id} song={song} />
                })
            }
        </main>
    </div>
}
