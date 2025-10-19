import React, { useState, useRef, useEffect } from 'react';
import styles from './KaraokePlayer.module.css';

const KaraokePlayer = ({ songBody }) => {
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Extract MP3 URL and karaoke lines from song body
    const mp3Line = songBody.find(line => line.type === 'mp3');
    const karaokeLines = songBody.filter(line => line.type === 'karaoke' && line.value.trim());
    
    // Parse timestamp format: [01:04:09-01:04:12] or [1:4:9-01:04:12]
    const parseTime = (timeStr) => {
        const parts = timeStr.split(':');
        const minutes = parseInt(parts[0], 10) || 0;
        const seconds = parseInt(parts[1], 10) || 0;
        const milliseconds = parseInt(parts[2], 10) || 0;
        return minutes * 60 + seconds + milliseconds / 100;
    };
    
    // Parse karaoke text and extract timing information
    const parseKaraokeText = (text) => {
        const segments = [];
        let lastIndex = 0;
        
        // Find all timestamp patterns: word[time-time] or phrase[time-time]
        const timestampRegex = /([^\[]+)\[([0-9:]+)-([0-9:]+)\]/g;
        let match;
        
        while ((match = timestampRegex.exec(text)) !== null) {
            const [fullMatch, textContent, startTime, endTime] = match;
            
            segments.push({
                text: textContent,
                startTime: parseTime(startTime),
                endTime: parseTime(endTime),
                originalIndex: match.index
            });
            
            lastIndex = match.index + fullMatch.length;
        }
        
        // Add any remaining text without timestamps
        if (lastIndex < text.length) {
            const remainingText = text.substring(lastIndex).trim();
            if (remainingText) {
                segments.push({
                    text: remainingText,
                    startTime: null,
                    endTime: null,
                    originalIndex: lastIndex
                });
            }
        }
        
        return segments;
    };
    
    // Update current time from audio
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };
        
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        
        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        
        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, []);
    
    // Check if text should be highlighted based on current time
    const isHighlighted = (startTime, endTime) => {
        if (startTime === null || endTime === null) return false;
        return currentTime >= startTime && currentTime <= endTime;
    };
    
    // Render karaoke text with highlighting
    const renderKaraokeLine = (line, lineIndex) => {
        const segments = parseKaraokeText(line.value);
        
        return (
            <div key={line.id} className={styles.karaokeLine}>
                {segments.map((segment, segmentIndex) => (
                    <span
                        key={`${lineIndex}-${segmentIndex}`}
                        className={`${styles.karaokeSegment} ${
                            isHighlighted(segment.startTime, segment.endTime) 
                                ? styles.highlighted 
                                : ''
                        }`}
                    >
                        {segment.text}
                    </span>
                ))}
            </div>
        );
    };
    
    if (!mp3Line) {
        return <div>კარაოკე ფაილი ვერ მოიძებნა</div>;
    }
    
    return (
        <div className={styles.karaokePlayer}>
            {/* Audio Player */}
            <div className={styles.audioPlayer}>
                <audio
                    ref={audioRef}
                    controls
                    className={styles.audioControls}
                    src={mp3Line.value}
                >
                    თქვენი ბრაუზერი არ აღიარებს audio ელემენტს.
                </audio>
            </div>
            
            {/* Karaoke Text Display */}
            <div className={styles.karaokeText}>
                {karaokeLines.map((line, index) => renderKaraokeLine(line, index))}
            </div>
            
        </div>
    );
};

export default KaraokePlayer;
