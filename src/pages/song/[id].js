import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import Head from 'next/head';
import FbComments from "@/components/FbComments";
import Header from "@/components/Header";
import EmbedVideo from "@/components/EmbedVideo";
import Footer from "@/components/Footer";
import SongVotes from "@/components/SongVotes";
import db from "@/services/db";
import styles from "./SongPage.module.css";
let intervalId;

export default function SongPage({ song }){
    const router = useRouter()

    const[fontSize, setFontSize] = useState(16);
    const[scrollSpeed, setScrollSpeed] = useState(0);

    useEffect(() => {
        scroll();
    }, [scrollSpeed])

    function scroll(){
        clearInterval(intervalId);

        intervalId = setInterval(() => {
            // Todo fix the scroll
            window.scrollBy(0, scrollSpeed);
        }, 200);
    }

    function handlePlusFontClick(){
        let newFontSize = fontSize + 1;
        if(newFontSize < 50) {
            setFontSize(newFontSize);
        }
    }

    function handleMinusFontClick(){
        let newFontSize = fontSize - 1;
        if(newFontSize > 5) {
            setFontSize(newFontSize);
        }
    }

    function handleMinusScrollClick(){
        let newSpeed = scrollSpeed - 1;
        if(newSpeed >= 0) {
            setScrollSpeed(newSpeed);
        }
    }

    function handlePlusScrollClick(){
        let newSpeed = scrollSpeed + 1;
        if(newSpeed < 6) {
            setScrollSpeed(newSpeed);
        }
    }

    return <>
        <Head>
            <title>{`${song.name} - გიტარის აკორდები`}</title>
            <meta name="description" content={ `${song.searchWords}` } />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/guitar.ico" />
        </Head>
        <Header />    
        <div className={`${styles.songPage} page_container`}>
            <div className={styles.majorSettings}>
                <div className={`${styles.font} ${styles.settings}`}>
                    <div className={`${styles.font} ${styles.label}`}>ფონტი</div>
                    <div className={`${styles.font} ${styles.operator} ${styles.minus}`} onClick={handleMinusFontClick}>-</div>
                    <div className={`${styles.font} ${styles.size}`}>{fontSize}</div>
                    <div className={`${styles.font} ${styles.operator} ${styles.plus}`} onClick={handlePlusFontClick}>+</div>
                </div>
                <div className={`${styles.scroll} ${styles.settings}`}>
                    <div className={`${styles.scroll} ${styles.label}`}>სქროლი</div>
                    <div className={`${styles.scroll} ${styles.operator} ${styles.minus}`} onClick={handleMinusScrollClick}>-</div>
                    <div className={`${styles.scroll} ${styles.size}`}>{scrollSpeed}</div>
                    <div className={`${styles.scroll} ${styles.operator} ${styles.plus}`} onClick={handlePlusScrollClick}>+</div>
                </div>
            </div>
            <div className={`${styles.songName} capital`}>{song?.name}</div>
            <div className={styles.songAuthors}>
                {
                    song?.authors ?
                    song.authors.map((author) => {
                        return <div key={author} className={styles.songAuthor}>{author}</div>
                    })
                    :
                    null
                }
            </div>
            <div className={styles.songBody} style={{fontSize}}>
                {
                    song?.body ? song.body.map(line => {
                        if(line.type == "rightHand") {
                            return rightHandLine(line.value);
                        }

                        if(line.type == "text") {
                            return coupletLine(line);
                        }
                        
                        if(line.type == "chorus") {
                            return chorusLine(line);
                        }

                        if(line.type == "break") {
                            return breakLine();
                        }
                    })
                    :
                    null
                } 
            </div>
            <div className={styles.songVotesWrapper}>
                <div>
                    შეაფასეთ აკორდების სისწორე: 
                </div>
                <SongVotes songId={song.id} />
            </div>
            {
                song?.videoLesson ?
                <div className={styles.videoTutorial}>
                    <EmbedVideo url={song.videoLesson} />
                </div>
                :
                null
            }
            <div className={styles.fbComments}>
                <FbComments href={`akordebi.ge/songPage/${song.id}`} />
            </div>
        </div>
        <Footer />
    </>
}

function rightHandLine(content){
    return <div className={`${styles.lineWrapper} ${styles.rightHand}`}>
        <div className={styles.rightHandLabel}>მარჯვენა ხელი: </div>
        {
            Array.from(content).map((char) => char === " " ? "\u00A0" : char)
        }
    </div>
}

function renderLine(line){
    return <div className={`lineWrapper ${line.type}`}>
    {
        line.value.split("").map((character, index) => {
            return <div className={styles.textBit}>
                <div className={styles.character}>{character == " " ? '\u00A0' : character}</div>
                {
                    line.chords[index] ?
                    <>
                        <div className={styles.chordLabel} onClick={handleChordClick}>{line.chords[index]}</div>
                        <div className={`${styles.chordImage} chordImage`}>
                            <div className={styles.closeChordBtn} onClick={handleChordClose}><HighlightOffIcon /></div>
                            {/* <div className={styles.imageLabel">{line.chords[index]}</div> */}
                            <img
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src="";
                                }}

                            src={ findChordImage(line.chords[index]) } />
                        </div>
                    </>
                    :
                    null
                }
            </div>
        })
    }
    </div>
}

function findChordImage(code){
    // let chordImage = chords.find(chord => chord.name == code)?.image
    let chordImage = `/chords/${code}.png`
    
    return chordImage;
}

function handleChordClose(){
    document.querySelectorAll(".chordImage").forEach((item) => {
        item.style.display = "none";
    });
}

function handleChordClick(event){
    if(event.target.nextSibling.style.display == "flex") {
        document.querySelectorAll(".chordImage").forEach((item) => {
            item.style.display = "none";
        });

        event.target.nextSibling.style.display = "none";
    } else {
        document.querySelectorAll(".chordImage").forEach((item) => {
            item.style.display = "none";
        });

        event.target.nextSibling.style.display = "flex";
    }
}

function coupletLine(line){
    return renderLine(line)
}

function breakLine(){
    return <div className={`lineWrapper break`}></div>
}

function chorusLine(line){
    return renderLine(line)
}

export async function getStaticPaths() {
    let songs = await db.getAllSongs();
    let paths = songs.map(song => {
        return { params: { id: "" + song.id } }
    })

    return {
      paths: paths,
      fallback: "blocking", // can also be true or 'blocking'
    }
}

export async function getStaticProps({ params }) {
    let { id } = params;
    let song = await db.getSong(id);
  
    return {
      props: {
        song
      },
    }
}