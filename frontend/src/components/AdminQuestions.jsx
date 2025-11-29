import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Auto-detect API base URL (local or production)
const API_BASE = import.meta.env.VITE_API_URL || '';

export default function AdminQuestions({ lang, i18n }) {
  const { currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add | edit
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

  // Fetch quizzes
  const fetchQuizzes = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE}/api/quizzes`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setQuizzes(data.quizzes);
        if (data.quizzes.length > 0 && !selectedQuiz) {
          setSelectedQuiz(data.quizzes[0].id);
        }
      }
    } catch (err) {
      console.error(err);
      setError(i18n(lang, 'failedToLoadQuizzes'));
    }
  };

  // Fetch questions in quiz
  const fetchQuestions = async (quizId) => {
    if (!quizId) return;

    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE}/api/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(data.quiz.questions || []);
      }
    } catch (err) {
      console.error(err);
      setError(i18n(lang, 'failedToLoadQuestions'));
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

  // Add modal
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

  // Edit modal
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

  // Save question (add/update)
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = await currentUser.getIdToken();

      const url =
        modalMode === 'add'
          ? `${API_BASE}/api/admin/questions`
          : `${API_BASE}/api/admin/questions/${questionForm.id}`;

      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const payload = {
        ...questionForm,
        quiz_id: selectedQuiz,
        options: JSON.stringify(questionForm.options)
      };

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          modalMode === 'add'
            ? i18n(lang, 'questionAddedSuccess')
            : i18n(lang, 'questionUpdatedSuccess')
        );
        setShowModal(false);
        fetchQuestions(selectedQuiz);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError(i18n(lang, 'failedToSaveQuestion'));
    }
  };

  // Delete question
  const handleDeleteQuestion = async (id) => {
    if (!confirm(i18n(lang, 'deleteQuestionConfirm'))) return;

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE}/api/admin/questions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(i18n(lang, 'questionDeletedSuccess'));
        fetchQuestions(selectedQuiz);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError(i18n(lang, 'failedToDeleteQuestion'));
    }
  };

  /** Update option input */
  const handleOptionChange = (key, value) => {
    setQuestionForm({
      ...questionForm,
      options: {
        ...questionForm.options,
        [key]: value
      }
    });
  };

  const getQuizTitle = (id) => {
    const quiz = quizzes.find((q) => q.id === id);
    return quiz ? quiz.title : i18n(lang, 'selectQuiz');
  };

  /* ---------------------- UI ---------------------- */

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-purple-300 mb-2">
          {i18n(lang, 'questionManagement')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {i18n(lang, 'questionManagementDescription')}
        </p>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg flex justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess('')}>✕</button>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
            {/* Quiz Selector */}
            <div className="flex-1">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                {i18n(lang, 'selectQuiz')}
              </label>
              <select
                value={selectedQuiz || ''}
                onChange={(e) => setSelectedQuiz(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title} ({q.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Add Question */}
            <button
              disabled={!selectedQuiz}
              onClick={handleAddQuestion}
              className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md disabled:bg-gray-400"
            >
              {i18n(lang, 'addQuestion')}
            </button>
          </div>
        </div>

        {/* Questions list */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">Loading...</div>
          ) : questions.length === 0 ? (
            <div className="p-12 text-center">
              <p>{i18n(lang, 'noQuestionsFound')}</p>
              <button
                onClick={handleAddQuestion}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg"
              >
                {i18n(lang, 'addFirstQuestion')}
              </button>
            </div>
          ) : (
            questions.map((question) => (
              <div key={question.id} className="p-6 border-b dark:border-gray-700 flex justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full">
                      {question.order_index}
                    </span>
                    <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                      {question.points} {question.points === 1 ? i18n(lang, 'point') : i18n(lang, 'points')}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-4">{question.question_text}</h3>

                  <div className="space-y-2 ml-8">
                    {Object.entries(question.options || {}).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-3 border rounded-lg ${
                          key === question.correct_answer
                            ? 'border-green-500 bg-green-50 dark:bg-green-900'
                            : 'border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        <strong>{key}. </strong> {value}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                  >
                    {i18n(lang, 'edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg"
                  >
                    {i18n(lang, 'delete')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Question count */}
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          {i18n(lang, 'questionCount')
            .replace('{0}', questions.length)
            .replace('{1}', getQuizTitle(selectedQuiz))}
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-4">
              {modalMode === 'add'
                ? i18n(lang, 'addNewQuestion')
                : i18n(lang, 'editQuestion')}
            </h2>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              {/* Text */}
              <div>
                <label className="block mb-1">{i18n(lang, 'questionText')}</label>
                <textarea
                  required
                  value={questionForm.question_text}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, question_text: e.target.value })
                  }
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block mb-1">{i18n(lang, 'answerOptions')}</label>
                <div className="space-y-2">
                  {Object.keys(questionForm.options).map((key) => (
                    <div key={key} className="flex gap-2 items-center">
                      <strong className="w-5">{key}.</strong>
                      <input
                        required
                        value={questionForm.options[key]}
                        onChange={(e) => handleOptionChange(key, e.target.value)}
                        className="flex-1 border p-2 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct + Points */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">{i18n(lang, 'correctAnswer')}</label>
                  <select
                    value={questionForm.correct_answer}
                    onChange={(e) =>
                      setQuestionForm({ ...questionForm, correct_answer: e.target.value })
                    }
                    className="w-full border p-2 rounded-lg"
                  >
                    {Object.keys(questionForm.options).map((key) => (
                      <option key={key}>{key}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">{i18n(lang, 'points')}</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={questionForm.points}
                    onChange={(e) =>
                      setQuestionForm({ ...questionForm, points: parseInt(e.target.value) })
                    }
                    className="w-full border p-2 rounded-lg"
                  />
                </div>
              </div>

              {/* Order */}
              <div>
                <label className="block mb-1">{i18n(lang, 'questionOrder')}</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={questionForm.order_index}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      order_index: parseInt(e.target.value)
                    })
                  }
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-lg"
                >
                  {i18n(lang, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg"
                >
                  {modalMode === 'add'
                    ? i18n(lang, 'addQuestionButton')
                    : i18n(lang, 'saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
