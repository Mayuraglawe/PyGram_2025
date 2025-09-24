-- Sample data for Py-Gram 2k25
-- Run this after creating the schema to populate with test data

-- Insert sample departments first (required for faculty and other tables)
INSERT INTO departments (name, code, description, contact_email, is_active) VALUES
('Computer Science', 'CS', 'Department of Computer Science and Engineering', 'cs@college.edu', true),
('Electronics', 'ECE', 'Department of Electronics and Communication Engineering', 'ece@college.edu', true),
('Mathematics', 'MATH', 'Department of Mathematics', 'math@college.edu', true),
('Physics', 'PHY', 'Department of Physics', 'physics@college.edu', true);

-- Insert sample time slots (typical academic schedule with breaks)
INSERT INTO time_slots (day_of_week, start_time, end_time, slot_name, slot_type) VALUES
('Monday', '08:00', '09:00', 'Period 1', 'regular'),
('Monday', '09:00', '10:00', 'Period 2', 'regular'),
('Monday', '10:00', '10:15', 'Morning Break', 'break'),
('Monday', '10:15', '11:15', 'Period 3', 'regular'),
('Monday', '11:15', '12:15', 'Period 4', 'regular'),
('Monday', '12:15', '13:00', 'Lunch Break', 'lunch'),
('Monday', '13:00', '14:00', 'Period 5', 'regular'),
('Monday', '14:00', '15:00', 'Period 6', 'regular'),
('Monday', '15:00', '16:00', 'Period 7', 'regular'),
('Monday', '16:00', '17:00', 'Period 8', 'regular'),

('Tuesday', '08:00', '09:00', 'Period 1', 'regular'),
('Tuesday', '09:00', '10:00', 'Period 2', 'regular'),
('Tuesday', '10:00', '10:15', 'Morning Break', 'break'),
('Tuesday', '10:15', '11:15', 'Period 3', 'regular'),
('Tuesday', '11:15', '12:15', 'Period 4', 'regular'),
('Tuesday', '12:15', '13:00', 'Lunch Break', 'lunch'),
('Tuesday', '13:00', '14:00', 'Period 5', 'regular'),
('Tuesday', '14:00', '15:00', 'Period 6', 'regular'),
('Tuesday', '15:00', '16:00', 'Period 7', 'regular'),
('Tuesday', '16:00', '17:00', 'Period 8', 'regular'),

('Wednesday', '08:00', '09:00', 'Period 1', 'regular'),
('Wednesday', '09:00', '10:00', 'Period 2', 'regular'),
('Wednesday', '10:00', '10:15', 'Morning Break', 'break'),
('Wednesday', '10:15', '11:15', 'Period 3', 'regular'),
('Wednesday', '11:15', '12:15', 'Period 4', 'regular'),
('Wednesday', '12:15', '13:00', 'Lunch Break', 'lunch'),
('Wednesday', '13:00', '14:00', 'Period 5', 'regular'),
('Wednesday', '14:00', '15:00', 'Period 6', 'regular'),
('Wednesday', '15:00', '16:00', 'Period 7', 'regular'),
('Wednesday', '16:00', '17:00', 'Period 8', 'regular'),

('Thursday', '08:00', '09:00', 'Period 1', 'regular'),
('Thursday', '09:00', '10:00', 'Period 2', 'regular'),
('Thursday', '10:00', '10:15', 'Morning Break', 'break'),
('Thursday', '10:15', '11:15', 'Period 3', 'regular'),
('Thursday', '11:15', '12:15', 'Period 4', 'regular'),
('Thursday', '12:15', '13:00', 'Lunch Break', 'lunch'),
('Thursday', '13:00', '14:00', 'Period 5', 'regular'),
('Thursday', '14:00', '15:00', 'Period 6', 'regular'),
('Thursday', '15:00', '16:00', 'Period 7', 'regular'),
('Thursday', '16:00', '17:00', 'Period 8', 'regular'),

('Friday', '08:00', '09:00', 'Period 1', 'regular'),
('Friday', '09:00', '10:00', 'Period 2', 'regular'),
('Friday', '10:00', '10:15', 'Morning Break', 'break'),
('Friday', '10:15', '11:15', 'Period 3', 'regular'),
('Friday', '11:15', '12:15', 'Period 4', 'regular'),
('Friday', '12:15', '13:00', 'Lunch Break', 'lunch'),
('Friday', '13:00', '14:00', 'Period 5', 'regular'),
('Friday', '14:00', '15:00', 'Period 6', 'regular'),
('Friday', '15:00', '16:00', 'Period 7', 'regular'),
('Friday', '16:00', '17:00', 'Period 8', 'regular'),

