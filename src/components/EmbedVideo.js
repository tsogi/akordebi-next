import React from "react";
import styles from  "./EmbedVideo.module.css";

function EmbedVideo({url}){
    function parseVideoUrl(url){
        if(url.includes("youtube.com")) {
            try {
                let videoCode = url.split("v=")[1].split("&")[0];

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
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
        />
    </div>
}

export default EmbedVideo;