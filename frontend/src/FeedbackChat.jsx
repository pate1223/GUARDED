import React, { useState } from "react";
import { apiService } from "./services/api";
import { useLanguage } from "./contexts/LanguageContext";

export default function FeedbackChat() {
  const { t } = useLanguage();

  // fully translated questions
  const questions = [
    {
      id: 1,
      title: t("satisfactionQuestion"),
      type: "rating",
      hint: t("satisfactionHint"),
    },
    {
      id: 2,
      title: t("whatLikedMost"),
      type: "text",
      placeholder: t("likedMostPlaceholder"),
    },
    {
      id: 3,
      title: t("whatCanImprove"),
      type: "text",
      placeholder: t("improvePlaceholder"),
    },
    {
      id: 4,
      title: t("wouldRecommend"),
      type: "choice",
      options: [t("yes"), t("maybe"), t("no")],
    },
    {
      id: 5,
      title: t("otherComments"),
      type: "text",
      placeholder: t("optional"),
    },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    rating: 0,
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });

  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const q = questions[step];

  function setAnswer(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    if (step < questions.length - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function submit() {
    setLoading(true);
    setErrorMsg("");

    const payload = {
      rating: answers.rating,
      q2: answers.q2,
      q3: answers.q3,
      q4: answers.q4,
      q5: answers.q5,
    };

    const result = await apiService.submitFeedback(payload);

    if (result.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(result.error || t("failedToSendFeedback"));
    }

    setLoading(false);
  }

  // SUBMITTED STATE UI
  if (submitted) {
    return (
      <div className="min-h-[420px] w-full bg-[#f3f1fb] dark:bg-gray-800 rounded-xl shadow dark:shadow-purple-500/20 p-6 flex flex-col items-center justify-center text-center animate-fadeIn">
        <div className="text-2xl font-extrabold text-[#2b2360] dark:text-purple-300 mb-2">
          🎉 {t("thanksFeedback")}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          {t("appreciateHelp")}{" "}
          <span className="text-[#5c52ff] dark:text-purple-400 font-semibold">GuardEd</span>.
        </p>

        <button
          onClick={() => {
            setSubmitted(false);
            setStep(0);
            setAnswers({ rating: 0, q2: "", q3: "", q4: "", q5: "" });
          }}
          className="px-4 py-2 bg-[#5c52ff] dark:bg-purple-600 text-white rounded-md hover:bg-[#4335d1] dark:hover:bg-purple-700 transition"
        >
          {t("submitAnother")}
        </button>
      </div>
    );
  }

  // MAIN FEEDBACK UI
  return (
    <div className="min-h-[420px] w-full bg-[#f3f1fb] dark:bg-gray-800 rounded-xl shadow dark:shadow-purple-500/20 p-6 flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2b2360] dark:text-purple-300">
            {t("quickFeedback")}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("answerQuickQuestions")}
          </p>
        </div>

        <div className="text-sm text-gray-400 dark:text-gray-500">
          {step + 1}/{questions.length}
        </div>
      </header>

      {/* QUESTION BODY */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 rounded-lg p-6 border dark:border-gray-700">
        <h3 className="text-lg font-semibold text-[#2b2360] dark:text-purple-300 mb-3">{q.title}</h3>

        {/* ⭐ RATING QUESTION */}
        {q.type === "rating" && (
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => setAnswer("rating", i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none"
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill={(hover || answers.rating) >= i ? "#f6b73c" : "none"}
                  stroke={(hover || answers.rating) >= i ? "#f6b73c" : "#c7c4d9"}
                  strokeWidth="1.5"
                  className="transition-colors"
                >
                  <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.172L12 18.896 4.664 23.17l1.402-8.172L.132 9.21l8.2-1.192z" />
                </svg>
              </button>
            ))}

            <div className="ml-3 text-sm text-gray-500 dark:text-gray-400">
              {answers.rating ? `${answers.rating} / 5` : t("tapToRate")}
            </div>
          </div>
        )}

        {/* TEXT QUESTIONS */}
        {q.type === "text" && (
          <textarea
            value={answers[`q${q.id}`]}
            onChange={(e) => setAnswer(`q${q.id}`, e.target.value)}
            placeholder={q.placeholder || ""}
            className="w-full min-h-[140px] p-3 rounded-md border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 resize-y focus:border-[#5c52ff] dark:focus:border-purple-500 focus:ring-1 focus:ring-[#e9e6ff] dark:focus:ring-purple-500/40"
          />
        )}

        {/* CHOICE QUESTIONS */}
        {q.type === "choice" && (
          <div className="flex flex-col gap-3">
            {q.options.map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer ${
                  answers.q4 === opt
                    ? "border-[#5c52ff] dark:border-purple-500 bg-[#f0ecff] dark:bg-purple-900/30"
                    : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <input
                  type="radio"
                  name="recommend"
                  checked={answers.q4 === opt}
                  onChange={() => setAnswer("q4", opt)}
                />
                <span className="text-sm text-[#2b2360] dark:text-gray-200">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {errorMsg && (
          <div className="text-red-500 dark:text-red-400 text-sm mt-4 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
            ⚠️ {errorMsg}
          </div>
        )}
      </div>

      {/* FOOTER BUTTONS */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {t("allResponsesAnonymous")}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={back}
            disabled={step === 0}
            className="px-3 py-2 rounded-md border dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
          >
            {t("back")}
          </button>

          {step < questions.length - 1 ? (
            <button
              onClick={next}
              className="px-4 py-2 bg-[#5c52ff] dark:bg-purple-600 text-white rounded-md hover:bg-[#4335d1] dark:hover:bg-purple-700 transition"
            >
              {t("next")}
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className="px-4 py-2 bg-[#5c52ff] dark:bg-purple-600 text-white rounded-md hover:bg-[#4335d1] dark:hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? t("submitting") : t("submit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
