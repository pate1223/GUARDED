// backend/controllers/quizController.js
const db = require('../models/db');
const { checkAndAwardBadges } = require('./badgeController');

/**
 * Helper: build achievements for a quiz attempt
 * Purely in JSON – no extra DB columns required.
 */
function buildAchievements({ percentage, timeTaken, timeLimit, attemptNumber, improvement }) {
  const achievements = [];

  // Only bother if they scored at least something
  if (percentage < 60) {
    // You can still add "keep trying" type achievements here if you want
  }

  // Score-based achievements
  if (percentage === 100) {
    achievements.push({
      id: `perfect_${Date.now()}`,
      title: 'Perfect Score!',
      description: 'Answered all questions correctly.',
      icon: '🌟',
      rarity: 'legendary'
    });
  } else if (percentage >= 90) {
    achievements.push({
      id: `excellent_${Date.now()}`,
      title: 'Excellent Performance',
      description: 'Scored 90% or higher.',
      icon: '⭐',
      rarity: 'epic'
    });
  } else if (percentage >= 80) {
    achievements.push({
      id: `great_${Date.now()}`,
      title: 'Great Job',
      description: 'Scored 80% or higher.',
      icon: '🎯',
      rarity: 'rare'
    });
  } else if (percentage >= 60) {
    achievements.push({
      id: `good_${Date.now()}`,
      title: 'Good Effort',
      description: 'Scored 60% or higher.',
      icon: '✨',
      rarity: 'common'
    });
  }

  // Speed achievements – based on time limit if available
  if (timeLimit && timeTaken) {
    const timeLimitSeconds = timeLimit * 60;
    const percentageOfTimeUsed = (timeTaken / timeLimitSeconds) * 100;

    if (percentage >= 80 && percentageOfTimeUsed <= 50) {
      achievements.push({
        id: `speed_demon_${Date.now()}`,
        title: 'Speed Demon',
        description: 'Completed the quiz in half the time with a high score.',
        icon: '⚡',
        rarity: 'epic'
      });
    } else if (percentage >= 70 && percentageOfTimeUsed <= 75) {
      achievements.push({
        id: `fast_learner_${Date.now()}`,
        title: 'Fast Learner',
        description: 'Completed the quiz quickly.',
        icon: '🚀',
        rarity: 'rare'
      });
    }
  }

  // Improvement achievement
  if (typeof improvement === 'number' && improvement > 0) {
    achievements.push({
      id: `improvement_${Date.now()}`,
      title: 'Getting Better!',
      description: `Improved by ${improvement} percentage points from your last attempt.`,
      icon: '📈',
      rarity: 'common'
    });
  }

  // First attempt success
  if (attemptNumber === 1 && percentage >= 80) {
    achievements.push({
      id: `first_try_${Date.now()}`,
      title: 'First Try Success',
      description: 'Scored 80% or higher on your first attempt.',
      icon: '🎊',
      rarity: 'rare'
    });
  }

  return achievements;
}

/* -----------------------------------------------------
 *  GET ALL QUIZZES (bilingual)
 *  GET /api/quizzes?lang=en|fr
 * --------------------------------------------------- */
exports.getAllQuizzes = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    console.log(`🌐 getAllQuizzes - lang="${lang}"`);

    const [quizzes] = await db.query(`
      SELECT
        id,
        title,
        title_fr,
        description,
        description_fr,
        category,
        difficulty,
        time_limit,
        created_at
      FROM quizzes
      WHERE is_active = TRUE
      ORDER BY created_at DESC
    `);

    const localizedQuizzes = quizzes.map(quiz => ({
      id: quiz.id,
      title: lang === 'fr' && quiz.title_fr ? quiz.title_fr : quiz.title,
      description:
        lang === 'fr' && quiz.description_fr ? quiz.description_fr : quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      time_limit: quiz.time_limit,
      created_at: quiz.created_at
    }));

    res.json({ success: true, quizzes: localizedQuizzes });
  } catch (error) {
    console.error('Get all quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes',
      error: error.message
    });
  }
};

