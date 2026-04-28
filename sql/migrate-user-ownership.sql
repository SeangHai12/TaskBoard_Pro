-- Migration: add per-user ownership to existing databases.
-- Run this once if your tables already exist from an older version.

USE taskboard_pro;

-- Ensure users table exists
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash CHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Ensure at least one user exists so we can backfill old rows
INSERT IGNORE INTO users (id, username, password_hash)
VALUES (1, 'student', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');

-- Add ownership columns if missing (compatible with older MySQL versions)
SET @has_boards_user_col := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'boards'
    AND COLUMN_NAME = 'user_id'
);
SET @sql_boards_user_col := IF(
  @has_boards_user_col = 0,
  'ALTER TABLE boards ADD COLUMN user_id INT NULL',
  'SELECT 1'
);
PREPARE stmt_boards_user_col FROM @sql_boards_user_col;
EXECUTE stmt_boards_user_col;
DEALLOCATE PREPARE stmt_boards_user_col;

SET @has_tasks_user_col := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tasks'
    AND COLUMN_NAME = 'user_id'
);
SET @sql_tasks_user_col := IF(
  @has_tasks_user_col = 0,
  'ALTER TABLE tasks ADD COLUMN user_id INT NULL',
  'SELECT 1'
);
PREPARE stmt_tasks_user_col FROM @sql_tasks_user_col;
EXECUTE stmt_tasks_user_col;
DEALLOCATE PREPARE stmt_tasks_user_col;

-- Backfill old rows to default user
UPDATE boards SET user_id = 1 WHERE user_id IS NULL AND id > 0;
UPDATE tasks SET user_id = 1 WHERE user_id IS NULL AND id > 0;

-- Make ownership required
ALTER TABLE boards MODIFY COLUMN user_id INT NOT NULL;
ALTER TABLE tasks MODIFY COLUMN user_id INT NOT NULL;

-- Add foreign keys only if they do not already exist
SET @has_fk_boards_user := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND CONSTRAINT_NAME = 'fk_boards_user'
);
SET @sql_boards_fk := IF(
  @has_fk_boards_user = 0,
  'ALTER TABLE boards ADD CONSTRAINT fk_boards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE',
  'SELECT 1'
);
PREPARE stmt_boards_fk FROM @sql_boards_fk;
EXECUTE stmt_boards_fk;
DEALLOCATE PREPARE stmt_boards_fk;

SET @has_fk_tasks_user := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND CONSTRAINT_NAME = 'fk_tasks_user'
);
SET @sql_tasks_fk := IF(
  @has_fk_tasks_user = 0,
  'ALTER TABLE tasks ADD CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE',
  'SELECT 1'
);
PREPARE stmt_tasks_fk FROM @sql_tasks_fk;
EXECUTE stmt_tasks_fk;
DEALLOCATE PREPARE stmt_tasks_fk;
