import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import styles from "./AuthorsEditor.module.css";
import { useLanguage } from '@/context/LanguageContext';

const css = {
    textInput: "h-[50px] pl-5 text-white w-full bg-[rgba(255,255,255,.05)] shadow-[inset 12px 12px 30px rgba(53,123,230,.2)]"
}

const AuthorsEditor = ({ onAuthorsChange, _authors = [{ id: 1, name: '' }] }) => {
  const [authors, setAuthors] = useState(_authors);
  const { lang } = useLanguage();

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
            <input type="text" className={`${styles.authorInput} ${css.textInput}`} onChange={e => editInput(input.id, e.target.value)} value={input.name} placeholder={lang.upload.authors.authorName} />
            <Tooltip placement="top" title={lang.upload.authors.delete}>
              <DeleteForeverIcon className={styles.deleteAuthorIcon} onClick={() => deleteInput(input.id)}></DeleteForeverIcon>
            </Tooltip>
          </div>
        ))}
      </div>
      <Button className={styles.addAuthorBtn} variant="contained" color="primary" onClick={addInput}>{lang.upload.authors.add}</Button>
    </div>
  );
};

export default AuthorsEditor;