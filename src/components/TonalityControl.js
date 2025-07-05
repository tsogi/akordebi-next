import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import styles from '../pages/chord/SongPage.module.css';

export default function TonalityControl({ onTonalityChange, tonality = 0 }) {
    const handleMinusTonalityClick = () => {
        const newTonality = tonality - 1;
        if (newTonality >= -6) {
            onTonalityChange(newTonality);
        }
    };

    const handlePlusTonalityClick = () => {
        const newTonality = tonality + 1;
        if (newTonality <= 6) {
            onTonalityChange(newTonality);
        }
    };

    return (
        <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>ტონალობა</label>
            <div className={styles.controlActions}>
                <button 
                    className={styles.controlButton} 
                    onClick={handleMinusTonalityClick}
                    aria-label="Decrease tonality"
                >
                    <MinusIcon className={styles.controlIcon} />
                </button>
                <div className={styles.controlValue}>
                    {tonality > 0 ? `+${tonality}` : tonality}
                </div>
                <button 
                    className={styles.controlButton} 
                    onClick={handlePlusTonalityClick}
                    aria-label="Increase tonality"
                >
                    <PlusIcon className={styles.controlIcon} />
                </button>
            </div>
        </div>
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