import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

/**
 * Prepares the song content for capture by modifying styles for better visibility
 * @param {HTMLElement} songBodyElement - The main song content element
 * @returns {Array} Array of style changes for restoration
 */
export const prepareSongForCapture = (songBodyElement) => {
    const changes = [];

    // Hide all report wrappers
    const reportWrappers = songBodyElement.querySelectorAll('.reportWrapper');
    reportWrappers.forEach((wrapper, index) => {
        changes.push({
            element: wrapper,
            property: 'display',
            originalValue: wrapper.style.display,
            newValue: 'none'
        });
        wrapper.style.display = 'none';
    });

    // Change text color to black for better visibility
    const textElements = songBodyElement.querySelectorAll('*');
    textElements.forEach((element, index) => {
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.color && computedStyle.color !== 'rgb(0, 0, 0)') {
            changes.push({
                element: element,
                property: 'color',
                originalValue: element.style.color,
                newValue: 'black'
            });
            element.style.color = 'black';
        }
    });

    // Hide chord images that might be visible
    const chordImages = songBodyElement.querySelectorAll('.chordImage');
    chordImages.forEach((img, index) => {
        changes.push({
            element: img,
            property: 'display',
            originalValue: img.style.display,
            newValue: 'none'
        });
        img.style.display = 'none';
    });

    return changes;
};

/**
 * Restores original styles after capture
 * @param {Array} changes - Array of style changes to restore
 */
export const restoreOriginalStyles = (changes) => {
    changes.forEach(change => {
        if (change.originalValue) {
            change.element.style[change.property] = change.originalValue;
        } else {
            change.element.style.removeProperty(change.property);
        }
    });
};

/**
 * Downloads song content as PNG image
 * @param {Object} options - Download options
 * @param {string} options.songBodySelector - CSS selector for the song body element
 * @param {string} options.songName - Name of the song for filename
 * @param {string} options.notationCode - Notation format code
 * @returns {Promise<boolean>} Success status
 */
export const downloadSongAsPNG = async ({ songBodySelector, songName, notationCode }) => {
    try {
        const songBodyElement = document.querySelector(songBodySelector);
        if (!songBodyElement) {
            console.error('Song body element not found');
            return false;
        }

        // Prepare the content for capture
        const styleChanges = prepareSongForCapture(songBodyElement);

        // Create canvas with high quality settings
        const canvas = await html2canvas(songBodyElement, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher resolution
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            width: songBodyElement.scrollWidth,
            height: songBodyElement.scrollHeight,
        });

        // Restore original styles
        restoreOriginalStyles(styleChanges);

        // Convert to blob and download
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const fileName = `${songName || 'song'}_${notationCode || 'chords'}.png`;
                saveAs(blob, fileName);
                resolve(true);
            }, 'image/png');
        });

    } catch (error) {
        console.error('Error downloading song as PNG:', error);
        return false;
    }
};

/**
 * Downloads song content as text file (fallback)
 * @param {Object} options - Download options
 * @param {string} options.songBodySelector - CSS selector for the song body element
 * @param {string} options.songName - Name of the song for filename
 * @param {string} options.notationCode - Notation format code
 * @returns {Promise<boolean>} Success status
 */
export const downloadSongAsText = async ({ songBodySelector, songName, notationCode }) => {
    try {
        const songBodyElement = document.querySelector(songBodySelector);
        if (!songBodyElement) {
            console.error('Song body element not found');
            return false;
        }

        const textContent = songBodyElement.textContent || songBodyElement.innerText;
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const fileName = `${songName || 'song'}_${notationCode || 'chords'}.txt`;
        saveAs(blob, fileName);
        return true;

    } catch (error) {
        console.error('Error downloading song as text:', error);
        return false;
    }
};

/**
 * Main download function with automatic fallback
 * @param {Object} options - Download options
 * @param {string} options.songBodySelector - CSS selector for the song body element
 * @param {string} options.songName - Name of the song for filename
 * @param {string} options.notationCode - Notation format code
 * @returns {Promise<boolean>} Success status
 */
export const downloadSong = async ({ songBodySelector, songName, notationCode }) => {
    try {
        // Try PNG download first
        const pngSuccess = await downloadSongAsPNG({ songBodySelector, songName, notationCode });
        
        if (pngSuccess) {
            return true;
        }

        // Fallback to text download
        console.log('PNG download failed, falling back to text download');
        const textSuccess = await downloadSongAsText({ songBodySelector, songName, notationCode });
        return textSuccess;

    } catch (error) {
        console.error('Download failed completely:', error);
        
        // Final attempt to restore styles if something went wrong
        try {
            const songBodyElement = document.querySelector(songBodySelector);
            if (songBodyElement) {
                const styleChanges = prepareSongForCapture(songBodyElement);
                restoreOriginalStyles(styleChanges);
            }
        } catch (restoreError) {
            console.error('Error restoring styles after failed download:', restoreError);
        }
        
        return false;
    }
}; 