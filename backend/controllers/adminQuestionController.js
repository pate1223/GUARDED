const db = require('../models/db');

// Add new question (admin only)
exports.addQuestion = async (req, res) => {
  try {
    const {
      quiz_id,
      question_text,
      question_type,
      options,
      correct_answer,
      points,
      order_index
    } = req.body;
    const adminUserId = req.user.dbUser.id;

    // Validate required fields
    if (!quiz_id || !question_text || !question_type || !options || !correct_answer) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify quiz exists
    const [quizzes] = await db.query('SELECT id FROM quizzes WHERE id = ?', [quiz_id]);
    if (quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Parse options if it's a string
    const parsedOptions = typeof options === 'string' ? options : JSON.stringify(options);

    // Insert question
    const [result] = await db.query(`
      INSERT INTO questions (
        quiz_id, question_text, question_type, options, correct_answer, points, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [quiz_id, question_text, question_type, parsedOptions, correct_answer, points || 1, order_index || 1]);

    // Log admin action
    await db.query(`
      INSERT INTO admin_logs (admin_user_id, action, target_type, target_id, details, created_at)
      VALUES (?, 'CREATE_QUESTION', 'question', ?, ?, NOW())
    `, [
      adminUserId,
      result.insertId,
      JSON.stringify({ quiz_id, question_text: question_text.substring(0, 50) })
    ]);

    res.json({
      success: true,
      message: 'Question added successfully',
      question: {
        id: result.insertId,
        quiz_id,
        question_text,
        question_type,
        options: JSON.parse(parsedOptions),
        correct_answer,
        points,
        order_index
      }
    });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add question',
      error: error.message
    });
  }
};

// Update question (admin only)
exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const {
      question_text,
      question_type,
      options,
      correct_answer,
      points,
      order_index
    } = req.body;
    const adminUserId = req.user.dbUser.id;

    // Verify question exists
    const [questions] = await db.query('SELECT id, quiz_id FROM questions WHERE id = ?', [questionId]);
    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Parse options if it's a string
    const parsedOptions = typeof options === 'string' ? options : JSON.stringify(options);

    // Update question
    await db.query(`
      UPDATE questions
      SET question_text = ?, question_type = ?, options = ?,
          correct_answer = ?, points = ?, order_index = ?
      WHERE id = ?
    `, [question_text, question_type, parsedOptions, correct_answer, points, order_index, questionId]);

    // Log admin action
    await db.query(`
      INSERT INTO admin_logs (admin_user_id, action, target_type, target_id, details, created_at)
      VALUES (?, 'UPDATE_QUESTION', 'question', ?, ?, NOW())
    `, [
      adminUserId,
      questionId,
      JSON.stringify({ quiz_id: questions[0].quiz_id, question_text: question_text.substring(0, 50) })
    ]);

    res.json({
      success: true,
      message: 'Question updated successfully'
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update question',
      error: error.message
    });
  }
};

// Delete question (admin only)
exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const adminUserId = req.user.dbUser.id;

    // Get question details before deletion
    const [questions] = await db.query(`
      SELECT id, quiz_id, question_text
      FROM questions
      WHERE id = ?
    `, [questionId]);

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const question = questions[0];

    // Delete question
    await db.query('DELETE FROM questions WHERE id = ?', [questionId]);

    // Log admin action
    await db.query(`
      INSERT INTO admin_logs (admin_user_id, action, target_type, target_id, details, created_at)
      VALUES (?, 'DELETE_QUESTION', 'question', ?, ?, NOW())
    `, [
      adminUserId,
      questionId,
      JSON.stringify({ quiz_id: question.quiz_id, question_text: question.question_text.substring(0, 50) })
    ]);

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message
    });
  }
};

// Get all questions for a quiz (admin only)
exports.getQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const [questions] = await db.query(`
      SELECT
        id,
        quiz_id,
        question_text,
        question_type,
        options,
        correct_answer,
        points,
        order_index
      FROM questions
      WHERE quiz_id = ?
      ORDER BY order_index ASC
    `, [quizId]);

    // Parse JSON options for each question
    const questionsWithParsedOptions = questions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    res.json({
      success: true,
      questions: questionsWithParsedOptions
    });
  } catch (error) {
    console.error('Get questions by quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error.message
    });
  }
};

// Reorder questions (admin only)
exports.reorderQuestions = async (req, res) => {
  try {
    const { questions } = req.body; // Array of { id, order_index }
    const adminUserId = req.user.dbUser.id;

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: 'Questions must be an array'
      });
    }

    // Update order for each question
    for (const question of questions) {
      await db.query(`
        UPDATE questions
        SET order_index = ?
        WHERE id = ?
      `, [question.order_index, question.id]);
    }

    // Log admin action
    await db.query(`
      INSERT INTO admin_logs (admin_user_id, action, target_type, target_id, details, created_at)
      VALUES (?, 'REORDER_QUESTIONS', 'question', NULL, ?, NOW())
    `, [
      adminUserId,
      JSON.stringify({ count: questions.length })
    ]);

    res.json({
      success: true,
      message: 'Questions reordered successfully'
    });
  } catch (error) {
    console.error('Reorder questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder questions',
      error: error.message
    });
  }
};