import React, { useState, useRef, useEffect } from 'react';
import { Button, TextField, Box, Modal, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { ReactSortable } from "react-sortablejs";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import styles from "./SongTextEditor.module.css";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import lang from '@/services/lang'
// Todo if song url has / in it we get wrong url and page can't be opened https://akordebi.ge/chord/chiti-werili/gia_toidze

const css = {
    textInput: "h-[50px] pl-5 text-white w-full bg-[rgba(255,255,255,.05)] shadow-[inset 12px 12px 30px rgba(53,123,230,.2)]"
}

const PoemEditor = ({onSongTextChange, _lines = []}) => {
  const [lines, setLines] = useState(_lines);

  useEffect(() => {
    onSongTextChange(lines);
  }, [lines])

  const [editId, setEditId] = useState(null);
  const [selectedLineIndex, setSelectedLineIndex] = useState(null);
  const [selectedCharIndex, setSelectedCharIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedChord, setselectedChord] = useState('');
  const [lineType, setLineType] = useState('');
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editId]);

  const addLine = (type) => {
    // let newId = lines.length ? (lines.map(line => line.id).sort((a,b) => { return a - b }).pop() + 1) : 1;
    let newId = Date.now();
    let newLine = { id: newId, type }

    if(type == "text") {
        newLine.chords = [];
        newLine.value = "";
        setLineType("text");
        setEditId(newLine.id);
    }

    // Todo if user adds multiple lines for rightHand, goes error
    if(type == "rightHand") {
        newLine.value = "";
        setLineType("rightHand");
        setEditId(newLine.id);
    }

    if(type == "break") {
        newLine.value = "";
    }

    if(type == "image") {
        newLine.value = "";
        setImageUploadOpen(true);
        setSelectedLineIndex(lines.length);  // Set index to the position where new line will be added
    }

    setLines([...lines, newLine]);
  };

  const duplicateLine = (lineIndex) => {
    const lineToDuplicate = {...lines[lineIndex]};
    const newLine = { ...lineToDuplicate, id: Date.now() };
    if(newLine.chords) {
      newLine.chords = [...newLine.chords];
    }
    setLines([...lines.slice(0, lineIndex + 1), newLine, ...lines.slice(lineIndex + 1)]);
  };

  const editLine = (id, value) => {
    let updatedLines = lines.map(line => {
      if (line.id === id) {
        return { ...line, value };
      }
      return line;
    })

    setLines(updatedLines);
  };

  const deleteLine = id => {
    let conf = confirm("დარწმუნებული ხართ რომ გინდათ სტრიქონის წაშლა?");
    if(conf) {
      setLines(lines.filter(line => line.id !== id));
    }
  };

  const handleEdit = lineId => {
    setEditId(lineId);
  };

  const handleUpdate = (lineId, value) => {
    editLine(lineId, value);
  };

  const handleSaveClick = () => {
    let newLines = handleMultiLineText();
    setLines(newLines);
    setEditId(null);
  }

  function handleMultiLineText(){
    let updatedLines = lines.flatMap(line => {
      if (line.value.includes("\n")) {
        // Split the value into an array by newline
        const values = line.value.split("\n");
        return values.map((val, index) => {
          // Calculate the start index for the chords of the current line
          const startChordIndex = index === 0 ? 0 : line.value.substring(0, line.value.indexOf(val)).split("\n").reduce((acc, curr) => acc + curr.length, 0);
          // Calculate the end index for the chords of the current line
          const endChordIndex = startChordIndex + val.length;
          return {
            id: Number(line.id.toString() + index), // Generate a new ID
            type: line.type,
            chords: line.chords.slice(startChordIndex, endChordIndex), // Slice the chords array to fit the current line
            value: val,
            chosen: line.chosen
          };
        });
      } else {
        // If no newline, return the line as is
        return line;
      }
    });

    updatedLines = updatedLines.map((line, index) => {
      while(true){
        let splitOpen = line.value.split(/\((.*)/s);
        if(splitOpen.length == 1) {
          break;
        }

        let beforeOpen = splitOpen[0];
        let splitClose = line.value.split(/\)(.*)/s);
        let chord = splitClose[0].split(beforeOpen)[1].split("(")[1];

        // Chord on beggining of line
        if(beforeOpen == "") {
          chord = splitClose[0].split("(")[1];
        }

        // Chord on end of line
        if(splitClose[1] == "") {
          chord = splitClose[0].split("(")[1];
        }

        let textAfterClose = splitClose[1];
        let newLineValue = beforeOpen + textAfterClose;

        if(splitClose[1] == "") {
          line.chords[beforeOpen.length - 1] = chord;
        } else {
          line.chords[beforeOpen.length] = chord;
        }
        
        line.value = newLineValue;
      }

      return line;
    });

    return updatedLines;
  }

  const handleOpen = (lineIndex, charIndex) => {
    setSelectedLineIndex(lineIndex);
    setSelectedCharIndex(charIndex);
    setOpen(true);
 
};