('Saturday', '08:00', '09:00', 'Period 1', 'regular'),
('Saturday', '09:00', '10:00', 'Period 2', 'regular'),
('Saturday', '10:00', '10:15', 'Morning Break', 'break'),
('Saturday', '10:15', '11:15', 'Period 3', 'regular'),
('Saturday', '11:15', '12:15', 'Period 4', 'regular'),
('Saturday', '12:15', '13:00', 'Lunch Break', 'lunch'),
('Saturday', '13:00', '14:00', 'Period 5', 'regular'),
('Saturday', '14:00', '15:00', 'Period 6', 'regular'),
('Saturday', '15:00', '16:00', 'Period 7', 'regular'),
('Saturday', '16:00', '17:00', 'Period 8', 'regular');

-- Insert sample faculty
INSERT INTO faculty (name, employee_id, department_id, email, designation) VALUES
('Dr. Alice Johnson', 'FAC001', 1, 'alice.johnson@college.edu', 'Professor'),
('Prof. Bob Smith', 'FAC002', 1, 'bob.smith@college.edu', 'Associate Professor'),
('Dr. Carol Brown', 'FAC003', 2, 'carol.brown@college.edu', 'Assistant Professor'),
('Prof. David Wilson', 'FAC004', 1, 'david.wilson@college.edu', 'Professor'),
('Dr. Emma Davis', 'FAC005', 3, 'emma.davis@college.edu', 'Associate Professor'),
('Prof. Frank Miller', 'FAC006', 4, 'frank.miller@college.edu', 'Professor'),
('Dr. Grace Taylor', 'FAC007', 1, 'grace.taylor@college.edu', 'Assistant Professor'),
('Prof. Henry Anderson', 'FAC008', 2, 'henry.anderson@college.edu', 'Associate Professor'),
('Dr. Iris Thomas', 'FAC009', 3, 'iris.thomas@college.edu', 'Professor'),
('Prof. Jack White', 'FAC010', 1, 'jack.white@college.edu', 'Assistant Professor');

-- Insert sample subjects
INSERT INTO subjects (name, code, department_id, credits, lectures_per_week, labs_per_week, requires_lab, semester, year) VALUES
('Data Structures and Algorithms', 'CS201', 1, 4, 3, 1, true, 3, 2),
('Database Management Systems', 'CS301', 1, 4, 3, 1, true, 5, 3),
('Computer Networks', 'CS302', 1, 3, 2, 1, true, 5, 3),
('Operating Systems', 'CS303', 1, 4, 3, 1, true, 5, 3),
('Software Engineering', 'CS304', 1, 3, 3, 0, false, 6, 3),
('Machine Learning', 'CS401', 1, 4, 2, 2, true, 7, 4),
('Web Development', 'CS305', 1, 3, 2, 1, true, 6, 3),
('Digital Electronics', 'EC201', 2, 4, 3, 1, true, 3, 2),
('Microprocessors', 'EC301', 2, 4, 3, 1, true, 5, 3),
('Linear Algebra', 'MA201', 3, 3, 3, 0, false, 3, 2),
('Discrete Mathematics', 'MA202', 3, 3, 3, 0, false, 3, 2),
('Physics Fundamentals', 'PH101', 4, 3, 2, 1, true, 1, 1);

-- Insert sample classrooms
INSERT INTO classrooms (room_number, building, floor_number, capacity, type, has_projector, has_smartboard) VALUES
('101', 'Main Building', 1, 60, 'Lecture', true, false),
('102', 'Main Building', 1, 60, 'Lecture', true, true),
('103', 'Main Building', 1, 45, 'Lecture', false, true),
('201', 'Main Building', 2, 80, 'Lecture', true, true),
('202', 'Main Building', 2, 50, 'Lecture', true, false),
('CS-A', 'Computer Lab Building', 1, 30, 'Lab', true, true),
('CS-B', 'Computer Lab Building', 1, 25, 'Lab', true, false),
('CS-C', 'Computer Lab Building', 2, 35, 'Lab', true, true),
('EL-1', 'Electronics Building', 1, 20, 'Lab', false, true),
('EL-2', 'Electronics Building', 1, 25, 'Lab', true, false),
('PH-1', 'Physics Building', 1, 24, 'Lab', false, true),
('SH-1', 'Main Building', 3, 120, 'Auditorium', true, true);

