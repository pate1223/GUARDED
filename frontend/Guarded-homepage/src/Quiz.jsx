import React, { useState, useEffect } from "react";
import QuizList from "./components/QuizList";
import Quiz from "./components/Quiz";
import { apiService } from "./services/api";
import { useAuth } from "./contexts/AuthContext";

export default function QuizPage() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProgress();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchUserProgress = async () => {
    try {
      const result = await apiService.getUserProgress();
      if (result.success) {
        setUserProgress(result.data.progress);
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
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
        alert(result.error || 'Failed to load quiz');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      alert('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = () => {
    setSelectedQuiz(null);
    if (isAuthenticated) {
      fetchUserProgress(); // Refresh progress
    }
  };

  const handleBackToList = () => {
    setSelectedQuiz(null);
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
        onBack={handleBackToList}
      />
    );
  }

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
        <QuizList onQuizSelect={handleQuizSelect} />
      </section>

      {/* Completed Quizzes */}
      {isAuthenticated && userProgress.length > 0 && (
        <section className="w-full mt-20 px-8 mb-24">
          <h2 className="text-2xl font-bold text-gray-600 mb-8 text-center">
            Completed Quizzes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProgress.map((progress) => (
              <div key={progress.quiz_id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{progress.title}</h3>
                  <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    Completed
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-semibold">{progress.score}/{progress.max_score}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Percentage:</span>
                    <span className="font-semibold">{progress.percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-semibold">
                      {new Date(progress.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {isAuthenticated && userProgress.length === 0 && (
        <section className="w-full mt-20 px-8 mb-24">
          <h2 className="text-2xl font-bold text-gray-600 mb-8 text-center">
            Completed Quizzes
          </h2>
          <p className="text-center text-gray-400 italic">
            You haven't completed any quizzes yet. Start with the quizzes above!
          </p>
        </section>
      )}
    </div>
  );
}


