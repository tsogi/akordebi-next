import { useState } from 'react';
import styles from './GuitarQuiz.module.css';

const questions = [
  {
    id: 1,
    question: "What's your budget range?",
    options: [
      { value: "budget", label: "Under $200" },
      { value: "midRange", label: "$200 - $500" },
      { value: "premium", label: "$500 - $1000" },
      { value: "highEnd", label: "Over $1000" }
    ]
  },
  {
    id: 2,
    question: "What style of music do you primarily want to play?",
    options: [
      { value: "acoustic", label: "Folk/Acoustic" },
      { value: "electric", label: "Rock/Metal" },
      { value: "classical", label: "Classical" },
      { value: "jazz", label: "Jazz" }
    ]
  },
  {
    id: 3,
    question: "What's your current skill level?",
    options: [
      { value: "beginner", label: "Complete Beginner" },
      { value: "intermediate", label: "Some Experience" },
      { value: "advanced", label: "Experienced Player" }
    ]
  },
  {
    id: 4,
    question: "What size guitar would you prefer?",
    options: [
      { value: "small", label: "Smaller (Travel/3/4 size)" },
      { value: "standard", label: "Standard size" },
      { value: "large", label: "Larger body" }
    ]
  },
  {
    id: 5,
    question: "Do you plan to perform live?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "maybe", label: "Maybe in the future" }
    ]
  }
];

export default function GuitarQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      console.log('Quiz Results:', newAnswers);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className={styles.quizContainer}>
        <h2 className={styles.title}>Thank You!</h2>
        <p className={styles.description}>Based on your answers, we'll help you find the perfect guitar.</p>
        <button onClick={resetQuiz} className={styles.resetButton}>
          Start Over
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className={styles.quizContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      <h2 className={styles.title}>Find Your Perfect Guitar</h2>
      <p className={styles.questionNumber}>Question {currentQuestion + 1} of {questions.length}</p>
      
      <div className={styles.questionContainer}>
        <h3 className={styles.question}>{question.question}</h3>
        <div className={styles.options}>
          {question.options.map((option) => (
            <button
              key={option.value}
              className={styles.optionButton}
              onClick={() => handleAnswer(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 