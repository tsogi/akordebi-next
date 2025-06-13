import React, { useState, useRef, useEffect } from 'react';
import db from '@/services/data';
import { useLanguage } from '@/context/LanguageContext';
import { getNotation } from '../utils/notations';

const SearchSong = () => {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { lang } = useLanguage();
  const searchRef = useRef(null);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    try {
      let response = await db.searchSongs(searchText);

      if(response.status === "ok") {
        setSearchResults(response.data);
        setShowResults(true);
      } else {
        alert(lang._search_error);
        setShowResults(false);
      }

      if(!response.data.length) {
        setShowResults(true); // Still show modal but with no results message
      }
    } catch (error) {
      console.error("Search error:", error);
      alert(lang._search_error);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    
    // If input is empty, hide results
    if (!value.trim()) {
      setShowResults(false);
    }
  };

  const handleInputPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleResultClick = (song) => {
    const notation = getNotation(song.notation_format);
    if (notation) {
      const url = `/resource/${notation.code}/${song.url}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div ref={searchRef} className="relative w-full px-[10px]">
      <div className="flex items-center bg-gray-800 rounded-lg border border-gray-600 focus-within:border-blue-500 transition-colors">
        <div className="flex items-center justify-center px-3 py-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" 
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <input 
          type="text"
          className="flex-1 px-2 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm min-w-0"
          value={searchText}
          placeholder={lang._searchText}
          onChange={handleInputChange}
          onKeyDown={handleInputPress}
          aria-label={lang._searchLabel}
        />
        <button 
          onClick={handleSearch}
          className="px-3 py-3 text-blue-400 hover:text-blue-300 disabled:text-gray-500 transition-colors text-sm font-medium flex-shrink-0"
          disabled={isSearching}
          type="button"
          aria-label="Search"
        >
          {isSearching ? '...' : lang._search}
        </button>
      </div>

      {/* Search Results Modal */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto mx-[10px]">
          {searchResults.length > 0 ? (
            <>
              <div className="px-3 py-2 border-b border-gray-600">
                <h3 className="text-xs font-medium text-gray-300">
                  {lang.searchModal?.searchResults || 'Search Results'} ({searchResults.length})
                </h3>
              </div>
              <div className="py-1">
                {searchResults.map((song) => {
                  const notation = getNotation(song.notation_format);
                  return (
                    <div
                      key={`${song.id}-${song.notation_format}`}
                      onClick={() => handleResultClick(song)}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="text-white font-medium text-sm truncate">
                          {song.name}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="text-blue-400 truncate">
                            {notation?.page_title || song.notation_format}
                          </div>
                          {song.authors?.length > 0 && (
                            <div className="text-gray-400 ml-2 truncate">
                              {song.authors.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="px-3 py-4 text-center mx-[10px]">
              <div className="text-gray-400 text-sm">
                {lang.searchModal?.noResults || 'No results found'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSong;