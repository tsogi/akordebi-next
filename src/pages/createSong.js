import SongCreator from "@/components/SongCreator";
import styles from "./createSong.module.css";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CreateSong(){
    return <>
        <Head>
            <title>{`სიმღერის ატვირთვა - Upload new song`}</title>
            <meta name="description" content={"სიმღერის აკორდების დამატება | Add new song chords"} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <Header />
        <div className={`${styles.createSongPage} page_container`}>
            <div className={styles.uploadLabel}>სიმღერის akordebi.ge-ზე გამოსაქვეყნებლად შეავსეთ ველები და ატვირთეთ ტექსტი პლიუს(+) ღილაკების მეშვეობით. პროცესი არის მარტივი და ინტუიტიური. ასევე, ამ გვერდის ბოლოში, შეგიძლიათ ნახოთ <a href="#videoInstruction">ატვირთვის ვიდეო ინსტრუქცია</a></div>
            <SongCreator  />
            <div id="videoInstruction" className={styles.videoInstruction}>
                <iframe width="100%" height="500px" src="https://www.youtube.com/embed/HuO8oZXFKgg" title="ატვირთვის ვიდეო ინსტრუქციები" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        </div>
        <Footer />
    </>
}