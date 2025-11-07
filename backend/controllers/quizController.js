const db = require('../models/db');

/**
 * Generate achievements dynamically based on performance
 */
function generateAchievements(score, percentage, timeTaken, quizId, improvementScore) {
  const achievements = [];

  if (score < 3) return achievements;

  // Score-based achievements
  if (percentage === 100) {
    achievements.push({
      id: 'perfect',
      title: 'Perfect Score!',
      description: 'You got every question right!',
      icon: '🏆',
      color: 'from-yellow-400 to-orange-500',
      rarity: 'legendary'
    });
  } else if (percentage >= 90) {
    achievements.push({
      id: 'excellent',
      title: 'Excellent Performance!',
      description: 'Outstanding understanding of the topic!',
      icon: '🥇',
      color: 'from-yellow-300 to-yellow-500',
      rarity: 'epic'
    });
  } else if (percentage >= 80) {
    achievements.push({
      id: 'great',
      title: 'Great Job!',
      description: 'You have a solid grasp of the material!',
      icon: '🥈',
      color: 'from-gray-300 to-gray-500',
      rarity: 'rare'
    });
  } else if (percentage >= 70) {
    achievements.push({
      id: 'good',
      title: 'Good Work!',
      description: 'You are on the right track!',
      icon: '🥉',
      color: 'from-green-300 to-green-500',
      rarity: 'common'
    });
  }

  // Speed achievement (if average < 30s per question)
  const timePerQuestion = timeTaken / 5;
  if (timePerQuestion < 30 && percentage >= 70) {
    achievements.push({
      id: 'speed_demon',
      title: 'Speed Demon!',
      description: 'You answered questions quickly and accurately!',
      icon: '⚡',
      color: 'from-blue-400 to-purple-500',
      rarity: 'rare'
    });
  }

  // Improvement achievement
  if (improvementScore > 0) {
    achievements.push({
      id: 'improvement',
      title: 'Getting Better!',
      description: `You improved by ${improvementScore} points from your last attempt!`,
      icon: '📈',
      color: 'from-green-400 to-blue-500',
      rarity: 'common'
    });
  }

  // Category-specific achievements
  const categoryAchievements = {
    1: { id: 'email_expert', title: 'Email Security Expert!', description: 'You know how to spot email scams!', icon: '📧', color: 'from-green-400 to-blue-500', rarity: 'common' },
    2: { id: 'phone_expert', title: 'Phone Security Expert!', description: 'You can identify phone scams!', icon: '📞', color: 'from-purple-400 to-pink-500', rarity: 'common' },
    3: { id: 'social_expert', title: 'Social Media Security Expert!', description: 'You understand social media security!', icon: '👥', color: 'from-indigo-400 to-purple-500', rarity: 'common' }
  };

  if (categoryAchievements[quizId] && percentage >= 70) {
    achievements.push(categoryAchievements[quizId]);
  }

  return achievements;
}

/**
 * Get all active quizzes
 */
exports.getAllQuizzes = async (req, res) => {
  try {
    const [quizzes] = await db.query(`
      SELECT id, title, description, category, difficulty, time_limit, created_at
      FROM quizzes 
      WHERE is_active = TRUE 
      ORDER BY created_at DESC
    `);

    res.json({ success: true, quizzes });
  } catch (error) {
    console.error('Get all quizzes error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quizzes', error: error.message });
  }
};

/**
 * Get quiz details with questions
 */
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const [quizRows] = await db.query(`
      SELECT id, title, description, category, difficulty, time_limit
      FROM quizzes WHERE id = ? AND is_active = TRUE
    `, [id]);

    if (quizRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const quiz = quizRows[0];
    const [questions] = await db.query(`
      SELECT id, question_text, question_type, options, correct_answer, points, order_index
      FROM questions WHERE quiz_id = ? ORDER BY order_index ASC
    `, [id]);

    const parsedQuestions = questions.map(q => ({
      ...q,
      options: (() => { try { return q.options ? JSON.parse(q.options) : {}; } catch { return {}; } })()
    }));

    res.json({ success: true, quiz: { ...quiz, questions: parsedQuestions } });
  } catch (error) {
    console.error('Get quiz by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quiz', error: error.message });
  }
};

/**
 * Submit quiz answers and calculate score + achievements
 */
exports.submitQuiz = async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user?.dbUser?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User authentication required' });
    }

    const [questions] = await db.query(`SELECT id, correct_answer, points FROM questions WHERE quiz_id = ?`, [quizId]);
    if (questions.length === 0) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let score = 0, maxScore = 0;
    const results = [];

    questions.forEach(q => {
      maxScore += q.points;
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) score += q.points;

      results.push({
        questionId: q.id,
        userAnswer,
        correctAnswer: q.correct_answer,
        isCorrect,
        points: isCorrect ? q.points : 0
      });
    });

    const percentage = Math.round((score / maxScore) * 100);

    // Fetch last attempt for improvement calculation
    const [previousAttempts] = await db.query(`
      SELECT score, percentage, attempt_number 
      FROM user_progress WHERE user_id = ? AND quiz_id = ?
      ORDER BY attempt_number DESC LIMIT 1
    `, [userId, quizId]);

    const prev = previousAttempts[0] || {};
    const improvementScore = prev.score ? score - prev.score : 0;
    const attemptNumber = prev.attempt_number ? prev.attempt_number + 1 : 1;

    const achievements = generateAchievements(score, percentage, timeTaken, quizId, improvementScore);

    // Mark previous as inactive
    await db.query(`UPDATE user_progress SET is_current_attempt = FALSE WHERE user_id = ? AND quiz_id = ?`, [userId, quizId]);

    // Insert new attempt
    const [insertResult] = await db.query(`
      INSERT INTO user_progress (
        user_id, quiz_id, score, max_score, time_taken, answers, 
        attempt_number, previous_score, improvement_score, percentage, 
        achievements, is_current_attempt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `, [
      userId, quizId, score, maxScore, timeTaken, JSON.stringify(answers),
      attemptNumber, prev.score || null, improvementScore, percentage, JSON.stringify(achievements)
    ]);

    res.json({
      success: true,
      data: { score, maxScore, percentage, results, timeTaken, attemptNumber, improvementScore, achievements, attemptId: insertResult.insertId }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit quiz', error: error.message });
  }
};

