-- Quiz Data for GuardED Demo
-- This file contains sample quiz data for the demo

USE guarded_db;

-- Insert sample quizzes
INSERT INTO quizzes (title, description, category, difficulty, time_limit, is_active) VALUES
('Phishing Awareness', 'Test your knowledge about phishing emails and how to identify them', 'phishing', 'easy', 10, TRUE),
('Phone Scams Awareness', 'Learn to recognize and avoid phone scams', 'phone_scams', 'easy', 10, TRUE);

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

-- Insert some sample user progress (optional - for testing)
-- INSERT INTO user_progress (user_id, quiz_id, score, max_score, time_taken, answers) VALUES
-- (1, 1, 4, 5, 180, JSON_OBJECT('1', 'B', '2', 'B', '3', 'B', '4', 'B', '5', 'C'));
