-- Database Creation --
create database backend;
use backend;

SET FOREIGN_KEY_CHECKS = 0;

-- Deleting Table --
DROP table users;
DROP table quizzes;
DROP table questions;
DROP TABLE IF EXISTS user_progress;
DROP table feedback;

SET FOREIGN_KEY_CHECKS = 1;

-- Clear existing data first (optional - only if you want to reset)
DELETE FROM user_progress;
DELETE FROM questions;
DELETE FROM quizzes;

-- Table Creation --
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firebase_uid VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role ENUM('guest', 'user', 'admin') NOT NULL DEFAULT 'guest',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);

ALTER TABLE users ADD UNIQUE (firebase_uid);
ALTER TABLE users ADD UNIQUE (email);

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

CREATE TABLE admin_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action TEXT NOT NULL,
    target_id INT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

SELECT * FROM quizzes;
SELECT * FROM questions;

-- Checking the Results --
select * from users;

-- Insert sample quizzes
INSERT INTO quizzes (title, description, category, difficulty, time_limit, is_active) VALUES
('Phishing Awareness', 'Test your knowledge about phishing emails and how to identify them. Learn to spot common phishing tactics and protect yourself from email scams.', 'phishing', 'easy', 10, TRUE),
('Phone Scams Awareness', 'Learn to recognize and avoid phone scams. Test your knowledge about common phone scam tactics and how to protect yourself.', 'phone_scams', 'easy', 10, TRUE),
('Social Media Security', 'Understand the risks of social media and learn how to protect your privacy and personal information online.', 'social_media', 'medium', 15, TRUE);

-- Insert questions for Phishing Quiz (quiz_id = 1)
INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, explanation, points, order_index) VALUES
(1, 'Which of the following is a sign of a phishing email?', 'multiple_choice', 
JSON_OBJECT(
  'A', 'An email from your bank with your name',
  'B', 'An email with poor grammar and urgent requests',
  'C', 'A message from a known contact',
  'D', 'A regular newsletter'
), 'B', 'Phishing emails often contain poor grammar, spelling errors, and create a sense of urgency to trick you into acting quickly.', 1, 1),

(1, 'What should you do if you receive a suspicious link?', 'multiple_choice',
JSON_OBJECT(
  'A', 'Click it to see what it is',
  'B', 'Ignore and delete the email',
  'C', 'Forward it to friends',
  'D', 'Reply to the sender'
), 'B', 'Never click suspicious links. Delete the email and report it if it appears to be from a legitimate organization.', 1, 2),

(1, 'Which email address is most likely to be legitimate?', 'multiple_choice',
JSON_OBJECT(
  'A', 'support@paypal-security.com',
  'B', 'noreply@paypal.com',
  'C', 'urgent@paypal-verification.net',
  'D', 'help@paypal-update.org'
), 'B', 'Legitimate companies use their official domain names. Be suspicious of variations or additional words in the domain.', 1, 3),

(1, 'What is the main goal of phishing attacks?', 'multiple_choice',
JSON_OBJECT(
  'A', 'To send you advertisements',
  'B', 'To steal your personal information',
  'C', 'To improve your security',
  'D', 'To update your software'
), 'B', 'Phishing attacks aim to steal personal information like passwords, credit card numbers, or other sensitive data.', 1, 4),

(1, 'You receive an email claiming your account will be closed unless you verify your information. What should you do?', 'multiple_choice',
JSON_OBJECT(
  'A', 'Click the link and verify immediately',
  'B', 'Call the company using the number in the email',
  'C', 'Log into your account directly through the official website',
  'D', 'Reply to the email with your information'
), 'C', 'Always access your accounts directly through the official website, never through links in emails.', 1, 5);

-- Insert questions for Phone Scams Quiz (quiz_id = 2)
INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, explanation, points, order_index) VALUES
(2, 'A caller claims to be from tech support and asks for remote access. What should you do?', 'multiple_choice',
JSON_OBJECT(
  'A', 'Give access immediately',
  'B', 'Ask for their ID',
  'C', 'Hang up and call the official number',
  'D', 'Share your password'
), 'C', 'Legitimate tech support will never call you unsolicited. Hang up and call the official number if you need support.', 1, 1),

