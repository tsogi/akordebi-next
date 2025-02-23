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
      { value: "doesNotMatter", label: "Does not matter" }
    ]
  },
  {
    id: 2,
    question: "What style of music do you primarily want to play?",
    options: [
      { value: "pop", label: "Pop" },
      { value: "folk", label: "Folk" },
      { value: "rock_metal", label: "Rock/Metal" },
      { value: "classical", label: "Classical" },
      { value: "jazz", label: "Jazz" },
      { value: "blues", label: "Blues" },
      { value: "hiphop", label: "Hip-Hop" },
      { value: "all", label: "More or less all" },
    ]
  },
  {
    id: 3,
    question: "What's your current skill level?",
    options: [
      { value: "super_beginner", label: "Complete Beginner" },
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Some Experience" },
      { value: "advanced", label: "Experienced Player" },
      { value: "superstar", label: "Superstar" }
    ]
  },
  {
    id: 4,
    question: "How important is portability to you?",
    options: [
      { value: "very", label: "Very important - I want to travel with it" },
      { value: "somewhat", label: "Somewhat - Might take it places occasionally" },
      { value: "not", label: "Not important - It will stay at home" }
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
  },
  {
    id: 6,
    question: "How important is the guitar's appearance to you?",
    options: [
      { value: "very", label: "Very important - I want it to look stunning" },
      { value: "somewhat", label: "Somewhat - Nice to have but not crucial" },
      { value: "not", label: "Not important - Only care about sound" }
    ]
  },
  {
    id: 7,
    question: "Do you prefer playing with fingers or a pick?",
    options: [
      { value: "fingers", label: "Fingerstyle playing" },
      { value: "pick", label: "Using a pick" },
      { value: "both", label: "Both equally" },
      { value: "unsure", label: "Not sure yet" }
    ]
  },
  {
    id: 8,
    question: "What's your preferred playing position?",
    options: [
      { value: "sitting", label: "Mostly sitting down" },
      { value: "standing", label: "Mostly standing up" },
      { value: "both", label: "Both equally" }
    ]
  },
  {
    id: 9,
    question: "How important is having built-in electronics (pickup/preamp)?",
    options: [
      { value: "must", label: "Must have - Want to plug into an amp" },
      { value: "nice", label: "Nice to have but not required" },
      { value: "not", label: "Not important at all" }
    ]
  },
  {
    id: 10,
    question: "What's your hand size?",
    options: [
      { value: "small", label: "Small - Prefer smaller necks" },
      { value: "medium", label: "Average" },
      { value: "large", label: "Large - Comfortable with wider necks" }
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