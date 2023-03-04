import React, { useState, useRef, useEffect } from 'react';
import { Button, TextField, Container, Box, Modal, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { ReactSortable } from "react-sortablejs";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import styles from "./SongTextEditor.module.css";

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

    if(type == "text" || type == "chorus") {
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
    setLines(lines.filter(line => line.id !== id));
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

const handleClose = () => {
  setOpen(false);
};

const handleNumberChange = event => {
  setselectedChord(event.target.value);
};

const handleSave = () => {
  const newLines = [...lines];
  newLines[selectedLineIndex].chords[selectedCharIndex] = selectedChord;

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
                <TextField className={styles.editInput}
                    inputRef={inputRef}
                    value={line.value}
                    onChange={e => handleUpdate(line.id, e.target.value)}
                />
                <Button style={{ marginLeft: "20px" }} color='primary' variant='outlined' onClick={handleSaveClick}>შენახვა</Button>
            </div>
        ) : (
          <div className={styles.lineWrapper}>
            <div className={styles.dragIcon}>
              <Tooltip placement="left" title="სტრიქონის გადატანა">
                <SwapVertIcon />
              </Tooltip>
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
            <div className={styles.lineActionBtns}>
                {
                    ["text", "chorus", "rightHand"].includes(line.type) ?
                    <Tooltip placement="top" title="სტრიქონის შეცვლა">
                      <EditIcon style={{ cursor: "pointer" }} onClick={() => handleEdit(line.id)} />
                    </Tooltip>
                    :
                    null
                }
                <Tooltip placement="top" title="სტრიქონის წაშლა">
                  <DeleteForeverIcon style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => deleteLine(line.id)} />
                </Tooltip>
            </div>
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
                    მარჯვენა ხელის დამატება
                </Button>
            </div>
            <div className={styles.poemActionBtn}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => { addLine("text") }}
                >
                    სტრიქონის დამატება
                </Button>
            </div>
            <div className={styles.poemActionBtn}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => { addLine("chorus") }}
                >
                    მისამღერის სტრიქონის დამატება
                </Button>
            </div>
            <div className={styles.poemActionBtn}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => { addLine("break") }}
                >
                    გამოტოვების დამატება
                </Button>
            </div>
        </div>
    </Box>
    <Modal open={open} onClose={handleClose}>
      <div style={{ position: 'absolute', width: 400, backgroundColor: "white", borderRadius: "4px", padding: "35px", top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography variant="h6">ჩაწერეთ აკორდი</Typography>
        <TextField
          label="აკორდი"
          value={selectedChord}
          onChange={handleNumberChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          შენახვა
        </Button>
      </div>
    </Modal>
  </div>
);
};

export default PoemEditor;