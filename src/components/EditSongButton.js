import Link from 'next/link';
import { useUser } from '@/utils/useUser';

const EditSongButton = ({ song, className = "", style = {}, children }) => {
    const { user } = useUser();

    // Check if user has permission to edit this song
    const canEdit = user && (
        process.env.NEXT_PUBLIC_CAN_EDIT_SONG.includes(user.email) || 
        (user?.id == song.uploaderUserId)
    );

    if (!canEdit) {
        return null;
    }

    return (
        <Link 
            href={`/edit/${song.notation_format}/${song.url}`} 
            className={className}
            style={style}
        >
            {children || (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            )}
        </Link>
    );
};

export default EditSongButton; 