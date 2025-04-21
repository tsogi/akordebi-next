import { useState } from 'react';
import styles from './GuitarQuiz.module.css';
import Image from 'next/image';
import uiDb from '@/services/data';

const questions = [
  {
    id: 1,
    question: {
      en: "What's your budget range?",
      ge: "რა ბიუჯეტი გაქვთ?"
    },
    options: [
      { value: "budget", label: { en: "Under 200 gel", ge: "200-მდე" }},
      { value: "midRange", label: { en: "From 200 to 500 gel", ge: "200 - 500ლ" }},
      { value: "premium", label: { en: "From 500 to 1000 gel", ge: "500 - 1000ლ" }},
      { value: "doesNotMatter", label: { en: "Unlimited budget", ge: "ნებისმიერი ფასი" }}
    ]
  },
  {
    id: 2,
    question: {
      en: "How important is the guitar's appearance to you?",
      ge: "რამდენად მნიშვნელოვანია გიტარის გარეგნული მხარე?"
    },
    options: [
      { value: "very", label: { en: "Very important - I want it to look stunning", ge: "ძალიან მნიშვნელოვანი - მინდა რომ შესანიშნავად გამოიყურებოდეს" }},
      { value: "somewhat", label: { en: "Somewhat - Nice to have but not crucial", ge: "მეტნაკლებად - კარგია, მაგრამ არა გადამწყვეტი" }},
      { value: "not", label: { en: "Not important - Only care about sound", ge: "არ არის მნიშვნელოვანი - მხოლოდ ჟღერადობა მაინტერესებს" }}
    ]
  },
  {
    id: 3,
    question: {
      en: "Do you prefer playing with fingers or a pick?",
      ge: "თითებით დაკვრას ამჯობინებთ თუ მედიატორით?"
    },
    options: [
      { value: "fingers", label: { en: "Fingerstyle playing", ge: "თითებით დაკვრა" }},
      { value: "pick", label: { en: "Using a pick", ge: "მედიატორით დაკვრა" }},
      { value: "both", label: { en: "Both equally", ge: "ორივე თანაბრად" }},
      { value: "unsure", label: { en: "Not sure yet", ge: "ჯერ არ ვიცი" }}
    ]
  },
  {
    id: 4,
    question: {
      en: "How important is portability to you?",
      ge: "რამდენად მნიშვნელოვანია გიტარის პორტატულობა?"
    },
    options: [
      { value: "very", label: { en: "Very important - I want to travel with it", ge: "ძალიან - მინდა რომ თან ვატარო" }},
      { value: "somewhat", label: { en: "Somewhat - Might take it places occasionally", ge: "მეტნაკლებად - შეიძლება პერიოდულად ვატარო" }},
      { value: "not", label: { en: "Not important - It will stay at home", ge: "არ არის მნიშვნელოვანი - სახლში გამოვიყენებ" }}
    ]
  },
  {
    id: 5,
    question: {
      en: "What style of music do you primarily want to play?",
      ge: "მუსიკის რომელი სტილის დაკვრა გსურთ?"
    },
    options: [
      { value: "pop", label: { en: "Pop", ge: "პოპი" }},
      { value: "rock_metal", label: { en: "Rock/Metal", ge: "როკი/მეტალი" }},
      { value: "classical", label: { en: "Classical", ge: "კლასიკური" }},
      { value: "hiphop", label: { en: "Hip-Hop", ge: "ჰიპ-ჰოპი" }},
      { value: "folk", label: { en: "Folk", ge: "ფოლკლორი" }},
      { value: "jazz", label: { en: "Jazz", ge: "ჯაზი" }},
      { value: "blues", label: { en: "Blues", ge: "ბლუზი" }},
      { value: "all", label: { en: "More or less all", ge: "მეტნაკლებად ყველაფრის" }}
    ]
  },
  {
    id: 6,
    question: {
      en: "What's your current skill level?",
      ge: "რა დონის გიტარისტი ხართ?"
    },
    options: [
      { value: "super_beginner", label: { en: "Complete Beginner", ge: "სრული დამწყები" }},
      { value: "beginner", label: { en: "Beginner", ge: "დამწყები" }},
      { value: "intermediate", label: { en: "Medium Experience", ge: "საშუალო" }},
      { value: "advanced", label: { en: "Experienced Player", ge: "გამოცდილი" }},
      { value: "superstar", label: { en: "Superstar", ge: "პროფესიონალი" }}
    ]
  },
  {
    id: 7,
    question: {
      en: "Do you plan to perform live on stage?",
      ge: "აპირებთ სცენაზე შესრულებას?"
    },
    options: [
      { value: "yes", label: { en: "Yes", ge: "დიახ" }},
      { value: "no", label: { en: "No", ge: "არა" }},
      { value: "maybe", label: { en: "Maybe in the future", ge: "შესაძლოა მომავალში" }}
    ]
  },
  {
    id: 8,
    question: {
      en: "What's your preferred playing position?",
      ge: "რომელ პოზიციაში ამჯობინებთ დაკვრას?"
    },
    options: [
      { value: "sitting", label: { en: "Mostly sitting down", ge: "ძირითადად მჯდომარე" }},
      { value: "standing", label: { en: "Mostly standing up", ge: "ძირითადად ფეხზე მდგომი" }},
      { value: "both", label: { en: "Both equally", ge: "ორივე თანაბრად" }}
    ]
  },
  {
    id: 9,
    question: {
      en: "How important is having built-in electronics (pickup/preamp)?",
      ge: "გსურთ გიტარის ხმის გამაძლიერებელთან მიერთება?"
    },
    options: [
      { value: "must", label: { en: "Must have - Want to plug into an amp", ge: "აუცილებელია - მინდა გამაძლიერებელთან მიერთება" }},
      { value: "nice", label: { en: "Nice to have but not required", ge: "კარგია, მაგრამ არა აუცილებელი" }},
      { value: "not", label: { en: "No need at all", ge: "არ დამჭირდება" }}
    ]
  },
  {
    id: 10,
    question: {
      en: "What's your hand size?",
      ge: "რა ზომის ხელები გაქვთ?"
    },
    options: [
      { value: "small", label: { en: "Small - Prefer smaller necks", ge: "პატარა - მირჩევნია პატარა გრიფი" }},
      { value: "medium", label: { en: "Average", ge: "საშუალო" }},
      { value: "large", label: { en: "Large - Comfortable with wider necks", ge: "დიდი - კომფორტულად ვგრძნობ თავს განიერ გრიფზე" }}
    ]
  }
];

