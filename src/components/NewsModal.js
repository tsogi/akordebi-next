import { useState, useEffect } from 'react';
import styles from './NewsModal.module.css';

export default function NewsModal({ children, title, duration = 5, name = 'default' }) {
  const [showModal, setShowModal] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    const checkAndShowModal = async () => {
      try {
        const response = await fetch(`/api/newsModal/check?name=${encodeURIComponent(name)}`);
        const data = await response.json();
        
        if (data.shouldShow) {
          setShowModal(true);
          setTimeLeft(duration);
        }
      } catch (error) {
        console.error('Error checking modal status:', error);
      }
    };

    checkAndShowModal();
  }, [duration, name]);

  useEffect(() => {
    if (!showModal) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanClose(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showModal]);

  const handleClose = async () => {
    if (!canClose) return;
    
    try {
      await fetch('/api/newsModal/markSeen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error marking modal as seen:', error);
    }
  };

  if (!showModal) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.footer}>
          <button 
            className={`${styles.closeButton} ${canClose ? styles.enabled : styles.disabled}`}
            onClick={handleClose}
            disabled={!canClose}
          >
            <span>დახურვა</span>
            {!canClose && <span className={styles.countdown}>{timeLeft}</span>}
          </button>
        </div>
      </div>
    </div>
  );
} 