const db = require('./db');

async function getAllQuizzes() {
  const [rows] = await db.query('SELECT * FROM quizzes');
  return rows;
}

async function getQuestionsByQuizId(quiz_id) {
  const [rows] = await db.query('SELECT * FROM questions WHERE quiz_id = ?', [quiz_id]);
  return rows;
}

module.exports = { getAllQuizzes, getQuestionsByQuizId };