// Add modal content
const modalContent = {
  title: {
    ge: "როგორ მუშაობს გიტარის შერჩევა?",
    en: "How does the Guitar Finder work?"
  },
  description: {
    ge: `ჩვენი გიტარის შერჩევის სისტემა გეხმარებათ იდეალური გიტარის პოვნაში თქვენი საჭიროებების მიხედვით:

    1. პასუხობთ მარტივ კითხვებს თქვენი პრეფერენციების შესახებ
    2. სისტემა აანალიზებს თქვენს პასუხებს ხელოვნური ინტელექტის მეშვეობით
    3. გთავაზობთ საუკეთესო გიტარას თქვენი მოთხოვნების შესაბამისად
    
    რეკომენდაცია ეფუძნება პროფესიონალი გიტარისტების გამოცდილებას და რჩევებს.`,
    en: `Our Guitar Finder system helps you find the perfect guitar based on your needs:

    1. Answer simple questions about your preferences
    2. System analyzes your responses
    3. Get personalized guitar recommendations
    
    All recommendations are based on professional guitarists' experience and advice.`
  }
};

// Update InfoIcon to QuestionIcon
const QuestionIcon = () => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

// Add confetti effect component at the top
const Confetti = () => (
  <div className={styles.confetti}>
    {[...Array(50)].map((_, i) => (
      <div key={i} className={styles.confettiPiece} style={{
        '--delay': `${Math.random() * 3}s`,
        '--rotation': `${Math.random() * 360}deg`,
        '--position': `${Math.random() * 100}%`,
      }}></div>
    ))}
  </div>
);

