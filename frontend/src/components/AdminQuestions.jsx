import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminQuestions() {
  const { currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Question form state
  const [questionForm, setQuestionForm] = useState({
    id: null,
    question_text: '',
    question_type: 'multiple_choice',
    options: { A: '', B: '', C: '', D: '' },
    correct_answer: 'A',
    points: 1,
    order_index: 1
  });

  // Fetch all quizzes
  const fetchQuizzes = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('/api/quizzes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setQuizzes(data.quizzes);
        if (data.quizzes.length > 0 && !selectedQuiz) {
          setSelectedQuiz(data.quizzes[0].id);
        }
      }
    } catch (error) {
      console.error('Fetch quizzes error:', error);
      setError('Failed to load quizzes');
    }
  };

  // Fetch questions for selected quiz
  const fetchQuestions = async (quizId) => {
    if (!quizId) return;

    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const response = await fetch(`/api/quizzes/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(data.quiz.questions || []);
      }
    } catch (error) {
      console.error('Fetch questions error:', error);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [currentUser]);

  useEffect(() => {
    if (selectedQuiz) {
      fetchQuestions(selectedQuiz);
    }
  }, [selectedQuiz]);

  // Open add modal
  const handleAddQuestion = () => {
    setModalMode('add');
    setQuestionForm({
      id: null,
      question_text: '',
      question_type: 'multiple_choice',
      options: { A: '', B: '', C: '', D: '' },
      correct_answer: 'A',
      points: 1,
      order_index: questions.length + 1
    });
    setShowModal(true);
    setError('');
  };

  // Open edit modal
  const handleEditQuestion = (question) => {
    setModalMode('edit');
    setQuestionForm({
      id: question.id,
      question_text: question.question_text,
      question_type: question.question_type,
      options: question.options || { A: '', B: '', C: '', D: '' },
      correct_answer: question.correct_answer,
      points: question.points,
      order_index: question.order_index
    });
    setShowModal(true);
    setError('');
  };

  // Save question (add or edit)
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = await currentUser.getIdToken();
      const url = modalMode === 'add'
        ? `/api/admin/questions`
        : `/api/admin/questions/${questionForm.id}`;

      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const payload = {
        ...questionForm,
        quiz_id: selectedQuiz,
        options: JSON.stringify(questionForm.options)
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(`Question ${modalMode === 'add' ? 'added' : 'updated'} successfully`);
        setShowModal(false);
        fetchQuestions(selectedQuiz);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Save question error:', error);
      setError('Failed to save question');
    }
  };

  // Delete question
  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Question deleted successfully');
        fetchQuestions(selectedQuiz);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Delete question error:', error);
      setError('Failed to delete question');
    }
  };

  // Update option value
  const handleOptionChange = (optionKey, value) => {
    setQuestionForm({
      ...questionForm,
      options: {
        ...questionForm.options,
        [optionKey]: value
      }
    });
  };

  const getQuizTitle = (quizId) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz ? quiz.title : 'Select Quiz';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-purple-300 mb-2 transition-colors duration-300">Question Management</h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Add, edit, and manage quiz questions</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg flex items-center justify-between transition-colors duration-300">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg flex items-center justify-between transition-colors duration-300">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6 transition-colors duration-300">
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
            {/* Quiz Selector */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Select Quiz
              </label>
              <select
                value={selectedQuiz || ''}
                onChange={(e) => setSelectedQuiz(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 transition-colors duration-300"
              >
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title} ({quiz.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Add Question Button */}
            <button
              onClick={handleAddQuestion}
              disabled={!selectedQuiz}
              className="px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors duration-300 font-semibold flex items-center gap-2 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed shadow-sm dark:shadow-green-500/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Question
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-colors duration-300">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5c52ff] dark:border-purple-400"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">No questions found for this quiz</p>
              <button
                onClick={handleAddQuestion}
                className="px-6 py-2 bg-[#5c52ff] dark:bg-purple-600 text-white rounded-lg hover:bg-[#4335d1] dark:hover:bg-purple-700 transition-colors duration-300 font-semibold shadow-sm dark:shadow-purple-500/20"
              >
                Add First Question
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              {questions.map((question, index) => (
                <div key={question.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Question Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-[#5c52ff] dark:bg-purple-600 text-white rounded-full font-semibold text-sm transition-colors duration-300 shadow-sm dark:shadow-purple-500/20">
                          {question.order_index}
                        </span>
                        <span className="text-xs font-semibold px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full transition-colors duration-300">
                          {question.points} {question.points === 1 ? 'point' : 'points'}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
                        {question.question_text}
                      </h3>

                      {/* Options */}
                      <div className="space-y-2 ml-11">
                        {Object.entries(question.options || {}).map(([key, value]) => (
                          <div
                            key={key}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors duration-300 ${
                              key === question.correct_answer
                                ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30'
                            }`}
                          >
                            <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[24px] transition-colors duration-300">{key}.</span>
                            <span className="text-gray-800 dark:text-gray-200 transition-colors duration-300">{value}</span>
                            {key === question.correct_answer && (
                              <svg className="w-5 h-5 text-green-600 dark:text-green-400 ml-auto transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-300"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-300"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Question Count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center transition-colors duration-300">
          {questions.length} question{questions.length !== 1 ? 's' : ''} in {getQuizTitle(selectedQuiz)}
        </div>
      </div>

      {/* Add/Edit Question Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-purple-500/30 max-w-2xl w-full p-6 my-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-purple-300 mb-4 transition-colors duration-300">
              {modalMode === 'add' ? 'Add New Question' : 'Edit Question'}
            </h2>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Question Text *
                </label>
                <textarea
                  required
                  rows={3}
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm({...questionForm, question_text: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 transition-colors duration-300"
                  placeholder="Enter your question here..."
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Answer Options *
                </label>
                <div className="space-y-2">
                  {Object.keys(questionForm.options).map((key) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[24px] transition-colors duration-300">{key}.</span>
                      <input
                        type="text"
                        required
                        value={questionForm.options[key]}
                        onChange={(e) => handleOptionChange(key, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 transition-colors duration-300"
                        placeholder={`Option ${key}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct Answer & Points Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                    Correct Answer *
                  </label>
                  <select
                    value={questionForm.correct_answer}
                    onChange={(e) => setQuestionForm({...questionForm, correct_answer: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 transition-colors duration-300"
                  >
                    {Object.keys(questionForm.options).map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                    Points *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm({...questionForm, points: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Order Index */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Question Order *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={questionForm.order_index}
                  onChange={(e) => setQuestionForm({...questionForm, order_index: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 transition-colors duration-300"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Order in which this question appears in the quiz</p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#5c52ff] dark:bg-purple-600 text-white rounded-lg hover:bg-[#4335d1] dark:hover:bg-purple-700 transition-colors duration-300 font-semibold shadow-sm dark:shadow-purple-500/20"
                >
                  {modalMode === 'add' ? 'Add Question' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}