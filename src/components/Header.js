'use client';

import styles from "./Header.module.css";
import { useUser } from "@/utils/useUser";
import { supabase } from "@/utils/supabase-client";
import { useRouter } from "next/router";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import uiDb from '@/services/data';
import Link from 'next/link'
import { useState } from 'react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import { useLanguage } from '@/context/LanguageContext';

export default function Header(){
    const { user, setAuthOpenedFrom } = useUser();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { lang, toggleLanguage, language } = useLanguage();

    function isActive(page){
        if(page == "home" && ["/", "/chord/[chordUrl]"].includes(router.pathname)){ 
            return true;
        }

        if(page == "guitar-finder" && router.pathname == "/guitar-finder"){
            return true;
        }
        
        if(page == "shop" && router.pathname == "/shop"){
            return true;
        }

        if(page == "prices" && router.pathname == "/prices"){
            return true;
        }

        if(page == "teachers" && router.pathname == "/teachers"){
            return true;
        }
    }

    async function handleShopClick(e){
        e.preventDefault();
        // await uiDb.logEvent("guitar_finder_link_click");
        router.push("/guitar-finder");
    }

    async function handleForeignClick(e){
        e.preventDefault();
        await uiDb.logEvent("foreign_songs_page_click");
        router.push("https://chords365.com");
    }

    function languageSwitcher() {
        return (
            <button onClick={toggleLanguage} className={styles.languageSwitcher} aria-label="Toggle language">
                {language === 'geo' ? '🇺🇸' : '🇬🇪'}
            </button>
        );
    }

    function menuPages(){
        if(process.env.NEXT_PUBLIC_DOMAIN == "akordebi.ge") {
            return <>
                <Link 
                    href={"/"} 
                    className={`nav-link ${isActive("home") ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                >
                    {lang.main_page}
                </Link>
                <Link 
                    href="/prices" 
                    onClick={() => setIsMenuOpen(false)}
                    className="nav-link"
                >
                    {lang.prices || "ფასები"}
                </Link>
                <Link 
                    href="/teachers" 
                    onClick={() => setIsMenuOpen(false)}
                    className="nav-link"
                >
                    {lang.teachers}
                </Link>
                {/* <Link 
                    href="/shop" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`nav-link ${isActive("shop") ? "active" : ""}`}
                >
                    გიტარის მაღაზია
                </Link> */}
                {/* <Link 
                    href={""} 
                    onClick={(e) => {
                        handleShopClick(e);
                        setIsMenuOpen(false);
                    }} 
                    className={`nav-link ${isActive("guitar-finder") ? "active" : ""}`}
                >
                    {lang.guitar_finder}
                </Link> */}
                {/* <Link 
                    href={""} 
                    onClick={(e) => {
                        handleForeignClick(e);
                        setIsMenuOpen(false);
                    }} 
                    className="nav-link"
                >
                    {lang.foreign_songs}
                </Link> */}
            </>
        }

        if(process.env.NEXT_PUBLIC_DOMAIN == "chords365.com") {
            return <>
                {/* <Link href={"/"} className={` px-[10px]  text-gray-500 hover py-1 sm:py-0 ${isActive("home") ? "isActivePage" : ""}`}>Chords</Link> */}
            </>
        }

        if(process.env.NEXT_PUBLIC_DOMAIN == "dev.akordebi.ge") {
            return <>
                <Link href={"/"} className=" px-[10px]  text-gray-500 hover py-1 sm:py-0" >აკორდები</Link>
                <Link href={"/"} className=" px-[10px]  text-gray-500 hover py-1 sm:py-0" >ტაბები</Link>
                {/* <Link href="/shop" className={` px-[10px] text-gray-500 hover py-1 sm:py-0 ${isActive("shop") ? "active" : ""}`}>გიტარის მაღაზია</Link> */}
                <Link href={"/"} className=" px-[10px]  text-gray-500 hover py-1 sm:py-0" >უცხოური სიმღერები</Link>
            </>
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <div className={styles.headerTop}>
                    <div className={styles.logoContainer}>
                        <Link href="/" className={styles.logoLink}>
                            {siteLogo()}
                        </Link>
                    </div>

                    <div className={styles.headerActions}>
                        {languageSwitcher()}
                        <button 
                            className={styles.menuButton}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>
                        <div className={styles.authButton}>
                            {user ? (
                                <div className={styles.userInfo}>
                                    <span className={styles.username}>{user.email.split('@')[0]}</span>
                                    <button
                                        onClick={async () => {
                                            const { error } = await supabase.auth.signOut();
                                            if(error) console.error(error);
                                            router.reload();
                                        }}
                                        className={styles.logoutButton}
                                        aria-label="Sign out"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setAuthOpenedFrom('header')}
                                    className={styles.loginButton}
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                    <span>{lang._login}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`${styles.navContainer} ${isMenuOpen ? styles.menuOpen : ''}`}>
                    <nav className={styles.nav}>
                        {menuPages()}
                    </nav>
                </div>
            </div>
        </header>
    );
}


function siteLogo(){
    if(process.env.NEXT_PUBLIC_DOMAIN == "akordebi.ge") {
        return <span className={styles.logoText}>akordebi.ge</span>
    }

    if(process.env.NEXT_PUBLIC_DOMAIN == "chords365.com") {
        return <span className={styles.logoText}>chords365.com</span>
    }

    if(process.env.NEXT_PUBLIC_DOMAIN == "dev.akordebi.ge") {
        return <span className={styles.logoText}>akordebi.ge</span>
    }
}

