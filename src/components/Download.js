import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import SubscriptionPrompt from '@/components/SubscriptionPrompt';
import { downloadSong } from '@/services/downloadService';

export default function Download({ 
    song, 
    songBodySelector, 
    showLabel = false, 
    className = "",
    size = 'medium' 
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
    const { user, isPremium } = useUser();
    const { lang } = useLanguage();

    function shouldShowPrompt() {
        if (!user) {
            return true;
        }

        if (!isPremium) {
            const downloadsLimit = parseInt(process.env.NEXT_PUBLIC_DOWNLOADS);
            if (user?.totalDownloads >= downloadsLimit) {
                return true;
            }
        }

        return false;
    }

    const handleDownloadClick = async () => {
        if (shouldShowPrompt()) {
            setShowSubscriptionPrompt(true);
            return;
        }

        setIsLoading(true);
        try {
            const success = await downloadSong({
                songBodySelector,
                songName: song.name,
                notationCode: song.notation?.code
            });

            // Record the download if successful
            if (success && user?.id && song?.id) {
                try {
                    await fetch('/api/downloads/record', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ songId: song.id }),
                    });
                } catch (error) {
                    console.error('Error recording download:', error);
                }
            }
        } catch (error) {
            console.error('Error downloading:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-4 h-4',
        large: 'w-5 h-5'
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
                    unauthenticatedText="ფაილის გადმოწერისთვის გაიარეთ მარტივი ავტორიზაცია 1 კლიკით"
                    authenticatedText={`უფასო ვერსიაში შეგიძლიათ გადმოწეროთ მაქსიმუმ ${process.env.NEXT_PUBLIC_DOWNLOADS} ფაილი. შეუზღუდავი გადმოწერისთვის გაიაქტიურეთ პრემიუმ პაკეტი. ამით ასევე წვლილს შეიტანთ საიტის განვითარებაში`}
                    source="download"
                    inModal={true}
                />
            </div>
        </div>,
        typeof window !== 'undefined' ? document.body : null
    ) : null;

    const buttonClass = showLabel
        ? `w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white text-sm font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`
        : `flex items-center justify-center gap-2 px-2 py-2 border border-slate-600/50 rounded-lg hover:bg-slate-600/50 hover:text-white font-medium text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

    const label = showLabel
        ? (
            <span>
                {lang.chord?.download || "გადმოწერა"}
            </span>
        )
        : (
            <span>
                {lang.chord?.download || "გადმოწერა"}
            </span>
        );

    return (
        <>
            <button 
                className={buttonClass}
                onClick={handleDownloadClick}
                aria-label={lang.chord?.download || "გადმოწერა"}
                title={lang.chord?.download || "გადმოწერა"}
                disabled={isLoading}
            >
                <ArrowDownTrayIcon className={sizeClasses[size]} />
                {label}
            </button>
            {modal}
        </>
    );
} 