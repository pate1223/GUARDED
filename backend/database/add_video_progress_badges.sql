-- Create video_progress table
CREATE TABLE IF NOT EXISTS video_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  module_id VARCHAR(100) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  last_watched DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_module (user_id, module_id),
  INDEX idx_user_progress (user_id),
  INDEX idx_module (module_id)
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(255),
  requirement_type ENUM('quiz_count', 'quiz_percentage', 'video_count', 'streak') NOT NULL,
  requirement_value INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  badge_id INT NOT NULL,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_badge (user_id, badge_id),
  INDEX idx_user_badges (user_id)
);

-- Add photo_url column to users table (ignore if exists)
ALTER TABLE users ADD COLUMN photo_url VARCHAR(500);
-- Add language column to users table (ignore if exists)
ALTER TABLE users ADD COLUMN language VARCHAR(10) DEFAULT 'EN';

-- Insert default badges
INSERT INTO badges (name, description, icon, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first quiz', '🎯', 'quiz_count', 1),
('Quiz Master', 'Complete 5 quizzes', '🏆', 'quiz_count', 5),
('Perfect Score', 'Score 100% on any quiz', '⭐', 'quiz_percentage', 100),
('Dedicated Learner', 'Complete 10 quizzes', '📚', 'quiz_count', 10),
('Video Enthusiast', 'Watch 5 complete videos', '🎬', 'video_count', 5)
ON DUPLICATE KEY UPDATE name=name;
