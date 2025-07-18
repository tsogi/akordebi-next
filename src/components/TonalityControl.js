import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import SubscriptionPrompt from '@/components/SubscriptionPrompt';

export default function TonalityControl({ songId, onTonalityChange }) {
    const [tonality, setTonality] = useState(0);
    const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
    const { user, isPremium } = useUser();
    const { lang } = useLanguage();

    // Load user's saved tonality when component mounts
    useEffect(() => {
        const loadUserTonality = async () => {
            if (user?.id && songId) {
                try {
                    const response = await fetch(`/api/tonality/${songId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setTonality(data.tonality);
                        // Notify parent component of the loaded tonality
                        if (onTonalityChange) {
                            onTonalityChange(data.tonality);
                        }
                    }
                } catch (error) {
                    console.error('Error loading user tonality:', error);
                }
            }
        };

        loadUserTonality();
    }, [user?.id, songId, onTonalityChange]);

    function shouldShowPrompt(newTonality) {
        if (!user) {
            return true;
        }

        if (!isPremium && newTonality !== 0) {
            const tonalityLimit = parseInt(process.env.NEXT_PUBLIC_TONALITY);
            // Only show prompt if user is trying to set a new tonality and has reached limit
            // Todo: totalTonalities is loaded on initial load, so user can set unlimited tonality if he doesn't refresh the page
            if (tonality === 0 && user?.totalTonalities >= tonalityLimit) {
                return true;
            }
        }

        return false;
    }

    const handleTonalityChange = async (newTonality) => {
        // Check if we should show subscription prompt
        if (shouldShowPrompt(newTonality)) {
            setShowSubscriptionPrompt(true);
            return;
        }

        setTonality(newTonality);
        
        // Notify parent component
        if (onTonalityChange) {
            onTonalityChange(newTonality);
        }
        
        // Save tonality to database if user is authenticated
        if (user?.id && songId) {
            try {
                await fetch(`/api/tonality/${songId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tonality: newTonality }),
                });
            } catch (error) {
                console.error('Error saving tonality:', error);
            }
        }
    };

    const handleMinusTonalityClick = () => {
        const newTonality = tonality - 1;
        if (newTonality >= -6) {
            handleTonalityChange(newTonality);
        }
    };

    const handlePlusTonalityClick = () => {
        const newTonality = tonality + 1;
        if (newTonality <= 6) {
            handleTonalityChange(newTonality);
        }
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
                    unauthenticatedText="ტონალობის შესაცვლელად გაიარეთ მარტივი ავტორიზაცია 1 კლიკით"
                    authenticatedText={`უფასო ვერსიაში ტონალობა შეგიძლიათ შეუცვალოთ მაქსიმუმ ${process.env.NEXT_PUBLIC_TONALITY} სიმღერას. შეუზღუდავი ტონალობისთვის გაიაქტიურეთ პრემიუმ პაკეტი. ამით ასევე წვლილს შეიტანთ საიტის განვითარებაში`}
                    source="tonality"
                    inModal={true}
                />
            </div>
        </div>,
        typeof window !== 'undefined' ? document.body : null
    ) : null;

    return (
        <>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 block">ტონალობა</label>
                <div className="flex items-center justify-center bg-slate-700/50 rounded-lg p-1 gap-1">
                    <button 
                        className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-600/50 hover:bg-slate-500/50 text-slate-300 hover:text-white transition-colors duration-200 border border-slate-600/50"
                        onClick={handleMinusTonalityClick}
                        aria-label="Decrease tonality"
                    >
                        <MinusIcon className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center text-sm font-medium text-slate-200 min-w-[60px]">
                        {tonality > 0 ? `+${tonality}` : tonality}
                    </div>
                    <button 
                        className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-600/50 hover:bg-slate-500/50 text-slate-300 hover:text-white transition-colors duration-200 border border-slate-600/50"
                        onClick={handlePlusTonalityClick}
                        aria-label="Increase tonality"
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
            {modal}
        </>
    );
}

// Chord transposition utility function
export function transposeChord(chord, semitones) {
    if (!chord || semitones === 0) return chord;
    
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    
    // Extract root note and chord suffix
    let rootNote = '';
    let chordSuffix = '';
    
    if (chord.length >= 2 && (chord[1] === '#' || chord[1] === 'b')) {
        rootNote = chord.slice(0, 2);
        chordSuffix = chord.slice(2);
    } else {
        rootNote = chord.slice(0, 1);
        chordSuffix = chord.slice(1);
    }
    
    // Find current note index
    let noteIndex = notes.indexOf(rootNote);
    if (noteIndex === -1) {
        noteIndex = flats.indexOf(rootNote);
    }
    if (noteIndex === -1) return chord; // Return original if not found
    
    // Transpose
    let newIndex = (noteIndex + semitones + 12) % 12;
    let newNote = notes[newIndex];
    
    return newNote + chordSuffix;
} 