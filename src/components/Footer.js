import styles from "./Footer.module.css";
import { useEffect } from "react";

export default function Footer(){
    useEffect(() => {
        const script = document.createElement('script');

        script.src = "//counter.top.ge/counter.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        }
    }, []);

    return <footer className={styles.footerWrapper}>
      <div className={`${styles.topGeWrapper} flex flex-col items-center`}>
        <div id="top-ge-counter-container" data-site-id="116500"></div>
        <div className="text-[#004aad] mt-[40px]">Designed and developed by 
          <a className="text-[#f2ac2b]" href="https://github.com/tsogi"> tsogi</a>
        </div>
      </div>
    </footer>
}