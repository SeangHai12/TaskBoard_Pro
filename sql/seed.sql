-- TaskBoard Pro - Sample data (seed)
-- Run this AFTER schema.sql.

USE taskboard_pro;

-- Demo login account:
-- username: student
-- password: admin
-- SHA-256("admin") = 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
INSERT INTO users (username, password_hash) VALUES
('student', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');

INSERT INTO boards (user_id, title, description) VALUES
(1, 'Personal Tasks', 'A sample board for personal to-dos.'),
(1, 'University Project', 'Track tasks for the TaskBoard Pro assignment.');

-- Board 1 tasks
INSERT INTO tasks (user_id, board_id, title, description, status) VALUES
(1, 1, 'Buy groceries', 'Milk, eggs, rice, and vegetables.', 'todo'),
(1, 1, 'Pay internet bill', 'Due this week.', 'progress'),
(1, 1, 'Morning workout', '30-minute cardio session.', 'done');

-- Board 2 tasks
INSERT INTO tasks (user_id, board_id, title, description, status) VALUES
(1, 2, 'Design database schema', 'Create boards and tasks tables.', 'done'),
(1, 2, 'Build API routes', 'CRUD endpoints for boards and tasks.', 'progress'),
(1, 2, 'Polish UI', 'Responsive Trello-like layout with Tailwind.', 'todo');
