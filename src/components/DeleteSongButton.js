import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/20/solid';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import ConfirmDialog from './ConfirmDialog';
import Alert from './Alert';

const DeleteSongButton = ({ song, onDelete, className = "", style = {} }) => {
    const { user, setAuthOpenedFrom } = useUser();
    const { lang } = useLanguage();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [showDeleteError, setShowDeleteError] = useState(false);

    // Check if user can delete songs
    const canDelete = user && process.env.NEXT_PUBLIC_CAN_DELETE_SONG && process.env.NEXT_PUBLIC_CAN_DELETE_SONG.includes(user.email);

    // Don't render if user can't delete
    if (!canDelete) {
        return null;
    }

    const handleDeleteClick = async () => {
        if (!user) {
            setAuthOpenedFrom('deleteSongBtn');
            return;
        }

        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch('/api/songs/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ songId: song.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete song');
            }

            setShowDeleteSuccess(true);
            
            // Call the onDelete callback to remove the song from the UI
            if (onDelete) {
                onDelete(song.id);
            }
        } catch (error) {
            console.error('Error deleting song:', error);
            setShowDeleteError(true);
        }
    };

    return (
        <>
            <button 
                onClick={handleDeleteClick}
                className={`inline-flex items-center justify-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors ${className}`}
                style={style}
                title={lang.songCard?.deleteTooltip || "Delete song"}
            >
                <TrashIcon className="w-4 h-4" />
            </button>

            <ConfirmDialog 
                open={showDeleteConfirm} 
                setOpen={setShowDeleteConfirm} 
                message={lang.songCard?.deleteConfirm || "Are you sure you want to delete this song?"}
                onConfirm={handleDeleteConfirm}
                type="error"
            />

            <Alert 
                open={showDeleteSuccess} 
                setOpen={setShowDeleteSuccess} 
                message={lang.songCard?.deleteSuccess || "Song was successfully deleted"} 
                duration={3}
                type="success"
            />

            <Alert 
                open={showDeleteError} 
                setOpen={setShowDeleteError} 
                message="Error deleting song. Please try again." 
                duration={3}
                type="error"
            />
        </>
    );
};

export default DeleteSongButton; 