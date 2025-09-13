-- Sample data for Py-Gram 2025
-- Run this after creating the schema to populate with test data

-- Insert sample time slots (typical academic schedule)
INSERT INTO time_slots (day_of_week, start_time, end_time) VALUES
('Monday', '08:00', '09:00'),
('Monday', '09:00', '10:00'),
('Monday', '10:00', '11:00'),
('Monday', '11:00', '12:00'),
('Monday', '12:00', '13:00'),
('Monday', '13:00', '14:00'),
('Monday', '14:00', '15:00'),
('Monday', '15:00', '16:00'),
('Monday', '16:00', '17:00'),
('Monday', '17:00', '18:00'),

('Tuesday', '08:00', '09:00'),
('Tuesday', '09:00', '10:00'),
('Tuesday', '10:00', '11:00'),
('Tuesday', '11:00', '12:00'),
('Tuesday', '12:00', '13:00'),
('Tuesday', '13:00', '14:00'),
('Tuesday', '14:00', '15:00'),
('Tuesday', '15:00', '16:00'),
('Tuesday', '16:00', '17:00'),
('Tuesday', '17:00', '18:00'),

('Wednesday', '08:00', '09:00'),
('Wednesday', '09:00', '10:00'),
('Wednesday', '10:00', '11:00'),
('Wednesday', '11:00', '12:00'),
('Wednesday', '12:00', '13:00'),
('Wednesday', '13:00', '14:00'),
('Wednesday', '14:00', '15:00'),
('Wednesday', '15:00', '16:00'),
('Wednesday', '16:00', '17:00'),
('Wednesday', '17:00', '18:00'),

('Thursday', '08:00', '09:00'),
('Thursday', '09:00', '10:00'),
('Thursday', '10:00', '11:00'),
('Thursday', '11:00', '12:00'),
('Thursday', '12:00', '13:00'),
('Thursday', '13:00', '14:00'),
('Thursday', '14:00', '15:00'),
('Thursday', '15:00', '16:00'),
('Thursday', '16:00', '17:00'),
('Thursday', '17:00', '18:00'),

('Friday', '08:00', '09:00'),
('Friday', '09:00', '10:00'),
('Friday', '10:00', '11:00'),
('Friday', '11:00', '12:00'),
('Friday', '12:00', '13:00'),
('Friday', '13:00', '14:00'),
('Friday', '14:00', '15:00'),
('Friday', '15:00', '16:00'),
('Friday', '16:00', '17:00'),
('Friday', '17:00', '18:00'),

('Saturday', '08:00', '09:00'),
('Saturday', '09:00', '10:00'),
('Saturday', '10:00', '11:00'),
('Saturday', '11:00', '12:00'),
('Saturday', '12:00', '13:00'),
('Saturday', '13:00', '14:00'),
('Saturday', '14:00', '15:00'),
('Saturday', '15:00', '16:00'),
('Saturday', '16:00', '17:00'),
('Saturday', '17:00', '18:00');

-- Insert sample faculty
INSERT INTO faculty (name, employee_id, department) VALUES
('Dr. Alice Johnson', 'FAC001', 'Computer Science'),
('Prof. Bob Smith', 'FAC002', 'Computer Science'),
('Dr. Carol Brown', 'FAC003', 'Electronics'),
('Prof. David Wilson', 'FAC004', 'Computer Science'),
('Dr. Emma Davis', 'FAC005', 'Mathematics'),
('Prof. Frank Miller', 'FAC006', 'Physics'),
('Dr. Grace Taylor', 'FAC007', 'Computer Science'),
('Prof. Henry Anderson', 'FAC008', 'Electronics'),
('Dr. Iris Thomas', 'FAC009', 'Mathematics'),
('Prof. Jack White', 'FAC010', 'Computer Science');

