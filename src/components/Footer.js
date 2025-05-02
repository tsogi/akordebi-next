import styles from "./Footer.module.css";
import { useEffect } from "react";
import WriteUs from "./WriteUs";
import { useLanguage } from '@/context/LanguageContext';
import Link from "next/link";

export default function Footer(){
  const { lang } = useLanguage();

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
        <div className="w-[100%] flex items-center px-[10px] flex-wrap">
          <div className={styles.linksAndCopyright}>
            <div className={`${styles.quickLinks} text-[#98b9fa] text-[0.8rem] flex flex-wrap items-center mb-[10px]`}>
              <a className={styles.quickLink} href="/prices">
                {/* <span className={styles.linksDivider}></span> */}
                {lang.prices}
              </a>
              {process.env.NEXT_PUBLIC_DOMAIN === "akordebi.ge" && (
                <a className={styles.quickLink} href="/teachers">
                  <span className={styles.linksDivider}></span>
                  {lang.teachers}
                </a>
              )}
              {/* {process.env.NEXT_PUBLIC_DOMAIN === "akordebi.ge" && (
                <a className={styles.quickLink} href="/guitar-finder">
                  <span className={styles.linksDivider}></span>
                  {lang.guitar_finder}
                </a>
              )} */}
              <a className={styles.quickLink} href="/legal/terms">
                <span className={styles.linksDivider}></span>
                {lang._footer_terms}
              </a>
              <a className={styles.quickLink} href="/legal/refunds">
                <span className={styles.linksDivider}></span>
                {lang._footer_refunds}
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
            <div className={`${styles.feedback}`}>
              <div className="mt-12 text-center text-gray-600 text-[0.8rem]">
                <p>{lang.price.questions} <a href="mailto:tsogiaidze1@gmail.com" className="text-blue-600 hover:underline">{lang.price.contact_us}</a></p>
              </div>
              {/* <WriteUs /> */}
            </div>
            <div className={`${styles.copyright} text-[#035fda]`}>© {lang._footer_designBy}<span> </span><a className="text-[#f2ac2b] underline" href="https://tsogi.net">{lang._footer_tsogi}</a>
            </div>
          </div>
        </div>
        {
          topGeJsx()
        }
        {/* <div className="donationWrapper capital mt-[20px]">
          <a href="/donation" class="justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 flex items-center gap-2 rounded-md px-4 py-2 bg-red-500 text-white hover:bg-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5 fill-white"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            დონაცია
          </a>
        </div> */}
      </div>
    </footer>
}

function topGeJsx(){
  if(process.env.NEXT_PUBLIC_DOMAIN == "akordebi.ge"){
    return <div className="mt-[70px]" id="top-ge-counter-container" data-site-id="116500"></div>
  }
}