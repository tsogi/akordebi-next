import { useState } from "react";
import styles from "./WriteUs.module.css";
import lang from '@/services/lang'
import Alert from "./Alert";

export default function WriteUs(){
  const [text, setText] = useState("");
  const [showAlert,setShowAlert] = useState(false);
  const [showError,setShowError] = useState(false);

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  async function handleSend(){
    if(!text) {
      alert("ჩაწერეთ ტექსტი");
      return;
    }

    try {
      let msg = `${process.env.NEXT_PUBLIC_DOMAIN} feedback: ${text}`;

      const response = await fetch("/api/sendSlack", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: msg })
      });

      setText("");

      setShowAlert(true)
    } catch(error){
      console.log(error);
      setShowError(true)
    }
  }

  function handleInputPress(event){
    if (event.key === 'Enter') {
        handleSend();
    }
  }

    
    return <>
    <Alert type="success" duration={10} message={"თქვენი კომენტარი წარმატებით გაიგზავნა"} open={showAlert} setOpen={setShowAlert}/>
    <Alert type="error" duration={10} message={"მესიჯი ვერ გაიგზავნა. გთხოვთ მოგვწეროთ მეილზე tsogiaidze@yahoo.com"} open={showError} setOpen={setShowError}/>
    <div className="flex w-full relative">
    <input type='text' id={styles.test} className={`${styles.input} text-xs leading-5 tracking-tight h-12 w-full border-b border-f2ac2b bg-opacity-2 py-3 px-5 text-white`} label={lang._footer_input}
        value={text}
        placeholder={lang._footer_input_placeholder}
        onChange={handleInputChange}
        onKeyDown={handleInputPress}
      />
      <button onClick={handleSend} className="absolute top-[12px] right-3"
      type="submit"> 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </div>
    </>
}