import { useEffect, useState } from "react";
import styles from "./ChordsList.module.css";
import SongCard from "./SongCard";
import { Tooltip } from '@mui/material';
import SearchSongs from "./SearchSongs";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Pagination from "./Pagination";
import { useRouter } from 'next/router';
import db from '@/services/data';
import lang from '@/services/lang'
import { HeartIcon } from '@heroicons/react/20/solid';
import { useUser } from "@/utils/useUser";

const resultsPerPage = 20;

export default function ChordsList({ initialSongs }){
    const router = useRouter();
    const { user, setAuthOpenedFrom } = useUser();

    const[displayedSongs, setDisplayedSongs] = useState([]);
    const[filterConfirmed, setFilterConfirmed] = useState(
        router.query.confirmed ? router.query.confirmed : false
    );
    const[filterFavorites, setFilterFavorites] = useState(
        router.query.favorites ? router.query.favorites : false
    );
    const[filterLessoned, setFilterLessoned] = useState(
        router.query.lessoned ? router.query.lessoned : false
    );
    const[sortBy, setSortBy] = useState(
        router.query.sort ? router.query.sort : "default"
    );
    const[currentPage, setCurrentPage] = useState(
        router.query.page ? Number(router.query.page) : 1
    );
    const[paginationCount, setPaginationCount] = useState(0);

        
    // async function handleYamahaClick(){
    //     try {
    //     let msg = `akordebi.ge: yamaha banner clicked`;

    //     const response = await fetch("/api/sendSlack", {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ message: msg })
    //     });

    //     alert("სამწუხაროდ მარაგი ამოწურულია. გთხოვთ შეამოწმოთ რამდენიმე დღეში");

    //     } catch(error){

    //     }
    // }

    useEffect(() => {
        writeParametersToState();
    }, []);

    useEffect(() => {
        applyFilters();
        updateUrlParameters();
    }, [currentPage, sortBy, filterFavorites, filterLessoned, filterConfirmed]);

    useEffect(() => {
        applyFilters();
    }, [initialSongs]);

    function writeParametersToState(){
        const { page: urlPage, sort: urlSort, favorites: urlFavorites,  lessoned: urlLessoned, confirmed: urlConfirmed } = router.query;
        
        if(urlPage) setCurrentPage(Number(urlPage));
        if(urlSort) setSortBy(urlSort);
        if(urlLessoned) setFilterLessoned(urlLessoned === 'true');
        if(urlFavorites) setFilterFavorites(urlFavorites === 'true');
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
            favorites: filterFavorites,
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

        if(filterFavorites) {
            songs = songs.filter((song) => { return song.isFavorite })
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

    async function handleFavoritesClick(){
        if(!user){
            setAuthOpenedFrom('favoritesFilter');
            return;
        }

        setCurrentPage(1);
        if(filterFavorites) {
            setFilterFavorites(false);
            return;
        }

        setFilterFavorites(true);

        await db.logEvent("filter", "favorites");
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
        setFilterFavorites(false);
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
                        <option value="default">{lang._filterQuality}</option>
                        <option value="likes">{lang._filterPopularity}</option>
                        <option value="difficulty">{lang._filterDifficulty}</option>
                    </select>
                </div>
                <div className={styles.filterContainer}>
                    {
                        ["dev.akordebi.ge", "akordebi.ge"].includes(process.env.NEXT_PUBLIC_DOMAIN) ?
                        <Tooltip placement="top" title={lang._favoriteIconTitle}>
                            <div onClick={handleFavoritesClick} className={`${styles.filter} ${styles.favorites} ${filterFavorites ? styles.filterSelected : ""}`}>
                                <HeartIcon 
                                    style={{ fill: "transparent", stroke: "white" }} 
                                    className={`w-[26px] h-[26px]`}  
                                />
                            </div>
                        </Tooltip>
                        : 
                        null
                    }
                    <Tooltip placement="top" title={lang._videoIconTitle}>
                        <div onClick={handleLessonedClick} className={`${styles.filter} ${styles.confirmed} ${filterLessoned ? styles.filterSelected : ""}`}>
                            <OndemandVideoIcon style={{ color: "#9ebeff" }} />
                        </div>
                    </Tooltip>
                    <Tooltip placement="top" title={lang._verifyIconTitle}>
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
                             <div style={{ padding: "15px" }} className={`${styles.songName} capital`}>{lang._uploadSong}</div>
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
        {/* <div className="px-[10px] mt-[40px]">
            <img onClick={handleYamahaClick} className="radius-[4px] cursor-pointer" src="/yamaha_C40II.png" />
        </div> */}
    </div>
}