export default function GuitarQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const formatAnswersForAPI = (currentAnswers = answers) => {
    return questions.map(q => {
      const selectedOption = q.options.find(opt => opt.value === currentAnswers[q.id]);
      return {
        question: q.question.en,
        answer: selectedOption ? selectedOption.label.en : currentAnswers[q.id]
      };
    });
  };

  const handleAnswer = async (answer) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: answer };
    setAnswers(newAnswers);
    
    // Log the user's answer selection
    const questionText = questions[currentQuestion].question.en;
    const selectedOption = questions[currentQuestion].options.find(opt => opt.value === answer);
    const answerText = selectedOption ? selectedOption.label.en : answer;
    // await uiDb.logEvent("guitar_finder_answer", { 
    //   question: questionText,
    //   answer: answerText,
    //   questionIndex: currentQuestion
    // });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      setIsLoading(true);
      setError(null);
      
      // Ensure the last answer is included before making the API call
      const finalAnswers = { ...newAnswers };
      
      try {
        const response = await fetch('/api/guitar-recommendation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers: formatAnswersForAPI(finalAnswers)
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get recommendation');
        }

        const data = await response.json();
        const recommendationData = {
          ...data.recommendation,
          summary: data.summary
        };
        
        setRecommendation(recommendationData);
        
        // Log the successful recommendation
        // await uiDb.logEvent("guitar_finder_recommendation", {
        //   name: recommendationData.name,
        //   price: recommendationData.price,
        //   thumbnail: recommendationData.thumbnail || 'no-image',
        //   link: recommendationData.link,
        //   summary: data.summary
        // });
        
      } catch (err) {
        const errorMessage = 'Failed to get recommendation. Please try again.';
        setError(errorMessage);
        console.error('Error:', err);
        
        // Log the error
        // await uiDb.logEvent("guitar_finder_error", {
        //   error: err.message || errorMessage
        // });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    return (
      <>
        <h1 className={styles.mainTitle}>
          იპოვე შენთვის იდეალური გიტარა
          <button 
            className={styles.questionButton}
            onClick={() => setShowModal(true)}
            aria-label="ინფორმაცია"
          >
            <QuestionIcon />
          </button>
        </h1>
        <div className={`${styles.quizContainer} ${styles.resultsContainer}`}>
          {isLoading ? (
            <p className={styles.description}>გთხოვთ დაიცადოთ, ვარჩევთ თქვენთვის საუკეთესო გიტარას...</p>
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
              <button onClick={resetQuiz} className={styles.resetButton}>
                სცადეთ თავიდან
              </button>
            </div>
          ) : recommendation ? (
            <>
              <Confetti />
              <div className={styles.successMessage}>
                <h2 className={styles.congratsTitle}>გილოცავთ! 🎉</h2>
                <p className={styles.congratsText}>ჩვენ ვიპოვეთ იდეალური გიტარა თქვენთვის</p>
              </div>
              <div className={styles.recommendationContainer}>
                <div className={`${styles.guitarCard} ${styles.successCard}`}>
                  <h3>{recommendation.name}</h3>
                  <div className="price-image-container">
                    {recommendation.thumbnail && (
                      <div className="guitar-thumbnail">
                        <Image 
                          src={recommendation.thumbnail}
                          alt={recommendation.name}
                          width={150}
                          height={150}
                          className="rounded-lg"
                        />
                      </div>
                    )}
                    <p className="text-lg">ფასი: {recommendation.price} ₾</p>
                  </div>
                  <a 
                    href={recommendation.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.viewButton}
                    onClick={async () => {
                      // await uiDb.logEvent("guitar_finder_shop_link_click", {
                      //   guitarName: recommendation.name,
                      //   price: recommendation.price,
                      //   link: recommendation.link
                      // });
                    }}
                  >
                    ონლაინ მაღაზიაში ნახვა
                  </a>
                  {recommendation.summary && (
                    <div className={styles.guitarSummary}>
                      <div className={`${styles.summaryContent} ${showFullSummary ? styles.expanded : ''}`}>
                        {recommendation.summary.split('\n').filter(para => para.trim()).map((paragraph, index) => (
                          <p key={index} className={styles.summaryText}>{paragraph.trim()}</p>
                        ))}
                      </div>
                      {recommendation.summary.split('\n').filter(para => para.trim()).length > 1 && (
                        <button 
                          onClick={() => setShowFullSummary(!showFullSummary)} 
                          className={styles.readMoreButton}
                        >
                          {showFullSummary ? 'ნაკლების ნახვა' : 'მეტის ნახვა'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={resetQuiz} className={`${styles.resetButton} ${styles.successResetButton}`}>
                  თავიდან დაწყება
                </button>
              </div>
            </>
          ) : null}
        </div>
      </>
    );
  }

  const question = questions[currentQuestion];

  return (
    <>
      <h1 className={styles.mainTitle}>
        იპოვე შენთვის იდეალური გიტარა
        <button 
          className={styles.questionButton}
          onClick={() => setShowModal(true)}
          aria-label="ინფორმაცია"
        >
          <QuestionIcon />
        </button>
      </h1>
      <div className={styles.quizContainer}>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className={styles.questionNumber}>
            <span className={styles.currentStep}>
              კითხვა {currentQuestion + 1}
            </span>
            <span className={styles.totalSteps}>
              {questions.length} კითხვიდან
            </span>
          </div>
        </div>
        
        <div className={styles.questionContainer}>
          <h3 className={styles.question}>{question.question.ge}</h3>
          <div className={`${styles.options} mxedruli`}>
            {question.options.map((option) => (
              <button
                key={option.value}
                className={styles.optionButton}
                onClick={() => handleAnswer(option.value)}
              >
                {option.label.ge}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button 
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
              aria-label="დახურვა"
            >
              ✕
            </button>
            <h2 className={styles.modalTitle}>{modalContent.title.ge}</h2>
            <div className={`${styles.modalContent} mxedruli`}>
              {modalContent.description.ge.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 