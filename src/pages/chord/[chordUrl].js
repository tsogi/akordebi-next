import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
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
import { getNotation, notations } from '@/utils/notations';
import { formatCount } from '@/utils/formatCount';
import DeleteSongButton from '@/components/DeleteSongButton';
import EditSongButton from '@/components/EditSongButton';
let intervalId;

export default function SongPage({ song, relatedSongs }){
    const [fontSize, setFontSize] = useState(16);
    const [scrollSpeed, setScrollSpeed] = useState(0);
    const [showChords, setShowChords ] = useState(false);
    const [tonality, setTonality] = useState(0);
    const { isPremium, user } = useUser();
    const { lang, language } = useLanguage();
    const router = useRouter();

    // Get song name and author(s) in either Georgian or Latin based on language
    const displaySongName = language === "eng" 
        ? transliterateWithCapital(song?.name)
        : song?.name;
    
    const displayAuthors = language === "eng" && song?.authors
        ? song.authors.map(author => transliterateWithCapitalizedWords(author))
        : song?.authors;

    // Load font size from localStorage after component mounts
    useEffect(() => {
        const savedFontSize = localStorage.getItem('songFontSize');
        if (savedFontSize) {
            setFontSize(parseInt(savedFontSize, 10));
        }
    }, []);

    useEffect(() => {
        scroll();
    }, [scrollSpeed])

    useEffect(() => {
        document.addEventListener('click', handleScreenClick);
        
        return () => {
            document.removeEventListener('click', handleScreenClick);
        };
    }, []);

    // Add cleanup for scroll interval when component unmounts
    useEffect(() => {
        return () => {
            clearInterval(intervalId);
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
            localStorage.setItem('songFontSize', newFontSize.toString());
        }
    }

    async function handleMinusFontClick(){
        let newFontSize = fontSize - 1;
        if(newFontSize > 5) {
            setFontSize(newFontSize);
            localStorage.setItem('songFontSize', newFontSize.toString());
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

    async function handleMinusTonalityClick(){
        let newTonality = tonality - 1;
        if(newTonality >= -6) {
            setTonality(newTonality);
        }
    }

    async function handlePlusTonalityClick(){
        let newTonality = tonality + 1;
        if(newTonality <= 6) {
            setTonality(newTonality);
        }
    }

    // Chord transposition function
    function transposeChord(chord, semitones) {
        if (!chord || semitones === 0) return chord;
        
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        
        // Extract root note and chord suffix
        let rootNote = '';
        let chordSuffix = '';
        
        if (chord.length >= 2 && (chord[1] === '#' || chord[1] === 'b')) {
            rootNote = chord.slice(0, 2);
            chordSuffix = chord.slice(2);
        } else {
            rootNote = chord.slice(0, 1);
            chordSuffix = chord.slice(1);
        }
        
        // Find current note index
        let noteIndex = notes.indexOf(rootNote);
        if (noteIndex === -1) {
            noteIndex = flats.indexOf(rootNote);
        }
        if (noteIndex === -1) return chord; // Return original if not found
        
        // Transpose
        let newIndex = (noteIndex + semitones + 12) % 12;
        let newNote = notes[newIndex];
        
        return newNote + chordSuffix;
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
            <title>{`${displaySongName} - ${song.notation.page_title}`}</title>
            <meta name="description" content={ `${song.searchWords}` } />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            
            {/* Open Graph meta tags for better social sharing */}
            <meta property="og:title" content={`${displaySongName} - ${song.notation.page_title}`} />
            <meta property="og:description" content={song.searchWords} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_DOMAIN}/resource/${song.notation_format}/${song.url}`} />
            
            {/* Twitter Card meta tags */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={`${displaySongName} - ${song.notation.page_title}`} />
            <meta name="twitter:description" content={song.searchWords} />
            
            {/* Canonical URL to prevent duplicate content issues */}
            <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/resource/${song.notation_format}/${song.url}`} />
            
            {/* Additional meta tags for better SEO */}
            <meta name="keywords" content={`${displaySongName}, ${displayAuthors?.join(', ')}, ${song.notation.page_title}, chords, music, აკორდები, ტაბები, გაკვეთილებები`} />
            <meta name="author" content={song.uploader || 'Akordebi.ge'} />
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

                <div className={styles.controlGroup}>
                    <label className={styles.controlLabel}>ტონალობა</label>
                    <div className={styles.controlActions}>
                        <button 
                            className={styles.controlButton} 
                            onClick={handleMinusTonalityClick}
                            aria-label="Decrease tonality"
                        >
                            <MinusIcon className={styles.controlIcon} />
                        </button>
                        <div className={styles.controlValue}>{tonality > 0 ? `+${tonality}` : tonality}</div>
                        <button 
                            className={styles.controlButton} 
                            onClick={handlePlusTonalityClick}
                            aria-label="Increase tonality"
                        >
                            <PlusIcon className={styles.controlIcon} />
                        </button>
                    </div>
                </div>
                
                {
                    song.notation?.hideChords ?
                    null
                    :
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
                }
                
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
                {/* {!song.notation?.isFree && !isPremium && user?.id !== song.uploaderUserId && (
                    <div className={styles.blurredContent}>
                        <SubscriptionPrompt />
                    </div>
                )} */}
                {
                    song?.capo_location ?
                    <div className="ml-[10px] mb-[15px] italic">
                        <span>{lang.chord.capoLocation}: </span>
                        <span id="capo-location">{song.capo_location} </span>
                        <span>{lang.chord.fret}</span>
                    </div>
                    :
                    null
                }
                {
                    song?.body ? song.body.map((line, index) => {
                        if(line.type == "rightHand") {
                            return rightHandLine(line.value, index);
                        }

                        if(line.type == "coupletChords") {
                            return coupletChordsLine(line.list, index, showChords, song.notation.chordsDir, tonality, transposeChord);
                        }

                        if(line.type == "text") {
                            return coupletLine(line, index, song.notation.chordsDir, tonality, transposeChord);
                        }
                        
                        if(line.type == "chorus") {
                            return chorusLine(line, index, song.notation.chordsDir, tonality, transposeChord);
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
                {
                    song.notation?.hideDifficulty ?
                    null
                    :
                    <div className={styles.songDifficultiesWrapper}>
                        <div className={styles.evaluate_label}>
                            {lang._evaluate_difficulty}
                        </div>
                        <div className={styles.difficultiesWrapper}>
                            <SongDifficulties songId={song.id} />
                        </div>
                    </div>
                }
                <div className={styles.songVotesWrapper}>
                    <div className={styles.evaluate_label}>
                        {lang.chord.views || "ნახვები"}
                    </div>
                    <div className={`${styles.viewsWrapper} flex items-center`}>
                        <VisibilityIcon />
                        <span className='ml-[10px]'>{formatCount(song.view_count) || "0"}</span>
                    </div>
                </div>
                    <div className="mt-2 flex items-center justify-center">
                        <EditSongButton 
                            song={song} 
                            className="text-sm mr-2"
                        />
                        <DeleteSongButton 
                            song={song} 
                            onDelete={() => {
                                // Redirect to home page after successful deletion
                                router.push('/');
                            }}
                            className="text-sm"
                        />
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

function coupletChordsLine(chords, index, showChords, chordsDir, tonality, transposeChord){
    // Simply transpose the existing chord list for this section
    const transposedChords = tonality !== 0 
        ? chords.map(chord => transposeChord(chord, tonality))
        : chords;
    
    // Remove duplicates that might occur after transposition
    const uniqueTransposedChords = [...new Set(transposedChords)];
    
    return <div key={index} className={`${styles.lineWrapper} ${styles.coupletChords}`}>
        <div className={styles.coupletChordsList} style={{ display: showChords ? "flex" : "none" }}>
            {
                uniqueTransposedChords.map((chord, chordIndex) => {
                    return <div key={chordIndex} className={styles.chordWrapper}>
                        <div className="text-center">{chord}</div>
                        <img 
                            className={styles.coupletChordImg} 
                            onError = {(e) => { e.target.style.display = 'none' }} 
                            src={ findChordImage(chord, chordsDir) } 
                        />
                    </div>
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

function renderLine(line, index, chordsDir, tonality, transposeChord){
    return <div key={index} className={`lineWrapper ${line.type}`}>
    {
        line.value.split("").map((character, index) => {
            const originalChord = line.chords[index];
            let displayChord = originalChord;
            let imageChord = originalChord;
            
            if (originalChord && tonality !== 0) {
                // Transpose both chord name and image to show correct fingerings
                displayChord = transposeChord(originalChord, tonality);
                imageChord = transposeChord(originalChord, tonality);
            }
            
            return <div key={index} className={styles.textBit}>
                <div className={styles.character}>{renderCharacter(character)}</div>
                {
                    originalChord ?
                    <>
                        <div className={`${styles.chordLabel} chordBtn`} onClick={(event) => { handleChordClick(event, imageChord, chordsDir)}}>{displayChord}</div>
                        <div className={`${styles.chordImage} chordImage`}>
                            <div className={styles.closeChordBtn} onClick={handleChordClose}><HighlightOffIcon /></div>
                            {/* <div className={styles.imageLabel">{imageChord}</div> */}
                            <img
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src="";
                                }}

                            src={ findChordImage(imageChord, chordsDir) } />
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

function findChordImage(code, chordsDir){
    console.log("The code", code);
    code = code.replace("/", "-");
    code = code.replace(":", "-");
    code = code.replace("#", "_");
    code = encodeURIComponent(code);

    let chordImage = `${chordsDir}/${code}.png`;
    
    return chordImage;
}

function handleChordClose(){
    document.querySelectorAll(".chordImage").forEach((item) => {
        item.style.display = "none";
    });
}

async function handleChordClick(event, chord, chordsDir){
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

function coupletLine(line, index, chordsDir, tonality, transposeChord){
    return renderLine(line, index, chordsDir, tonality, transposeChord)
}

function breakLine(index){
    return <div key={index} className={`lineWrapper break`}></div>
}

function chorusLine(line, index, chordsDir, tonality, transposeChord){
    return renderLine(line, index, chordsDir, tonality, transposeChord)
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
    let { chordUrl, notationFormat } = ctx.params;

    let song = null;

    // First attempt: Try to find song by name and notation format
    if (notationFormat) {
        song = await db.getSongByUrlAndNotation(chordUrl, notationFormat, userID);
    }

    // Second attempt: Try to find song by URL
    if (!song) {
        song = await db.getSongByUrl(chordUrl, userID);
    }

    if (song) {
        // Increment the view count for this song
        await db.incrementSongViewCount(song.id);
        
        // Get related songs
        const relatedSongs = await db.getRelatedSongs(song.id);

        song = attachNotation(song);
        
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

function attachNotation(song){
    const notation = getNotation(song.notation_format) || {
        ...notations[0],
        ...notations[0].tabs[0]
    };
    song.notation = notation;

    return song;
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