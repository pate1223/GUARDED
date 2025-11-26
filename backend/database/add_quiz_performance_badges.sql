-- Add new requirement types for quiz-specific badges
ALTER TABLE badges
MODIFY COLUMN requirement_type ENUM('quiz_count', 'quiz_percentage', 'video_count', 'streak', 'quiz_speed', 'quiz_participation') NOT NULL;

-- Add quiz_id column to user_badges to track which quiz earned the badge
ALTER TABLE user_badges
ADD COLUMN IF NOT EXISTS quiz_id INT NULL;

-- Add foreign key constraint for quiz_id (drop first if it exists)
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
                  WHERE CONSTRAINT_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'user_badges'
                  AND CONSTRAINT_NAME = 'fk_user_badges_quiz'
                  AND CONSTRAINT_TYPE = 'FOREIGN KEY');

SET @sql = IF(@fk_exists > 0, 'ALTER TABLE user_badges DROP FOREIGN KEY fk_user_badges_quiz', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE user_badges
ADD CONSTRAINT fk_user_badges_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL;

-- Insert new performance-based badges
INSERT INTO badges (name, description, icon, requirement_type, requirement_value) VALUES
('Lightning Fast', 'Complete a quiz in less than 50% of the time limit', '⚡', 'quiz_speed', 50),
('Good Try', 'Participate and complete any quiz', '👏', 'quiz_participation', 1),
('Speed Demon', 'Complete a quiz in less than 30% of the time limit', '🏃', 'quiz_speed', 30)
ON DUPLICATE KEY UPDATE name=name;
