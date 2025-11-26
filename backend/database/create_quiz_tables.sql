-- Clean Quiz Tables Creation for GuardED
-- This creates the complete quiz system tables from scratch

USE guarded_db;

-- Drop existing tables if they exist (to start fresh)
-- Must drop in correct order due to foreign key constraints
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS quizzes;

-- Create quizzes table with full functionality
CREATE TABLE quizzes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    time_limit INT DEFAULT 10, -- in minutes
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
);

-- Create questions table with full functionality
CREATE TABLE questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'fill_blank') DEFAULT 'multiple_choice',
    options JSON, -- for multiple choice questions: {"A": "option1", "B": "option2", "C": "option3", "D": "option4"}
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INT DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz_id (quiz_id),
    INDEX idx_question_type (question_type),
    INDEX idx_order_index (order_index)
);

-- Create user_progress table with full functionality
CREATE TABLE user_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT DEFAULT 0,
    max_score INT DEFAULT 0,
    time_taken INT, -- in seconds
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    answers JSON, -- stores user's answers: {"1": "A", "2": "B", "3": "C"}
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_quiz (user_id, quiz_id),
    INDEX idx_user_id (user_id),
    INDEX idx_quiz_id (quiz_id),
    INDEX idx_completed_at (completed_at)
);

-- Create feedback table with full functionality
CREATE TABLE feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    quiz_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    feedback_type ENUM('bug_report', 'feature_request', 'general', 'quiz_feedback') DEFAULT 'general',
    status ENUM('pending', 'in_progress', 'resolved', 'closed') DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_quiz_id (quiz_id),
    INDEX idx_rating (rating),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Add comments for documentation
ALTER TABLE quizzes COMMENT = 'Educational quizzes with metadata and configuration';
ALTER TABLE questions COMMENT = 'Individual quiz questions with answers and scoring';
ALTER TABLE user_progress COMMENT = 'User quiz completion tracking and scoring';
ALTER TABLE feedback COMMENT = 'User feedback and bug reports with admin responses';

-- Create additional performance indexes
CREATE INDEX idx_quizzes_category_difficulty ON quizzes(category, difficulty);
CREATE INDEX idx_user_progress_user_score ON user_progress(user_id, score);
CREATE INDEX idx_feedback_user_status ON feedback(user_id, status);
