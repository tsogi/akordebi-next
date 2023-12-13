import Link from "next/link";
import styles from "./Header.module.css";
import Image from "next/image";
import { useUser } from "@/utils/useUser";

export default function Header(){
    const { user, userDetails } = useUser();

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
            </>
            :
            <Link href="/auth">შესვლა</Link>
        }
                
        </div>
        
    </header>
}

