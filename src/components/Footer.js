import styles from "./Footer.module.css";
import { useEffect } from "react";
import WriteUs from "./WriteUs";
import { useLanguage } from '@/context/LanguageContext';
import { useShoppingCart } from '@/context/ShoppingCartContext';
import Link from "next/link";
import { useRouter } from 'next/router';

export default function Footer(){
  const { lang } = useLanguage();
  const { getTotalItems, getTotalPrice, isMounted } = useShoppingCart();
  const router = useRouter();

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

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const isCartPage = router.pathname === '/shop/cart';

  return <footer className={styles.footerWrapper}>
    <div className={`${styles.topGeWrapper} page_container flex flex-col items-center`}>
      <div className="w-[100%] flex items-center px-[10px] flex-wrap">
        <div className={styles.linksAndCopyright}>
          <div className={`${styles.quickLinks} text-[#98b9fa] text-[0.8rem] flex flex-wrap items-center mb-[10px]`}>
            {/* <a className={styles.quickLink} href="/prices">
              {lang.prices}
            </a> */}
            <a className={styles.quickLink} href="/upload-info">
              <span className={styles.linksDivider}></span>
              {lang._footer_earn_money}
            </a>
            {process.env.NEXT_PUBLIC_DOMAIN === "akordebi.ge" && (
              <a className={styles.quickLink} href="/teachers">
                <span className={styles.linksDivider}></span>
                {lang.teachers}
              </a>
            )}
            <a className={styles.quickLink} href="/chords_library">
              <span className={styles.linksDivider}></span>
              {lang._footer_chords_library}
            </a>
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
            <div className="mt-12 text-center text-[#a09898] text-[0.8rem]">
              <p>{lang.price.questions} <a href="mailto:tsogiaidze1@gmail.com" className="text-blue-600 hover:underline">{lang.price.contact_us}</a></p>
            </div>
            {/* <WriteUs /> */}
          </div>
          <div className={`${styles.copyright} text-[#035fda]`}>© {lang._footer_designBy}<span> </span><a className="text-[#f2ac2b] underline" href="https://tsogi.net">{lang._footer_tsogi}</a>
          </div>
        </div>
      </div>
      {isMounted && totalItems > 0 && !isCartPage && (
        <Link href="/shop/cart"
          className="fixed left-0 right-0 bottom-4 mx-auto w-[95vw] max-w-md z-50 px-0 flex justify-center"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="w-full flex items-center justify-between bg-blue-700 hover:bg-blue-800 transition-colors duration-200 text-white py-3 px-5 rounded-xl md:rounded-lg shadow-lg font-medium text-base md:text-lg">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-bold text-lg">{totalItems}</span>
              <span className="ml-2 xs:inline-block">შეკვეთის დასრულება</span>
            </div>
            <span className="font-bold text-lg">{totalPrice}₾</span>
          </div>
        </Link>
      )}
      {topGeJsx()}
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