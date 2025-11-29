-- Simple Quiz Data for GuardED Demo
-- This matches the basic table structure you provided

USE guarded_db;

-- Clear existing data first
DELETE FROM questions;
DELETE FROM quizzes;

-- Insert sample quizzes (basic structure)
INSERT INTO quizzes (title, category) VALUES
('Phishing Awareness', 'phishing'),
('Phone Scams Awareness', 'phone_scams');

-- Insert questions for Phishing Quiz (quiz_id = 1)
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES
(1, 'Which of the following is a sign of a phishing email?', 
 'An email from your bank with your name', 
 'An email with poor grammar and urgent requests', 
 'A message from a known contact', 
 'A regular newsletter', 
 'B'),

(1, 'What should you do if you receive a suspicious link?', 
 'Click it to see what it is', 
 'Ignore and delete the email', 
 'Forward it to friends', 
 'Reply to the sender', 
 'B'),

(1, 'Which email address is most likely to be legitimate?', 
 'support@paypal-security.com', 
 'noreply@paypal.com', 
 'urgent@paypal-verification.net', 
 'help@paypal-update.org', 
 'B'),

(1, 'What is the main goal of phishing attacks?', 
 'To send you advertisements', 
 'To steal your personal information', 
 'To improve your security', 
 'To update your software', 
 'B'),

(1, 'You receive an email claiming your account will be closed unless you verify your information. What should you do?', 
 'Click the link and verify immediately', 
 'Call the company using the number in the email', 
 'Log into your account directly through the official website', 
 'Reply to the email with your information', 
 'C');

-- Insert questions for Phone Scams Quiz (quiz_id = 2)
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES
(2, 'A caller claims to be from tech support and asks for remote access. What should you do?', 
 'Give access immediately', 
 'Ask for their ID', 
 'Hang up and call the official number', 
 'Share your password', 
 'C'),

(2, 'Which is a common sign of a phone scam?', 
 'Caller asks for payment in gift cards', 
 'Caller is polite', 
 'Caller knows your name', 
 'Caller offers a free vacation', 
 'A'),

(2, 'You receive a call about winning a prize you never entered. What should you do?', 
 'Provide your personal information to claim the prize', 
 'Pay the processing fee to receive your prize', 
 'Hang up immediately', 
 'Ask for more details about the prize', 
 'C'),

(2, 'A caller says your computer has a virus and offers to fix it for a fee. What should you do?', 
 'Pay the fee to have it fixed', 
 'Give them remote access to your computer', 
 'Hang up and run your own antivirus scan', 
 'Ask them to prove they are legitimate', 
 'C'),

(2, 'What should you do if you receive a call from someone claiming to be from the IRS?', 
 'Provide your Social Security number', 
 'Pay any requested fees immediately', 
 'Hang up and call the IRS directly', 
 'Give them your bank account information', 
 'C');
