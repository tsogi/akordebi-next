import styles from "./Header.module.css";
import { useUser } from "@/utils/useUser";
import { supabase } from "@/utils/supabase-client";
import { useRouter } from "next/router";

export default function Header(){
    const { user, setAuthOpenedFrom } = useUser();
    const router = useRouter();

    return <header className={`page_container ${styles.headerWrapper}`}>
        <div className={styles.logoArea}>
            <a href="/">
                <img className={styles.logoImage} alt="akordebiLogo" src={"/akordebige_logo.svg"} />
            </a>
        </div>
        <div className={styles.authWrapper}>
        {
            user ?
            <>
            <div>
                {user.email}
            </div>
            <button
                onClick={async () => {
                    const { error } = await supabase.auth.signOut();
                    if(error){
                        console.error(error);
                    }
                    router.reload();
                }}
            >
                Logout
            </button>
            </>
            :
            <button onClick={() => setAuthOpenedFrom('header')}>შესვლა</button>
        }
                
        </div>
        
    </header>
}

