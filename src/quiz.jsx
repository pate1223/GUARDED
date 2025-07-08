import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const questions = [
  {
    question: {
      en: "What is the capital of France?",
      fr: "Quelle est la capitale de la France ?"
    },
    options: ["Paris", "London", "Berlin"],
    answer: "Paris"
  },
  {
    question: {
      en: "What is 2 + 2?",
      fr: "Combien font 2 + 2 ?"
    },
    options: ["3", "4", "5"],
    answer: "4"
  }
];

function Quiz() {
  const { i18n, t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (selected === questions[current].answer) {
      setScore(score + 1);
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected('');
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return <h2>{t('Your score')}: {score}/{questions.length}</h2>;
  }

  return (
    <div>
      <h2>{questions[current].question[i18n.language]}</h2>
      {questions[current].options.map((opt) => (
        <div key={opt}>
          <label>
            <input
              type="radio"
              name="option"
              value={opt}
              checked={selected === opt}
              onChange={() => setSelected(opt)}
            />
            {opt}
          </label>
        </div>
      ))}
      <button onClick={handleNext} disabled={!selected}>
        {current === questions.length - 1 ? t('Submit') : t('Next')}
      </button>
    </div>
  );
}

export default Quiz;
