import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import SubscriptionPrompt from '@/components/SubscriptionPrompt';

export default function Favorite({ song, size = 'medium', showLabel = false }) {
  const [isFavorite, setIsFavorite] = useState(song.isFavorite ?? false);
  const { user, isPremium, refreshUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    setIsFavorite(song.isFavorite ?? false);
  }, [song.isFavorite]);

  async function shouldShowPrompt() {
    // Refresh user data to get latest favorites count
    const latestUser = await refreshUser();
    
    if(!latestUser) {
      return true;
    }

    if(!isPremium) {
      const favoritesLimit = parseInt(process.env.NEXT_PUBLIC_FAVORITES);
      if(latestUser?.totalFavorites >= favoritesLimit) {
        return true;
      }
    }

    return false;
  }

  async function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();

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
        if (await shouldShowPrompt()) {
          localStorage.setItem("addSongToFavorites", song.id);
          setShowSubscriptionPrompt(true);
          return;
        }

        const response = await fetch('/api/favorites/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ songId: song.id }),
        });

        if (response.ok) {
          setIsFavorite(true);
        } else if (response.status === 403) {
          // Favorites limit reached
          setShowSubscriptionPrompt(true);
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
          authenticatedText={`უფასო ვერსიაში ფავორიტებში შეგიძლიათ დაამატოთ მაქსიმუმ ${process.env.NEXT_PUBLIC_FAVORITES} სიმღერა. შეუზღუდავი ფავორიტებისთვის გაიაქტიურეთ პრემიუმ პაკეტი. ამით ასევე წვლილს შეიტანთ საიტის განვითარებაში`}
          source="favorite"
          inModal={true}
        />
      </div>
    </div>,
    typeof window !== 'undefined' ? document.body : null
  ) : null;

  const buttonClass = showLabel
    ? `w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white text-sm font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`
    : `flex items-center justify-center rounded-full transition-all duration-200 ${
        isFavorite
          ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
      } ${sizeClasses[size]} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`;

  const iconClass = showLabel
    ? "w-4 h-4"
    : isFavorite
      ? `${sizeClasses[size]} text-red-500`
      : `${sizeClasses[size]} text-gray-400`;

  // Simplified label rendering
  const label = showLabel
    ? (
        <span>
          {isFavorite
            ? (lang.favorites.remove || "ამოშლა")
            : (lang.favorites.add || "შენახვა")}
        </span>
      )
    : null;

  return (
    <>
      <button
        onClick={handleFavoriteClick}
        className={buttonClass}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        disabled={isLoading}
      >
        {isFavorite
          ? <HeartIcon className={iconClass} />
          : <HeartOutline className={iconClass} />}
        {label}
      </button>
      {modal}
    </>
  );
}