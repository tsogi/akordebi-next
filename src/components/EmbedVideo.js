import React from "react";
import styles from  "./EmbedVideo.module.css";

function EmbedVideo({url}){
    function parseVideoUrl(url){
        if(url.includes("youtube.com") || url.includes("youtu.be")) {
            try {
                let videoCode;
                if (url.includes("youtube.com")) {
                    videoCode = url.split("v=")[1].split("&")[0];
                } else {
                    // Handle youtu.be format
                    videoCode = url.split("youtu.be/")[1].split("?")[0];
                }

                let newUrl = `https://youtube.com/embed/${videoCode}`;

                return newUrl;
            } catch(error){
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