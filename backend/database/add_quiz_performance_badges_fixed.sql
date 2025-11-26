-- Add new requirement types for quiz-specific badges
ALTER TABLE badges
MODIFY COLUMN requirement_type ENUM('quiz_count', 'quiz_percentage', 'video_count', 'streak', 'quiz_speed', 'quiz_participation') NOT NULL;

-- Insert new performance-based badges
INSERT INTO badges (name, description, icon, requirement_type, requirement_value) VALUES
('Lightning Fast', 'Complete a quiz in less than 50% of the time limit', '⚡', 'quiz_speed', 50),
('Good Try', 'Participate and complete any quiz', '👏', 'quiz_participation', 1),
('Speed Demon', 'Complete a quiz in less than 30% of the time limit', '🏃', 'quiz_speed', 30)
ON DUPLICATE KEY UPDATE name=name;
