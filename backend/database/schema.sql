-- GuardED Database Schema
-- This file contains all the necessary tables for the authentication and RBAC system

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS guarded_db;
USE guarded_db;

-- Users table - stores user information and roles
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('guest', 'user', 'admin') DEFAULT 'user' NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_firebase_uid (firebase_uid),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);

-- Admin logs table - tracks all administrative actions
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_user_id INT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_admin_id (admin_id),
    INDEX idx_action (action),
    INDEX idx_target_user_id (target_user_id),
    INDEX idx_created_at (created_at)
);

-- Quizzes table - stores quiz information
CREATE TABLE IF NOT EXISTS quizzes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    time_limit INT, -- in minutes
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

-- Questions table - stores quiz questions
CREATE TABLE IF NOT EXISTS questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'fill_blank') DEFAULT 'multiple_choice',
    options JSON, -- for multiple choice questions
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

-- User progress table - tracks user quiz attempts and scores
CREATE TABLE IF NOT EXISTS user_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT DEFAULT 0,
    max_score INT DEFAULT 0,
    time_taken INT, -- in seconds
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    answers JSON, -- stores user's answers
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_quiz (user_id, quiz_id),
    INDEX idx_user_id (user_id),
    INDEX idx_quiz_id (quiz_id),
    INDEX idx_completed_at (completed_at)
);

-- Feedback table - stores user feedback
CREATE TABLE IF NOT EXISTS feedback (
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

-- Insert default admin user (you should change this in production)
-- Password should be set through Firebase, this is just for initial setup
INSERT IGNORE INTO users (firebase_uid, email, role, display_name) 
VALUES ('admin_initial', 'admin@guarded.com', 'admin', 'System Administrator');

-- Create indexes for better performance
CREATE INDEX idx_users_role_created ON users(role, created_at);
CREATE INDEX idx_admin_logs_admin_action ON admin_logs(admin_id, action);
CREATE INDEX idx_quizzes_category_difficulty ON quizzes(category, difficulty);
CREATE INDEX idx_user_progress_user_score ON user_progress(user_id, score);
CREATE INDEX idx_feedback_user_status ON feedback(user_id, status);

-- Add comments for documentation
ALTER TABLE users COMMENT = 'User accounts with Firebase authentication and role-based access control';
ALTER TABLE admin_logs COMMENT = 'Audit trail for all administrative actions';
ALTER TABLE quizzes COMMENT = 'Educational quizzes with metadata and configuration';
ALTER TABLE questions COMMENT = 'Individual quiz questions with answers and scoring';
ALTER TABLE user_progress COMMENT = 'User quiz completion tracking and scoring';
ALTER TABLE feedback COMMENT = 'User feedback and bug reports with admin responses';

