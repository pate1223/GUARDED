// Export utility functions for CSV and PDF generation

/**
 * Export quiz history as completion certificate (alternative format)
 * @param {Array} quizHistory - Array of quiz attempt objects
 * @param {string} quizTitle - Title of the quiz
 * @param {Object} userInfo - User information (name, email)
 */
export const exportQuizHistoryToCSV = (quizHistory, quizTitle = 'Quiz History', userInfo = {}) => {
  // Generate certificate (same as PDF)
  exportQuizHistoryToPDF(quizHistory, quizTitle, userInfo);
};

/**
 * Export all quiz progress to CSV format
 * @param {Array} progress - Array of user progress objects
 */
export const exportAllProgressToCSV = (progress) => {
  if (!progress || progress.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = ['Quiz Title', 'Category', 'Score', 'Max Score', 'Percentage', 'Time Taken', 'Completed At'];

  const rows = progress.map(item => [
    `"${item.title || 'Unknown'}"`,
    item.category || 'N/A',
    item.score || 0,
    item.max_score || 0,
    `${item.percentage || 0}%`,
    formatTime(item.time_taken || 0),
    new Date(item.completed_at).toLocaleString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadFile(csvContent, 'quiz_progress.csv', 'text/csv');
};

/**
 * Export quiz statistics to CSV format (Admin)
 * @param {Object} stats - Quiz statistics object
 * @param {string} quizTitle - Title of the quiz
 */
export const exportQuizStatsToCSV = (stats, quizTitle = 'Quiz Stats') => {
  if (!stats) {
    alert('No data to export');
    return;
  }

  const rows = [
    ['Metric', 'Value'],
    ['Quiz Title', quizTitle],
    ['Total Attempts', stats.statistics.total_attempts],
    ['Unique Users', stats.statistics.unique_users],
    ['Average Score', stats.statistics.average_score],
    ['Average Percentage', `${stats.statistics.average_percentage}%`],
    ['Pass Rate', `${stats.statistics.pass_rate}%`],
    ['Retry Rate', `${stats.statistics.retry_rate}%`],
    ['Average Time', formatTime(stats.statistics.average_time)],
    ['Highest Score', stats.statistics.highest_score],
    ['Lowest Score', stats.statistics.lowest_score],
    ['Users Who Retried', stats.statistics.users_who_retried],
    ['Average Improvement', `${stats.statistics.avg_improvement}%`],
    ['', ''],
    ['Score Distribution', ''],
    ['Range', 'Count']
  ];

  if (stats.scoreDistribution && stats.scoreDistribution.length > 0) {
    stats.scoreDistribution.forEach(dist => {
      rows.push([dist.score_range, dist.count]);
    });
  }

  const csvContent = rows.map(row => row.join(',')).join('\n');
  downloadFile(csvContent, `${sanitizeFilename(quizTitle)}_statistics.csv`, 'text/csv');
};

/**
 * Export quiz history as completion certificate (PDF)
 * @param {Array} quizHistory - Array of quiz attempt objects
 * @param {string} quizTitle - Title of the quiz
 * @param {Object} userInfo - User information (name, email)
 */
export const exportQuizHistoryToPDF = (quizHistory, quizTitle = 'Quiz History', userInfo = {}) => {
  if (!quizHistory || quizHistory.length === 0) {
    alert('No quiz attempts to generate certificate');
    return;
  }

  // Get the latest/best attempt
  const bestAttempt = quizHistory.reduce((best, current) =>
    current.percentage > best.percentage ? current : best
  );

  const userName = userInfo.displayName || userInfo.email?.split('@')[0] || 'Student';
  const completionDate = new Date(bestAttempt.completed_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certificateHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate of Completion - ${quizTitle}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .certificate {
      width: 297mm;
      height: 210mm;
      background: white;
      padding: 40px 60px;
      box-shadow: 0 10px 50px rgba(0,0,0,0.3);
      position: relative;
      border: 3px solid #8B7355;
    }
    .certificate::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 2px solid #DAA520;
      pointer-events: none;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .title {
      font-size: 42px;
      color: #2c3e50;
      font-weight: bold;
      margin-bottom: 10px;
      letter-spacing: 3px;
    }
    .subtitle {
      font-size: 20px;
      color: #667eea;
      font-style: italic;
    }
    .content {
      text-align: center;
      margin-top: 40px;
    }
    .awarded-to {
      font-size: 18px;
      color: #555;
      margin-bottom: 15px;
    }
    .recipient-name {
      font-size: 48px;
      color: #2c3e50;
      font-weight: bold;
      margin: 20px 0;
      border-bottom: 3px solid #DAA520;
      display: inline-block;
      padding-bottom: 10px;
    }
    .completion-text {
      font-size: 18px;
      color: #555;
      margin: 30px auto;
      max-width: 600px;
      line-height: 1.8;
    }
    .quiz-title {
      font-size: 28px;
      color: #667eea;
      font-weight: bold;
      margin: 20px 0;
    }
    .score-section {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin: 30px 0;
    }
    .score-item {
      text-align: center;
    }
    .score-label {
      font-size: 14px;
      color: #777;
      margin-bottom: 5px;
    }
    .score-value {
      font-size: 32px;
      color: #667eea;
      font-weight: bold;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 50px;
    }
    .signature-line {
      text-align: center;
      flex: 1;
      margin: 0 20px;
    }
    .line {
      border-top: 2px solid #333;
      margin-bottom: 5px;
      width: 200px;
      margin: 0 auto 5px;
    }
    .signature-label {
      font-size: 12px;
      color: #555;
    }
    .date {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #777;
    }
    .seal {
      position: absolute;
      bottom: 60px;
      right: 80px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      border: 4px solid #DAA520;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .certificate {
        box-shadow: none;
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">🛡️</div>
      <div class="title">CERTIFICATE OF COMPLETION</div>
      <div class="subtitle">GuardED - Cyber Security Awareness</div>
    </div>

    <div class="content">
      <div class="awarded-to">This certificate is proudly presented to</div>
      <div class="recipient-name">${userName}</div>

      <div class="completion-text">
        for successfully completing the
      </div>

      <div class="quiz-title">${quizTitle}</div>

      <div class="score-section">
        <div class="score-item">
          <div class="score-label">Final Score</div>
          <div class="score-value">${bestAttempt.percentage}%</div>
        </div>
        <div class="score-item">
          <div class="score-label">Points Earned</div>
          <div class="score-value">${bestAttempt.score}/${bestAttempt.max_score}</div>
        </div>
        <div class="score-item">
          <div class="score-label">Time Taken</div>
          <div class="score-value">${formatTime(bestAttempt.time_taken)}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="signature-line">
        <div class="line"></div>
        <div class="signature-label">Authorized Signature</div>
      </div>
      <div class="date">
        Completed on ${completionDate}
      </div>
      <div class="signature-line">
        <div class="line"></div>
        <div class="signature-label">Date</div>
      </div>
    </div>

    <div class="seal">✓</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    }
  </script>
</body>
</html>
  `;

  // Open certificate in new window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    printWindow.location.href = url;

    // Clean up after window is loaded
    printWindow.addEventListener('load', () => {
      URL.revokeObjectURL(url);
    });
  }
};

/**
 * Export quiz statistics to text-based "PDF" format
 * @param {Object} stats - Quiz statistics object
 * @param {string} quizTitle - Title of the quiz
 */
export const exportQuizStatsToPDF = (stats, quizTitle = 'Quiz Stats') => {
  if (!stats) {
    alert('No data to export');
    return;
  }

  let pdfContent = `
╔═══════════════════════════════════════════════════════════╗
║                 QUIZ ANALYTICS REPORT                     ║
║                 ${quizTitle.toUpperCase().padEnd(39)}     ║
╠═══════════════════════════════════════════════════════════╣
║ Generated: ${new Date().toLocaleString().padEnd(42)} ║
╚═══════════════════════════════════════════════════════════╝

┌─────────────── OVERVIEW STATISTICS ───────────────────────┐
│ Total Attempts: ${String(stats.statistics.total_attempts).padEnd(40)} │
│ Unique Users: ${String(stats.statistics.unique_users).padEnd(42)} │
│ Average Score: ${String(stats.statistics.average_score).padEnd(41)} │
│ Average Percentage: ${String(stats.statistics.average_percentage).padEnd(36)}% │
│ Pass Rate: ${String(stats.statistics.pass_rate).padEnd(45)}% │
└───────────────────────────────────────────────────────────┘

┌────────────── ENGAGEMENT METRICS ─────────────────────────┐
│ Retry Rate: ${String(stats.statistics.retry_rate).padEnd(44)}% │
│ Users Who Retried: ${String(stats.statistics.users_who_retried).padEnd(37)} │
│ Average Improvement: ${String(stats.statistics.avg_improvement).padEnd(35)}% │
│ Avg Attempts/User: ${String(stats.statistics.avg_attempts_per_user).padEnd(37)} │
└───────────────────────────────────────────────────────────┘

┌────────────── PERFORMANCE METRICS ────────────────────────┐
│ Highest Score: ${String(stats.statistics.highest_score).padEnd(41)} │
│ Lowest Score: ${String(stats.statistics.lowest_score).padEnd(42)} │
│ Fastest Time: ${formatTime(stats.statistics.shortest_time).padEnd(42)} │
│ Slowest Time: ${formatTime(stats.statistics.longest_time).padEnd(42)} │
│ Average Time: ${formatTime(stats.statistics.average_time).padEnd(42)} │
└───────────────────────────────────────────────────────────┘

┌────────────── SCORE DISTRIBUTION ─────────────────────────┐
`;

  if (stats.scoreDistribution && stats.scoreDistribution.length > 0) {
    stats.scoreDistribution.forEach(dist => {
      pdfContent += `│ ${dist.score_range.padEnd(15)} : ${String(dist.count).padEnd(35)} │\n`;
    });
  }

  pdfContent += `└───────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    END OF REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  downloadFile(pdfContent, `${sanitizeFilename(quizTitle)}_statistics.txt`, 'text/plain');
};

// Helper functions

/**
 * Format seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Sanitize filename by removing invalid characters
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
}

/**
 * Download file to user's computer
 * @param {string} content - File content
 * @param {string} filename - Name of the file
 * @param {string} mimeType - MIME type of the file
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}