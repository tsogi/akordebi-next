import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import SubscriptionPrompt from '@/components/SubscriptionPrompt';

export default function Favorite({ song, size = 'medium', showLabel = false }) {
  const [isFavorite, setIsFavorite] = useState(song.isFavorite ?? false);
  const { user, isPremium } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    setIsFavorite(song.isFavorite ?? false);
  }, [song.isFavorite]);

  async function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      localStorage.setItem("addSongToFavorites", song.id);
      setShowSubscriptionPrompt(true);
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
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10'
  };

  // Modal portal
  const modal = showSubscriptionPrompt ? createPortal(
    <div 
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center"
      onClick={() => setShowSubscriptionPrompt(false)}
    >
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4" 
        onClick={(e) => e.stopPropagation()}
      >
        <SubscriptionPrompt 
          unauthenticatedText="ფავორიტებში დასამატებლად გაიარეთ მარტივი ავტორიზაცია 1 კლიკით"
          authenticatedText="დააჭირეთ გადახდას და მიყევით ბანკის ინსტრუქციას"
          source="favorite"
          inModal={true}
        />
      </div>
    </div>,
    typeof window !== 'undefined' ? document.body : null
  ) : null;

  if (showLabel) {
    return (
      <>
        <button 
          onClick={handleFavoriteClick} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          disabled={isLoading}
        >
          {isFavorite ? (
            <>
              <HeartIcon className={`${sizeClasses[size]} text-red-500`} />
              <span>{lang.favorites.remove || "ფავორიტებიდან ამოშლა"}</span>
            </>
          ) : (
            <>
              <HeartOutline className={`${sizeClasses[size]} text-gray-400`} />
              <span>{lang.favorites.add || "ფავორიტებში დამატება"}</span>
            </>
          )}
        </button>
        {modal}
      </>
    );
  }

  return (
    <>
      <button 
        onClick={handleFavoriteClick} 
        className={`flex items-center justify-center rounded-full transition-all duration-200 ${
          isFavorite 
            ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
        } ${sizeClasses[size]} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        disabled={isLoading}
      >
        {isFavorite ? (
          <HeartIcon className={`${sizeClasses[size]} text-red-500`} />
        ) : (
          <HeartOutline className={`${sizeClasses[size]} text-gray-400`} />
        )}
      </button>
      {modal}
    </>
  );
}