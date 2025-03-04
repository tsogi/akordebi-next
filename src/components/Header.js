import styles from "./Header.module.css";
import { useUser } from "@/utils/useUser";
import { supabase } from "@/utils/supabase-client";
import { useRouter } from "next/router";
import { UserIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import lang from '@/services/lang'
import uiDb from '@/services/data';
import Link from 'next/link'
import { useState } from 'react';

export default function Header(){
    const { user, setAuthOpenedFrom } = useUser();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function isActive(page){
        if(page == "home" && ["/", "/chord/[chordUrl]"].includes(router.pathname)){ 
            return true;
        }

        if(page == "guitar-finder" && router.pathname == "/guitar-finder"){
            return true;
        }
    }

    async function handleShopClick(e){
        e.preventDefault();
        await uiDb.logEvent("guitar_finder_link_click");
        router.push("/guitar-finder");
    }

    async function handleForeignClick(e){
        e.preventDefault();
        await uiDb.logEvent("foreign_songs_page_click");
        router.push("https://chords365.com");
    }

    function menuPages(){
        if(process.env.NEXT_PUBLIC_DOMAIN == "akordebi.ge") {
            return <>
                <Link 
                    href={"/"} 
                    className={`nav-link ${isActive("home") ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                >
                    ქართული აკორდები
                </Link>
                <Link 
                    href={""} 
                    onClick={(e) => {
                        handleShopClick(e);
                        setIsMenuOpen(false);
                    }} 
                    className={`nav-link ${isActive("guitar-finder") ? "active" : ""}`}
                >
                    გიტარის შემრჩევი AI
                </Link>
                <Link 
                    href={""} 
                    onClick={(e) => {
                        handleForeignClick(e);
                        setIsMenuOpen(false);
                    }} 
                    className="nav-link"
                >
                    უცხოური აკორდები
                </Link>
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
                <Link href={"/"} className=" px-[10px]  text-gray-500 hover py-1 sm:py-0" >გიტარის მაღაზია</Link>
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
                                    <UserIcon className="w-5 h-5" />
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

