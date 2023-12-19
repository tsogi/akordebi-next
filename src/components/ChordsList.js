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
import { useRouter } from 'next/router';
import db from '@/services/data';

const resultsPerPage = 20;

export default function ChordsList({ initialSongs }){
    const[displayedSongs, setDisplayedSongs] = useState([]);
    const[filterConfirmed, setFilterConfirmed] = useState(false);
    const[filterLessoned, setFilterLessoned] = useState(false);
    const[sortBy, setSortBy] = useState("default");
    // Todo if you go to page 3 unauthorised, click favorite and login, it will put page 1 in url page parameter
    const[currentPage, setCurrentPage] = useState(1);
    const[paginationCount, setPaginationCount] = useState(0);

    const router = useRouter();
        
    async function handleYamahaClick(){
        try {
        let msg = `akordebi.ge: yamaha banner clicked`;

        const response = await fetch("/api/sendSlack", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: msg })
        });

        alert("სამწუხაროდ მარაგი ამოწურულია. გთხოვთ შეამოწმოთ რამდენიმე დღეში");

        } catch(error){

        }
    }

    useEffect(() => {
        writeParametersToState();
    }, []);

    useEffect(() => {
        applyFilters();
        updateUrlParameters();
    }, [currentPage, sortBy, filterLessoned, filterConfirmed]);

    useEffect(() => {
        applyFilters();
    }, [initialSongs]);

    function writeParametersToState(){
        const { page: urlPage, sort: urlSort, lessoned: urlLessoned, confirmed: urlConfirmed } = router.query;
        
        if(urlPage) setCurrentPage(Number(urlPage));
        if(urlSort) setSortBy(urlSort);
        if(urlLessoned) setFilterLessoned(urlLessoned === 'true');
        if(urlConfirmed) setFilterConfirmed(urlConfirmed === 'true');
    }
    
    function updateUrlParameters(){
        router.replace({
          pathname: router.pathname,
          query: {
            ...router.query,
            page: currentPage,
            sort: sortBy,
            lessoned: filterLessoned,
            confirmed: filterConfirmed
          }
        }, undefined, { scroll: false });
    }
    
    async function handleNextClick(){
        setCurrentPage(currentPage + 1);

        await db.logEvent("page_click", "next");
    }

    async function handlePreviousClick(){
        setCurrentPage(currentPage - 1);

        await db.logEvent("page_click", "previous");
    }

    async function handlePageClick(page){
        setCurrentPage(page);

        await db.logEvent("page_click", page);
    }

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

        if (sortBy === "difficulty") {
            songs = songs.sort((a, b) => a.difficulty - b.difficulty);
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

    async function handleConfirmedClick(){
        setCurrentPage(1);
        if(filterConfirmed) {
            setFilterConfirmed(false);
            return;
        } 

        setFilterConfirmed(true);

        await db.logEvent("filter", "confirmed");
    }

    async function handleSortChange(event) {
        let val = event.target.value;
        setSortBy(val);
        setCurrentPage(1);

        await db.logEvent("filter", val);
    }

    async function handleLessonedClick(){
        setCurrentPage(1);
        if(filterLessoned) {
            setFilterLessoned(false);
            return;
        }

        setFilterLessoned(true);

        await db.logEvent("filter", "lessoned");
    }

    function handleSearchClick(songs){
        setCurrentPage(1);
        setFilterConfirmed(false);
        setFilterLessoned(false);
        setSortBy("default");

        // Todo find safer way to make sure setAllSongs is executed after setFilterConfirmed and setFilterLessoned
        setTimeout(() => {
            initialSongs = songs;
            applyFilters();
        }, 10);
    }

    return <div className={"page_container"}>
        <div className="flex justify-between flex-wrap filterAndSearch">
            <div className={`${styles.searchComponent} searchWrapper`}>
                <SearchSongs onSearch={handleSearchClick} />
            </div>
            <div className={`${styles.filterSongs} filtersWrapper`}>
                <div className={styles.sortContainer}>
                    <select className={`${styles.selectSort} text-[14px]`} value={sortBy} onChange={handleSortChange}>
                        <option value="default">ხარისხით</option>
                        <option value="likes">პოპულარობით</option>
                        <option value="difficulty">სირთულით</option>
                    </select>
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
        </div>
        <main className={"songsList"}>
            {
                displayedSongs.map(song => {
                    return <SongCard key={song.id} song={song} />
                })
            }
            <aside className={"songItemWrapper"}>
                <a className={styles.songLink} href={`/createSong`}>
                    <div className={styles.songItem}>
                        <div className={styles.songDetails}>
                            <div style={{ padding: "15px" }} className={`${styles.songName} capital`}>სიმღერის ატვირთვა</div>
                        </div>
                    </div>
                </a>
            </aside>
        </main>
        <Pagination 
            currentPage = {currentPage}
            totalResults = {paginationCount}
            resultsPerPage = {resultsPerPage}
            onNextClick = {handleNextClick}
            onPreviousClick = {handlePreviousClick}
            goToPage = {handlePageClick}
        />
        <div className="px-[10px] mt-[40px]">
            <img onClick={handleYamahaClick} className="radius-[4px] cursor-pointer" src="/yamaha_C40II.png" />
        </div>
    </div>
}