import styles from "./Header.module.css";
import Image from "next/image";

export default function Header(){
    return <header className={styles.headerWrapper}>
        <div className={styles.logoArea}>
            <a href="/">
                <img className={styles.logoImage} alt="akordebiLogo" src={"/akordebige_logo.svg"} />
            </a>
        </div>
        <div></div>
    </header>
}