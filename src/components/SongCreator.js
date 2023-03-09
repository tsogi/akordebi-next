import * as React from 'react';
import styles from  "@/components/SongCreator.module.css";
import { Alert } from '@mui/material';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AuthorsEditor from '@/components/AuthorsEditor';
import DB from "@/services/data";
import SongTextEditor from "@/components/SongTextEditor";
import Snackbar from '@mui/material/Snackbar';

export default function SongCreator({ _songName = "", _authors = [], _songText = [], _videoLesson = "", _songId = null, _uploader = "" }){
    const [songName, setSongName] = React.useState(_songName);
    const [authors, setAuthors] = React.useState(_authors);
    const [songText, setSongText] = React.useState(_songText);
    const [videoLesson, setVideoLesson] = React.useState(_videoLesson);
    const [uploader, setUploader] = React.useState(_uploader);
    const [saving, setSaving] = React.useState(false);
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackSeverity, setSnackSeverity] = React.useState();
    const [snackMessage, setSnackMessage] = React.useState("");
    
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

    function handleSnackClose(){
        setSnackOpen(false);
    }
    
    async function handleSaveSongClick(){
        try{
            setSaving(true);
            let rawText = getRawText(songText);

            let data = { uploader, name: songName.trim(), authors, songText, rawText, videoLesson, id: _songId }

            let error = validationError(data);
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

    function validationError(data){
        if(!data.name) {
            return "სიმღერის სახელის ჩაწერა აუცილებელია";
        }

        if(data.name.includes("_") || data.name.includes("-") || data.name.includes("~")) {
            return "სახელში ტირე, ქვედა ტირე და ტილდა (- _ ~) სიმბოლოების გამოყენება არ შეიძლება";
        }

        if(!data.songText.length) {
            return "სიმღერის ტექსტის შეყვანა აუცილებელია. დააჭირეთ სტრიქონის დამატების ღილაკს";
        }

        let containsChord = false;
        for(let line of data.songText) {
            if(["text", "chorus"].includes(line.type) && line.chords.length) {
                containsChord = true;
                break;
            }
        }

        if(!containsChord) {
            return "მონიშნეთ აკორდები. ამისათვის ასოს თავზე დააჭირეთ პლიუს ნიშანს";
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

    return <>
            <div className={ styles.inputName }>
                <TextField value={songName} onChange={handleSongNameChange} style={{ width: "100%" }} label="ჩაწერეთ სიმღერის სახელი" id="fullWidth" />
            </div>
            <div className={ styles.inputAuthors }>
                <AuthorsEditor _authors={authors} onAuthorsChange={setAuthors} />
            </div>
            <div className={ styles.inputVideo }>
                <TextField value={videoLesson} onChange={handleVideoLessonChange} style={{ width: "100%" }} placeholder={"youtube-ის ლინკი. მაგ. youtube.com/watch?v=O08BvtiPka8"} label="ვიდეო გაკვეთილის ლინკი (არასავალდებულო)" id="fullWidth" />
            </div>
            <div className={ styles.uploader }>
                <TextField value={uploader} onChange={handleUploaderChange} style={{ width: "100%" }} placeholder={"გამოჩნდება სიმღერის ტექსტის ქვემოთ"} label="ამტვირთის სახელი/გვარი (არასავალდებულო)" id="fullWidth" />
            </div>
            <div className={styles.textEditor}>
                <SongTextEditor _lines={songText} onSongTextChange={setSongText} />
            </div>
            <div className={ `${styles.saveSongBtn} capital` }>
                <Button disabled={saving ? true : false} style={{ fontSize: "1.3rem" }} size="large" onClick={handleSaveSongClick} variant="contained">სიმღერის შენახვა</Button>
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