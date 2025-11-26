-- Migration to support quiz history with multiple attempts
-- This adds support for tracking multiple quiz attempts per user

USE guarded_db;

-- First, backup existing data by selecting it (admin should run this manually if needed)
-- SELECT * FROM user_progress;

-- Drop the unique constraint that prevents multiple attempts
ALTER TABLE user_progress DROP INDEX unique_user_quiz;

-- Add new columns for quiz history support
ALTER TABLE user_progress
  ADD COLUMN attempt_number INT DEFAULT 1 AFTER quiz_id,
  ADD COLUMN percentage INT DEFAULT 0 AFTER max_score,
  ADD COLUMN achievements JSON AFTER answers;

-- Add new composite index for user, quiz, and attempt number
CREATE INDEX idx_user_quiz_attempt ON user_progress(user_id, quiz_id, attempt_number);

-- Update existing records to have attempt_number = 1 and calculate percentage
UPDATE user_progress
SET
  attempt_number = 1,
  percentage = ROUND((score / max_score) * 100)
WHERE attempt_number IS NULL OR attempt_number = 0;

-- Add comments
ALTER TABLE user_progress COMMENT = 'User quiz attempts with history tracking and achievements';
