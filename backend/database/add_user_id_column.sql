-- Safe migration to add user_id column if it doesn't exist
-- This script checks if the column exists before adding it

USE backend;

-- Check if user_id column exists, if not add it
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'backend' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'user_id';

-- Add column if it doesn't exist
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN user_id VARCHAR(255) NULL AFTER firebase_uid',
    'SELECT "Column user_id already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing records to populate user_id
UPDATE users 
SET user_id = email 
WHERE user_id IS NULL AND email IS NOT NULL;

UPDATE users 
SET user_id = firebase_uid 
WHERE user_id IS NULL;

-- Verify the column was added
DESCRIBE users;

