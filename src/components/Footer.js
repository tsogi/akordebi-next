import styles from "./Footer.module.css";
import { useEffect } from "react";
import WriteUs from "./WriteUs";
import lang from '@/services/lang'

export default function Footer(){
    useEffect(() => {
      if(process.env.NEXT_PUBLIC_DOMAIN == "akordebi.ge"){
        const script = document.createElement('script');

        script.src = "//counter.top.ge/counter.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        }
      }
    }, []);

    return <footer className={styles.footerWrapper}>
      <div className={`${styles.topGeWrapper} page_container flex flex-col items-center`}>
        <div className="w-[100%] flex items-center justify-between px-[10px] flex-wrap">
          <div className={`${styles.feedback}`}>
            <WriteUs />
          </div>
          <div className={styles.linksAndCopyright}>
            <div className={`${styles.quickLinks} text-[#98b9fa] text-[14px] flex flex-wrap items-center mb-[10px]`}>
              <a className={styles.quickLink} href="/legal/terms">
                <span className={styles.linksDivider}></span>
                {lang._footer_terms}
              </a>
              <a className={styles.quickLink} href="/legal/privacy">
                <span className={styles.linksDivider}></span>
                {lang._footer_policy}
              </a>
              <a className={styles.quickLink} href="/">
                <span className={styles.linksDivider}></span>
                {lang._footer_all_songs}
              </a>
              <a className={styles.quickLink} href="/createSong">
                <span className={styles.linksDivider}></span>
                {lang._footer_add_song}
              </a>
            </div>
            <div className={`${styles.copyright} text-[#035fda]`}>{lang._footer_designBy} 
              <a className="text-[#f2ac2b]" href="https://www.linkedin.com/in/tsogiaidze/"> {lang._footer_tsogi}</a>
            </div>
          </div>
        </div>
        {
          topGeJsx()
        }
      </div>
    </footer>
}

function topGeJsx(){
  if(process.env.NEXT_PUBLIC_DOMAIN == "akordebi.ge"){
    return <div className="mt-[70px]" id="top-ge-counter-container" data-site-id="116500"></div>
  }
}