/* -----------------------------------------------------
 *  GET QUIZ BY ID (bilingual)
 *  GET /api/quizzes/:id?lang=en|fr
 * --------------------------------------------------- */
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = req.query.lang || 'en';
    console.log(`🌐 getQuizById - id=${id}, lang="${lang}"`);

    const [quizRows] = await db.query(
      `
      SELECT
        id,
        title,
        title_fr,
        description,
        description_fr,
        category,
        difficulty,
        time_limit
      FROM quizzes
      WHERE id = ? AND is_active = TRUE
    `,
      [id]
    );

    if (quizRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const quizData = quizRows[0];
    const quiz = {
      id: quizData.id,
      title: lang === 'fr' && quizData.title_fr ? quizData.title_fr : quizData.title,
      description:
        lang === 'fr' && quizData.description_fr
          ? quizData.description_fr
          : quizData.description,
      category: quizData.category,
      difficulty: quizData.difficulty,
      time_limit: quizData.time_limit
    };

    const [questions] = await db.query(
      `
      SELECT
        id,
        question_text,
        question_text_fr,
        question_type,
        options,
        options_fr,
        points,
        order_index
      FROM questions
      WHERE quiz_id = ?
      ORDER BY order_index ASC
    `,
      [id]
    );

    console.log(`Found ${questions.length} questions for quiz ${id}`);

    const questionsWithParsedOptions = questions.map(q => {
      let parsedOptions = {};
      let parsedOptionsFr = null;

      try {
        if (q.options) {
          parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
        }
      } catch (err) {
        console.error('Error parsing options for question', q.id, err);
      }

      try {
        if (q.options_fr) {
          parsedOptionsFr =
            typeof q.options_fr === 'string' ? JSON.parse(q.options_fr) : q.options_fr;
        }
      } catch (err) {
        console.error('Error parsing options_fr for question', q.id, err);
      }

      return {
        id: q.id,
        question_text:
          lang === 'fr' && q.question_text_fr ? q.question_text_fr : q.question_text,
        question_type: q.question_type,
        options: lang === 'fr' && parsedOptionsFr ? parsedOptionsFr : parsedOptions,
        points: q.points,
        order_index: q.order_index
      };
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

/* -----------------------------------------------------
 *  SUBMIT QUIZ
 *  POST /api/quizzes/:id/submit
 *  Body: { answers: { [questionId]: value }, timeTaken: seconds }
 * --------------------------------------------------- */
exports.submitQuiz = async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user?.dbUser?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Get quiz details (for time_limit)
    const [quizDetails] = await db.query(
      `
      SELECT time_limit
      FROM quizzes
      WHERE id = ?
    `,
      [quizId]
    );

    if (quizDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const timeLimit = quizDetails[0].time_limit;

    // Get questions and correct answers
    const [questions] = await db.query(
      `
      SELECT id, correct_answer, points
      FROM questions
      WHERE quiz_id = ?
    `,
      [quizId]
    );

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

    questions.forEach(q => {
      maxScore += q.points;
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct_answer;

      if (isCorrect) {
        score += q.points;
      }

      results.push({
        questionId: q.id,
        userAnswer,
        correctAnswer: q.correct_answer,
        isCorrect,
        points: isCorrect ? q.points : 0
      });
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    // Determine attempt number
    const [attemptCountRows] = await db.query(
      `
      SELECT COALESCE(MAX(attempt_number), 0) + 1 AS next_attempt
      FROM user_progress
      WHERE user_id = ? AND quiz_id = ?
    `,
      [userId, quizId]
    );
    const attemptNumber = attemptCountRows[0].next_attempt;

    // For improvement, compare to last attempt's percentage
    const [prevRows] = await db.query(
      `
      SELECT percentage
      FROM user_progress
      WHERE user_id = ? AND quiz_id = ?
      ORDER BY attempt_number DESC
      LIMIT 1
    `,
      [userId, quizId]
    );
    const prevPercentage = prevRows.length > 0 ? prevRows[0].percentage : null;
    const improvement =
      prevPercentage !== null ? Math.round(percentage - prevPercentage) : 0;

    // Build achievements JSON
    const achievements = buildAchievements({
      percentage,
      timeTaken,
      timeLimit,
      attemptNumber,
      improvement
    });

    // Mark previous attempts as not current
    await db.query(
      `
      UPDATE user_progress
      SET is_current_attempt = 0
      WHERE user_id = ? AND quiz_id = ?
    `,
      [userId, quizId]
    );

    // Insert new attempt
    const [insertResult] = await db.query(
      `
      INSERT INTO user_progress (
        user_id,
        quiz_id,
        attempt_number,
        score,
        max_score,
        is_current_attempt,
        percentage,
        time_taken,
        answers,
        achievements
      )
      VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
    `,
      [
        userId,
        quizId,
        attemptNumber,
        score,
        maxScore,
        percentage,
        timeTaken,
        JSON.stringify(answers || {}),
        JSON.stringify(achievements || [])
      ]
    );

    // Award badges
    const quizData = {
      score,
      maxScore,
      timeTaken,
      timeLimit
    };
    const newBadges = await checkAndAwardBadges(userId, quizId, quizData);

    res.json({
      success: true,
      score,
      maxScore,
      percentage,
      results,
      timeTaken,
      attemptNumber,
      improvement,
      achievements,
      newBadges,
      attemptId: insertResult.insertId
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

/* -----------------------------------------------------
 *  GET USER PROGRESS (current + history)
 *  GET /api/quizzes/progress
 * --------------------------------------------------- */
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user?.dbUser?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Current attempts (is_current_attempt = TRUE)
    const [current] = await db.query(
      `
      SELECT up.*, q.title, q.category
      FROM user_progress up
      JOIN quizzes q ON up.quiz_id = q.id
      WHERE up.user_id = ? AND up.is_current_attempt = TRUE
      ORDER BY up.completed_at DESC
    `,
      [userId]
    );

    // All history
    const [history] = await db.query(
      `
      SELECT up.*, q.title, q.category
      FROM user_progress up
      JOIN quizzes q ON up.quiz_id = q.id
      WHERE up.user_id = ?
      ORDER BY up.quiz_id, up.attempt_number DESC
    `,
      [userId]
    );

    const parse = arr =>
      arr.map(p => ({
        ...p,
        achievements: p.achievements
          ? typeof p.achievements === 'string'
            ? JSON.parse(p.achievements)
            : p.achievements
          : []
      }));

    res.json({
      success: true,
      data: {
        currentProgress: parse(current),
        quizHistory: parse(history)
      }
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

/* -----------------------------------------------------
 *  RESET PROGRESS FOR ONE QUIZ (per user)
 *  DELETE /api/quizzes/:id/reset
 * --------------------------------------------------- */
exports.resetQuizProgress = async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const userId = req.user?.dbUser?.id;

    const numericId = parseInt(quizId, 10);
    if (!userId || isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user or quiz ID'
      });
    }

    const [exists] = await db.query(
      `
      SELECT id
      FROM user_progress
      WHERE user_id = ? AND quiz_id = ?
    `,
      [userId, numericId]
    );

    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No quiz progress found for this quiz'
      });
    }

    await db.query(
      `
      DELETE FROM user_progress
      WHERE user_id = ? AND quiz_id = ?
    `,
      [userId, numericId]
    );

    res.json({
      success: true,
      message: 'Quiz progress reset successfully'
    });
  } catch (error) {
    console.error('Reset quiz progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset quiz progress',
      error: error.message
    });
  }
};

/* -----------------------------------------------------
 *  RESET ALL QUIZ PROGRESS FOR USER
 *  DELETE /api/quizzes/reset-all
 * --------------------------------------------------- */
exports.resetUserProgress = async (req, res) => {
  try {
    const userId = req.user?.dbUser?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const [countResult] = await db.query(
      `
      SELECT COUNT(*) AS count
      FROM user_progress
      WHERE user_id = ?
    `,
      [userId]
    );

    const deletedCount = countResult[0].count || 0;

    await db.query(
      `
      DELETE FROM user_progress
      WHERE user_id = ?
    `,
      [userId]
    );

    res.json({
      success: true,
      message: `Successfully reset ${deletedCount} quiz completion(s)`,
      deletedCount
    });
  } catch (error) {
    console.error('Reset user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset quiz progress',
      error: error.message
    });
  }
};

/* -----------------------------------------------------
 *  GET QUIZ HISTORY FOR ONE QUIZ
 *  GET /api/quizzes/:id/history
 * --------------------------------------------------- */
exports.getQuizHistory = async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const userId = req.user?.dbUser?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const [rows] = await db.query(
      `
      SELECT *
      FROM user_progress
      WHERE user_id = ? AND quiz_id = ?
      ORDER BY attempt_number DESC
    `,
      [userId, quizId]
    );

    const parsed = rows.map(r => ({
      ...r,
      achievements: r.achievements
        ? typeof r.achievements === 'string'
          ? JSON.parse(r.achievements)
          : r.achievements
        : [],
      answers: r.answers
        ? typeof r.answers === 'string'
          ? JSON.parse(r.answers)
          : r.answers
        : {}
    }));

    res.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz history',
      error: error.message
    });
  }
};

