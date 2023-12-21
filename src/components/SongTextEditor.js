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

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editId]);

  const addLine = (type) => {
    let newId = lines.length ? (lines.map(line => line.id).sort((a,b) => { return a - b }).pop() + 1) : 1;
    let newLine = { id: newId, type }

    if(type == "text") {
        newLine.chords = [];
        newLine.value = "";
        setEditId(newLine.id);
    }

    if(type == "rightHand") {
        newLine.value = "";
        setEditId(newLine.id);
    }

    if(type == "break") {
        newLine.value = "";
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
    setLines(
      lines.map(line => {
        if (line.id === id) {
          return { ...line, value };
        }
        return line;
      })
    );
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
    setEditId(null);
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

return (
  <div>
    <ReactSortable list={lines} setList={setLines}>
    {lines.map((line, lineIndex) => (
      <Box key={line.id} my={2}>
        {line.id === editId ? (
            <div className={styles.editInputWrapper}>
                <input type="text" className={`${styles.editInput} ${css.textInput}`}
                    inputRef={inputRef}
                    value={line.value}
                    onChange={e => handleUpdate(line.id, e.target.value)}
                />
                <Button className={styles.saveBtn} style={{ marginLeft: "20px" }} color='primary' variant='outlined' onClick={handleSaveClick}>{lang.upload.editor_save}</Button>
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
                    ["break", "rightHand"].includes(line.type) ?
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
          </div>
        )}
      </Box>
    ))}
    </ReactSortable>
    <Box my={2}>
        <div className={styles.poemActionBtns}>
            <div className={styles.poemActionBtn}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => { addLine("rightHand") }}
                >
                 {lang.upload.addition_right_hand_button}
                </Button>
            </div>
            <div className={styles.poemActionBtn}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => { addLine("text") }}
                >
                    {lang.upload.add_string_button}
                </Button>
            </div>
            <div className={styles.poemActionBtn}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => { addLine("break") }}
                >
                {lang.upload.add_skip_button}
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
  </div>
);
};

export default PoemEditor;