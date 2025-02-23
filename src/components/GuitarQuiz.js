import { useState } from 'react';
import styles from './GuitarQuiz.module.css';

const questions = [
  {
    id: 1,
    question: {
      en: "What's your budget range?",
      ge: "რა ბიუჯეტი გაქვთ?"
    },
    options: [
      { value: "budget", label: { en: "Under $200", ge: "$200-მდე" }},
      { value: "midRange", label: { en: "$200 - $500", ge: "$200 - $500" }},
      { value: "premium", label: { en: "$500 - $1000", ge: "$500 - $1000" }},
      { value: "doesNotMatter", label: { en: "Does not matter", ge: "არ აქვს მნიშვნელობა" }}
    ]
  },
  {
    id: 2,
    question: {
      en: "What style of music do you primarily want to play?",
      ge: "მუსიკის რომელი სტილის დაკვრა გსურთ?"
    },
    options: [
      { value: "pop", label: { en: "Pop", ge: "პოპი" }},
      { value: "folk", label: { en: "Folk", ge: "ფოლკი" }},
      { value: "rock_metal", label: { en: "Rock/Metal", ge: "როკი/მეტალი" }},
      { value: "classical", label: { en: "Classical", ge: "კლასიკური" }},
      { value: "jazz", label: { en: "Jazz", ge: "ჯაზი" }},
      { value: "blues", label: { en: "Blues", ge: "ბლუზი" }},
      { value: "hiphop", label: { en: "Hip-Hop", ge: "ჰიპ-ჰოპი" }},
      { value: "all", label: { en: "More or less all", ge: "მეტნაკლებად ყველაფრის" }}
    ]
  },
  {
    id: 3,
    question: {
      en: "What's your current skill level?",
      ge: "რა დონის გიტარისტი ხართ?"
    },
    options: [
      { value: "super_beginner", label: { en: "Complete Beginner", ge: "სრული დამწყები" }},
      { value: "beginner", label: { en: "Beginner", ge: "დამწყები" }},
      { value: "intermediate", label: { en: "Some Experience", ge: "საშუალო" }},
      { value: "advanced", label: { en: "Experienced Player", ge: "გამოცდილი" }},
      { value: "superstar", label: { en: "Superstar", ge: "პროფესიონალი" }}
    ]
  },
  {
    id: 4,
    question: {
      en: "How important is portability to you?",
      ge: "რამდენად მნიშვნელოვანია გიტარის პორტატულობა?"
    },
    options: [
      { value: "very", label: { en: "Very important - I want to travel with it", ge: "ძალიან - მინდა რომ სამოგზაუროდ ვატარო" }},
      { value: "somewhat", label: { en: "Somewhat - Might take it places occasionally", ge: "მეტნაკლებად - შეიძლება ზოგჯერ წავიღო" }},
      { value: "not", label: { en: "Not important - It will stay at home", ge: "არ არის მნიშვნელოვანი - სახლში გამოვიყენებ" }}
    ]
  },
  {
    id: 5,
    question: {
      en: "Do you plan to perform live?",
      ge: "აპირებთ ცოცხალ შესრულებას?"
    },
    options: [
      { value: "yes", label: { en: "Yes", ge: "დიახ" }},
      { value: "no", label: { en: "No", ge: "არა" }},
      { value: "maybe", label: { en: "Maybe in the future", ge: "შესაძლოა მომავალში" }}
    ]
  },
  {
    id: 6,
    question: {
      en: "How important is the guitar's appearance to you?",
      ge: "რამდენად მნიშვნელოვანია გიტარის გარეგნული მხარე?"
    },
    options: [
      { value: "very", label: { en: "Very important - I want it to look stunning", ge: "ძალიან მნიშვნელოვანი - მინდა რომ შესანიშნავად გამოიყურებოდეს" }},
      { value: "somewhat", label: { en: "Somewhat - Nice to have but not crucial", ge: "მეტნაკლებად - კარგია, მაგრამ არა გადამწყვეტი" }},
      { value: "not", label: { en: "Not important - Only care about sound", ge: "არ არის მნიშვნელოვანი - მხოლოდ ხმა მაინტერესებს" }}
    ]
  },
  {
    id: 7,
    question: {
      en: "Do you prefer playing with fingers or a pick?",
      ge: "თითებით დაკვრა გირჩევნიათ თუ მედიატორით?"
    },
    options: [
      { value: "fingers", label: { en: "Fingerstyle playing", ge: "თითებით დაკვრა" }},
      { value: "pick", label: { en: "Using a pick", ge: "მედიატორით დაკვრა" }},
      { value: "both", label: { en: "Both equally", ge: "ორივე თანაბრად" }},
      { value: "unsure", label: { en: "Not sure yet", ge: "ჯერ არ ვიცი" }}
    ]
  },
  {
    id: 8,
    question: {
      en: "What's your preferred playing position?",
      ge: "რომელ პოზიციაში გირჩევნიათ დაკვრა?"
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
      ge: "რამდენად მნიშვნელოვანია ჩაშენებული ელექტრონიკა (პიკაპი/პრეამპი)?"
    },
    options: [
      { value: "must", label: { en: "Must have - Want to plug into an amp", ge: "აუცილებელია - მინდა გამაძლიერებელთან მიერთება" }},
      { value: "nice", label: { en: "Nice to have but not required", ge: "კარგია, მაგრამ არა აუცილებელი" }},
      { value: "not", label: { en: "Not important at all", ge: "საერთოდ არ არის მნიშვნელოვანი" }}
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
        <h2 className={styles.title}>გმადლობთ!</h2>
        <p className={styles.description}>თქვენი პასუხების მიხედვით, დაგეხმარებით საუკეთესო გიტარის შერჩევაში.</p>
        <button onClick={resetQuiz} className={styles.resetButton}>
          თავიდან დაწყება
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
      
      <h2 className={styles.title}>იპოვე შენი იდეალური გიტარა</h2>
      <p className={styles.questionNumber}>კითხვა {currentQuestion + 1} / {questions.length}</p>
      
      <div className={styles.questionContainer}>
        <h3 className={styles.question}>{question.question.ge}</h3>
        <div className={styles.options}>
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
  );
} 