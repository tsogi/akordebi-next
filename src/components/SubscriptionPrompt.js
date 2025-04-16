import React from 'react';
import styles from './SubscriptionPrompt.module.css';

const SubscriptionPrompt = ({ onSubscribe }) => {
  return (
    <div className={styles.subscriptionPrompt}>
      <div className={styles.promptContent}>
        <h3 className={styles.promptTitle}>Full Access Required</h3>
        <p className={styles.promptText}>
          Subscribe to view the complete song with chords and lyrics
        </p>
        <button 
          className={styles.subscribeButton} 
          onClick={onSubscribe}
        >
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPrompt; 