-- Insert sample student batches
INSERT INTO student_batches (name, batch_code, department_id, year, semester, strength, academic_year) VALUES
('CSE 2025 Batch A', 'CSE2025A', 1, 1, 1, 58, '2025-2026'),
('CSE 2025 Batch B', 'CSE2025B', 1, 1, 1, 52, '2025-2026'),
('CSE 2024 Batch A', 'CSE2024A', 1, 2, 3, 55, '2024-2025'),
('CSE 2024 Batch B', 'CSE2024B', 1, 2, 3, 48, '2024-2025'),
('CSE 2023 Batch A', 'CSE2023A', 1, 3, 5, 50, '2023-2024'),
('ECE 2025 Batch A', 'ECE2025A', 2, 1, 1, 45, '2025-2026'),
('ECE 2024 Batch A', 'ECE2024A', 2, 2, 3, 42, '2024-2025'),
('MATH 2025 Batch A', 'MATH2025A', 3, 1, 1, 35, '2025-2026');

-- Link subjects to batches (many-to-many relationship)
INSERT INTO batch_subject_assignments (batch_id, subject_id, academic_year, semester) VALUES
-- CSE 2025 Batch A (1st semester)
(1, 12, '2025-2026', 1), -- Physics Fundamentals
(1, 10, '2025-2026', 1), -- Linear Algebra  
(1, 11, '2025-2026', 1), -- Discrete Mathematics

-- CSE 2025 Batch B (1st semester)
(2, 12, '2025-2026', 1), -- Physics Fundamentals
(2, 10, '2025-2026', 1), -- Linear Algebra
(2, 11, '2025-2026', 1), -- Discrete Mathematics

-- CSE 2024 Batch A (3rd semester)
(3, 1, '2024-2025', 3),  -- Data Structures
(3, 8, '2024-2025', 3),  -- Digital Electronics
(3, 10, '2024-2025', 3), -- Linear Algebra

-- CSE 2024 Batch B (3rd semester)
(4, 1, '2024-2025', 3),  -- Data Structures
(4, 8, '2024-2025', 3),  -- Digital Electronics
(4, 10, '2024-2025', 3), -- Linear Algebra

-- CSE 2023 Batch A (5th semester)
(5, 2, '2023-2024', 5),  -- Database Management
(5, 3, '2023-2024', 5),  -- Computer Networks
(5, 4, '2023-2024', 5),  -- Operating Systems

-- ECE 2025 Batch A
(6, 8, '2025-2026', 1),  -- Digital Electronics
(6, 10, '2025-2026', 1), -- Linear Algebra
(6, 12, '2025-2026', 1), -- Physics Fundamentals

-- ECE 2024 Batch A
(7, 9, '2024-2025', 3),  -- Microprocessors
(7, 8, '2024-2025', 3),  -- Digital Electronics

-- MATH 2025 Batch A
(8, 10, '2025-2026', 1), -- Linear Algebra
(8, 11, '2025-2026', 1); -- Discrete Mathematics

-- Insert a sample timetable
INSERT INTO timetables (name, department_id, academic_year, semester, status, quality_score) VALUES
('Fall 2025 Main Schedule', 1, '2025-2026', 1, 'approved', 0.92),
('Spring 2025 Draft', 1, '2024-2025', 2, 'draft', 0.0);

-- Insert faculty subject assignments (who can teach what)
INSERT INTO faculty_subject_assignments (faculty_id, subject_id, proficiency_level, max_hours_per_week, is_primary_instructor, academic_year) VALUES
-- Computer Science Faculty
(1, 1, 5, 12, true, '2024-2025'),  -- Dr. Alice Johnson -> Data Structures
(1, 2, 4, 8, false, '2024-2025'),  -- Dr. Alice Johnson -> Database Management
(2, 2, 5, 12, true, '2024-2025'),  -- Prof. Bob Smith -> Database Management
(2, 3, 4, 8, true, '2024-2025'),   -- Prof. Bob Smith -> Computer Networks
(4, 4, 5, 12, true, '2024-2025'),  -- Prof. David Wilson -> Operating Systems
(4, 5, 4, 8, true, '2024-2025'),   -- Prof. David Wilson -> Software Engineering
(7, 6, 5, 10, true, '2024-2025'),  -- Dr. Grace Taylor -> Machine Learning
(7, 7, 4, 8, true, '2024-2025'),   -- Dr. Grace Taylor -> Web Development
(10, 1, 4, 10, false, '2024-2025'), -- Prof. Jack White -> Data Structures

