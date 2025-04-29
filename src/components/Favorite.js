import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import styles from './Favorite.module.css';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';

export default function Favorite({ song, size = 'medium', showLabel = false }) {
  const [isFavorite, setIsFavorite] = useState(song.isFavorite ?? false);
  const { user, setAuthOpenedFrom } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    setIsFavorite(song.isFavorite ?? false);
  }, [song.isFavorite]);

  async function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setAuthOpenedFrom('favorite');
      localStorage.setItem("addSongToFavorites", song.id);
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        const response = await fetch('/api/favorites/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ songId: song.id }),
        });
        
        if (response.ok) {
          setIsFavorite(false);
        }
      } else {
        const response = await fetch('/api/favorites/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ songId: song.id }),
        });
        
        if (response.ok) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const sizeClasses = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large
  };

  if (showLabel) {
    return (
      <button 
        onClick={handleFavoriteClick} 
        className={`${styles.favoriteButtonWithLabel} ${isFavorite ? styles.active : ''} ${isLoading ? styles.loading : ''}`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        disabled={isLoading}
      >
        {isFavorite ? (
          <>
            <HeartIcon className={styles.favoriteIcon} />
            <span>{lang.favorites.remove || "ფავორიტებიდან ამოშლა"}</span>
          </>
        ) : (
          <>
            <HeartOutline className={styles.favoriteIcon} />
            <span>{lang.favorites.add || "ფავორიტებში დამატება"}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button 
      onClick={handleFavoriteClick} 
      className={`${styles.favoriteButton} ${sizeClasses[size]} ${isFavorite ? styles.active : ''} ${isLoading ? styles.loading : ''}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      disabled={isLoading}
    >
      {isFavorite ? (
        <HeartIcon className={styles.favoriteIcon} />
      ) : (
        <HeartOutline className={styles.favoriteIcon} />
      )}
    </button>
  );
}