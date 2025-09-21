const db = require('../models/db');

// Get all active quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const [quizzes] = await db.query(`
      SELECT 
        id, 
        title, 
        description, 
        category, 
        difficulty,
        time_limit,
        created_at
      FROM quizzes 
      WHERE is_active = TRUE 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      quizzes: quizzes
    });
  } catch (error) {
    console.error('Get all quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes',
      error: error.message
    });
  }
};

// Get quiz by ID with questions
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get quiz details
    const [quizRows] = await db.query(`
      SELECT 
        id, 
        title, 
        description, 
        category, 
        difficulty,
        time_limit
      FROM quizzes 
      WHERE id = ? AND is_active = TRUE
    `, [id]);

    if (quizRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const quiz = quizRows[0];

    // Get questions for this quiz
    const [questions] = await db.query(`
      SELECT 
        id,
        question_text,
        question_type,
        options,
        points,
        order_index
      FROM questions 
      WHERE quiz_id = ? 
      ORDER BY order_index ASC
    `, [id]);

    console.log(`Found ${questions.length} questions for quiz ${id}`);
    console.log('Questions data:', questions);

    // Parse JSON options for each question
    const questionsWithParsedOptions = questions.map(q => {
      try {
        return {
          ...q,
          options: q.options ? JSON.parse(q.options) : {}
        };
      } catch (error) {
        console.error('Error parsing options for question:', q.id, error);
        return {
          ...q,
          options: {}
        };
      }
    });

    res.json({
      success: true,
      quiz: {
        ...quiz,
        questions: questionsWithParsedOptions
      }
    });
  } catch (error) {
    console.error('Get quiz by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz',
      error: error.message
    });
  }
};

// Submit quiz answers and calculate score
exports.submitQuiz = async (req, res) => {
  try {
    const { id: quizId } = req.params; // Get quizId from URL parameter
    const { answers, timeTaken } = req.body;
    const userId = req.user.id; // From auth middleware

    // Get quiz questions to validate answers
    const [questions] = await db.query(`
      SELECT id, correct_answer, points
      FROM questions 
      WHERE quiz_id = ?
    `, [quizId]);

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let score = 0;
    let maxScore = 0;
    const results = [];

    questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correct_answer;
      
      if (isCorrect) {
        score += question.points;
      }

      results.push({
        questionId: question.id,
        userAnswer: userAnswer,
        correctAnswer: question.correct_answer,
        isCorrect: isCorrect,
        points: isCorrect ? question.points : 0
      });
    });

    // Check if user already completed this quiz
    const [existingProgress] = await db.query(`
      SELECT id FROM user_progress 
      WHERE user_id = ? AND quiz_id = ?
    `, [userId, quizId]);

    if (existingProgress.length > 0) {
      // Update existing progress
      await db.query(`
        UPDATE user_progress 
        SET score = ?, max_score = ?, time_taken = ?, answers = ?, completed_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND quiz_id = ?
      `, [score, maxScore, timeTaken, JSON.stringify(answers), userId, quizId]);
    } else {
      // Insert new progress
      await db.query(`
        INSERT INTO user_progress (user_id, quiz_id, score, max_score, time_taken, answers)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [userId, quizId, score, maxScore, timeTaken, JSON.stringify(answers)]);
    }

    res.json({
      success: true,
      score: score,
      maxScore: maxScore,
      percentage: Math.round((score / maxScore) * 100),
      results: results,
      timeTaken: timeTaken
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
};

// Get user's quiz progress
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const [progress] = await db.query(`
      SELECT 
        up.quiz_id,
        q.title,
        q.category,
        up.score,
        up.max_score,
        up.time_taken,
        up.completed_at,
        ROUND((up.score / up.max_score) * 100) as percentage
      FROM user_progress up
      JOIN quizzes q ON up.quiz_id = q.id
      WHERE up.user_id = ?
      ORDER BY up.completed_at DESC
    `, [userId]);

    res.json({
      success: true,
      progress: progress
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user progress',
      error: error.message
    });
  }
};

// Get quiz statistics (for admin)
exports.getQuizStats = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Get quiz details
    const [quizRows] = await db.query(`
      SELECT title, category
      FROM quizzes 
      WHERE id = ?
    `, [quizId]);

    if (quizRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Get statistics
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_attempts,
        AVG(score) as average_score,
        AVG(max_score) as average_max_score,
        AVG(time_taken) as average_time,
        MAX(score) as highest_score,
        MIN(score) as lowest_score
      FROM user_progress 
      WHERE quiz_id = ?
    `, [quizId]);

    // Get score distribution
    const [distribution] = await db.query(`
      SELECT 
        CASE 
          WHEN ROUND((score / max_score) * 100) >= 90 THEN '90-100%'
          WHEN ROUND((score / max_score) * 100) >= 80 THEN '80-89%'
          WHEN ROUND((score / max_score) * 100) >= 70 THEN '70-79%'
          WHEN ROUND((score / max_score) * 100) >= 60 THEN '60-69%'
          ELSE 'Below 60%'
        END as score_range,
        COUNT(*) as count
      FROM user_progress 
      WHERE quiz_id = ?
      GROUP BY score_range
      ORDER BY score_range DESC
    `, [quizId]);

    res.json({
      success: true,
      quiz: quizRows[0],
      statistics: {
        ...stats[0],
        average_percentage: Math.round((stats[0].average_score / stats[0].average_max_score) * 100)
      },
      scoreDistribution: distribution
    });
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz statistics',
      error: error.message
    });
  }
};