-- Electronics Faculty
(3, 8, 5, 12, true, '2024-2025'),  -- Dr. Carol Brown -> Digital Electronics
(8, 9, 5, 12, true, '2024-2025'),  -- Prof. Henry Anderson -> Microprocessors
(8, 8, 4, 8, false, '2024-2025'),  -- Prof. Henry Anderson -> Digital Electronics

-- Mathematics Faculty
(5, 10, 5, 15, true, '2025-2026'), -- Dr. Emma Davis -> Linear Algebra
(5, 11, 5, 12, true, '2025-2026'), -- Dr. Emma Davis -> Discrete Mathematics
(9, 10, 4, 10, false, '2025-2026'), -- Dr. Iris Thomas -> Linear Algebra
(9, 11, 4, 8, false, '2025-2026'),  -- Dr. Iris Thomas -> Discrete Mathematics

-- Physics Faculty
(6, 12, 5, 15, true, '2025-2026'); -- Prof. Frank Miller -> Physics Fundamentals

-- Insert sample scheduled classes for Fall 2025 timetable
INSERT INTO scheduled_classes (timetable_id, time_slot_id, subject_id, faculty_id, batch_id, classroom_id, class_type) VALUES
-- Monday Schedule
(1, 1, 12, 6, 1, 1, 'lecture'),   -- Physics Fundamentals, CSE 2025 A, Period 1, Room 101
(1, 2, 10, 5, 1, 2, 'lecture'),   -- Linear Algebra, CSE 2025 A, Period 2, Room 102
(1, 4, 11, 5, 1, 1, 'lecture'),   -- Discrete Math, CSE 2025 A, Period 3, Room 101
(1, 5, 12, 6, 2, 3, 'lecture'),   -- Physics Fundamentals, CSE 2025 B, Period 4, Room 103

-- Tuesday Schedule  
(1, 11, 10, 5, 2, 2, 'lecture'),  -- Linear Algebra, CSE 2025 B, Period 1, Room 102
(1, 12, 11, 9, 2, 1, 'lecture'),  -- Discrete Math, CSE 2025 B, Period 2, Room 101
(1, 14, 12, 6, 1, 1, 'lab'),      -- Physics Lab, CSE 2025 A, Period 3, Physics Lab
(1, 15, 1, 1, 3, 6, 'lecture'),   -- Data Structures, CSE 2024 A, Period 4, CS Lab A

-- Wednesday Schedule
(1, 21, 1, 1, 3, 1, 'lecture'),   -- Data Structures, CSE 2024 A, Period 1, Room 101
(1, 22, 8, 3, 3, 2, 'lecture'),   -- Digital Electronics, CSE 2024 A, Period 2, Room 102
(1, 24, 1, 10, 4, 3, 'lecture'),  -- Data Structures, CSE 2024 B, Period 3, Room 103
(1, 25, 8, 8, 4, 9, 'lab'),       -- Digital Electronics Lab, CSE 2024 B, Period 4, Electronics Lab

-- Thursday Schedule
(1, 31, 2, 2, 5, 1, 'lecture'),   -- Database Management, CSE 2023 A, Period 1, Room 101
(1, 32, 3, 2, 5, 2, 'lecture'),   -- Computer Networks, CSE 2023 A, Period 2, Room 102
(1, 34, 4, 4, 5, 3, 'lecture'),   -- Operating Systems, CSE 2023 A, Period 3, Room 103
(1, 35, 2, 2, 5, 6, 'lab'),       -- Database Lab, CSE 2023 A, Period 4, CS Lab A

-- Friday Schedule
(1, 41, 10, 5, 6, 1, 'lecture'),  -- Linear Algebra, ECE 2025 A, Period 1, Room 101
(1, 42, 8, 3, 6, 9, 'lecture'),   -- Digital Electronics, ECE 2025 A, Period 2, Electronics Lab
(1, 44, 12, 6, 6, 11, 'lab'),     -- Physics Lab, ECE 2025 A, Period 3, Physics Lab
(1, 45, 9, 8, 7, 9, 'lecture'),   -- Microprocessors, ECE 2024 A, Period 4, Electronics Lab

-- Saturday Schedule
(1, 51, 10, 9, 8, 1, 'lecture'),  -- Linear Algebra, MATH 2025 A, Period 1, Room 101
(1, 52, 11, 5, 8, 2, 'lecture'),  -- Discrete Math, MATH 2025 A, Period 2, Room 102
(1, 54, 1, 1, 4, 7, 'lab'),       -- Data Structures Lab, CSE 2024 B, Period 3, CS Lab B
(1, 55, 3, 2, 5, 8, 'lab');       -- Computer Networks Lab, CSE 2023 A, Period 4, CS Lab C