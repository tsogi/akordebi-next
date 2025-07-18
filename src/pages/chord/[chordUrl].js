import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import { transliterateWithCapital, transliterateWithCapitalizedWords, convertGeorgianToLatin } from '@/utils/transliteration';
import { getNotation, notations } from '@/utils/notations';
import { formatCount } from '@/utils/formatCount';
import DeleteSongButton from '@/components/DeleteSongButton';
import EditSongButton from '@/components/EditSongButton';
import { transposeChord } from '@/components/TonalityControl';
import TonalityControl from '@/components/TonalityControl';
import { handleDownload } from '@/services/downloadService';
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

    const handleTonalityChange = (newTonality) => {
        setTonality(newTonality);
    };

    async function handleShowChordsClick(){
        if(showChords) {
            setShowChords(false);
            return;
        }

        setShowChords(true);
    }

    const onDownloadClick = async () => {
        await handleDownload({
            songBodySelector: `.${styles.songBody}`,
            songName: displaySongName,
            notationCode: song.notation?.code,
            userId: user?.id,
            songId: song?.id
        });
    };

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
            {/* Modern controls layout with Tailwind CSS */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 space-y-4 border border-slate-700/50">
                {/* Font and Auto-scroll on same line */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Font Control */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 block">{lang.chord.font}</label>
                        <div className="flex items-center justify-center bg-slate-700/50 rounded-lg p-1 gap-1">
                            <button 
                                className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-600/50 hover:bg-slate-500/50 text-slate-300 hover:text-white transition-colors duration-200 border border-slate-600/50"
                                onClick={handleMinusFontClick}
                                aria-label="Decrease font size"
                            >
                                <MinusIcon className="w-4 h-4" />
                            </button>
                            <div className="flex-1 text-center text-sm font-medium text-slate-200 min-w-[32px]">
                                {fontSize}
                            </div>
                            <button 
                                className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-600/50 hover:bg-slate-500/50 text-slate-300 hover:text-white transition-colors duration-200 border border-slate-600/50"
                                onClick={handlePlusFontClick}
                                aria-label="Increase font size"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Auto-scroll Control */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 block">{lang.chord.autoScroll}</label>
                        <div className="flex items-center justify-center bg-slate-700/50 rounded-lg p-1 gap-1">
                            <button 
                                className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-600/50 hover:bg-slate-500/50 text-slate-300 hover:text-white transition-colors duration-200 border border-slate-600/50"
                                onClick={handleMinusScrollClick}
                                aria-label="Decrease scroll speed"
                            >
                                <MinusIcon className="w-4 h-4" />
                            </button>
                            <div className="flex-1 text-center text-sm font-medium text-slate-200 min-w-[32px]">
                                {scrollSpeed}
                            </div>
                            <button 
                                className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-600/50 hover:bg-slate-500/50 text-slate-300 hover:text-white transition-colors duration-200 border border-slate-600/50"
                                onClick={handlePlusScrollClick}
                                aria-label="Increase scroll speed"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tonality Control - Full Width */}
                {song.notation?.showTonality && (
                    <TonalityControl songId={song.id} onTonalityChange={handleTonalityChange} />
                )}

                {/* Divider */}
                <div className="border-t border-slate-600/50"></div>

                {/* Favorite and Download on same line */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Favorite Button */}
                    <div className="flex">
                        <Favorite song={song} showLabel={true} />
                    </div>
                    
                    {/* Download Button */}
                    <button 
                        className="flex items-center justify-center gap-2 px-2 py-2 border border-slate-600/50 rounded-lg hover:bg-slate-600/50 hover:text-white font-medium text-sm"
                        // className="flex items-center gap-2"
                        onClick={onDownloadClick}
                        aria-label={lang.chord.download}
                        title={lang.chord.download}
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>{lang.chord.download}</span>
                    </button>
                </div>

                {/* Show/Hide Chords Button - Full Width */}
                {song.notation?.showChords && (
                    <button 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white text-sm font-medium"
                        onClick={handleShowChordsClick}
                        aria-label={showChords ? lang.chord.hide : lang.chord.appearance}
                    >
                        {showChords ? (
                            <>
                                <EyeSlashIcon className="w-4 h-4" />
                                <span>{lang.chord.hide}</span>
                            </>
                        ) : (
                            <>
                                <EyeIcon className="w-4 h-4" />
                                <span>{lang.chord.appearance}</span>
                            </>
                        )}
                    </button>
                )}
            </div>
            
            
            {/* Donation Section */}
            {/* <div className="flex justify-left pl-[10px] my-6">
                <DonationButton className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" />
            </div> */}
            
            <main className={`${styles.songBody} mxedruli`} style={{fontSize}}>
                {/* Breadcrumb Navigation */}
                <div className="mb-[40px] capital">
                    <div className={styles.breadcrumb}>
                        <Link href={`/?notation=${song.notation.code}`} className={styles.breadcrumbLink}>
                            {song.notation.page_title_plural || song.notation.page_title}
                        </Link>
                        <span className={styles.breadcrumbSeparator}> / </span>
                        <span className={styles.breadcrumbCurrent}>{displaySongName}</span>
                    </div>
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
                </div>
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