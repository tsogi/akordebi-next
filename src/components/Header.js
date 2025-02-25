import styles from "./Header.module.css";
import { useUser } from "@/utils/useUser";
import { supabase } from "@/utils/supabase-client";
import { useRouter } from "next/router";
import { UserIcon } from '@heroicons/react/20/solid';
import lang from '@/services/lang'
import uiDb from '@/services/data';
import Link from 'next/link'

export default function Header(){
    const { user, setAuthOpenedFrom } = useUser();
    const router = useRouter();

    function isActive(page){
        console.log(router.pathname)
        if(page == "home" && ["/", "/chord/[chordUrl]"].includes(router.pathname)){ 
            return true;
        }

        if(page == "guitar-finder" && router.pathname == "/guitar-finder"){
            return true;
        }
    }

    async function handleShopClick(e){
        e.preventDefault();
        await uiDb.logEvent("guitar_shop_page_click");
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
                <Link href={"/"} className={` px-[10px] text-gray-500 hover py-1 sm:py-0 ${isActive("home") ? "isActivePage" : ""}`}>ქართული აკორდები</Link>
                <Link href={""} onClick={handleShopClick} className={`${isActive("guitar-finder") ? "isActivePage" : ""} px-[10px] text-gray-500 hover py-1 sm:py-0`}>გიტარის შერჩევა</Link>
                <Link href={""} onClick={handleForeignClick} className=" px-[10px] text-gray-500 hover py-1 sm:py-0" >უცხოური აკორდები</Link>
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

    return <header className={`page_container ${styles.headerWrapper}`}>
            <div className="flex flex-col justify-between items-center py-4 w-[100%]">
                <div className="flex items-center">
                    <Link href="/" className="flex justify-center">
                        {
                            siteLogo()
                        }
                    </Link>
                </div>
                
                <div className="flex flex-wrap justify-center w-[100%]">
                    <nav className="flex items-center flex-wrap justify-center text-[0.9rem]">
                        {
                            menuPages()
                        }
                    </nav>
                    <div className={`${styles.authWrapper}`}>
                        <div className={`flex text-[#96bcef] border-solid border-[1px] rounded-[4px] px-[12px] py-[5px] border-[#96bcef]`}>
                            {
                                user ?
                                <>
                                <div>
                                    {user.email.split('@')[0]}
                                </div>
                                <div className={"mx-[3px]"}> - </div>
                                <button
                                    onClick={async () => {
                                        const { error } = await supabase.auth.signOut();
                                        if(error){
                                            console.error(error);
                                        }
                                        router.reload();
                                    }}
                                    className="underline"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                </>
                                :
                                <div onClick={() => setAuthOpenedFrom('header')} className="flex items-center  cursor-pointer ">
                                    <UserIcon className="w-[18px] " />
                                    <span className={`${styles.enterLabel} pl-[5px]`}>{lang._login}</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
    </header>
}


function siteLogo(){
    if(process.env.NEXT_PUBLIC_DOMAIN == "akordebi.ge") {
        return <img className="w-[200px]" alt="akordebiLogo" src={"/akordebige_logo.svg"} />
    }

    if(process.env.NEXT_PUBLIC_DOMAIN == "chords365.com") {
        return <img className="w-[200px]" alt="Chords 365 logo" src={"/chords365.svg"} />
    }

    if(process.env.NEXT_PUBLIC_DOMAIN == "dev.akordebi.ge") {
        return <img className="w-[200px]" alt="akordebiLogo" src={"/devakordebige_logo.svg"} />
    }
}

