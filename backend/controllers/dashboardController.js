const db = require('../models/db');

exports.getDashboardStats = async (req, res) => {
  try {
    // Total quiz attempts
    const [totalAttempts] = await db.query(
      'SELECT COUNT(*) as count FROM user_progress'
    );

    // Total users
    const [totalUsers] = await db.query(
      'SELECT COUNT(*) as count FROM users'
    );

    // Completion rate (percentage of quizzes with score >= 60%)
    const [completionData] = await db.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN (score / max_score * 100) >= 60 THEN 1 ELSE 0 END) as completed
      FROM user_progress
    `);

    const completionRate = completionData[0].total > 0
      ? Math.round((completionData[0].completed / completionData[0].total) * 100)
      : 0;

    // Top quiz (most attempted)
    const [topQuiz] = await db.query(`
      SELECT q.title, COUNT(up.id) as attempt_count
      FROM quizzes q
      LEFT JOIN user_progress up ON q.id = up.quiz_id
      GROUP BY q.id, q.title
      ORDER BY attempt_count DESC
      LIMIT 1
    `);

    // Latest feedback (last 2 entries)
    const [latestFeedback] = await db.query(`
      SELECT f.id, f.rating, f.question2, f.question5, f.created_at, u.email
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY f.created_at DESC
      LIMIT 2
    `);

    // Recent attempts (last 5)
    const [recentAttempts] = await db.query(`
      SELECT
        up.id,
        q.title as quiz_title,
        up.score,
        up.max_score,
        up.completed_at,
        u.email as user_email
      FROM user_progress up
      JOIN quizzes q ON up.quiz_id = q.id
      LEFT JOIN users u ON up.user_id = u.id
      ORDER BY up.completed_at DESC
      LIMIT 5
    `);

    // Chart data - attempts per day for last 12 days
    const [chartData] = await db.query(`
      SELECT
        DATE(completed_at) as date,
        COUNT(*) as count
      FROM user_progress
      WHERE completed_at >= DATE_SUB(CURDATE(), INTERVAL 12 DAY)
      GROUP BY DATE(completed_at)
      ORDER BY date ASC
    `);

    // Create array of last 12 days with attempt counts
    const last12Days = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayData = chartData.find(d => d.date === dateStr);
      last12Days.push(dayData ? dayData.count : 0);
    }

    res.json({
      success: true,
      stats: {
        totalAttempts: totalAttempts[0].count,
        totalUsers: totalUsers[0].count,
        completionRate,
        topQuiz: topQuiz[0]?.title || 'No quizzes attempted yet',
        latestFeedback: latestFeedback.map(f => ({
          id: f.id,
          name: f.email ? f.email.split('@')[0] : 'Anonymous',
          text: f.question2 || f.question5 || 'No comment',
          rating: f.rating,
          created_at: f.created_at
        })),
        recentAttempts: recentAttempts.map(a => ({
          id: a.id,
          quizTitle: a.quiz_title,
          score: a.score,
          maxScore: a.max_score,
          percentage: Math.round((a.score / a.max_score) * 100),
          date: a.completed_at,
          userEmail: a.user_email
        })),
        chartData: last12Days
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      message: error.message
    });
  }
};