/* -----------------------------------------------------
 *  GET USER ACHIEVEMENTS SUMMARY
 *  GET /api/quizzes/achievements
 * --------------------------------------------------- */
exports.getUserAchievements = async (req, res) => {
  try {
    const userId = req.user?.dbUser?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Backfill achievements for older records that have score >=3 but no achievements JSON
    const [recordsToUpdate] = await db.query(
      `
      SELECT id, quiz_id, score, max_score, percentage, time_taken, attempt_number
      FROM user_progress
      WHERE user_id = ?
        AND score >= 3
        AND (achievements IS NULL OR achievements = '[]')
    `,
      [userId]
    );

    for (const record of recordsToUpdate) {
      const achievements = buildAchievements({
        percentage: record.percentage,
        timeTaken: record.time_taken,
        timeLimit: null,
        attemptNumber: record.attempt_number,
        improvement: 0
      });

      if (achievements.length > 0) {
        await db.query(
          `
          UPDATE user_progress
          SET achievements = ?
          WHERE id = ?
        `,
          [JSON.stringify(achievements), record.id]
        );
      }
    }

    // Now fetch all achievements with quiz metadata
    const [rows] = await db.query(
      `
      SELECT
        up.quiz_id,
        q.title AS quizTitle,
        q.category AS quizCategory,
        up.achievements,
        up.percentage,
        up.completed_at AS earnedAt,
        up.attempt_number AS attemptNumber
      FROM user_progress up
      JOIN quizzes q ON up.quiz_id = q.id
      WHERE up.user_id = ?
        AND up.score >= 3
      ORDER BY up.completed_at DESC
    `,
      [userId]
    );

    const allAchievements = [];
    rows.forEach(r => {
      if (!r.achievements) return;
      try {
        const achievements = typeof r.achievements === 'string'
          ? JSON.parse(r.achievements)
          : r.achievements;

        achievements.forEach(a => {
          allAchievements.push({
            ...a,
            quizTitle: r.quizTitle,
            quizCategory: r.quizCategory,
            percentage: r.percentage,
            earnedAt: r.earnedAt,
            attemptNumber: r.attemptNumber
          });
        });
      } catch (err) {
        console.error('Error parsing achievements JSON:', err);
      }
    });

    const achievementsByCategory = {
      phishing: allAchievements.filter(a => a.quizCategory === 'phishing'),
      phone_scams: allAchievements.filter(a => a.quizCategory === 'phone_scams'),
      social_media: allAchievements.filter(a => a.quizCategory === 'social_media')
    };

    res.json({
      success: true,
      data: {
        allAchievements,
        achievementsByCategory,
        totalAchievements: allAchievements.length
      }
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user achievements',
      error: error.message
    });
  }
};