-- Insert sample subjects
INSERT INTO subjects (name, code, department, credits, lectures_per_week, labs_per_week, requires_lab) VALUES
('Data Structures and Algorithms', 'CS201', 'Computer Science', 4, 3, 1, true),
('Database Management Systems', 'CS301', 'Computer Science', 4, 3, 1, true),
('Computer Networks', 'CS302', 'Computer Science', 3, 2, 1, true),
('Operating Systems', 'CS303', 'Computer Science', 4, 3, 1, true),
('Software Engineering', 'CS304', 'Computer Science', 3, 3, 0, false),
('Machine Learning', 'CS401', 'Computer Science', 4, 2, 2, true),
('Web Development', 'CS305', 'Computer Science', 3, 2, 1, true),
('Digital Electronics', 'EC201', 'Electronics', 4, 3, 1, true),
('Microprocessors', 'EC301', 'Electronics', 4, 3, 1, true),
('Linear Algebra', 'MA201', 'Mathematics', 3, 3, 0, false),
('Discrete Mathematics', 'MA202', 'Mathematics', 3, 3, 0, false),
('Physics Fundamentals', 'PH101', 'Physics', 3, 2, 1, true);

-- Insert sample classrooms
INSERT INTO classrooms (name, capacity, type, has_projector, has_smartboard) VALUES
('Room 101', 60, 'Lecture', true, false),
('Room 102', 60, 'Lecture', true, true),
('Room 103', 45, 'Lecture', false, true),
('Room 201', 80, 'Lecture', true, true),
('Room 202', 50, 'Lecture', true, false),
('CS Lab A', 30, 'Lab', true, true),
('CS Lab B', 25, 'Lab', true, false),
('CS Lab C', 35, 'Lab', true, true),
('Electronics Lab 1', 20, 'Lab', false, true),
('Electronics Lab 2', 25, 'Lab', true, false),
('Physics Lab', 24, 'Lab', false, true),
('Seminar Hall', 120, 'Lecture', true, true);

-- Insert sample student batches
INSERT INTO student_batches (name, year, semester, strength, department) VALUES
('CSE 2025 Batch A', 2025, 1, 58, 'Computer Science'),
('CSE 2025 Batch B', 2025, 1, 52, 'Computer Science'),
('CSE 2024 Batch A', 2024, 3, 55, 'Computer Science'),
('CSE 2024 Batch B', 2024, 3, 48, 'Computer Science'),
('CSE 2023 Batch A', 2023, 5, 50, 'Computer Science'),
('ECE 2025 Batch A', 2025, 1, 45, 'Electronics'),
('ECE 2024 Batch A', 2024, 3, 42, 'Electronics'),
('MATH 2025 Batch A', 2025, 1, 35, 'Mathematics');

-- Link subjects to batches (many-to-many relationship)
INSERT INTO batch_subjects (batch_id, subject_id) VALUES
-- CSE 2025 Batch A (1st semester)
(1, 1),  -- Data Structures
(1, 10), -- Linear Algebra
(1, 11), -- Discrete Mathematics
(1, 12), -- Physics Fundamentals

-- CSE 2025 Batch B (1st semester)
(2, 1),  -- Data Structures
(2, 10), -- Linear Algebra
(2, 11), -- Discrete Mathematics
(2, 12), -- Physics Fundamentals

-- CSE 2024 Batch A (3rd semester)
(3, 2),  -- Database Management
(3, 3),  -- Computer Networks
(3, 4),  -- Operating Systems
(3, 8),  -- Digital Electronics

-- CSE 2024 Batch B (3rd semester)
(4, 2),  -- Database Management
(4, 3),  -- Computer Networks
(4, 4),  -- Operating Systems
(4, 8),  -- Digital Electronics

-- CSE 2023 Batch A (5th semester)
(5, 5),  -- Software Engineering
(5, 6),  -- Machine Learning
(5, 7),  -- Web Development

-- ECE 2025 Batch A
(6, 8),  -- Digital Electronics
(6, 10), -- Linear Algebra
(6, 12), -- Physics Fundamentals

-- ECE 2024 Batch A
(7, 9),  -- Microprocessors
(7, 8),  -- Digital Electronics

-- MATH 2025 Batch A
(8, 10), -- Linear Algebra
(8, 11); -- Discrete Mathematics

-- Insert a sample timetable
INSERT INTO timetables (name, status, quality_score) VALUES
('Fall 2025 Main Schedule', 'Approved', 0.92),
('Spring 2025 Draft', 'Draft', 0.0);