import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './MobileBottomNav.module.css';

function HomeIcon({ filled }) {
    return filled ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
    ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12L12 3l9 9" />
            <path d="M9 21V12h6v9" />
            <path d="M3 12v9h18V12" />
        </svg>
    );
}

function SearchIcon({ filled }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={filled ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function ProfileIcon({ filled }) {
    return filled ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
    ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function BackIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
        </svg>
    );
}

export default function MobileBottomNav() {
    const router = useRouter();

    const isHome = router.pathname === '/';
    const isSearch = router.pathname === '/search';
    const isProfile = router.pathname === '/profile';

    function handleBack(e) {
        e.preventDefault();
        router.back();
    }

    return (
        <nav className={styles.nav}>
            <button className={styles.button} onClick={handleBack} aria-label="უკან">
                <span className={styles.iconWrap}>
                    <BackIcon />
                </span>
                <span className={styles.label}>უკან</span>
            </button>

            <Link href="/" className={`${styles.button} ${isHome ? styles.active : ''}`} aria-label="მთავარი">
                <span className={styles.iconWrap}>
                    <HomeIcon filled={isHome} />
                    {isHome && <span className={styles.activeIndicator} />}
                </span>
                <span className={styles.label}>მთავარი</span>
            </Link>

            <Link href="/search" className={`${styles.button} ${isSearch ? styles.active : ''}`} aria-label="ძებნა">
                <span className={styles.iconWrap}>
                    <SearchIcon filled={isSearch} />
                    {isSearch && <span className={styles.activeIndicator} />}
                </span>
                <span className={styles.label}>ძებნა</span>
            </Link>

            <Link href="/profile" className={`${styles.button} ${isProfile ? styles.active : ''}`} aria-label="პროფილი">
                <span className={styles.iconWrap}>
                    <ProfileIcon filled={isProfile} />
                    {isProfile && <span className={styles.activeIndicator} />}
                </span>
                <span className={styles.label}>პროფილი</span>
            </Link>
        </nav>
    );
}
