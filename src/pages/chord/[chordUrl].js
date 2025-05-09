import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useEffect, useState } from "react";
import Head from 'next/head';
// import FbComments from "@/components/FbComments";
import Header from "@/components/Header";
import EmbedVideo from "@/components/EmbedVideo";
import Footer from "@/components/Footer";
import SongVotes from "@/components/SongVotes";
import SubscriptionPrompt from "@/components/SubscriptionPrompt";
import ReportLine from "@/components/ReportLine";
import RelatedSongs from "@/components/RelatedSongs";
import db from "@/services/db";
import styles from "./SongPage.module.css";
import SongDifficulties from '@/components/SongDifficulties';
import Favorite from '@/components/Favorite';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { MinusIcon, PlusIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import { transliterateWithCapital, transliterateWithCapitalizedWords, convertGeorgianToLatin } from '@/utils/transliteration';
let intervalId;

export default function SongPage({ song, relatedSongs }){
    const [fontSize, setFontSize] = useState(16);
    const [scrollSpeed, setScrollSpeed] = useState(0);
    const [showChords, setShowChords ] = useState(false);
    const { isPremium } = useUser();
    const { lang, language } = useLanguage();

    // Get song name and author(s) in either Georgian or Latin based on language
    const displaySongName = language === "eng" 
        ? transliterateWithCapital(song?.name)
        : song?.name;
    
    const displayAuthors = language === "eng" && song?.authors
        ? song.authors.map(author => transliterateWithCapitalizedWords(author))
        : song?.authors;

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

    async function handlePlusFontClick(){
        let newFontSize = fontSize + 1;
        if(newFontSize < 50) {
            setFontSize(newFontSize);
        }
    }

    async function handleMinusFontClick(){
        let newFontSize = fontSize - 1;
        if(newFontSize > 5) {
            setFontSize(newFontSize);
        }
    }

    async function handleMinusScrollClick(){
        let newSpeed = scrollSpeed - 1;
        if(newSpeed >= 0) {
            setScrollSpeed(newSpeed);
        }
    }

    async function handlePlusScrollClick(){
        let newSpeed = scrollSpeed + 1;
        if(newSpeed < 6) {
            setScrollSpeed(newSpeed);
        }
    }

    async function handleShowChordsClick(){
        if(showChords) {
            setShowChords(false);
            return;
        }

        setShowChords(true);
    }

    return <>
        <Head>
            <title>{`${displaySongName} - ${lang._guitar_chords}`}</title>
            <meta name="description" content={ `${song.searchWords}` } />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <Header />    
        <div className={`${styles.songPage} page_container noselect`}>
            <div className={styles.controlsContainer}>
                <div className={styles.controlGroup}>
                    <label className={styles.controlLabel}>{lang.chord.font}</label>
                    <div className={styles.controlActions}>
                        <button 
                            className={styles.controlButton} 
                            onClick={handleMinusFontClick}
                            aria-label="Decrease font size"
                        >
                            <MinusIcon className={styles.controlIcon} />
                        </button>
                        <div className={styles.controlValue}>{fontSize}</div>
                        <button 
                            className={styles.controlButton} 
                            onClick={handlePlusFontClick}
                            aria-label="Increase font size"
                        >
                            <PlusIcon className={styles.controlIcon} />
                        </button>
                    </div>
                </div>
                
                <div className={styles.controlGroup}>
                    <label className={styles.controlLabel}>{lang.chord.autoScroll}</label>
                    <div className={styles.controlActions}>
                        <button 
                            className={styles.controlButton} 
                            onClick={handleMinusScrollClick}
                            aria-label="Decrease scroll speed"
                        >
                            <MinusIcon className={styles.controlIcon} />
                        </button>
                        <div className={styles.controlValue}>{scrollSpeed}</div>
                        <button 
                            className={styles.controlButton} 
                            onClick={handlePlusScrollClick}
                            aria-label="Increase scroll speed"
                        >
                            <PlusIcon className={styles.controlIcon} />
                        </button>
                    </div>
                </div>
                
                <button 
                    className={`${styles.toggleButton} ${showChords ? styles.active : ''}`}
                    onClick={handleShowChordsClick}
                    aria-label={showChords ? lang.chord.hide : lang.chord.appearance}
                >
                    {showChords ? (
                        <>
                            <EyeSlashIcon className={styles.toggleIcon} />
                            <span>{lang.chord.hide}</span>
                        </>
                    ) : (
                        <>
                            <EyeIcon className={styles.toggleIcon} />
                            <span>{lang.chord.appearance}</span>
                        </>
                    )}
                </button>
                
                <div className={styles.favoriteWrapper}>
                    <Favorite song={song} showLabel={true} />
                </div>
            </div>
            <h2 className={`${styles.songName} capital`}>{displaySongName}</h2>
            <div className={styles.songAuthors}>
                {
                    displayAuthors ?
                    displayAuthors.map((author) => {
                        return <h4 key={author} className={styles.songAuthor}>{author}</h4>
                    })
                    :
                    null
                }
            </div>
            <main className={`${styles.songBody} mxedruli`} style={{fontSize}}>
                {!isPremium && (
                    <div className={styles.blurredContent}>
                        <SubscriptionPrompt />
                    </div>
                )}
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
                        
                        if(line.type == "image") {
                            return imageLine(line.value, index);
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
                    <div className={styles.uploaderInfo}>
                        <span>{lang.chord.uploaded}:</span>
                        <span className={styles.uploaderName}>
                            {language === "eng" 
                                ? transliterateWithCapitalizedWords(song.uploader)
                                : song.uploader}
                        </span>
                    </div>
                </div>
                :
                null
            }

            <RelatedSongs songs={relatedSongs} />
            
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
            {/* <div className={styles.fbComments}>
                <FbComments href={`akordebi.ge/songPage/${song.id}`} />
            </div> */}
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
    const { lang } = useLanguage();

    return <div key={index} className={`${styles.lineWrapper} ${styles.rightHand}`}>
        <div className={styles.rightHandLabel}>{lang.rightHand}</div>
        <div className={styles.rightHandText}>
            {
                Array.from(content).map((char) => char === " " ? " \u00A0 " : char).reduce((previous, current) => {
                    return previous += current;
                }, "")
            }
        <span className='reportWrapper'>
            <ReportLine lineNumber={index} lineText={content} />
        </span>
        </div>
    </div>
}

function renderCharacter(character){
    const { language } = useLanguage();

    if(character == " ") {
        return '\u00A0';
    }

    if(language === "eng") {
        return convertGeorgianToLatin(character);
    }

    return character;
}

function renderLine(line, index){
    return <div key={index} className={`lineWrapper ${line.type}`}>
    {
        line.value.split("").map((character, index) => {
            return <div key={index} className={styles.textBit}>
                <div className={styles.character}>{renderCharacter(character)}</div>
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
    <div className='reportWrapper'>
        <ReportLine lineNumber={index} lineText={line.value} />
    </div>
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

function imageLine(value, index){
    return <div key={index} className={`${styles.lineWrapper} ${styles.image}`}>
        <img 
            src={value} 
            alt="ტაბი ან ნოტის ფოტო" 
            className={styles.tabImage}
            style={{ maxWidth: '100%', margin: "2px 0" }} 
            loading="lazy"
        />
        <div className='reportWrapper'>
            <ReportLine lineNumber={index} lineText="Tab or note image" />
        </div>
    </div>
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
        // Increment the view count for this song
        await db.incrementSongViewCount(song.id);
        
        // Get related songs
        const relatedSongs = await db.getRelatedSongs(song.id);
        
        song = addCoupletChords(song)

        return {
            props: {
                song,
                relatedSongs
            },
        }
    } else {
        return {
            notFound: true,
        }
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