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
import Download from '@/components/Download';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { MinusIcon, PlusIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import { transliterateWithCapital, transliterateWithCapitalizedWords, convertGeorgianToLatin } from '@/utils/transliteration';
import { getNotation, notations } from '@/utils/notations';
import { formatCount } from '@/utils/formatCount';
import DeleteSongButton from '@/components/DeleteSongButton';
import EditSongButton from '@/components/EditSongButton';
import { transposeChord } from '@/components/TonalityControl';
import TonalityControl from '@/components/TonalityControl';
import KaraokePlayer from '@/components/KaraokePlayer';
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
        console.log("The song is ", song)
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
            
            {/* JSON-LD structured data for better SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "MusicComposition",
                        "name": displaySongName,
                        "composer": displayAuthors,
                        "description": song.searchWords,
                        "text": song.text,
                        "url": `${process.env.NEXT_PUBLIC_DOMAIN}/resource/${song.notation_format}/${song.url}`,
                        "genre": song.notation.page_title,
                        "inLanguage": language === "eng" ? "en" : "ka"
                    })
                }}
            />
        </Head>
        <Header />
        <div className={`${styles.songPage} page_container noselect`}>
            {/* Modern controls layout with Tailwind CSS */}
            <div className="bg-slate-800/80 rounded-xl p-4 mb-6 space-y-4 border border-slate-700/50 max-w-2xl mx-auto lg:max-w-4xl">
                {/* First row: Font, Auto-scroll, and Tonality (if enabled) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

                    {/* Tonality Control - Third column on desktop, full width on mobile */}
                    {song.notation?.showTonality && (
                        <div className="col-span-2 md:col-span-1">
                            <TonalityControl songId={song.id} onTonalityChange={handleTonalityChange} />
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-600/50"></div>

                {/* Second row: Favorite, Download, and Show/Hide Chords */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Favorite Button */}
                    <div className="flex">
                        <Favorite song={song} showLabel={true} />
                    </div>
                    
                    {/* Download Button */}
                    <Download 
                        song={song} 
                        songBodySelector={`.${styles.songBody}`}
                        showLabel={true}
                    />

                    {/* Show/Hide Chords Button */}
                    {song.notation?.showChords && (
                        <div className="col-span-2 md:col-span-1">
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
                        </div>
                    )}
                </div>
            </div>
            
            
            {/* Donation Section */}
            {/* <div className="flex justify-left pl-[10px] my-6">
                <DonationButton className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" />
            </div> */}
            
            {/* Hidden full text for SEO - not visible to users but crawlable by search engines */}
            {song.text && (
                <div 
                    className="sr-only" 
                    aria-hidden="true"
                    style={{ 
                        position: 'absolute', 
                        left: '-10000px', 
                        width: '1px', 
                        height: '1px', 
                        overflow: 'hidden' 
                    }}
                >
                    <h2>
                        {displaySongName}
                        {displayAuthors && ` - ${displayAuthors.join(', ')}`}
                    </h2>
                    <p>{song.text}</p>
                </div>
            )}
            
            <main className={`${styles.songBody} mxedruli`} style={{fontSize}}>
                {/* Breadcrumb Navigation - spans all columns */}
                <div className={`${styles.songHeader} capital`}>
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
                    
                    {/* Edit and Delete Buttons */}
                    <div className="mt-4 flex gap-3 justify-start pl-[10px]">
                        <EditSongButton 
                            song={song} 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            {lang.songActions?.edit || "რედაქტირება"}
                        </EditSongButton>
                        <DeleteSongButton 
                            song={song} 
                            onDelete={() => {
                                // Redirect to home page after successful deletion
                                router.push('/');
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            {lang.songActions?.delete || "წაშლა"}
                        </DeleteSongButton>
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
                    // Handle karaoke notation type specially
                    song?.notation_format === "karaoke" ? (
                        <KaraokePlayer songBody={song.body} />
                    ) : (
                        // Handle other notation types
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
                            
                            if(line.type == "mp3") {
                                return mp3Line(line.value, index);
                            }
                        })
                        :
                        null
                    )
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
                <div className={styles.character}>{renderCharacter(character)}</div>
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

function mp3Line(value, index){
    return <div key={index} className={`${styles.lineWrapper} ${styles.audio}`}>
        <div style={{ color: 'white', marginBottom: '10px' }}>
            აუდიო ფაილი:
        </div>
        <audio 
            controls 
            style={{ width: '100%', maxWidth: '600px' }}
            src={value}
        >
            თქვენი ბრაუზერი არ აღიარებს audio ელემენტს.
        </audio>
        <div className='reportWrapper'>
            <ReportLine lineNumber={index} lineText="Audio file" />
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
    // Skip chord processing for karaoke notation
    if (song.notation_format === "karaoke") {
        return song;
    }
    
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