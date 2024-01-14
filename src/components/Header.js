import styles from "./Header.module.css";
import { useUser } from "@/utils/useUser";
import { supabase } from "@/utils/supabase-client";
import { useRouter } from "next/router";
import { UserIcon } from '@heroicons/react/20/solid';
import lang from '@/services/lang'

export default function Header(){
    const { user, setAuthOpenedFrom } = useUser();
    const router = useRouter();

    return <header className={`page_container ${styles.headerWrapper}`}>
        <div className={styles.fakeDiv}></div>
        <div className={`${styles.logoArea}`}>
            <a href="/" className="flex justify-center">
                {
                    siteLogo()
                }
            </a>
        </div>
        <div className={`${styles.authWrapper}`}>
            <div className={`flex text-[#96bcef] border-solid border-[1px] rounded-[4px] px-[12px] py-[5px] border-[#96bcef]`}>
            {
                user ?
                <>
                <div>
                    {/* {user?.email || "tsogiaidze@yahoo.com"} */}
                    {user.email}
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
                    Logout
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
    </header>
}


function siteLogo(){
    if(process.env.NEXT_PUBLIC_DOMAIN == "akordebi.ge") {
        return <img className={styles.logoImage} alt="akordebiLogo" src={"/akordebige_logo.svg"} />
    }

    if(process.env.NEXT_PUBLIC_DOMAIN == "chordsofsongs.com") {
        return <img className={styles.logoImage} alt="akordebiLogo" src={"/chordsofsongs.svg"} />
    }

    if(process.env.NEXT_PUBLIC_DOMAIN == "dev.akordebi.ge") {
        return <img className={styles.logoImage} alt="akordebiLogo" src={"/devakordebige_logo.svg"} />
    }
}