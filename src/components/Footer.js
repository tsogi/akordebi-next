import styles from "./Footer.module.css";
import { useEffect } from "react";
import WriteUs from "./WriteUs";

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
      <div className={`${styles.topGeWrapper} page_container flex flex-col items-center`}>
        <div className="w-[100%] flex items-center justify-between px-[10px] flex-wrap">
          <div className={`${styles.feedback}`}>
            <WriteUs />
          </div>
          <div className={`${styles.copyright} text-[#004aad]`}>Designed and developed by 
            <a className="text-[#f2ac2b]" href="https://github.com/tsogi"> tsogi</a>
          </div>
        </div>
        <div className="mt-[40px]" id="top-ge-counter-container" data-site-id="116500"></div>
      </div>
    </footer>
}