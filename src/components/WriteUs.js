import { useState } from "react";
import styles from "./WriteUs.module.css";
import lang from '@/services/lang'
import Alert from "./Alert";
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export default function WriteUs(){
  const [text, setText] = useState("");
  const [showAlert,setShowAlert] = useState(false);
  const [showError,setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  async function handleSend(){
    if(!text.trim()) {
      alert(lang._enter_text);
      return;
    }

    setIsSubmitting(true);

    try {
      let msg = `${process.env.NEXT_PUBLIC_DOMAIN} feedback: ${text}`;

      const response = await fetch("/api/feedback", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: msg })
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      setText("");
      setShowAlert(true);
    } catch(error){
      console.log(error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleInputPress(event){
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className={styles.container}>
      <Alert 
        type="success" 
        duration={10} 
        message={lang._comment_sent} 
        open={showAlert} 
        setOpen={setShowAlert}
      />
      <Alert 
        type="error" 
        duration={10} 
        message={lang._comment_not_sent} 
        open={showError} 
        setOpen={setShowError}
      />
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleInputPress}
          placeholder={lang._footer_input_placeholder}
          className={styles.input}
        />
        <button 
          onClick={handleSend}
          disabled={isSubmitting || !text.trim()} 
          className={styles.sendButton}
          aria-label="Send feedback"
        >
          <PaperAirplaneIcon className={styles.sendIcon} />
        </button>
      </div>
    </div>
  );
}