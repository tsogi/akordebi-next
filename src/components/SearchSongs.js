import React, { useState } from 'react';
import db from '@/services/data';
import styles from "./SearchSongs.module.css";
import lang from '@/services/lang'

const SearchSong = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    
    setIsSearching(true);
    try {
      let response = await db.searchSongs(searchText);

      if(response.status === "ok") {
        onSearch(response.data);
      } else {
        alert(lang._search_error);
      }

      if(!response.data.length) {
        alert(lang._nothing_found);
      }
    } catch (error) {
      console.error("Search error:", error);
      alert(lang._search_error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleInputPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchIconWrapper}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" 
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <input 
        type="text"
        className={styles.searchInput}
        value={searchText}
        placeholder={lang._searchText}
        onChange={handleInputChange}
        onKeyDown={handleInputPress}
        aria-label={lang._searchLabel}
      />
      <button 
        onClick={handleSearch}
        className={styles.searchButton}
        disabled={isSearching}
        type="button"
        aria-label="Search"
      >
        {lang._search}
      </button>
    </div>
  );
};

export default SearchSong;