/* -----------------------------------------------------
 *  GET QUIZ STATS (admin)
 *  GET /api/quizzes/:id/stats
 * --------------------------------------------------- */
exports.getQuizStats = async (req, res) => {
  try {
    const { id: quizId } = req.params;

    const [quizRows] = await db.query(
      `
      SELECT title, category
      FROM quizzes
      WHERE id = ?
    `,
      [quizId]
    );

    if (quizRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const [stats] = await db.query(
      `
      SELECT
        COUNT(*) AS total_attempts,
        COUNT(DISTINCT user_id) AS unique_users,
        AVG(score) AS average_score,
        AVG(max_score) AS average_max_score,
        AVG(percentage) AS average_percentage,
        AVG(time_taken) AS average_time,
        MAX(score) AS highest_score,
        MIN(score) AS lowest_score,
        MAX(time_taken) AS longest_time,
        MIN(time_taken) AS shortest_time
      FROM user_progress
      WHERE quiz_id = ?
    `,
      [quizId]
    );

    const [retryStats] = await db.query(
      `
      SELECT
        COUNT(DISTINCT user_id) AS users_who_retried,
        AVG(attempt_count) AS avg_attempts_per_user
      FROM (
        SELECT user_id, COUNT(*) AS attempt_count
        FROM user_progress
        WHERE quiz_id = ?
        GROUP BY user_id
        HAVING COUNT(*) > 1
      ) AS retry_users
    `,
      [quizId]
    );

    const [distribution] = await db.query(
      `
      SELECT
        CASE
          WHEN percentage >= 90 THEN '90-100%'
          WHEN percentage >= 80 THEN '80-89%'
          WHEN percentage >= 70 THEN '70-79%'
          WHEN percentage >= 60 THEN '60-69%'
          ELSE 'Below 60%'
        END AS score_range,
        COUNT(*) AS count
      FROM user_progress
      WHERE quiz_id = ?
      GROUP BY score_range
      ORDER BY score_range DESC
    `,
      [quizId]
    );

    const [recentAttempts] = await db.query(
      `
      SELECT
        up.id,
        up.user_id,
        u.email,
        up.score,
        up.max_score,
        up.percentage,
        up.time_taken,
        up.attempt_number,
        up.completed_at
      FROM user_progress up
      LEFT JOIN users u ON up.user_id = u.id
      WHERE up.quiz_id = ?
      ORDER BY up.completed_at DESC
      LIMIT 10
    `,
      [quizId]
    );

    const [passFail] = await db.query(
      `
      SELECT
        SUM(CASE WHEN percentage >= 60 THEN 1 ELSE 0 END) AS passed,
        SUM(CASE WHEN percentage < 60 THEN 1 ELSE 0 END) AS failed
      FROM user_progress
      WHERE quiz_id = ?
    `,
      [quizId]
    );

    const [improvementStats] = await db.query(
      `
      SELECT
        AVG(improvement) AS avg_improvement
      FROM (
        SELECT
          user_id,
          MAX(percentage) - MIN(percentage) AS improvement
        FROM user_progress
        WHERE quiz_id = ?
        GROUP BY user_id
        HAVING COUNT(*) > 1
      ) AS improvements
    `,
      [quizId]
    );

    const totalAttempts = stats[0].total_attempts || 0;
    const uniqueUsers = stats[0].unique_users || 0;
    const usersWhoRetried = retryStats[0].users_who_retried || 0;
    const passRate =
      totalAttempts > 0 ? Math.round((passFail[0].passed / totalAttempts) * 100) : 0;

    res.json({
      success: true,
      quiz: quizRows[0],
      statistics: {
        total_attempts: totalAttempts,
        unique_users: uniqueUsers,
        average_score: Math.round((stats[0].average_score || 0) * 10) / 10,
        average_max_score: Math.round((stats[0].average_max_score || 0) * 10) / 10,
        average_percentage: Math.round(stats[0].average_percentage || 0),
        average_time: Math.round(stats[0].average_time || 0),
        highest_score: stats[0].highest_score || 0,
        lowest_score: stats[0].lowest_score || 0,
        longest_time: stats[0].longest_time || 0,
        shortest_time: stats[0].shortest_time || 0,
        users_who_retried: usersWhoRetried,
        retry_rate:
          uniqueUsers > 0 ? Math.round((usersWhoRetried / uniqueUsers) * 100) : 0,
        avg_attempts_per_user:
          Math.round((retryStats[0].avg_attempts_per_user || 1) * 10) / 10,
        pass_rate: passRate,
        passed: passFail[0].passed || 0,
        failed: passFail[0].failed || 0,
        avg_improvement: Math.round(improvementStats[0].avg_improvement || 0)
      },
      scoreDistribution: distribution,
      recentAttempts
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
