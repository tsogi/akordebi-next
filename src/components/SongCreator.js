import * as React from 'react';
import styles from  "@/components/SongCreator.module.css";
import { Alert } from '@mui/material';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import AuthorsEditor from '@/components/AuthorsEditor';
import DB from "@/services/data";
import SongTextEditor from "@/components/SongTextEditor";
import Snackbar from '@mui/material/Snackbar';
import { useLanguage } from '@/context/LanguageContext';
import CustomSelect from "@/components/CustomSelect";
import { getNotation, notations } from "@/utils/notations";

const css = {
    textInput: "h-[50px] pl-5 text-white w-full bg-[rgba(255,255,255,.05)] shadow-[inset 12px 12px 30px rgba(53,123,230,.2)]"
}

export default function SongCreator({ _songName = "", _authors = [], _songText = [], _videoLesson = "", _songId = null, _uploader = "", _notationFormat = notations[0].tabs[0].code }){
    const [songName, setSongName] = React.useState(_songName);
    const [authors, setAuthors] = React.useState(_authors);
    const [songText, setSongText] = React.useState(_songText);
    const [videoLesson, setVideoLesson] = React.useState(_videoLesson);
    const [uploader, setUploader] = React.useState(_uploader);
    const [notationFormat, setNotationFormat] = React.useState(_notationFormat);
    const [saving, setSaving] = React.useState(false);
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackSeverity, setSnackSeverity] = React.useState();
    const [snackMessage, setSnackMessage] = React.useState("");
    const [pass, setPass] = React.useState("");
    const { lang } = useLanguage();

    React.useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const passValue = queryParams.get('pass');
        setPass(passValue);
        
        // Check if _notationFormat is passed from props
        if (_notationFormat) {
            setNotationFormat(_notationFormat);
        }
    }, [_notationFormat]);
    
    function handleSongNameChange(event) {
        let name = event.target.value;

        setSongName(name);
    }

    function handleVideoLessonChange(event) {
        let video = event.target.value;

        setVideoLesson(video);
    }

    function handleUploaderChange(event) {
        let uploader = event.target.value;

        setUploader(uploader);
    }

    function handleNotationFormatChange(event) {
        let format = event.target.value;
        setNotationFormat(format);
    }

    function handleSnackClose(){
        setSnackOpen(false);
    }
    
    async function handleSaveSongClick(){
        try{
            setSaving(true);
            let rawText = getRawText(songText);

            let data = { 
                pass, 
                uploader, 
                name: songName.trim(), 
                authors, 
                songText, 
                rawText, 
                videoLesson, 
                id: _songId,
                notation_format: notationFormat 
            }

            let error = await validationError(data);
            if(error) {
                setSaving(false);
                updateSnackData("warning", error, true);

                return;
            }

            let response;
            if(_songId) {
                response = await DB.updateSong(data)
            } else {
                response = await DB.storeSong(data)
            }

            if(response.error === "") {
                updateSnackData("success", response.msg, true);
                if(_songId) { setSaving(false); }
            } else {
                setSaving(false);
                updateSnackData("error", response.error, true);
            }
        } catch(error){
            setSaving(false);
            alert(error);
        }
    }

    function updateSnackData(severity, msg, open){
        setSnackSeverity(severity);
        setSnackMessage(msg);
        setSnackOpen(open);
    }

    async function validationError(data){
        if(!data.name) {
            return "სიმღერის სახელის ჩაწერა აუცილებელია";
        }
        if(!data.songText.length) {
            return "სიმღერის ტექსტის შეყვანა აუცილებელია. დააჭირეთ სტრიქონის დამატების ღილაკს";
        }

        let containsChord = false;
        let containsImage = false;
        let uniqueChords = new Set();
        
        // Get the notation directory from notations.js
        const notation = getNotation(data.notation_format);
        if (!notation) {
            return "არასწორი ნოტაციის ფორმატი";
        }
        
        for(let line of data.songText) {
            if(["text", "chorus"].includes(line.type) && line.chords && line.chords.length) {
                containsChord = true;
                // Collect unique chords
                for (let chord of line.chords) {
                    if (chord && chord.trim()) {
                        uniqueChords.add(chord.trim());
                    }
                }
            }
            if(line.type === "image" && line.value) {
                containsImage = true;
                break;
            }
        }

        if(!containsChord && !containsImage) {
            return "მონიშნეთ აკორდები ან დაამატეთ ტაბის სურათი. აკორდების მოსანიშნად ასოს თავზე დააჭირეთ პლიუს ნიშანს";
        }

        // Check if all unique chord files exist
        let missingChords = new Set();
        for (let chord of uniqueChords) {
            // Create a web-safe filename
            // Replace / with _ and # with sharp (or another safe replacement)
            const safeChordName = chord.replace(/\//g, '-').replace(/#/g, '_');
            const chordFile = `${notation.chordsDir}/${safeChordName}.png`;
            try {
                const response = await fetch(chordFile, { method: 'HEAD' });
                if (!response.ok) {
                    missingChords.add(chord);
                }
            } catch (e) {
                missingChords.add(chord);
            }
        }

        if (missingChords.size > 0) {
            const missingChordsList = Array.from(missingChords).join(", ");
            return `${notation.name} ${missingChordsList} ვერ მოიძებნა სისტემაში, გთხოვთ გამოიყენოთ ალტერნატიული, გავრცელებული აკორდი. აკორდების სრული სია შეგიძლიათ ნახოთ შემდეგ ბმულზე: ${process.env.NEXT_PUBLIC_DOMAIN}/chords_library`;
        }

        return false;
    }

    function getRawText(songText) {
        let text = "";

        for(let line of songText){
            if(["text", "chorus"].includes(line.type)) {
                text += " " + line.value
            }
        }

        return text;
    }

    // Get all available notation options
    const notationOptions = notations.flatMap(category => 
        category.tabs.map(tab => ({
            label: `${category.name} - ${tab.name}`,
            value: tab.code
        }))
    );

    return <>
            <div className={ styles.inputName }>
                <input className={css.textInput} type="text" value={songName} onChange={handleSongNameChange} style={{ width: "100%" }} placeholder={lang.upload.song_name_input} />
            </div>
            <div className={ styles.inputAuthors }>
                <AuthorsEditor _authors={authors} onAuthorsChange={setAuthors} />
            </div>
            <div className={ styles.inputVideo }>
                <input className={css.textInput} type="text" value={videoLesson} onChange={handleVideoLessonChange} style={{ width: "100%" }} placeholder={lang.upload.video_lesson_link} />
            </div>
            <div className={ styles.uploader }>
                <input className={css.textInput} type="text" value={uploader} onChange={handleUploaderChange} style={{ width: "100%" }} placeholder={lang.upload.uploader_name} />
            </div>
            <div className={ styles.notationFormat + " mt-[50px]" }>
                <div className="flex items-center mb-2">
                    <span className="text-white mr-2">{lang.upload.select_type}</span>
                    <div className="flex-1">
                        <CustomSelect
                            options={notationOptions}
                            value={notationFormat}
                            onChange={handleNotationFormatChange}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.textEditor}>
                <SongTextEditor _lines={songText} onSongTextChange={setSongText} />
            </div>
            <div className={ `${styles.saveSongBtn} capital` }>
                <Button disabled={saving ? true : false} style={{ background: "green", color: "white", fontSize: "1.3rem" }} size="large" onClick={handleSaveSongClick} variant="outlined" color='success'>{lang.upload.save}</Button>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackOpen}
                onClose={handleSnackClose}
                // autoHideDuration={4000}
                TransitionComponent={Slide}
                message="I love snacks"
                key={"top" + "right"} 
                >
                <Alert severity={snackSeverity} variant="filled" sx={{ width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
    </>
}