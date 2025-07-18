import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';


/**
 * Prepares the song content for capture by modifying styles for better visibility
 * @param {HTMLElement} songBodyElement - The main song content element
 * @returns {Array} Array of style changes for restoration
 */
export const prepareSongForCapture = (songBodyElement) => {
    const changes = [];

    // Add logo at the top
    const logoDiv = document.createElement('div');
    logoDiv.className = 'download-watermark-top';
    logoDiv.innerHTML = `<span class="logoText" style="font-size: 24px; margin-left: 10px; font-weight: bold; color: black; margin-bottom: 20px; display: block; font-family: 'Charm', cursive;">akordebi.ge</span>`;
    songBodyElement.insertBefore(logoDiv, songBodyElement.firstChild);
    changes.push({
        type: 'addedElement',
        element: logoDiv
    });

    // Add footer text
    const footerDiv = document.createElement('div');
    footerDiv.className = 'download-watermark-bottom';
    footerDiv.innerHTML = '<span style="font-size: 14px; color: black; margin-left: 10px; margin-top: 20px; display: block;">© გადმოწერილია akordebi.ge-დან</span>';
    songBodyElement.appendChild(footerDiv);
    changes.push({
        type: 'addedElement',
        element: footerDiv
    });

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
        if (change.type === 'addedElement') {
            // Remove added watermark elements
            change.element.remove();
        } else if (change.originalValue) {
            change.element.style[change.property] = change.originalValue;
        } else {
            change.element.style.removeProperty(change.property);
        }
    });
};

/**
 * Downloads song content as PNG image using html-to-image (better CORS support)
 * 
 * @param {Object} options - Download options
 * @param {string} options.songBodySelector - CSS selector for the song body element
 * @param {string} options.songName - Name of the song for filename
 * @param {string} options.notationCode - Notation format code
 * @returns {Promise<boolean>} Success status
 */
export const downloadSongAsPNG = async ({ songBodySelector, songName, notationCode }) => {
    let styleChanges = [];
    
    try {
        const songBodyElement = document.querySelector(songBodySelector);
        if (!songBodyElement) {
            console.error('Song body element not found');
            return false;
        }

        console.log('Preparing song for download...');
        
        // Prepare the content for capture
        styleChanges = prepareSongForCapture(songBodyElement);

        // Wait a moment for styles to apply
        await new Promise(resolve => setTimeout(resolve, 100));

        console.log('Starting PNG capture with html-to-image...');

        // Calculate full dimensions to avoid cutting off content
        const rect = songBodyElement.getBoundingClientRect();
        const scrollHeight = Math.max(
            songBodyElement.scrollHeight,
            songBodyElement.offsetHeight,
            songBodyElement.clientHeight
        );
        const scrollWidth = Math.max(
            songBodyElement.scrollWidth,
            songBodyElement.offsetWidth,
            songBodyElement.clientWidth
        );

        console.log(`Capturing dimensions: ${scrollWidth}x${scrollHeight}`);

        // Use html-to-image which has much better CORS support
        const dataUrl = await htmlToImage.toPng(songBodyElement, {
            quality: 1.0,
            pixelRatio: 2, // High resolution
            backgroundColor: '#ffffff',
            width: scrollWidth,
            height: scrollHeight + 50, // Add 50px padding to prevent cutoff
            style: {
                // Ensure consistent styling
                fontFamily: 'inherit',
                color: 'black',
                // Ensure we capture the full content
                overflow: 'visible',
                maxHeight: 'none',
                height: 'auto'
            },
            // html-to-image handles CORS automatically - no complex configuration needed!
            skipAutoScale: false,
            cacheBust: true, // Helps with external image loading
            // Wait for images to load
            skipFonts: false
        });

        // Restore original styles immediately after capture
        restoreOriginalStyles(styleChanges);
        styleChanges = []; // Clear to avoid double restoration

        console.log('Converting to blob and downloading...');

        // Convert data URL to blob and download
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        const fileName = `${songName || 'song'}_${notationCode || 'chords'}_akordebi.ge.png`;
        saveAs(blob, fileName);
        
        console.log('✅ Download completed successfully with html-to-image!');
        return true;

    } catch (error) {
        console.error('Error downloading song as PNG:', error);
        
        // Restore styles if anything went wrong
        if (styleChanges.length > 0) {
            restoreOriginalStyles(styleChanges);
        }
        
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
 * Handle download with error handling and logging
 * @param {Object} options - Download options
 * @param {string} options.songBodySelector - CSS selector for the song body element
 * @param {string} options.songName - Name of the song for filename
 * @param {string} options.notationCode - Notation format code
 * @param {string} options.userId - User ID for tracking (optional)
 * @param {number} options.songId - Song ID for tracking (optional)
 * @returns {Promise<boolean>} Success status
 */
export const handleDownload = async ({ songBodySelector, songName, notationCode, userId, songId }) => {
    const success = await downloadSong({
        songBodySelector,
        songName,
        notationCode
    });
    
    // Record the download if successful and we have user/song info
    if (success && userId && songId) {
        try {
            await fetch('/api/downloads/record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ songId }),
            });
        } catch (error) {
            console.error('Error recording download:', error);
            // Don't fail the download if recording fails
        }
    }
    
    if (!success) {
        console.error('Download failed');
        // Could show user notification here if needed
    }
    
    return success;
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
        return false;
    }
}; 