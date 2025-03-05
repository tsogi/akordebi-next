import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import styles from './NewsModal.module.css';

export default function NewsModal({ message, title, duration = 5, name = 'default' }) {
  const [showModal, setShowModal] = useState(false);
  const [canClose, setCanClose] = useState(false);
  
  useEffect(() => {
    const checkAndShowModal = async () => {
      try {
        console.log('Checking modal visibility for:', name); // Debug log
        const response = await fetch(`/api/newsModal/check?name=${encodeURIComponent(name)}`);
        const data = await response.json();
        
        console.log('Modal check response:', data); // Debug log
        
        if (data.shouldShow) {
          setShowModal(true);
          // Start the timer for the close button
          setTimeout(() => {
            setCanClose(true);
          }, duration * 1000);
        }
      } catch (error) {
        console.error('Error checking modal status:', error);
      }
    };

    checkAndShowModal();
  }, [duration, name]);

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
    <div className={styles.overlay} onClick={canClose ? handleClose : undefined}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {canClose && (
            <button 
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close modal"
            >
              <XMarkIcon className={styles.closeIcon} />
            </button>
          )}
        </div>
        <div className={styles.content}>
          {message}
        </div>
        {!canClose && (
          <div className={styles.timer}>
            The close button will appear in {duration} seconds
          </div>
        )}
      </div>
    </div>
  );
} 