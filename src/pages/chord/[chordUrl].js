import HighlightOffIcon from '@mui/icons-material/HighlightOff';
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
    const [fontSize, setFontSize] = useState(16);
    const [scrollSpeed, setScrollSpeed] = useState(0);

    useEffect(() => {
        scroll();
    }, [scrollSpeed])

    useEffect(() => {
        document.addEventListener('click', handleScreenClick);

        return () => {
            document.removeEventListener('click', handleScreenClick);
        };
    }, []);

    function handleScreenClick(event) {
        let el = event.target;
        if(!el.classList.contains('chordBtn')) {
            handleChordClose();
        }
    }

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
        <div className={`${styles.songPage} page_container noselect`}>
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
            <h2 className={`${styles.songName} capital`}>{song?.name}</h2>
            <div className={styles.songAuthors}>
                {
                    song?.authors ?
                    song.authors.map((author) => {
                        return <h4 key={author} className={styles.songAuthor}>{author}</h4>
                    })
                    :
                    null
                }
            </div>
            <main className={styles.songBody} style={{fontSize}}>
                {
                    song?.body ? song.body.map((line, index) => {
                        if(line.type == "rightHand") {
                            return rightHandLine(line.value, index);
                        }

                        if(line.type == "text") {
                            return coupletLine(line, index);
                        }
                        
                        if(line.type == "chorus") {
                            return chorusLine(line, index);
                        }

                        if(line.type == "break") {
                            return breakLine(index);
                        }
                    })
                    :
                    null
                } 
            </main>
            <div className={styles.postSongArea}>
                {
                    song.uploader ?
                    <div className={styles.uploaderWrapper}>
                        <div>
                            ატვირთა: {song.uploader}
                        </div>
                    </div>
                    :
                    null
                }
                <div className={styles.songVotesWrapper}>
                    <div>
                        შეაფასეთ აკორდების სისწორე: 
                    </div>
                    <SongVotes songId={song.id} />
                </div>
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

function rightHandLine(content, index){
    return <div key={index} className={`${styles.lineWrapper} ${styles.rightHand}`}>
        <div className={styles.rightHandLabel}>მარჯვენა ხელი: </div>
        <div className={styles.rightHandText}>
            {
                Array.from(content).map((char) => char === " " ? " \u00A0 " : char).reduce((previous, current) => {
                    return previous += current;
                }, "")
            }
        </div>
    </div>
}

function renderLine(line, index){
    return <div key={index} className={`lineWrapper ${line.type}`}>
    {
        line.value.split("").map((character, index) => {
            return <div key={index} className={styles.textBit}>
                <div className={styles.character}>{character == " " ? '\u00A0' : character}</div>
                {
                    line.chords[index] ?
                    <>
                        <div className={`${styles.chordLabel} chordBtn`} onClick={handleChordClick}>{line.chords[index]}</div>
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
    code = code.replace("/", "-");
    code = code.replace(":", "-");
    code = code.replace("#", "_");
    code = encodeURIComponent(code);

    let chordImage = `/chords/${code}.png`;
    
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

        const mouseX = event.clientX;
        const screenWidth = window.innerWidth;
        let center = screenWidth / 2;
        let side = center < mouseX ? "right" : "left";

        event.target.nextSibling.style.display = "flex";
        if(side == "right") {
            event.target.nextSibling.style.right = "0";
        } else {
            event.target.nextSibling.style.left = "0";
        }
    }
}

function coupletLine(line, index){
    return renderLine(line, index)
}

function breakLine(index){
    return <div key={index} className={`lineWrapper break`}></div>
}

function chorusLine(line, index){
    return renderLine(line, index)
}

// export async function getStaticPaths() {
//     let songs = await db.getAllSongs();
//     let paths = songs.map(song => {
//         return { params: { id: "" + song.id } }
//     })

//     return {
//       paths: paths,
//       fallback: "blocking", // can also be true or 'blocking'
//     }
// }

export async function getServerSideProps({ params }) {
    let { chordUrl } = params;

    let song = await db.getSongByUrl(chordUrl);
  
    return {
      props: {
        song
      },
    }
}