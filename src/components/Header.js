import styles from "./Header.module.css";
import Image from "next/image";

export default function Header(){
    return <header className={styles.headerWrapper}>
        <div className={styles.logoArea}>
            <a href="/">
                <Image alt="akordebiLogo" src={"/akordebige_logo.svg"} width={300} height={300} />
            </a>
        </div>
        <div></div>
    </header>
}