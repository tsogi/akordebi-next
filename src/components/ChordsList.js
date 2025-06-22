import { useEffect, useState } from "react";
import styles from "./ChordsList.module.css";
import SongCard from "./SongCard";
import { Tooltip } from '@mui/material';
import SearchSongs from "./SearchSongs";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Pagination from "./Pagination";
import { useRouter } from 'next/router';
import { HeartIcon } from '@heroicons/react/20/solid';
import { useUser } from "@/utils/useUser";
import CustomSelect from "./CustomSelect";
import UploadSongBtn from "./UploadSongBtn";
import { useLanguage } from '@/context/LanguageContext';
import NotationSwitcher from "./NotationSwitcher";
import { getNotation } from '@/utils/notations';
const resultsPerPage = 20;

export default function ChordsList({ initialSongs }){
    const router = useRouter();
    const { user, setAuthOpenedFrom } = useUser();
    const { lang } = useLanguage();

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
    const[notationFormat, setNotationFormat] = useState(
        router.query.notation ? router.query.notation : "guitar_chord"
    );
    const[sortBy, setSortBy] = useState(
        router.query.sort ? router.query.sort : "likes"
    );
    const[currentPage, setCurrentPage] = useState(
        router.query.page ? Number(router.query.page) : 1
    );
    const[paginationCount, setPaginationCount] = useState(0);

    const handleDeleteSong = (songId) => {
        // Remove the song from both initialSongs and displayedSongs
        initialSongs = initialSongs.filter(song => song.id !== songId);
        setDisplayedSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
        setPaginationCount(prev => prev - 1);
    };

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
    }, [currentPage, sortBy, filterFavorites, filterLessoned, filterConfirmed, notationFormat]);

    useEffect(() => {
        applyFilters();
    }, [initialSongs]);

    function writeParametersToState(){
        const { page: urlPage, sort: urlSort, favorites: urlFavorites,  lessoned: urlLessoned, confirmed: urlConfirmed, notation: urlNotation } = router.query;
        
        if(urlPage) setCurrentPage(Number(urlPage));
        if(urlSort) setSortBy(urlSort);
        if(urlLessoned) setFilterLessoned(urlLessoned === 'true');
        if(urlFavorites) setFilterFavorites(urlFavorites === 'true');
        if(urlConfirmed) setFilterConfirmed(urlConfirmed === 'true');
        if(urlNotation) setNotationFormat(urlNotation);
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
            confirmed: filterConfirmed,
            notation: notationFormat
          }
        }, undefined, { scroll: false });
    }
    
    async function handleNextClick(){
        setCurrentPage(currentPage + 1);
    }

    async function handlePreviousClick(){
        setCurrentPage(currentPage - 1);
    }

    async function handlePageClick(page){
        setCurrentPage(page);
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
        
        if(notationFormat !== "all") {
            songs = songs.filter((song) => { return song.notation_format === notationFormat });
        }

        if (sortBy === "likes") {
            songs = songs.sort((a, b) => b.voteSum - a.voteSum);
        }

        if (sortBy === "difficulty") {
            songs = songs.sort((a, b) => a.difficulty - b.difficulty);
        }
        
        if (sortBy === "views") {
            songs = songs.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
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
    }

    async function handleSortChange(event) {
        let val = event.target.value;
        setSortBy(val);
        setCurrentPage(1);
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
    }

    async function handleLessonedClick(){
        setCurrentPage(1);
        if(filterLessoned) {
            setFilterLessoned(false);
            return;
        }

        setFilterLessoned(true);
    }

    function handleNotationFormatChange(format) {
        setCurrentPage(1);
        setNotationFormat(format);
    }

    return <div className={"page_container"}>
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6 mb-8">
            <div className="w-full md:w-1/2">
                <SearchSongs />
            </div>
            <div className={`${styles.filterSongs} w-full md:w-1/2 flex justify-end`}>
                <div className={styles.sortContainer}>
                    <CustomSelect 
                        options={[
                            // { label: lang._filterQuality, value: "default" }, 
                            { label: lang._filterPopularity, value: "likes" }, 
                            { label: lang._filterDifficulty, value: "difficulty" },
                            { label: lang._filterViews, value: "views" }
                        ]} 
                        value={sortBy} 
                        onChange={handleSortChange} 
                    />
                </div>
                <div className={styles.filterContainer}>
                    <Tooltip placement="top" title={lang._favoriteIconTitle}>
                        <div onClick={handleFavoritesClick} className={`${styles.filter} ${filterFavorites ? styles.filterSelected : ""}`}>
                            <HeartIcon 
                                style={{ fill: "transparent", stroke: "white" }} 
                                className={`w-[22px] h-[22px]`}  
                            />
                        </div>
                    </Tooltip>
                    {/* <Tooltip placement="top" title={lang._videoIconTitle}>
                        <div onClick={handleLessonedClick} className={`${styles.filter} ${filterLessoned ? styles.filterSelected : ""}`}>
                            <OndemandVideoIcon style={{ color: "#9ebeff", fontSize: "22px" }} />
                        </div>
                    </Tooltip> */}
                </div>
            </div>
        </div>
        
        <NotationSwitcher 
            notationFormat={notationFormat}
            onNotationFormatChange={handleNotationFormatChange}
        />
        
        <main className={"songsList"}>
            {
                displayedSongs.map(song => {
                    return <SongCard key={song.id} song={song} onDelete={handleDeleteSong} />
                })
            }
            <aside className={"songItemWrapper"}>
                <UploadSongBtn />
            </aside>
        </main>
        <Pagination 
            currentPage = {currentPage}
            totalResults = {paginationCount}
            resultsPerPage = {resultsPerPage}
            onNextClick = {handleNextClick}
            onPreviousClick = {handlePreviousClick}
            goToPage = {handlePageClick}
            notation = {getNotation(notationFormat)}
        />
        {/* {
            process.env.NEXT_PUBLIC_DOMAIN == "akordebi.ge" ?
            <div className="px-[10px] mt-[40px]">
                <a href={`https://chords365.com`}>
                    <div className={styles.chords365}></div>
                </a>
            </div>
            :
            null
        } */}
        {/* {
            process.env.NEXT_PUBLIC_DOMAIN == "akordebi.ge" ?
            <div className="px-[10px] mt-[40px]">
                <img className="radius-[4px] w-[100%] rounded-[4px] cursor-pointer" src="/ad_place.png" />
            </div>
            :
            null
        } */}
    </div>
}
