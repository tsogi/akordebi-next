import React from "react";
import styles from  "./EmbedVideo.module.css";

function EmbedVideo({url}){
    function parseVideoUrl(url){
        if(url.includes("youtube.com") || url.includes("youtu.be")) {
            try {
                let videoCode;
                // Clean up the URL first - take only the first part if there are multiple URLs concatenated
                const cleanUrl = url.split('https')[0] + 'https' + url.split('https')[1];
                
                if (cleanUrl.includes("youtube.com")) {
                    // Extract video code using regex to be more robust
                    const match = cleanUrl.match(/[?&]v=([^&]+)/);
                    videoCode = match ? match[1] : null;
                } else {
                    // Handle youtu.be format
                    const match = cleanUrl.match(/youtu\.be\/([^?]+)/);
                    videoCode = match ? match[1] : null;
                }

                if (!videoCode) {
                    return url;
                }

                let newUrl = `https://youtube.com/embed/${videoCode}`;
                return newUrl;
            } catch(error){
                console.error("Error parsing YouTube URL:", error);
                return url;
            }
        }

        return url;
    }

    return <div className={styles.videoResponsive}>
        <iframe
            width="100%"
            height="100%"
            src={parseVideoUrl(url)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
        />
    </div>
}

export default EmbedVideo;