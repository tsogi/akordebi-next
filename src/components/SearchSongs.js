import React, { useState } from 'react';
import db from '@/services/data';
import styles from "./SearchSongs.module.css";
import lang from '@/services/lang'

const SearchSong = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = async () => {
    let response = await db.searchSongs(searchText);

    if(response.status == "ok") {
        onSearch(response.data);
    } else {
        alert("ძებნისას დაფიქსირდა შეცდომა");
    }

    await db.logEvent("song_search", searchText);

    if(!response.data.length) {
        alert("სამწუხაროდ ვერაფერი მოიძებნა. გთხოვთ დაწეროთ ქართულად და სრულად");
    }
  };

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  function handleInputPress(event){
    if (event.key === 'Enter') {
        handleSearch();
    }
  }

  return (
    <div className={styles.searchContainer}>
      <input type='text' id={styles.test} className={styles.searchInput} label={lang._searchLabel}
        value={searchText}
        placeholder={lang._searchText}
        onChange={handleInputChange}
        onKeyDown={handleInputPress}
      />
      <button onClick={handleSearch} className={styles.searchButton}
      type="submit"> <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M19 19L14.65 14.65" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </button>
    </div>
  );
};

export default SearchSong;