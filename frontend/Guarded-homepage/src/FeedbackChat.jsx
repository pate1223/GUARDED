import React, { useState } from 'react';

export default function FeedbackChat() {
  const questions = [
    {
      id: 1,
      title: 'Overall, how satisfied are you with the app?',
      type: 'rating',
      hint: '1 = Very dissatisfied, 5 = Very satisfied'
    },
    {
      id: 2,
      title: 'What did you like most about the app?',
      type: 'text',
      placeholder: 'Features, UX, content, etc.'
    },
    {
      id: 3,
      title: 'What can we improve?',
      type: 'text',
      placeholder: 'Bugs, missing features, clarity...'
    },
    {
      id: 4,
      title: 'Would you recommend GuardEd to a friend or colleague?',
      type: 'choice',
      options: ['Yes', 'Maybe', 'No']
    },
    {
      id: 5,
      title: 'Any other comments or suggestions?',
      type: 'text',
      placeholder: 'Optional'
    }
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    rating: 0,
    q2: '',
    q3: '',
    q4: '',
    q5: ''
  });
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function setAnswer(key, value) {
    setAnswers(a => ({ ...a, [key]: value }));
  }

  function next() {
    if (step < questions.length - 1) setStep(s => s + 1);
  }
  function back() {
    if (step > 0) setStep(s => s - 1);
  }

  function submit() {
    // design-only: show success state
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-[420px] w-full bg-[#f3f1fb] rounded-xl shadow p-6 flex flex-col items-center justify-center">
        <div className="text-2xl font-extrabold text-[#2b2360] mb-2">Thanks for your feedback!</div>
        <div className="text-sm text-gray-500 mb-4">We appreciate you taking the time to help improve GuardEd.</div>
        <button
          onClick={() => {
            setSubmitted(false);
            setStep(0);
            setAnswers({ rating:0, q2:'', q3:'', q4:'', q5:'' });
          }}
          className="px-4 py-2 bg-[#5c52ff] text-white rounded-md"
        >
          Submit another
        </button>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="min-h-[420px] w-full bg-[#f3f1fb] rounded-xl shadow p-6 flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2b2360]">Quick Feedback</h2>
          <p className="text-sm text-gray-500">Answer a few quick questions — should take under a minute.</p>
        </div>
        <div className="text-sm text-gray-400">{step + 1}/{questions.length}</div>
      </header>

      <div className="flex-1 overflow-auto bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#2b2360] mb-3">{q.title}</h3>
        {q.type === 'rating' && (
          <div className="flex items-center gap-3">
            {[1,2,3,4,5].map(i => (
              <button
                key={i}
                onClick={() => { setAnswer('rating', i); }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none"
                aria-label={`${i} star`}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill={(hover || answers.rating) >= i ? '#f6b73c' : 'none'}
                  stroke={(hover || answers.rating) >= i ? '#f6b73c' : '#c7c4d9'}
                  strokeWidth="1.5"
                  className="transition-colors"
                >
                  <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.172L12 18.896 4.664 23.17l1.402-8.172L.132 9.21l8.2-1.192z" />
                </svg>
              </button>
            ))}
            <div className="ml-3 text-sm text-gray-500">{answers.rating ? `${answers.rating} / 5` : 'Tap to rate'}</div>
          </div>
        )}

        {q.type === 'text' && (
          <textarea
            value={answers[`q${q.id}`]}
            onChange={e => setAnswer(`q${q.id}`, e.target.value)}
            placeholder={q.placeholder || ''}
            className="w-full min-h-[140px] p-3 rounded-md border resize-y focus:border-[#5c52ff] focus:ring-1 focus:ring-[#e9e6ff]"
          />
        )}

        {q.type === 'choice' && (
          <div className="flex flex-col gap-3">
            {q.options.map(opt => (
              <label key={opt} className={`flex items-center gap-3 p-3 rounded-md border ${answers.q4 === opt ? 'border-[#5c52ff] bg-[#f0ecff]' : 'border-transparent hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="recommend"
                  checked={answers.q4 === opt}
                  onChange={() => setAnswer('q4', opt)}
                  className="form-radio"
                />
                <span className="text-sm text-[#2b2360]">{opt}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">All responses are anonymous unless you choose otherwise.</div>
        <div className="flex items-center gap-3">
          <button onClick={back} disabled={step===0} className="px-3 py-2 rounded-md border text-gray-600 disabled:opacity-50">Back</button>
          {step < questions.length - 1 ? (
            <button onClick={next} className="px-4 py-2 bg-[#5c52ff] text-white rounded-md">Next</button>
          ) : (
            <button onClick={submit} className="px-4 py-2 bg-[#5c52ff] text-white rounded-md">Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}