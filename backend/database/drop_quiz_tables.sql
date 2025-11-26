-- Safe Drop Script for Quiz Tables
-- This handles foreign key constraints properly

USE guarded_db;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all quiz-related tables
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS quizzes;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Show confirmation
SELECT 'Quiz tables dropped successfully' as status;
