import * as React from 'react';
import "./CreateSongPage.css";
import { Alert } from '@mui/material';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Header from "../components/Header";
import AuthorsEditor from './AuthorsEditor';
import DB from "../services/db";
import SongTextEditor from "./SongTextEditor";
import Footer from '../components/Footer';
import Snackbar from '@mui/material/Snackbar';

export default function CreateSongPage(){
    const [songName, setSongName] = React.useState("");
    const [authors, setAuthors] = React.useState([]);
    const [songText, setSongText] = React.useState([]);
    const [saving, setSaving] = React.useState(false);
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackSeverity, setSnackSeverity] = React.useState();
    const [snackMessage, setSnackMessage] = React.useState("");
    const [videoLesson, setVideoLesson] = React.useState("");
    
    function handleSongNameChange(event) {
        let name = event.target.value;

        setSongName(name);
    }

    function handleVideoLessonChange(event) {
        let video = event.target.value;

        setVideoLesson(video);
    }

    function handleSnackClose(){
        setSnackOpen(false);
    }
    
    async function handleSaveSongClick(){
        setSaving(true);
        let rawText = getRawText(songText);

        let data = { name: songName, authors, songText, rawText, videoLesson }

        let error = validationError(data);
        if(error) {
            setSaving(false);
            updateSnackData("warning", error, true);

            return;
        }

        let response = await DB.storeSong(data)

        if(response.error === "") {
            updateSnackData("success", response.msg, true);
        } else {
            setSaving(false);
            updateSnackData("error", response.error, true);
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
        <Header />
        <div className="createSongPage page_container">
            <div className='inputName'>
                <TextField value={songName} onChange={handleSongNameChange} style={{ width: "400px" }} label="ჩაწერეთ სიმღერის სახელი" id="fullWidth" />
            </div>
            <div className='inputAuthors'>
                <AuthorsEditor onAuthorsChange={setAuthors} />
            </div>
            <div className='inputVideo'>
                <TextField value={videoLesson} onChange={handleVideoLessonChange} style={{ width: "600px" }} label="ვიდეო გაკვეთილის ლინკი (არასავალდებულო)" id="fullWidth" />
            </div>
            <SongTextEditor onSongTextChange={setSongText} />
            <div className='saveSongBtn capital'>
                <Button disabled={saving ? true : false} style={{ fontSize: "1.3rem" }} size="large" onClick={handleSaveSongClick} variant="contained">სიმღერის შენახვა</Button>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackOpen}
                onClose={handleSnackClose}
                autoHideDuration={4000}
                TransitionComponent={Slide}
                message="I love snacks"
                key={"top" + "right"} 
                >
                <Alert severity={snackSeverity} variant="filled" sx={{ width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </div>
        <Footer />
    </>
}