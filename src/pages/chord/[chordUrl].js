import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useEffect, useState } from "react";
import Head from 'next/head';
import FbComments from "@/components/FbComments";
import Header from "@/components/Header";
import EmbedVideo from "@/components/EmbedVideo";
import Footer from "@/components/Footer";
import SongVotes from "@/components/SongVotes";
import db from "@/services/db";
import uiDb from '@/services/data';
import styles from "./SongPage.module.css";
import SongDifficulties from '@/components/SongDifficulties';
import lang from '@/services/lang';
import Favorite from '@/components/Favorite';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
let intervalId;

export default function SongPage({ song }){
    const [fontSize, setFontSize] = useState(16);
    const [scrollSpeed, setScrollSpeed] = useState(0);
    const [showChords, setShowChords ] = useState(false);

    useEffect(() => {
        scroll();
    }, [scrollSpeed])

    useEffect(() => {
        document.addEventListener('click', handleScreenClick);
        
        // uiDb.logEvent("song_page", song.id);

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

    async function handlePlusFontClick(){
        let newFontSize = fontSize + 1;
        if(newFontSize < 50) {
            setFontSize(newFontSize);
        }

        // await uiDb.logEvent("font_click", "plus");
    }

    async function handleMinusFontClick(){
        let newFontSize = fontSize - 1;
        if(newFontSize > 5) {
            setFontSize(newFontSize);
        }

        // await uiDb.logEvent("font_click", "minus");
    }

    async function handleMinusScrollClick(){
        let newSpeed = scrollSpeed - 1;
        if(newSpeed >= 0) {
            setScrollSpeed(newSpeed);
        }

        // await uiDb.logEvent("auto_scroll", "minus");
    }

    async function handlePlusScrollClick(){
        let newSpeed = scrollSpeed + 1;
        if(newSpeed < 6) {
            setScrollSpeed(newSpeed);
        }

        // await uiDb.logEvent("auto_scroll", "plus");
    }

    async function handleShowChordsClick(){
        if(showChords) {
            setShowChords(false);
            return;
        }

        setShowChords(true);

        // await uiDb.logEvent("show_chords");
    }

    return <>
        <Head>
            <title>{`${song.name} - ${lang._guitar_chords}`}</title>
            <meta name="description" content={ `${song.searchWords}` } />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <Header />    
        <div className={`${styles.songPage} page_container noselect`}>
            <div className={styles.majorSettings}>
                <div className={`${styles.font} ${styles.settings}`}>
                    <div className={`${styles.font} ${styles.label}`}>{lang.chord.font}</div>
                    <div className={`${styles.font} ${styles.operator} ${styles.minus}`} onClick={handleMinusFontClick}>-</div>
                    <div className={`${styles.font} ${styles.size}`}>{fontSize}</div>
                    <div className={`${styles.font} ${styles.operator} ${styles.plus}`} onClick={handlePlusFontClick}>+</div>
                </div>
                <div className={`${styles.scroll} ${styles.settings}`}>
                    <div className={`${styles.scroll} ${styles.label}`}>{lang.chord.autoScroll}</div>
                    <div className={`${styles.scroll} ${styles.operator} ${styles.minus}`} onClick={handleMinusScrollClick}>-</div>
                    <div className={`${styles.scroll} ${styles.size}`}>{scrollSpeed}</div>
                    <div className={`${styles.scroll} ${styles.operator} ${styles.plus}`} onClick={handlePlusScrollClick}>+</div>
                </div>
                <div className={`${styles.coupletChords} ${styles.settings}`}>
                    <div onClick={handleShowChordsClick} className={`${styles.coupletChordsBtn}`}>
                        {
                            showHideText(showChords)
                        }
                    </div>
                </div>
                <div className={`${styles.settings}`}>
                    <Favorite song={song} />
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

                        if(line.type == "coupletChords") {
                            return coupletChordsLine(line.list, index, showChords);
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
                <div className={styles.songVotesWrapper}>
                    <div>
                      {lang.chord.rate}:
                    </div>
                    <SongVotes songId={song.id} />
                </div>
                <div className={styles.songDifficultiesWrapper}>
                    <div className={styles.evaluate_label}>
                        {lang._evaluate_difficulty}
                    </div>
                    <div className={styles.difficultiesWrapper}>
                        <SongDifficulties songId={song.id} />
                    </div>
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
            {
                song.uploader ?
                <div className={styles.uploaderWrapper}>
                    <div>
                        {lang.chord.uploaded}: {song.uploader}
                    </div>
                </div>
                :
                null
            }
            {/* {
                process.env.NEXT_PUBLIC_DOMAIN == "akordebi.ge" ?
                <div className="mt-[40px]">
                    <a href={`https://chords365.com`}>
                        <div className={styles.chords365}></div>
                    </a>
                </div>
                :
                null
            } */}
            <div className={styles.fbComments}>
                <FbComments href={`akordebi.ge/songPage/${song.id}`} />
            </div>
        </div>
        <Footer />
    </>
}

function coupletChordsLine(chords, index, showChords){
    return <div key={index} className={`${styles.lineWrapper} ${styles.coupletChords}`}>
        <div className={styles.coupletChordsList} style={{ display: showChords ? "flex" : "none" }}>
            {
                chords.map(chord => {
                    return <img className={styles.coupletChordImg} onError = {() => { this.style.display = 'none' }} src={ findChordImage(chord) } />
                })
            }
        </div>
    </div>
}

function rightHandLine(content, index){
    return <div key={index} className={`${styles.lineWrapper} ${styles.rightHand}`}>
        <div className={styles.rightHandLabel}>{lang.rightHand}</div>
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
                        <div className={`${styles.chordLabel} chordBtn`} onClick={(event) => { handleChordClick(event, line.chords[index])}}>{line.chords[index]}</div>
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

async function handleChordClick(event, chord){
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

    // await uiDb.logEvent("chord_click", chord);
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

export async function getServerSideProps(ctx) {
    const supabase = createPagesServerClient(ctx);
    const {data} = await supabase.auth.getSession();
    const userID = data?.session?.user?.id ?? null;
    let { chordUrl } = ctx.params;

    let song = await db.getSongByUrl(chordUrl, userID);

    if (!song) {
        let name = chordUrl.split("_")[0];
        name = name.replaceAll("-", " ");

        song = await db.getSongByName(name);
    }

    if (!song) {
        song = await db.getSong(chordUrl);
    }

    if (song) {
        song = addCoupletChords(song)
    } else {
        return {
            notFound: true,
        }
    }
  
    return {
      props: {
        song
      },
    }
}

function addCoupletChords(song){
    let newLines = [];
    let lines = song.body;

    newLines.push({id: new Date().getTime(), type: 'coupletChords', value: '', list: []});

    for(let i =0; i< lines.length; i++) {
        let line = lines[i];
        let nextLine = lines[i + 1];
        if(nextLine && !["text", "chorus"].includes(line.type) && ["text", "chorus"].includes(nextLine.type)) {
            newLines.push(line);
            // let randomNumber = Math.floor(Math.random() * 10000) + 1;
            newLines.push({id: new Date().getTime(), type: 'coupletChords', value: '', list: []});
            continue;
        }

        if(nextLine && line.type == "text" && line.value == "") {
            newLines.push(line);
            // let randomNumber = Math.floor(Math.random() * 10000) + 1;
            newLines.push({id: new Date().getTime(), type: 'coupletChords', value: '', list: []});
            continue;
        }

        newLines.push(line);
    }

    let chordsList = [];
    for(let i = newLines.length - 1; i >= 0; i--) {
        let line = newLines[i];

        if(line.chords) {
            let lineChords = line.chords.filter(Boolean);
            chordsList = [...new Set([...lineChords, ...chordsList])] 
        }
        if(line.type == "coupletChords") {
            line.list = [...chordsList];
            chordsList = [];
        }
    }

    song.body = newLines;

    return song;
}

function showHideText(showChords){
    if(process.env.NEXT_PUBLIC_LANG == "geo") {
        return `${lang.chord.chord} ${showChords ? lang.chord.hide : lang.chord.appearance}`;
    }

    return `${showChords ? lang.chord.hide : lang.chord.appearance} ${lang.chord.chord}`;
}