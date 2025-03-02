import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import styles from './Favorite.module.css';
import { useUser } from '@/utils/useUser';
import { supabase } from '@/utils/supabase-client';

export default function Favorite({ song, size = 'medium' }) {
  const [isFavorite, setIsFavorite] = useState(song.isFavorite ?? false);
  const { user, setAuthOpenedFrom } = useUser();
  const [isLoading, setIsLoading] = useState(false);

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
        await supabase
          .from('favorites')
          .delete()
          .eq('song_id', song.id)
          .eq('user_id', user.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert([{ song_id: song.id, user_id: user.id }]);
        setIsFavorite(true);
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