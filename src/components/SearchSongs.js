import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import db from '@/services/data';
import styles from "./SearchSongs.module.css";

const SearchSong = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = async () => {
    let response = await db.searchSongs(searchText);

    if(response.status == "ok") {
        onSearch(response.data);
    } else {
        alert("ძებნისას დაფიქსირდა შეცდომა");
    }

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
      <TextField
        className={styles.searchInput}
        style={{ width: "75%" }}
        label="აკორდების ძებნა"
        variant="outlined"
        value={searchText}
        placeholder="ჩაწერეთ სიმღერის ან ავტორის სახელი"
        onChange={handleInputChange}
        onKeyDown={handleInputPress}
      />
      <Button
        style={{ width: "25%" }}
        className={styles.searchButton} variant="outlined" color="primary" onClick={handleSearch}>
        მოძებნა
      </Button>
    </div>
  );
};

export default SearchSong;