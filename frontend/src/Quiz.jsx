import React, { useState, useEffect } from "react";
import Quiz from "./components/Quiz"; // use your real Quiz component
import { apiService } from "./services/api";
import { useAuth } from "./contexts/AuthContext";

// Quiz card UI
function QuizCard({ quiz, onSelect, isCompleted, progress }) {
  return (
    <div
      key={quiz.id}
      className="relative bg-white rounded-3xl shadow-xl w-72 min-h-[370px] flex flex-col items-center pt-8 pb-6 px-6 transition-all"
    >
      {/* Status badge */}
      <div
        className={`absolute left-6 top-6 px-4 py-1 rounded-tl-2xl rounded-br-2xl text-xs font-bold ${
          isCompleted
            ? "bg-gray-400 text-white"
            : "bg-[#5c52ff] text-white"
        }`}
      >
        {isCompleted ? "✔ Completed" : "✨ New"}
      </div>

      {/* Icon */}
      <div
        className={`w-32 h-32 rounded-2xl flex items-center justify-center mb-6 mt-6 shadow-lg ${
          isCompleted
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
            stroke={isCompleted ? "#aaa" : "#5c52ff"}
            strokeWidth="4"
          />
          <text
            x="32"
            y="40"
            textAnchor="middle"
            fontSize="32"
            fill={isCompleted ? "#aaa" : "#5c52ff"}
          >
            ★
          </text>
        </svg>
      </div>

      {/* Titles */}
      <div className="text-center mb-2">
        <div
          className={`text-base font-bold ${
            isCompleted ? "text-gray-400" : "text-[#5c52ff]"
          }`}
        >
          {quiz.category || "Quiz"}
        </div>
        <div
          className={`text-2xl font-extrabold ${
            isCompleted ? "text-gray-400" : "text-[#5c52ff]"
          }`}
        >
          {quiz.title}
        </div>
        <div className="text-xs text-gray-400 mt-1">{quiz.description}</div>
      </div>

      {/* Progress (if completed) */}
      {isCompleted && progress && (
        <div className="w-full mt-4 text-sm text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Score:</span>
            <span className="font-semibold">
              {progress.score}/{progress.max_score}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Percentage:</span>
            <span className="font-semibold">{progress.percentage}%</span>
          </div>
          <div className="flex justify-between">
            <span>Completed:</span>
            <span className="font-semibold">
              {new Date(progress.completed_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Start button */}
      {!isCompleted && (
        <button
          onClick={() => onSelect(quiz)}
          className="mt-6 w-full py-3 rounded-xl font-bold text-lg shadow bg-gradient-to-br from-[#6a5cff] to-[#5c52ff] text-white hover:opacity-90"
        >
          Start
        </button>
      )}
    </div>
  );
}

// Main page
export default function QuizPage() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchQuizzes();
    if (isAuthenticated) {
      fetchUserProgress();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

const fetchQuizzes = async () => {
  try {
    const result = await apiService.getQuizzes();
    if (result.success) {
      // Adjust depending on actual response shape
      const quizArray = Array.isArray(result.data)
        ? result.data
        : result.data?.quizzes || [];
      setQuizzes(quizArray);
    } else {
      setQuizzes([]);
    }
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    setQuizzes([]);
  }
};


  const fetchUserProgress = async () => {
    try {
      const result = await apiService.getUserProgress();
      if (result.success) {
        setUserProgress(result.data.progress);
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSelect = async (quiz) => {
    try {
      setLoading(true);
      const result = await apiService.getQuiz(quiz.id);
      if (result.success) {
        setSelectedQuiz(result.data.quiz);
      } else {
        alert(result.error || "Failed to load quiz");
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
      alert("Failed to load quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = () => {
    setSelectedQuiz(null);
    if (isAuthenticated) {
      fetchUserProgress();
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#f3f2fd]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5c52ff]"></div>
      </div>
    );
  }

  if (selectedQuiz) {
    return (
      <Quiz
        quiz={selectedQuiz}
        onComplete={handleQuizComplete}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  // Match completed progress with quizzes
  const completedIds = userProgress.map((p) => p.quiz_id);
  const newQuizzes = quizzes.filter((q) => !completedIds.includes(q.id));
  const completedQuizzes = quizzes
    .filter((q) => completedIds.includes(q.id))
    .map((q) => ({
      ...q,
      progress: userProgress.find((p) => p.quiz_id === q.id),
    }));

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#f3f2fd]">
      {/* Page header */}
      <div className="w-[90%] h-24 bg-[#5c52ff] rounded-full flex items-center justify-center mb-[-40px] z-10 mt-10 shadow-lg">
        <span className="text-white text-4xl font-bold">Quizzes</span>
      </div>

      {/* Browse Quizzes */}
      <section className="w-full mt-40 px-8">
        <h2 className="text-2xl font-bold text-[#5c52ff] mb-8 text-center">
          Browse Quizzes
        </h2>
        {newQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 justify-items-center">
            {newQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onSelect={handleQuizSelect}
                isCompleted={false}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">
            No new quizzes available right now.
          </p>
        )}
      </section>

      {/* Completed Quizzes */}
      {isAuthenticated && (
        <section className="w-full mt-20 px-8 mb-24">
          <h2 className="text-2xl font-bold text-gray-600 mb-8 text-center">
            Completed Quizzes
          </h2>
          {completedQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 justify-items-center">
              {completedQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onSelect={handleQuizSelect}
                  isCompleted={true}
                  progress={quiz.progress}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 italic">
              You haven’t completed any quizzes yet.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
