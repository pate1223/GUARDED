import React, { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import QuizResults from "./components/QuizResults"; 
import { apiService } from "./services/api";
import { useAuth } from "./contexts/AuthContext";

/* -------------------------------------------------------------------------- */
/*                               QUIZ CARD UI                                 */
/* -------------------------------------------------------------------------- */

function QuizCard({
  quiz,
  onSelect,
  onRetake,
  onViewResults,
  isCompleted,
  isRetaking,
  progress,
  lang,
  i18n
}) {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-72 min-h-[370px] flex flex-col items-center pt-8 pb-6 px-6 transition-all duration-300 hover:shadow-2xl">

      {/* STATUS BADGE */}
      <div
        className={`absolute left-6 top-6 px-4 py-1 rounded-tl-2xl rounded-br-2xl text-xs font-bold ${
          isRetaking
            ? "bg-orange-500 text-white"
            : isCompleted
            ? "bg-gray-400 text-white"
            : "bg-[#5c52ff] text-white"
        }`}
      >
        {isRetaking
          ? i18n(lang, "retakeBadge")
          : isCompleted
          ? i18n(lang, "completedBadge")
          : i18n(lang, "newBadge")}
      </div>

      {/* ICON */}
      <div
        className={`w-32 h-32 rounded-2xl flex items-center justify-center mb-6 mt-6 shadow-lg ${
          isRetaking
            ? "bg-gradient-to-br from-orange-500 to-red-500"
            : isCompleted
            ? "bg-gradient-to-br from-gray-400 to-gray-400"
            : "bg-gradient-to-br from-[#6a5cff] to-[#5c52ff]"
        }`}
      >
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill={isCompleted ? "#e5e5e5" : "#fff"}
            stroke={isCompleted ? "#aaa" : "#fff"}
            strokeWidth="4"
          />
          <text
            x="32"
            y="40"
            textAnchor="middle"
            fontSize="32"
            fill={isCompleted ? "#aaa" : "#fff"}
          >
            ★
          </text>
        </svg>
      </div>

      {/* TITLE */}
      <div className="text-center mb-2">
        <div
          className={`text-base font-bold ${
            isRetaking ? "text-orange-600" : isCompleted ? "text-gray-400" : "text-[#5c52ff]"
          }`}
        >
          {quiz.category || "Quiz"}
        </div>

        <div
          className={`text-2xl font-extrabold ${
            isRetaking ? "text-orange-600" : isCompleted ? "text-gray-400" : "text-[#5c52ff]"
          }`}
        >
          {quiz.title}
        </div>

        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {quiz.description}
        </div>
      </div>

      {/* PROGRESS (completed quizzes) */}
      {isCompleted && progress && (
        <div className="w-full mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <div className="flex justify-between">
            <span>{i18n(lang, "score")}:</span>
            <span className="font-semibold">
              {progress.score}/{progress.max_score}
            </span>
          </div>

          <div className="flex justify-between">
            <span>{i18n(lang, "percentage")}:</span>
            <span className="font-semibold">{progress.percentage}%</span>
          </div>

          <div className="flex justify-between">
            <span>{i18n(lang, "completedOn")}:</span>
            <span className="font-semibold">
              {new Date(progress.completed_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* START / RETAKE BUTTON */}
      <button
        onClick={() => onSelect(quiz)}
        className={`mt-6 w-full py-3 rounded-xl font-bold text-lg shadow text-white ${
          isRetaking
            ? "bg-gradient-to-br from-orange-500 to-red-500"
            : "bg-gradient-to-br from-[#6a5cff] to-[#5c52ff]"
        } hover:opacity-90`}
      >
        {isRetaking ? i18n(lang, "startRetake") : i18n(lang, "startQuiz")}
      </button>

      {/* RESULT + RETAKE ACTIONS */}
      {isCompleted && !isRetaking && (
        <div className="w-full mt-4 space-y-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewResults(quiz.id);
            }}
            className="w-full py-2 rounded-xl bg-[#5c52ff] text-white shadow hover:bg-[#4335d1]"
          >
            📊 {i18n(lang, "viewResults")}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRetake(quiz.id);
            }}
            className="w-full py-2 rounded-xl bg-orange-500 text-white shadow hover:bg-orange-600"
          >
            🔄 {i18n(lang, "retakeQuiz")}
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

export default function QuizPage({ lang, i18n }) {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [retakingQuizId, setRetakingQuizId] = useState(null);

  const [quizzes, setQuizzes] = useState([]);
  const [userProgress, setUserProgress] = useState([]);

  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  /* ---------------------------- LOAD QUIZZES ---------------------------- */

  useEffect(() => {
    fetchQuizzes();
    if (isAuthenticated) fetchUserProgress();
    else setLoading(false);
  }, [isAuthenticated]);

  const fetchQuizzes = async () => {
    try {
      const result = await apiService.getQuizzes();

      const list = result?.data?.quizzes || result?.data || [];
      setQuizzes(list);
    } catch (e) {
      console.error("Failed quizzes:", e);
      setQuizzes([]);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const result = await apiService.getUserProgress();
      setUserProgress(result?.data?.data?.currentProgress || []);
    } catch (e) {
      console.error("Failed progress:", e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- LOAD QUIZ QUESTIONS ---------------------------- */

  const handleQuizSelect = async (quiz) => {
    try {
      setLoading(true);

      const result = await apiService.getQuiz(quiz.id);
      setSelectedQuiz(result.data.quiz);

      setRetakingQuizId(null);
    } catch (e) {
      alert("Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- QUIZ COMPLETION ---------------------------- */

  const handleQuizComplete = async () => {
    setSelectedQuiz(null);
    setRetakingQuizId(null);

    if (isAuthenticated) fetchUserProgress();
  };

  /* ---------------------------- RESULTS VIEWER ---------------------------- */

  const handleViewResults = async (quizId) => {
    try {
      setLoading(true);

      const history = await apiService.getQuizHistory(quizId);

      if (!history.success || history.data.data.length === 0) {
        alert("No results found.");
        return;
      }

      const latestAttempt = history.data.data[0];

      const quizData = await apiService.getQuiz(quizId);

      setQuizResults({
        quiz: quizData.data.quiz,
        results: latestAttempt
      });
    } catch (e) {
      alert("Failed to load results.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- RETAKE FLOW ---------------------------- */

  const handleRetake = (quizId) => {
    setRetakingQuizId(quizId);
  };

  /* ---------------------------- CONDITIONAL SCREEN RENDER ---------------------------- */

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-[#5c52ff]"></div>
      </div>
    );
  }

  if (quizResults) {
    return (
      <QuizResults
        quiz={quizResults.quiz}
        results={quizResults.results}
        onBack={() => setQuizResults(null)}
        lang={lang}
        i18n={i18n}
      />
    );
  }

  if (selectedQuiz) {
    return (
      <Quiz
        quiz={selectedQuiz}
        onComplete={handleQuizComplete}
        onBack={() => setSelectedQuiz(null)}
        lang={lang}
        i18n={i18n}
      />
    );
  }

  /* ---------------------------- MERGED QUIZ LIST ---------------------------- */

  const completedIds = userProgress.map((p) => p.quiz_id);

  const allQuizzes = quizzes.map((q) => ({
    ...q,
    isCompleted: completedIds.includes(q.id),
    progress: userProgress.find((p) => p.quiz_id === q.id)
  }));

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-3xl font-bold text-[#5c52ff] my-10">{i18n(lang, "browseQuizzes")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {allQuizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            lang={lang}
            i18n={i18n}
            isCompleted={quiz.isCompleted}
            progress={quiz.progress}
            isRetaking={retakingQuizId === quiz.id}
            onSelect={handleQuizSelect}
            onRetake={quiz.isCompleted ? handleRetake : null}
            onViewResults={quiz.isCompleted ? handleViewResults : null}
          />
        ))}
      </div>
    </div>
  );
}
