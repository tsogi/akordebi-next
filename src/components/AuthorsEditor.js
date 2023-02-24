import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import styles from "./AuthorsEditor.module.css";

const AuthorsEditor = ({ onAuthorsChange }) => {
  const [authors, setAuthors] = useState([{ id: 1, name: '' }]);

  const addInput = () => {
    const newInput = { id: authors.length + 1, name: '' };
    setAuthors([...authors, newInput]);
  };

  useEffect(() => {
    onAuthorsChange(authors);
  }, [authors])

  const editInput = (id, value) => {
    setAuthors(
      authors.map(input => {
        if (input.id === id) {
          return { ...input, name: value };
        }
        return input;
      })
    );
  };

  const deleteInput = id => {
    setAuthors(authors.filter(input => input.id !== id));
  };

  return (
    <div className={styles.authorsEditor}>
      <div className={styles.authorsWrapper}>
        {authors.map((input, index) => (
          <div className={styles.authorWrapper} key={input.id}>
            <TextField className={styles.authorInput} onChange={e => editInput(input.id, e.target.value)} value={input.name} label={`ჩაწერეთ ავტორი`} />
            <Tooltip placement="top" title="ავტორის წაშლა">
              <DeleteForeverIcon className={styles.deleteAuthorIcon} onClick={() => deleteInput(input.id)}></DeleteForeverIcon>
            </Tooltip>
          </div>
        ))}
      </div>
      <Button onClick={addInput}>ავტორის დამატება</Button>
    </div>
  );
};

export default AuthorsEditor;