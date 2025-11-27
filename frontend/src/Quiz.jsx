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
  i18n,
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

      {/* TITLE / DESCRIPTION */}
      <div className="text-center mb-2">
        <div
          className={`text-base font-bold ${
            isRetaking
              ? "text-orange-600"
              : isCompleted
              ? "text-gray-400"
              : "text-[#5c52ff]"
          }`}
        >
          {quiz.category || "Quiz"}
        </div>

        <div
          className={`text-2xl font-extrabold ${
            isRetaking
              ? "text-orange-600"
              : isCompleted
              ? "text-gray-400"
              : "text-[#5c52ff]"
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
              {progress.completed_at
                ? new Date(progress.completed_at).toLocaleDateString()
                : "—"}
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

      {/* RESULT + RETAKE ACTIONS (only for completed & not currently retaking) */}
      {isCompleted && !isRetaking && (
        <div className="w-full mt-4 space-y-3">
          {onViewResults && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewResults(quiz.id);
              }}
              className="w-full py-2 rounded-xl bg-[#5c52ff] text-white shadow hover:bg-[#4335d1]"
            >
              📊 {i18n(lang, "viewResults")}
            </button>
          )}

          {onRetake && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRetake(quiz.id);
              }}
              className="w-full py-2 rounded-xl bg-orange-500 text-white shadow hover:bg-orange-600"
            >
              🔄 {i18n(lang, "retakeQuiz")}
            </button>
          )}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { isAuthenticated } = useAuth();

  /* ---------------------------- LOAD QUIZZES ---------------------------- */

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchQuizzes();
      if (isAuthenticated) {
        await fetchUserProgress();
      } else {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, lang]);

  const fetchQuizzes = async () => {
    try {
      const result = await apiService.getQuizzes(lang);
      if (result?.success) {
        // Data shape A: { success: true, data: { quizzes: [...] } }
        const list = result.data?.quizzes || [];
        setQuizzes(Array.isArray(list) ? list : []);
      } else {
        setQuizzes([]);
      }
    } catch (e) {
      console.error("Failed to fetch quizzes:", e);
      setQuizzes([]);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const result = await apiService.getUserProgress();
      // Be flexible with the shape here:
      const progress =
        result?.data?.data?.currentProgress ||
        result?.data?.progress ||
        result?.data ||
        [];
      setUserProgress(Array.isArray(progress) ? progress : []);
    } catch (e) {
      console.error("Failed to fetch user progress:", e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- LOAD QUIZ QUESTIONS ---------------------------- */

  const handleQuizSelect = async (quiz) => {
    try {
      setLoading(true);
      const result = await apiService.getQuiz(quiz.id, lang);
      if (result?.success) {
        setSelectedQuiz(result.data.quiz);
        setRetakingQuizId(null); // clear retake flag when actually starting
      } else {
        alert(result?.error || "Failed to load quiz.");
      }
    } catch (e) {
      console.error("Failed to load quiz:", e);
      alert("Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- QUIZ COMPLETION ---------------------------- */

  const handleQuizComplete = async () => {
    setSelectedQuiz(null);
    setRetakingQuizId(null);

    if (isAuthenticated) {
      await fetchUserProgress();
    }
  };

  /* ---------------------------- RESULTS VIEWER ---------------------------- */

  const handleViewResults = async (quizId) => {
    try {
      setLoading(true);

      const history = await apiService.getQuizHistory(quizId);
      if (!history?.success) {
        alert(history?.error || "Failed to load results.");
        return;
      }

      const attempts =
        history.data?.data || history.data?.history || history.data || [];
      if (!Array.isArray(attempts) || attempts.length === 0) {
        alert("No results found.");
        return;
      }

      const latestAttempt = attempts[0];

      const quizData = await apiService.getQuiz(quizId, lang);
      if (!quizData?.success) {
        alert(quizData?.error || "Failed to load quiz for results.");
        return;
      }

      setQuizResults({
        quiz: quizData.data.quiz,
        results: latestAttempt,
      });
    } catch (e) {
      console.error("Failed to load results:", e);
      alert("Failed to load results.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- RETAKE FLOW ---------------------------- */

  const handleRetake = (quizId) => {
    setRetakingQuizId(quizId);
    // User then clicks the main button ("Start Retake") to actually start.
  };

  /* ---------------------------- FILTERING HELPERS ---------------------------- */

  const filterQuizzes = (quizList) => {
    return quizList.filter((quiz) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        quiz.title?.toLowerCase().includes(search) ||
        quiz.description?.toLowerCase().includes(search) ||
        quiz.category?.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "all" || quiz.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  };

  /* ---------------------------- LOADING / MODES ---------------------------- */

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-[#5c52ff] dark:border-purple-400" />
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

  /* ---------------------------- DERIVED LISTS ---------------------------- */

  const completedIds = userProgress.map((p) => p.quiz_id);

  const completedQuizzesRaw = quizzes.filter((q) => completedIds.includes(q.id));
  const newQuizzesRaw = quizzes.filter((q) => !completedIds.includes(q.id));

  const completedQuizzes = filterQuizzes(
    completedQuizzesRaw.map((q) => ({
      ...q,
      progress: userProgress.find((p) => p.quiz_id === q.id) || null,
    }))
  );

  const newQuizzes = filterQuizzes(newQuizzesRaw);

  const categories = [
    "all",
    ...new Set(quizzes.map((q) => q.category).filter(Boolean)),
  ];

  /* ---------------------------- RENDER PAGE ---------------------------- */

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Page header */}
      <div className="w-[90%] h-24 bg-[#5c52ff] dark:bg-purple-600 rounded-full flex items-center justify-center mb-[-40px] z-10 mt-10 shadow-lg transition-colors duration-300">
        <span className="text-white text-4xl font-bold">
          {i18n(lang, "quizzes")}
        </span>
      </div>

      {/* Search + Filters */}
      <div className="w-[90%] mt-32 mb-8 flex flex-col md:flex-row gap-4 items-center justify-center">
        {/* Search Input */}
        <div className="w-full md:w-96">
          <input
            type="text"
            placeholder={i18n(lang, "searchQuizzes")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-full border-2 border-purple-200 dark:border-gray-700 focus:border-[#5c52ff] dark:focus:border-purple-500 focus:outline-none transition-colors duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-md"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-64">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-6 py-3 rounded-full border-2 border-purple-200 dark:border-gray-700 focus:border-[#5c52ff] dark:focus:border-purple-500 focus:outline-none transition-colors duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all"
                  ? i18n(lang, "allCategories")
                  : cat.charAt(0).toUpperCase() +
                    cat.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(searchTerm || categoryFilter !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
            }}
            className="px-6 py-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 font-medium text-gray-700 dark:text-gray-300 shadow-md"
          >
            {i18n(lang, "clearFilters")}
          </button>
        )}
      </div>

      {/* New Quizzes */}
      <section className="w-full mt-8 px-8">
        <h2 className="text-2xl font-bold text-[#5c52ff] dark:text-purple-400 mb-8 text-center transition-colors duration-300">
          {i18n(lang, "browseQuizzes")}
        </h2>

        {newQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 justify-items-center">
            {newQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                lang={lang}
                i18n={i18n}
                isCompleted={false}
                progress={null}
                isRetaking={false}
                onSelect={handleQuizSelect}
                onRetake={null}
                onViewResults={null}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 italic transition-colors duration-300">
            {searchTerm || categoryFilter !== "all"
              ? i18n(lang, "noQuizzesMatch")
              : i18n(lang, "noNewQuizzes")}
          </p>
        )}
      </section>

      {/* Completed Quizzes */}
      {isAuthenticated && (
        <section className="w-full mt-20 px-8 mb-24">
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-8 text-center transition-colors duration-300">
            {i18n(lang, "completedQuizzes")}
          </h2>

          {completedQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 justify-items-center">
              {completedQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  lang={lang}
                  i18n={i18n}
                  isCompleted={true}
                  progress={quiz.progress}
                  isRetaking={retakingQuizId === quiz.id}
                  onSelect={handleQuizSelect}
                  onRetake={handleRetake}
                  onViewResults={handleViewResults}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-500 italic transition-colors duration-300">
              {searchTerm || categoryFilter !== "all"
                ? i18n(lang, "noCompletedMatch")
                : i18n(lang, "noCompletedQuizzes")}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
