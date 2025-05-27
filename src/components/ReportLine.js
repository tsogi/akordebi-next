import { useEffect, useState } from 'react';
import styles from './ReportLine.module.css';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import { useLanguage } from '@/context/LanguageContext';

export default function ReportLine({ lineNumber, lineText, songUrl }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reportText, setReportText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { lang } = useLanguage();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    useEffect(() => {
        console.log(lineText, lineText.length);
    }, [lineText]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reportText.trim()) return;

        setIsSubmitting(true);
        
        try {
            const response = await fetch('/api/report-line', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lineNumber,
                    lineText,
                    songUrl: window.location.pathname,
                    reportText
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    closeModal();
                    // Reset after closing
                    setTimeout(() => {
                        setSubmitted(false);
                        setReportText('');
                    }, 300);
                }, 5000);
            } else {
                throw new Error('Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (lineText.length === 0) {
        return null;
    }

    return (
        <div className={styles.reportContainer}>
            <button 
                className={styles.reportButton} 
                onClick={openModal}
                aria-label="Report issue with this line"
            >
                <FlagIcon className={styles.reportIcon} />
            </button>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>{lang?.report?.title || 'Report an Issue'}</h3>
                            <button 
                                className={styles.closeButton} 
                                onClick={closeModal}
                                aria-label="Close report modal"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        
                        {submitted ? (
                            <div className={styles.successMessage}>
                                <p>{lang?.report?.success || 'Thank you for your report!'}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className='text-black'>
                                <div className={styles.linePreview}>
                                    <p><strong>{lang?.report?.linePreview || 'სტრიქონი'}:</strong> {lineText}</p>
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <textarea
                                        className={styles.textarea}
                                        value={reportText}
                                        onChange={(e) => setReportText(e.target.value)}
                                        placeholder={lang.report.placeholder}
                                        rows={5}
                                        required
                                    />
                                </div>
                                
                                <div className={styles.buttonGroup}>
                                    <button 
                                        type="button" 
                                        className={styles.cancelButton}
                                        onClick={closeModal}
                                    >
                                        {lang?.report?.cancel || 'Cancel'}
                                    </button>
                                    <button 
                                        type="submit" 
                                        className={styles.submitButton}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting 
                                            ? (lang?.report?.submitting || 'Submitting...') 
                                            : (lang?.report?.submit || 'Submit')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 