/**
 * Get user progress (current + history)
 */
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user?.dbUser?.id;

    const [current] = await db.query(`
      SELECT up.*, q.title, q.category 
      FROM user_progress up JOIN quizzes q ON up.quiz_id = q.id
      WHERE up.user_id = ? AND up.is_current_attempt = TRUE
      ORDER BY up.completed_at DESC
    `, [userId]);

    const [history] = await db.query(`
      SELECT up.*, q.title, q.category 
      FROM user_progress up JOIN quizzes q ON up.quiz_id = q.id
      WHERE up.user_id = ? ORDER BY up.quiz_id, up.attempt_number DESC
    `, [userId]);

    const parse = arr => arr.map(p => ({ ...p, achievements: p.achievements ? JSON.parse(p.achievements) : [] }));

    res.json({ success: true, data: { currentProgress: parse(current), quizHistory: parse(history) } });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user progress', error: error.message });
  }
};

/**
 * Reset quiz progress (for testing/retaking)
 */
exports.resetQuizProgress = async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const userId = req.user?.dbUser?.id;

    const numericId = parseInt(quizId);
    if (isNaN(numericId)) return res.status(400).json({ success: false, message: 'Invalid quiz ID' });

    const [exists] = await db.query(`SELECT id FROM user_progress WHERE user_id = ? AND quiz_id = ?`, [userId, numericId]);
    if (exists.length === 0) return res.status(404).json({ success: false, message: 'No quiz progress found for this quiz' });

    await db.query(`DELETE FROM user_progress WHERE user_id = ? AND quiz_id = ?`, [userId, numericId]);
    res.json({ success: true, message: 'Quiz progress reset successfully' });
  } catch (error) {
    console.error('Reset quiz progress error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset quiz progress', error: error.message });
  }
};

/**
 * Get user's quiz history for a specific quiz
 */
exports.getQuizHistory = async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const userId = req.user?.dbUser?.id;

    const [rows] = await db.query(`
      SELECT * FROM user_progress WHERE user_id = ? AND quiz_id = ? ORDER BY attempt_number DESC
    `, [userId, quizId]);

    const parsed = rows.map(r => ({
      ...r,
      achievements: r.achievements ? JSON.parse(r.achievements) : [],
      answers: r.answers ? JSON.parse(r.answers) : []
    }));

    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quiz history', error: error.message });
  }
};

/**
 * Get user's achievements summary
 */
exports.getUserAchievements = async (req, res) => {
  try {
    const userId = req.user?.dbUser?.id;

    const [rows] = await db.query(`
      SELECT up.quiz_id, q.title, q.category, up.achievements, up.percentage, up.completed_at, up.attempt_number
      FROM user_progress up JOIN quizzes q ON up.quiz_id = q.id
      WHERE up.user_id = ? AND up.achievements IS NOT NULL AND up.score >= 3
      ORDER BY up.completed_at DESC
    `, [userId]);

    const all = [];
    rows.forEach(r => {
      if (r.achievements) {
        JSON.parse(r.achievements).forEach(a => {
          all.push({ ...a, quizTitle: r.title, quizCategory: r.category, percentage: r.percentage, earnedAt: r.completed_at });
        });
      }
    });

    const grouped = {
      phishing: all.filter(a => a.quizCategory === 'phishing'),
      phone_scams: all.filter(a => a.quizCategory === 'phone_scams'),
      social_media: all.filter(a => a.quizCategory === 'social_media')
    };

    res.json({ success: true, data: { allAchievements: all, achievementsByCategory: grouped, totalAchievements: all.length } });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch achievements', error: error.message });
  }
};

/**
 * Get quiz statistics (for admin)
 */
exports.getQuizStats = async (req, res) => {
  try {
    const { quizId } = req.params;
    const [quiz] = await db.query(`SELECT title, category FROM quizzes WHERE id = ?`, [quizId]);
    if (quiz.length === 0) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const [stats] = await db.query(`
      SELECT COUNT(*) as total_attempts, AVG(score) as average_score, AVG(max_score) as average_max_score,
             AVG(time_taken) as average_time, MAX(score) as highest_score, MIN(score) as lowest_score
      FROM user_progress WHERE quiz_id = ?
    `, [quizId]);

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
      GROUP BY score_range ORDER BY score_range DESC
    `, [quizId]);

    res.json({
      success: true,
      quiz: quiz[0],
      statistics: {
        ...stats[0],
        average_percentage: Math.round((stats[0].average_score / stats[0].average_max_score) * 100)
      },
      scoreDistribution: distribution
    });
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quiz statistics', error: error.message });
  }
};
