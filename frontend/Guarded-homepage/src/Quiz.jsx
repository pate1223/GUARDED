import React, { useState, useEffect } from "react";
import Quiz from "./components/Quiz"; // use your real Quiz component
import QuizResults from "./components/QuizResults"; // use your real QuizResults component
import { apiService } from "./services/api";
import { useAuth } from "./contexts/AuthContext";

// Quiz card UI
function QuizCard({ quiz, onSelect, isCompleted, progress, onRetake, onViewResults, isRetaking }) {
  return (
    <div
      key={quiz.id}
      className="relative bg-white rounded-3xl shadow-xl w-72 min-h-[370px] flex flex-col items-center pt-8 pb-6 px-6 transition-all group hover:shadow-2xl"
    >
      {/* Status badge */}
      <div
        className={`absolute left-6 top-6 px-4 py-1 rounded-tl-2xl rounded-br-2xl text-xs font-bold ${
          isRetaking
            ? "bg-orange-500 text-white"
            : isCompleted
            ? "bg-gray-400 text-white"
            : "bg-[#5c52ff] text-white"
        }`}
      >
        {isRetaking ? "🔄 Retake" : isCompleted ? "✔ Completed" : "✨ New"}
      </div>

      {/* Icon */}
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
            fill={isRetaking ? "#fff" : isCompleted ? "#e5e5e5" : "#fff"}
            stroke={isRetaking ? "#ea580c" : isCompleted ? "#aaa" : "#5c52ff"}
            strokeWidth="4"
          />
          <text
            x="32"
            y="40"
            textAnchor="middle"
            fontSize="32"
            fill={isRetaking ? "#ea580c" : isCompleted ? "#aaa" : "#5c52ff"}
          >
            ★
          </text>
        </svg>
      </div>

      {/* Titles */}
      <div className="text-center mb-2">
        <div
          className={`text-base font-bold ${
            isRetaking 
              ? "text-orange-600" 
              : isCompleted ? "text-gray-400" : "text-[#5c52ff]"
          }`}
        >
          {quiz.category || "Quiz"}
        </div>
        <div
          className={`text-2xl font-extrabold ${
            isRetaking 
              ? "text-orange-600" 
              : isCompleted ? "text-gray-400" : "text-[#5c52ff]"
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
      {(!isCompleted || isRetaking) && (
        <button
          onClick={() => onSelect(quiz)}
          className={`mt-6 w-full py-3 rounded-xl font-bold text-lg shadow text-white hover:opacity-90 ${
            isRetaking 
              ? "bg-gradient-to-br from-orange-500 to-red-500" 
              : "bg-gradient-to-br from-[#6a5cff] to-[#5c52ff]"
          }`}
        >
          {isRetaking ? "🔄 Start Retake" : "Start"}
        </button>
      )}

       {/* Action buttons for completed quizzes (only when not retaking) */}
       {isCompleted && !isRetaking && (
         <div className="mt-6 w-full space-y-3">
           <button
             onClick={(e) => {
               e.stopPropagation();
               onViewResults(quiz.id);
             }}
             className="w-full py-2 rounded-xl font-semibold text-sm shadow bg-gradient-to-br from-[#6a5cff] to-[#5c52ff] text-white hover:opacity-90"
           >
             📊 View Results
           </button>
           {onRetake && (
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 console.log('QuizCard: Retake button clicked, quiz object:', quiz);
                 console.log('QuizCard: Quiz ID being passed:', quiz.id, 'Type:', typeof quiz.id);
                 onRetake(quiz.id);
               }}
               className="w-full py-2 rounded-xl font-semibold text-sm shadow bg-gradient-to-br from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300"
             >
               🔄 Retake Quiz
             </button>
           )}
         </div>
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
  const [quizResults, setQuizResults] = useState(null);
  const [retakingQuizId, setRetakingQuizId] = useState(null);
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
      // Backend returns { success: true, quizzes: [...] }
      const quizArray = result.data.quizzes || [];
      console.log('Fetched quizzes:', quizArray);
      setQuizzes(quizArray);
    } else {
      console.error('Failed to fetch quizzes:', result.error);
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
        // Use currentProgress from the new API structure
        setUserProgress(result.data.data.currentProgress || []);
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizResults = async (quizId) => {
    try {
      console.log('Fetching quiz results for quizId:', quizId);
      
      const result = await apiService.getQuizHistory(quizId);
      console.log('Quiz history result:', result);
      
      if (result.success && result.data.data.length > 0) {
        // Get the latest attempt (first in the array since it's sorted by attempt_number DESC)
        const latestAttempt = result.data.data[0];
        console.log('Latest attempt:', latestAttempt);
        
        // Fetch the quiz data to get questions
        const quizResult = await apiService.getQuiz(quizId);
        console.log('Quiz data result:', quizResult);
        
        if (quizResult.success) {
          const combinedData = {
            quiz: quizResult.data.quiz,
            results: latestAttempt
          };
          console.log('Combined data for QuizResults:', combinedData);
          return combinedData;
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      return null;
    }
  };

  const handleQuizSelect = async (quiz) => {
    try {
      setLoading(true);
      const result = await apiService.getQuiz(quiz.id);
      if (result.success) {
        setSelectedQuiz(result.data.quiz);
        // Clear retaking state when starting a quiz
        setRetakingQuizId(null);
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
    setRetakingQuizId(null);
    if (isAuthenticated) {
      fetchUserProgress();
    }
  };

  const handleViewResults = async (quizId) => {
    if (!isAuthenticated) {
      alert('Please sign in to view quiz results.');
      return;
    }

    try {
      setLoading(true);
      const resultsData = await fetchQuizResults(quizId);
      if (resultsData) {
        setQuizResults(resultsData);
      } else {
        alert('No results found for this quiz.');
      }
    } catch (error) {
      console.error('Error loading quiz results:', error);
      alert('Failed to load quiz results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizRetake = async (quizId) => {
    if (!isAuthenticated) {
      alert('Please sign in to retake quizzes.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to retake this quiz? Your previous attempts will be preserved in your history.');
    if (!confirmed) return;

    try {
      console.log('Retaking quiz:', quizId, 'Type:', typeof quizId);
      
      // Set the quiz as being retaken - this will change the UI
      setRetakingQuizId(quizId);
      
      // Don't load the quiz immediately - let the user click "Start Retake" button
    } catch (error) {
      console.error('Error setting up quiz retake:', error);
      alert('Failed to prepare quiz retake. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#f3f2fd]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5c52ff]"></div>
      </div>
    );
  }

  if (quizResults) {
    return (
      <QuizResults
        quiz={quizResults.quiz}
        results={quizResults.results}
        onBack={() => setQuizResults(null)}
      />
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

  // Match completed progress with quizzes and merge all quizzes
  const completedIds = userProgress.map((p) => p.quiz_id);
  const allQuizzes = quizzes.map((quiz) => ({
    ...quiz,
    isCompleted: completedIds.includes(quiz.id),
    progress: userProgress.find((p) => p.quiz_id === quiz.id),
  }));

  console.log('Debug - Quizzes:', quizzes);
  console.log('Debug - User Progress:', userProgress);
  console.log('Debug - Completed IDs:', completedIds);
  console.log('Debug - All Quizzes:', allQuizzes);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Browse Quizzes */}
      <section className="w-full px-8 mb-24">
        <h2 className="text-2xl font-bold text-[#5c52ff] mb-8 text-center">
          Browse Quizzes
        </h2>
        {allQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 justify-items-center">
            {allQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onSelect={handleQuizSelect}
                isCompleted={quiz.isCompleted}
                progress={quiz.progress}
                onRetake={quiz.isCompleted ? handleQuizRetake : null}
                onViewResults={quiz.isCompleted ? handleViewResults : null}
                isRetaking={retakingQuizId === quiz.id}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">
            No quizzes available right now.
          </p>
        )}
      </section>
    </div>
  );
}