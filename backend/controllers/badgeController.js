const db = require('../models/db');

// Check and award quiz-specific badges (speed, participation, perfect score)
async function checkQuizSpecificBadges(userId, quizId, quizData) {
  try {
    const { score, maxScore, timeTaken, timeLimit } = quizData;
    const percentage = Math.round((score / maxScore) * 100);

    // Get all badges
    const [badges] = await db.query('SELECT * FROM badges');

    // Get user's current badges
    const [userBadges] = await db.query(`
      SELECT badge_id FROM user_badges WHERE user_id = ?
    `, [userId]);
    const ownedBadgeIds = userBadges.map(ub => ub.badge_id);

    const newBadges = [];

    for (const badge of badges) {
      // Skip if user already has this badge
      if (ownedBadgeIds.includes(badge.id)) continue;

      let qualifies = false;

      switch (badge.requirement_type) {
        case 'quiz_speed':
          // Award if completed in less than X% of time limit
          if (timeLimit && timeTaken) {
            const timeLimitSeconds = timeLimit * 60; // Convert minutes to seconds
            const percentageOfTimeUsed = (timeTaken / timeLimitSeconds) * 100;
            qualifies = percentageOfTimeUsed <= badge.requirement_value;
          }
          break;

        case 'quiz_participation':
          // Award for simply completing a quiz
          qualifies = true;
          break;

        case 'quiz_percentage':
          // Award for achieving a specific percentage on THIS quiz
          qualifies = percentage >= badge.requirement_value;
          break;
      }

      // Award badge if qualified
      if (qualifies) {
        await db.query(`
          INSERT INTO user_badges (user_id, badge_id, quiz_id)
          VALUES (?, ?, ?)
        `, [userId, badge.id, quizId]);
        newBadges.push(badge);
      }
    }

    return newBadges;
  } catch (error) {
    console.error('Check quiz-specific badges error:', error);
    return [];
  }
}

// Check and award badges automatically (for overall stats)
async function checkAndAwardBadges(userId, quizId = null, quizData = null) {
  try {
    let allNewBadges = [];

    // If quiz-specific data provided, check quiz-specific badges first
    if (quizId && quizData) {
      const quizSpecificBadges = await checkQuizSpecificBadges(userId, quizId, quizData);
      allNewBadges.push(...quizSpecificBadges);
    }

    // Get user stats for overall badges
    const [quizStats] = await db.query(`
      SELECT
        COUNT(*) as quiz_count,
        MAX(ROUND((score / max_score) * 100)) as best_percentage
      FROM user_progress
      WHERE user_id = ?
    `, [userId]);

    const [videoStats] = await db.query(`
      SELECT COUNT(*) as video_count
      FROM video_progress
      WHERE user_id = ? AND percentage >= 100
    `, [userId]);

    const stats = {
      quiz_count: quizStats[0]?.quiz_count || 0,
      quiz_percentage: quizStats[0]?.best_percentage || 0,
      video_count: videoStats[0]?.video_count || 0
    };

    // Get all badges
    const [badges] = await db.query('SELECT * FROM badges');

    // Get user's current badges
    const [userBadges] = await db.query(`
      SELECT badge_id FROM user_badges WHERE user_id = ?
    `, [userId]);
    const ownedBadgeIds = userBadges.map(ub => ub.badge_id);

    // Check each badge for overall stats
    for (const badge of badges) {
      // Skip if user already has this badge
      if (ownedBadgeIds.includes(badge.id)) continue;

      // Check if user qualifies
      let qualifies = false;
      switch (badge.requirement_type) {
        case 'quiz_count':
          qualifies = stats.quiz_count >= badge.requirement_value;
          break;
        case 'quiz_percentage':
          // For overall percentage badges, check best score across all quizzes
          qualifies = stats.quiz_percentage >= badge.requirement_value;
          break;
        case 'video_count':
          qualifies = stats.video_count >= badge.requirement_value;
          break;
        // Skip quiz-specific types here (handled above)
        case 'quiz_speed':
        case 'quiz_participation':
          continue;
      }

      // Award badge if qualified
      if (qualifies) {
        await db.query(`
          INSERT INTO user_badges (user_id, badge_id, quiz_id)
          VALUES (?, ?, ?)
        `, [userId, badge.id, quizId]);
        allNewBadges.push(badge);
      }
    }

    return allNewBadges;
  } catch (error) {
    console.error('Check badges error:', error);
    return [];
  }
}

// Get user's badges
exports.getUserBadges = async (req, res) => {
  try {
    const userId = req.user.dbUser.id;

    const [badges] = await db.query(`
      SELECT b.*, ub.earned_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ?
      ORDER BY ub.earned_at DESC
    `, [userId]);

    res.json({
      success: true,
      badges: badges
    });
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch badges',
      error: error.message
    });
  }
};

// Get all available badges
exports.getAllBadges = async (req, res) => {
  try {
    const [badges] = await db.query('SELECT * FROM badges ORDER BY requirement_value ASC');

    res.json({
      success: true,
      badges: badges
    });
  } catch (error) {
    console.error('Get all badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch badges',
      error: error.message
    });
  }
};

// Export helper function
exports.checkAndAwardBadges = checkAndAwardBadges;