(2, 'Which is a common sign of a phone scam?', 'multiple_choice',
JSON_OBJECT(
  'A', 'Caller asks for payment in gift cards',
  'B', 'Caller is polite',
  'C', 'Caller knows your name',
  'D', 'Caller offers a free vacation'
), 'A', 'Legitimate businesses never ask for payment in gift cards. This is a major red flag for scams.', 1, 2),

(2, 'You receive a call about winning a prize you never entered. What should you do?', 'multiple_choice',
JSON_OBJECT(
  'A', 'Provide your personal information to claim the prize',
  'B', 'Pay the processing fee to receive your prize',
  'C', 'Hang up immediately',
  'D', 'Ask for more details about the prize'
), 'C', 'If you never entered a contest, you cannot win a prize. This is a common scam tactic.', 1, 3),

(2, 'A caller says your computer has a virus and offers to fix it for a fee. What should you do?', 'multiple_choice',
JSON_OBJECT(
  'A', 'Pay the fee to have it fixed',
  'B', 'Give them remote access to your computer',
  'C', 'Hang up and run your own antivirus scan',
  'D', 'Ask them to prove they are legitimate'
), 'C', 'Legitimate tech support doesn\'t call you about viruses. Run your own antivirus software to check for issues.', 1, 4),

(2, 'What should you do if you receive a call from someone claiming to be from the IRS?', 'multiple_choice',
JSON_OBJECT(
  'A', 'Provide your Social Security number',
  'B', 'Pay any requested fees immediately',
  'C', 'Hang up and call the IRS directly',
  'D', 'Give them your bank account information'
), 'C', 'The IRS will never call you demanding immediate payment. Always verify by calling the official IRS number.', 1, 5);

-- Insert questions for Social Media Security Quiz (quiz_id = 3)
INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, explanation, points, order_index) VALUES
(3, 'What information should you avoid sharing on social media?', 'multiple_choice',
JSON_OBJECT(
  'A', 'Your favorite food',
  'B', 'Your home address and phone number',
  'C', 'Your pet\'s name',
  'D', 'Your favorite movie'
), 'B', 'Never share personal information like your address, phone number, or financial details on social media.', 1, 1),

(3, 'What should you do if you receive a friend request from someone you don\'t know?', 'multiple_choice',
JSON_OBJECT(
  'A', 'Accept it to be polite',
  'B', 'Accept it and then block them',
  'C', 'Ignore or decline the request',
  'D', 'Accept it and ask who they are'
), 'C', 'Only accept friend requests from people you know and trust. Unknown accounts could be scammers or bots.', 1, 2),

(3, 'Which privacy setting is most important for your social media accounts?', 'multiple_choice',
JSON_OBJECT(
  'A', 'Making your profile public',
  'B', 'Allowing anyone to tag you',
  'C', 'Restricting who can see your posts',
  'D', 'Sharing your location in posts'
), 'C', 'Restricting who can see your posts helps protect your privacy and personal information from strangers.', 1, 3),

(3, 'What should you do if someone asks for your password on social media?', 'multiple_choice',
JSON_OBJECT(
  'A', 'Share it if they seem trustworthy',
  'B', 'Never share your password with anyone',
  'C', 'Share it only with close friends',
  'D', 'Share it if they offer something in return'
), 'B', 'Never share your passwords with anyone, even friends or family. Legitimate services will never ask for your password.', 1, 4),

(3, 'How often should you review your social media privacy settings?', 'multiple_choice',
JSON_OBJECT(
  'A', 'Only when you first create the account',
  'B', 'Once a year',
  'C', 'Regularly, at least every few months',
  'D', 'Never, set it once and forget it'
), 'C', 'Privacy settings can change, and new features are added regularly. Review your settings every few months to stay protected.', 1, 5);

-- Show summary of inserted data
SELECT 'Quiz data inserted successfully' as status;
SELECT COUNT(*) as total_quizzes FROM quizzes;
SELECT COUNT(*) as total_questions FROM questions;