function makeLineStriqoni(lineId) {
  let line = lines.find((line) => { return line.id == lineId });
  line.type = "text";
  let newLines = [...lines];

  setLines(newLines);
}

function makeLineChorus(lineId) {
  let line = lines.find((line) => { return line.id == lineId });
  line.type = "chorus";
  let newLines = [...lines];

  setLines(newLines);
}

const handleClose = () => {
  setOpen(false);
};

const handleImageUploadClose = () => {
  setImageUploadOpen(false);
};

const handleNumberChange = event => {
  setselectedChord(event.target.value);
};

const handleSave = () => {
  const newLines = [...lines];
  newLines[selectedLineIndex].chords[selectedCharIndex] = selectedChord.trim();

  for(let i = 0; i < selectedCharIndex; i++) {
    if(!newLines[selectedLineIndex].chords[i]) {
        newLines[selectedLineIndex].chords[i] = "";
    }
  }

  setLines(newLines);
  setOpen(false);
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      
      // Update the value of the appropriate line with the base64 image
      const newLines = [...lines];
      newLines[selectedLineIndex].value = base64Image;
      
      setLines(newLines);
      setImageUploadOpen(false);
    };
    
    reader.readAsDataURL(file);
  }
};

return (
  <div>
    <ReactSortable list={lines} setList={setLines}>
    {lines.map((line, lineIndex) => (
      <Box key={line.id} my={2}>
        {line.id === editId ? (
            <div className={styles.editInputWrapper}>
                <textarea className={`${styles.editInput} ${css.textInput}`}
                    inputRef={inputRef}
                    value={line.value}
                    onChange={e => handleUpdate(line.id, e.target.value)}
                    rows={ getTextAreaRows(lineType) }
                    placeholder={ getTextAreaPlaceholder(lineType) }
                ></textarea>
                <Button className={styles.saveBtn} style={{ borderColor: "white", color: "white", marginLeft: "20px" }} color='primary' variant='outlined' onClick={handleSaveClick}>{lang.upload.editor_save}</Button>
            </div>
        ) : (
          <div className={styles.lineWrapper}>
            <div className={styles.lineActionBtns}>
                    <span className={styles.actionBtn}>
                      <Tooltip placement="top" title={lang.upload.editor_delete_title}>
                        <DeleteForeverIcon onClick={() => deleteLine(line.id)} />
                      </Tooltip>
                    </span>
                    <span className={styles.actionBtn}>
                      <Tooltip placement="top" title={lang.upload.editor_move_title}>
                        <SwapVertIcon />
                      </Tooltip>
                    </span>
                    <span className={styles.actionBtn}>
                      <Tooltip placement="top" title={lang.upload.editor_duplicate_title}>
                        <ContentCopyIcon onClick={() => duplicateLine(lineIndex)}/>
                      </Tooltip>
                    </span>
                {
                    ["text", "chorus", "rightHand"].includes(line.type) ?
                    <span className={styles.actionBtn}>
                      <Tooltip placement="top" title={lang.upload.editor_change_title}>
                        <EditIcon onClick={() => handleEdit(line.id)} />
                      </Tooltip>
                    </span>
                    :
                    <div className={styles.actionPlace}></div>
                }
                {
                    ["text"].includes(line.type) ?
                    <span className={styles.actionBtn}>
                      <Tooltip placement="top" title={lang.upload.editor_mark_title}>
                        <MusicNoteIcon onClick={() => makeLineChorus(line.id)} />
                      </Tooltip>
                    </span>
                    :
                    null
                }
                {
                    ["chorus"].includes(line.type) ?
                    <span className={styles.actionBtn}>
                      <Tooltip placement="top" title={lang.upload.editor_mark_string_title}>
                        <MusicOffIcon onClick={() => makeLineStriqoni(line.id)} />
                      </Tooltip>
                    </span>
                    :
                    null
                }
                {
                    ["break", "rightHand", "image"].includes(line.type) ?
                    <div className={styles.actionPlace}></div>
                    :
                    null
                }
            </div>
            {
                line.type == "text" || line.type == "chorus" ?
                <div className={line.type + "LineWrapper"}>
                  {
                    line.value.split('').map((char, charIndex) => (
                    <div className={styles.bitWrapper} onClick={() => handleOpen(lineIndex, charIndex)} key={`${lineIndex}-${charIndex}`}>
                        {line.chords[charIndex] ? (
                            <>
                                <div className={styles.charLabel}>{char}</div>
                                <div className={styles.chordLabel}>{line.chords[charIndex]}</div>
                            </>
                        ) : (
                            <>
                                <div className={styles.charLabel}>{char}</div>
                                <div className={`${styles.chordLabel} ${styles.addChord}`}><AddIcon style={{ fontSize: "10px" }} /></div>
                            </>
                        )}
                    </div>
                    ))
                    }
                  </div>
                :
                null
            }
            {
                line.type == "rightHand" ?
                <div className={styles.rightHand}>
                  {
                    Array.from(line.value).map((char) => char === " " ? " \u00A0 " : char).reduce((previous, current) => {
                        return previous += current;
                    }, "")
                  }
                </div>
                :
                null
            }
            {
                line.type == "break" ?
                <div className={styles.breakDiv}>
                </div>
                :
                null
            }
            {
                line.type == "image" && line.value ?
                <div className={styles.imageContainer}>
                  <img 
                    src={line.value} 
                    alt="Uploaded tab or music note" 
                    style={{ maxWidth: '100%', marginTop: '10px' }} 
                  />
                </div>
                :
                null
            }
          </div>
        )}
      </Box>
    ))}
    </ReactSortable>
    <Box my={2}>
        <div className={styles.poemActionBtns}>
            <div className={styles.poemActionBtn}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => { addLine("rightHand") }}
                >
                 {lang.upload.addition_right_hand_button}
                </Button>
            </div>
            <div className={styles.poemActionBtn}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => { addLine("text") }}
                >
                    {lang.upload.add_string_button}
                </Button>
            </div>
            <div className={styles.poemActionBtn}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => { addLine("image") }}
                >
                    {lang.upload.add_image_button || "Add Image"}
                </Button>
            </div>
        </div>
    </Box>
    <Modal open={open} onClose={handleClose}>
      <div style={{ position: 'absolute', width: 400, backgroundColor: "#004aad", borderRadius: "4px", padding: "35px", top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography variant="h6">{lang.upload.write_chord}</Typography>
        <input type="text" className={`${css.textInput} my-[30px]`}
          value={selectedChord}
          onChange={handleNumberChange}
          placeholder={`${lang.upload.ex} Am, F#, Csus4/Bb`}
        />
          <Button variant="contained" color="primary" onClick={handleSave}>
             {lang.upload.editor_save}
          </Button>
        
      </div>
    </Modal>
    <Modal open={imageUploadOpen} onClose={handleImageUploadClose}>
      <div style={{ position: 'absolute', width: 400, backgroundColor: "#004aad", borderRadius: "4px", padding: "35px", top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {/* <Typography variant="h6">{lang.upload.upload_image || "Upload Image"}</Typography> */}
        <Typography variant="h8">{lang.upload.upload_image_instructions || "Upload Image"}</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{
            display: 'block',
            margin: '20px 0',
            color: 'white'
          }}
        />
        <Button variant="contained" color="primary" onClick={handleImageUploadClose}>
          {lang.upload.cancel || "Cancel"}
        </Button>
      </div>
    </Modal>
  </div>
);
};

function getTextAreaPlaceholder(type) {
  if(type == "rightHand") {
    return lang.placeholder.rightHand;
  }

  if(type == "text") {
    return lang.placeholder.songText;
  }

  return "";
}

function getTextAreaRows(type) {
  if(type == "rightHand") {
    return 3;
  }

  if(type == "text") {
    return 25;
  }

  return 6;
}

export default PoemEditor;