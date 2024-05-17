import * as React from 'react';
import styles from "./SongCard.module.css";
import { useUser } from '@/utils/useUser';
import { HeartIcon } from '@heroicons/react/20/solid';

export default function Favorite({ song }) {
    const { user, setAuthOpenedFrom } = useUser();
    const [isFavorite, setIsFavorite] = React.useState(song.isFavorite ?? false);

    React.useEffect(() => {
        setIsFavorite(song.isFavorite ?? false);
    }, [song.isFavorite]);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const favoriteSongId = localStorage.getItem("addSongToFavorites");
            if (user && favoriteSongId == song.id) {
                handleAddToFavorites();
                localStorage.removeItem("addSongToFavorites");
            }
        }
    }, [user, song.id]);

    const handleFavoriteClick = async () => {
        if (!user) {
            if (typeof window !== 'undefined') {
                localStorage.setItem("addSongToFavorites", song.id);
                setAuthOpenedFrom('favorites');
            }
            return;
        }
        if (isFavorite) {
            try {
                await handleRemoveFromFavorites();
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                await handleAddToFavorites();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleAddToFavorites = async () => {
        await fetch("/api/favorites/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ songId: song.id })
        });
        setIsFavorite(true);
    };

    const handleRemoveFromFavorites = async () => {
        await fetch("/api/favorites/remove", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ songId: song.id })
        });
        setIsFavorite(false);
    };

    return (
        <div className={`${styles.songMetaLeft} flex items-center`}>
            <FavoriteIcon isFavorite={isFavorite} onClick={handleFavoriteClick} />
        </div>
    );
}

function FavoriteIcon({ isFavorite, onClick }) {
    return (
        <HeartIcon
            style={{ fill: isFavorite ? "red" : "transparent", stroke: isFavorite ? "red" : "white" }}
            className={`w-[26px] h-[26px] cursor-pointer`}
            onClick={onClick}
        />
    );
}