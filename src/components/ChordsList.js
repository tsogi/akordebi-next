import { useEffect, useState } from "react";
import styles from "./ChordsList.module.css";
import SongCard from "./SongCard";
import Paper from '@mui/material/Paper';
import { CardActionArea, MenuItem, Tooltip } from '@mui/material';
import SearchSongs from "./SearchSongs";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export default function ChordsList({ initialSongs }){
    const[songs, setSongs] = useState([]);
    const[filterConfirmed, setFilterConfirmed] = useState(false);
    const[filterLessoned, setFilterLessoned] = useState(false);
    const[sortBy, setSortBy] = useState("");


    useEffect(() => {
        applyFilters();
    }, [filterConfirmed, filterLessoned, sortBy]);

    function applyFilters(){
        let songs = [...initialSongs];

        if(filterConfirmed) {
            songs = songs.filter((song) => { return song.confirmed })
        }

        if(filterLessoned) {
            songs = songs.filter((song) => { return song.videoLesson })
        }

        if (sortBy === "likes") {
            songs = songs.sort((a, b) => b.voteSum - a.voteSum);
        }

        setSongs(songs);
    }

    useEffect(() => {
        setSongs([...initialSongs]);
    }, [initialSongs]);

    function handleConfirmedClick(){
        if(filterConfirmed) {
            setFilterConfirmed(false);
            return;
        } 

        setFilterConfirmed(true);
    }

    function handleSortChange(event) {
        setSortBy(event.target.value);
    }

    function handleLessonedClick(){
        if(filterLessoned) {
            setFilterLessoned(false);
            return;
        }

        setFilterLessoned(true);
    }

    function handleSearchClick(songs){
        setFilterConfirmed(false);
        setFilterLessoned(false);
        setSortBy("");

        // Todo find safer way to make sure setSongs is executed after setFilterConfirmed and setFilterLessoned
        setTimeout(() => {
            setSongs(songs);
        }, 10);
    }

    return <div className={"page_container"}>
        <div className={styles.searchComponent}>
            <SearchSongs onSearch={handleSearchClick} />
        </div>
        <div className={styles.filterSongs}>
            <div className={styles.sortContainer}>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                    <InputLabel id="sort">სორტირება</InputLabel>
                    <Select labelId="sort" label="სორტირება" id="sort" value={sortBy} onChange={handleSortChange}>
                        <MenuItem value="default">ხარისხით</MenuItem>
                        <MenuItem value="likes">პოპულარობით</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className={styles.filterContainer}>
                <Tooltip placement="top" title="მიჩვენე მხოლოდ გაკვეთილით">
                    <div onClick={handleLessonedClick} className={`${styles.filter} ${styles.confirmed} ${filterLessoned ? styles.filterSelected : ""}`}>
                            <OndemandVideoIcon style={{ color: "#9ebeff" }} />
                    </div>
                </Tooltip>
                <Tooltip placement="top" title="მიჩვენე მხოლოდ დამოწმებული">
                    <div onClick={handleConfirmedClick} className={`${styles.filter} ${styles.lesson} ${filterConfirmed ? styles.filterSelected : ""}`}>
                        <TaskAltIcon style={{ color: "#15a894" }} /> 
                    </div>
                </Tooltip>
            </div>
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
