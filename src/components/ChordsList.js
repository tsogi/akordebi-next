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
import Pagination from "./Pagination";

const resultsPerPage = 20;

export default function ChordsList({ initialSongs }){
    const[displayedSongs, setDisplayedSongs] = useState([]);
    const[filterConfirmed, setFilterConfirmed] = useState(false);
    const[filterLessoned, setFilterLessoned] = useState(false);
    const[sortBy, setSortBy] = useState("");
    const[currentPage, setCurrentPage] = useState(1);
    const[paginationCount, setPaginationCount] = useState(0);

    function handleNextClick(){
        setCurrentPage(currentPage + 1);
    }

    function handlePreviousClick(){
        setCurrentPage(currentPage - 1);
    }

    function handlePageClick(page){
        setCurrentPage(page);
    }

    useEffect(() => {
        applyFilters();
    }, [filterConfirmed, filterLessoned, sortBy, currentPage]);

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

        setPaginationCount(songs.length);

        songs = getSongsOnPage(songs, currentPage);

        setDisplayedSongs(songs);
    }

    function getSongsOnPage(songs, currentPage) {
        let startIndex = 0;
        let endIndex = resultsPerPage;

        if (currentPage > 1 && Number.isInteger(currentPage)) {
            startIndex = (currentPage - 1) * resultsPerPage;
            endIndex = currentPage * resultsPerPage;
        }
        let ret = songs.slice(startIndex, endIndex);

        return ret;
    }

    useEffect(() => {
        applyFilters();
    }, [initialSongs]);

    function handleConfirmedClick(){
        setCurrentPage(1);
        if(filterConfirmed) {
            setFilterConfirmed(false);
            return;
        } 

        setFilterConfirmed(true);
    }

    function handleSortChange(event) {
        setSortBy(event.target.value);
        setCurrentPage(1);
    }

    function handleLessonedClick(){
        setCurrentPage(1);
        if(filterLessoned) {
            setFilterLessoned(false);
            return;
        }

        setFilterLessoned(true);
    }

    function handleSearchClick(songs){
        setCurrentPage(1);
        setFilterConfirmed(false);
        setFilterLessoned(false);
        setSortBy("");

        // Todo find safer way to make sure setAllSongs is executed after setFilterConfirmed and setFilterLessoned
        setTimeout(() => {
            initialSongs = songs;
            applyFilters();
            // setDisplayedSongs(songs);
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
                displayedSongs.map(song => {
                    return <SongCard key={song.id} song={song} />
                })
            }
        </main>
        <Pagination 
            currentPage = {currentPage}
            totalResults = {paginationCount}
            resultsPerPage = {resultsPerPage}
            onNextClick = {handleNextClick}
            onPreviousClick = {handlePreviousClick}
            goToPage = {handlePageClick}
        />
    </div>
}
