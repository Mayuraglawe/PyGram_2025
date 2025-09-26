-- ============================================================================
-- SMART CLASSROOM & TIMETABLE SCHEDULING SYSTEM - COMPREHENSIVE SAMPLE DATA
-- Run this AFTER creating the schema to populate with realistic test data
-- ============================================================================

-- ============================================================================
-- 1. DEPARTMENTS (Academic Units)
-- ============================================================================

INSERT INTO departments (name, code, description, established_year, contact_email, contact_phone, building, floor_number) VALUES
('Computer Science & Engineering', 'CSE', 'Department focusing on software development, algorithms, and computer systems', 2005, 'cse@college.edu', '+91-98765-43210', 'Engineering Block A', 2),
('Electronics & Communication Engineering', 'ECE', 'Department specializing in electronics, communication systems, and signal processing', 2008, 'ece@college.edu', '+91-98765-43211', 'Engineering Block B', 1),
('Mechanical Engineering', 'MECH', 'Department covering mechanical systems, thermodynamics, and manufacturing', 2010, 'mech@college.edu', '+91-98765-43212', 'Engineering Block C', 1),
('Civil Engineering', 'CIVIL', 'Department focusing on construction, infrastructure, and environmental engineering', 2012, 'civil@college.edu', '+91-98765-43213', 'Engineering Block D', 2),
('Information Technology', 'IT', 'Department specializing in IT systems, networks, and software applications', 2015, 'it@college.edu', '+91-98765-43214', 'IT Block', 3),
('Mathematics', 'MATH', 'Department providing mathematical foundation for engineering disciplines', 2005, 'math@college.edu', '+91-98765-43215', 'Science Block', 1);

-- ============================================================================
-- 2. FACULTY (Teaching Staff)
-- ============================================================================

INSERT INTO faculty (name, employee_id, department_id, email, phone_number, designation, qualification, specialization, experience_years, joining_date, office_location, max_weekly_hours) VALUES
-- CSE Faculty
('Dr. Rajesh Kumar', 'FAC001', 1, 'rajesh.kumar@college.edu', '+91-99876-54321', 'Professor & HOD', 'Ph.D. Computer Science, M.Tech CSE', 'Artificial Intelligence, Machine Learning', 15, '2009-07-15', 'A-201', 20),
('Dr. Priya Sharma', 'FAC002', 1, 'priya.sharma@college.edu', '+91-99876-54322', 'Associate Professor', 'Ph.D. Computer Science, M.E. Software Engineering', 'Software Engineering, Database Systems', 12, '2012-08-01', 'A-202', 18),
('Prof. Amit Patel', 'FAC003', 1, 'amit.patel@college.edu', '+91-99876-54323', 'Assistant Professor', 'M.Tech CSE, B.Tech CSE', 'Web Development, Cloud Computing', 8, '2016-06-15', 'A-203', 20),
('Dr. Sneha Gupta', 'FAC004', 1, 'sneha.gupta@college.edu', '+91-99876-54324', 'Assistant Professor', 'Ph.D. Computer Science, M.Tech IT', 'Computer Networks, Cybersecurity', 6, '2018-07-20', 'A-204', 18),
('Prof. Rahul Verma', 'FAC005', 1, 'rahul.verma@college.edu', '+91-99876-54325', 'Assistant Professor', 'M.Tech CSE, B.Tech CSE', 'Data Structures, Algorithms', 5, '2020-08-10', 'A-205', 20),

-- ECE Faculty
('Dr. Suresh Reddy', 'FAC006', 2, 'suresh.reddy@college.edu', '+91-99876-54326', 'Professor & HOD', 'Ph.D. Electronics, M.Tech ECE', 'Digital Signal Processing, VLSI Design', 18, '2008-06-01', 'B-101', 20),
('Prof. Kavita Singh', 'FAC007', 2, 'kavita.singh@college.edu', '+91-99876-54327', 'Associate Professor', 'M.Tech ECE, B.Tech ECE', 'Communication Systems, Microprocessors', 10, '2014-07-15', 'B-102', 18),
('Dr. Manoj Agarwal', 'FAC008', 2, 'manoj.agarwal@college.edu', '+91-99876-54328', 'Assistant Professor', 'Ph.D. Electronics, M.Tech VLSI', 'Embedded Systems, IoT', 7, '2017-08-20', 'B-103', 20),

-- MECH Faculty
('Dr. Vikram Joshi', 'FAC009', 3, 'vikram.joshi@college.edu', '+91-99876-54329', 'Professor & HOD', 'Ph.D. Mechanical, M.Tech Production', 'Manufacturing, Automation', 16, '2010-07-01', 'C-201', 20),
('Prof. Sunita Rao', 'FAC010', 3, 'sunita.rao@college.edu', '+91-99876-54330', 'Associate Professor', 'M.Tech Thermal, B.Tech Mechanical', 'Thermodynamics, Heat Transfer', 9, '2015-06-10', 'C-202', 18),

-- CIVIL Faculty
('Dr. Ashok Mehta', 'FAC011', 4, 'ashok.mehta@college.edu', '+91-99876-54331', 'Professor & HOD', 'Ph.D. Civil, M.Tech Structural', 'Structural Engineering, Earthquake Engineering', 14, '2012-08-15', 'D-301', 20),
('Prof. Rekha Nair', 'FAC012', 4, 'rekha.nair@college.edu', '+91-99876-54332', 'Assistant Professor', 'M.Tech Environmental, B.Tech Civil', 'Environmental Engineering, Water Resources', 6, '2019-07-01', 'D-302', 18),

-- IT Faculty
('Dr. Deepak Jain', 'FAC013', 5, 'deepak.jain@college.edu', '+91-99876-54333', 'Associate Professor & HOD', 'Ph.D. Information Technology, M.Tech IT', 'Information Systems, Data Analytics', 11, '2015-08-01', 'IT-401', 20),
('Prof. Anita Desai', 'FAC014', 5, 'anita.desai@college.edu', '+91-99876-54334', 'Assistant Professor', 'M.Tech IT, B.Tech CSE', 'Mobile Computing, UI/UX Design', 4, '2021-07-15', 'IT-402', 18),

-- MATH Faculty
('Dr. Ramesh Pandey', 'FAC015', 6, 'ramesh.pandey@college.edu', '+91-99876-54335', 'Professor & HOD', 'Ph.D. Mathematics, M.Sc. Applied Mathematics', 'Applied Mathematics, Numerical Methods', 20, '2005-06-01', 'S-101', 22),
('Prof. Sita Devi', 'FAC016', 6, 'sita.devi@college.edu', '+91-99876-54336', 'Associate Professor', 'M.Sc. Mathematics, B.Sc. Mathematics', 'Linear Algebra, Discrete Mathematics', 13, '2011-07-20', 'S-102', 20);

-- Update departments with HOD assignments
UPDATE departments SET head_of_department_id = 1 WHERE code = 'CSE';
UPDATE departments SET head_of_department_id = 6 WHERE code = 'ECE';
UPDATE departments SET head_of_department_id = 9 WHERE code = 'MECH';
UPDATE departments SET head_of_department_id = 11 WHERE code = 'CIVIL';
UPDATE departments SET head_of_department_id = 13 WHERE code = 'IT';
UPDATE departments SET head_of_department_id = 15 WHERE code = 'MATH';

-- ============================================================================
-- 3. SUBJECTS (Academic Courses)
-- ============================================================================

INSERT INTO subjects (name, code, department_id, credits, lectures_per_week, labs_per_week, requires_lab, semester, year, subject_type, prerequisites, syllabus) VALUES
-- CSE Subjects
('Programming Fundamentals', 'CS101', 1, 4, 3, 1, true, 1, 1, 'core', 'None', 'Introduction to programming concepts, C programming language basics'),
('Data Structures and Algorithms', 'CS201', 1, 4, 3, 1, true, 3, 2, 'core', 'CS101', 'Arrays, linked lists, stacks, queues, trees, graphs, sorting and searching algorithms'),
('Database Management Systems', 'CS301', 1, 4, 3, 1, true, 5, 3, 'core', 'CS201', 'Relational databases, SQL, normalization, transactions, concurrency control'),
('Computer Networks', 'CS302', 1, 3, 2, 1, true, 5, 3, 'core', 'CS201', 'OSI model, TCP/IP, routing protocols, network security'),
('Operating Systems', 'CS303', 1, 4, 3, 1, true, 4, 2, 'core', 'CS201', 'Process management, memory management, file systems, synchronization'),
('Software Engineering', 'CS304', 1, 3, 3, 0, false, 6, 3, 'core', 'CS201, CS301', 'SDLC, requirements analysis, design patterns, testing methodologies'),
('Machine Learning', 'CS401', 1, 4, 2, 2, true, 7, 4, 'elective', 'CS201, CS301', 'Supervised and unsupervised learning, neural networks, deep learning'),
('Web Development', 'CS305', 1, 3, 2, 1, true, 6, 3, 'elective', 'CS301', 'HTML, CSS, JavaScript, frameworks, backend development'),
('Compiler Design', 'CS402', 1, 3, 3, 0, false, 8, 4, 'elective', 'CS201', 'Lexical analysis, parsing, code generation, optimization'),
('Computer Graphics', 'CS403', 1, 3, 2, 1, true, 7, 4, 'elective', 'CS201', '2D/3D graphics, rendering, animation, graphics libraries'),

-- ECE Subjects
('Digital Electronics', 'EC101', 2, 4, 3, 1, true, 3, 2, 'core', 'None', 'Boolean algebra, logic gates, combinational and sequential circuits'),
('Microprocessors and Microcontrollers', 'EC201', 2, 4, 3, 1, true, 4, 2, 'core', 'EC101', '8085/8086 architecture, assembly programming, interfacing'),
('Communication Systems', 'EC301', 2, 3, 3, 0, false, 5, 3, 'core', 'EC101', 'Analog and digital communication, modulation techniques'),
('Digital Signal Processing', 'EC302', 2, 4, 2, 2, true, 6, 3, 'core', 'EC201', 'DFT, FFT, digital filters, signal analysis'),
('VLSI Design', 'EC401', 2, 3, 2, 1, true, 7, 4, 'elective', 'EC101, EC201', 'CMOS technology, logic design, layout design'),
('Embedded Systems', 'EC402', 2, 4, 2, 2, true, 8, 4, 'elective', 'EC201', 'Real-time systems, embedded programming, IoT applications'),

-- MECH Subjects
('Engineering Mechanics', 'ME101', 3, 3, 3, 0, false, 1, 1, 'core', 'None', 'Statics, dynamics, friction, equilibrium of forces'),
('Thermodynamics', 'ME201', 3, 4, 3, 1, true, 3, 2, 'core', 'ME101', 'Laws of thermodynamics, heat engines, refrigeration cycles'),
('Fluid Mechanics', 'ME202', 3, 3, 3, 0, false, 4, 2, 'core', 'ME101', 'Fluid properties, fluid statics and dynamics, flow measurement'),
('Manufacturing Processes', 'ME301', 3, 4, 3, 1, true, 5, 3, 'core', 'ME201', 'Casting, forming, machining, welding, modern manufacturing'),
('Machine Design', 'ME302', 3, 4, 3, 1, true, 6, 3, 'core', 'ME202', 'Design of machine elements, failure theories, optimization'),
('Automobile Engineering', 'ME401', 3, 3, 2, 1, true, 7, 4, 'elective', 'ME301', 'IC engines, transmission systems, vehicle dynamics'),

-- CIVIL Subjects
('Engineering Surveying', 'CE101', 4, 3, 2, 1, true, 1, 1, 'core', 'None', 'Chain surveying, compass surveying, leveling, theodolite'),
('Strength of Materials', 'CE201', 4, 4, 3, 1, true, 3, 2, 'core', 'CE101', 'Stress, strain, bending moment, deflection, torsion'),
('Concrete Technology', 'CE202', 4, 3, 3, 0, false, 4, 2, 'core', 'CE201', 'Cement, aggregates, concrete mix design, testing'),
('Structural Analysis', 'CE301', 4, 4, 3, 1, true, 5, 3, 'core', 'CE201', 'Statically determinate and indeterminate structures'),
('Geotechnical Engineering', 'CE302', 4, 3, 2, 1, true, 6, 3, 'core', 'CE201', 'Soil properties, foundation design, slope stability'),
('Transportation Engineering', 'CE401', 4, 3, 3, 0, false, 7, 4, 'elective', 'CE301', 'Highway design, traffic engineering, pavement design'),

-- IT Subjects
('Programming in Java', 'IT101', 5, 4, 3, 1, true, 1, 1, 'core', 'None', 'OOP concepts, Java syntax, exception handling, collections'),
('Web Technologies', 'IT201', 5, 4, 2, 2, true, 3, 2, 'core', 'IT101', 'HTML, CSS, JavaScript, PHP, web frameworks'),
('Software Project Management', 'IT301', 5, 3, 3, 0, false, 5, 3, 'core', 'IT201', 'Project planning, risk management, agile methodologies'),
('Mobile Application Development', 'IT302', 5, 3, 2, 1, true, 6, 3, 'elective', 'IT201', 'Android/iOS development, hybrid apps, UI design'),
('Data Analytics', 'IT401', 5, 4, 2, 2, true, 7, 4, 'elective', 'IT301', 'Statistical analysis, data visualization, business intelligence'),

-- MATH Subjects (Foundation for all engineering)
('Engineering Mathematics I', 'MA101', 6, 4, 4, 0, false, 1, 1, 'core', 'None', 'Calculus, differential equations, linear algebra basics'),
('Engineering Mathematics II', 'MA102', 6, 4, 4, 0, false, 2, 1, 'core', 'MA101', 'Vector calculus, Fourier series, probability and statistics'),
('Discrete Mathematics', 'MA201', 6, 3, 3, 0, false, 3, 2, 'core', 'MA101', 'Set theory, logic, graph theory, combinatorics'),
('Numerical Methods', 'MA301', 6, 3, 2, 1, true, 5, 3, 'elective', 'MA102', 'Interpolation, numerical integration, solving equations');

-- ============================================================================
-- 4. CLASSROOMS (Physical Infrastructure)
-- ============================================================================

INSERT INTO classrooms (room_number, building, floor_number, capacity, type, equipment, has_projector, has_smartboard, has_ac, has_computer_lab) VALUES
-- Engineering Block A (CSE Department)
('A101', 'Engineering Block A', 1, 60, 'Lecture', 'Whiteboard, Speaker System', true, false, true, false),
('A102', 'Engineering Block A', 1, 60, 'Lecture', 'Smart Board, Audio System', true, true, true, false),
('A103', 'Engineering Block A', 1, 40, 'Lecture', 'Whiteboard, Microphone', false, false, true, false),
('A201', 'Engineering Block A', 2, 80, 'Lecture', 'Smart Board, Audio, Video System', true, true, true, false),
('A202', 'Engineering Block A', 2, 50, 'Lecture', 'Whiteboard, Speaker', true, false, true, false),
('A-LAB1', 'Engineering Block A', 1, 30, 'Lab', 'Desktop Computers, Network Setup', true, true, true, true),
('A-LAB2', 'Engineering Block A', 1, 25, 'Lab', 'High-end Workstations, Graphics Cards', true, false, true, true),
('A-LAB3', 'Engineering Block A', 2, 35, 'Lab', 'Programming Lab Setup, Servers', true, true, true, true),

-- Engineering Block B (ECE Department)
('B101', 'Engineering Block B', 1, 50, 'Lecture', 'Whiteboard, Audio System', true, false, true, false),
('B102', 'Engineering Block B', 1, 45, 'Lecture', 'Smart Board, Microphone', true, true, true, false),
('B103', 'Engineering Block B', 1, 55, 'Lecture', 'Whiteboard, Speaker System', false, false, true, false),
('B-LAB1', 'Engineering Block B', 1, 20, 'Lab', 'Electronics Lab Equipment, Oscilloscopes', false, true, true, false),
('B-LAB2', 'Engineering Block B', 1, 25, 'Lab', 'Microprocessor Kits, Digital Trainers', true, false, true, true),
('B-LAB3', 'Engineering Block B', 2, 30, 'Lab', 'Communication Lab, Signal Generators', true, true, true, false),

-- Engineering Block C (MECH Department)
('C101', 'Engineering Block C', 1, 70, 'Lecture', 'Whiteboard, Audio System', true, false, true, false),
('C102', 'Engineering Block C', 1, 60, 'Lecture', 'Smart Board, Speaker', true, true, true, false),
('C-LAB1', 'Engineering Block C', 1, 15, 'Lab', 'Manufacturing Machines, Tools', false, false, false, false),
('C-LAB2', 'Engineering Block C', 1, 20, 'Lab', 'CAD Workstations, Design Software', true, false, true, true),

-- Engineering Block D (CIVIL Department)
('D101', 'Engineering Block D', 1, 65, 'Lecture', 'Whiteboard, Microphone', true, false, true, false),
('D102', 'Engineering Block D', 1, 55, 'Lecture', 'Smart Board, Audio', true, true, true, false),
('D-LAB1', 'Engineering Block D', 1, 25, 'Lab', 'Surveying Instruments, Testing Equipment', false, false, false, false),
('D-LAB2', 'Engineering Block D', 2, 20, 'Lab', 'Concrete Testing Lab, Material Testing', false, true, true, false),

-- IT Block
('IT101', 'IT Block', 1, 50, 'Lecture', 'Smart Board, Audio, Video System', true, true, true, false),
('IT102', 'IT Block', 1, 45, 'Lecture', 'Whiteboard, Speaker System', true, false, true, false),
('IT201', 'IT Block', 2, 60, 'Lecture', 'Smart Board, Advanced Audio', true, true, true, false),
('IT-LAB1', 'IT Block', 3, 40, 'Lab', 'Latest Computers, High-speed Internet', true, true, true, true),
('IT-LAB2', 'IT Block', 3, 35, 'Lab', 'Server Setup, Cloud Access', true, false, true, true),

-- Science Block (MATH Department)
('S101', 'Science Block', 1, 80, 'Lecture', 'Whiteboard, Speaker System', true, false, true, false),
('S102', 'Science Block', 1, 70, 'Lecture', 'Smart Board, Audio System', true, true, true, false),
('S103', 'Science Block', 1, 60, 'Lecture', 'Whiteboard, Microphone', false, false, true, false),

-- Multi-purpose Halls
('SEMINAR-1', 'Main Building', 1, 120, 'Seminar', 'Advanced AV System, Stage, Lighting', true, true, true, false),
('AUDITORIUM', 'Main Building', 2, 300, 'Auditorium', 'Professional Sound System, Stage, Recording', true, true, true, false);

-- ============================================================================
-- 5. TIME SLOTS (Class Periods)
-- ============================================================================

INSERT INTO time_slots (day_of_week, start_time, end_time, slot_name, slot_type) VALUES
-- Monday Schedule
('Monday', '08:00:00', '09:00:00', 'Period 1', 'regular'),
('Monday', '09:00:00', '10:00:00', 'Period 2', 'regular'),
('Monday', '10:00:00', '11:00:00', 'Period 3', 'regular'),
('Monday', '11:00:00', '11:15:00', 'Tea Break', 'break'),
('Monday', '11:15:00', '12:15:00', 'Period 4', 'regular'),
('Monday', '12:15:00', '13:15:00', 'Period 5', 'regular'),
('Monday', '13:15:00', '14:15:00', 'Lunch Break', 'lunch'),
('Monday', '14:15:00', '15:15:00', 'Period 6', 'regular'),
('Monday', '15:15:00', '16:15:00', 'Period 7', 'regular'),
('Monday', '16:15:00', '18:15:00', 'Lab Session A', 'lab'),

-- Tuesday Schedule
('Tuesday', '08:00:00', '09:00:00', 'Period 1', 'regular'),
('Tuesday', '09:00:00', '10:00:00', 'Period 2', 'regular'),
('Tuesday', '10:00:00', '11:00:00', 'Period 3', 'regular'),
('Tuesday', '11:00:00', '11:15:00', 'Tea Break', 'break'),
('Tuesday', '11:15:00', '12:15:00', 'Period 4', 'regular'),
('Tuesday', '12:15:00', '13:15:00', 'Period 5', 'regular'),
('Tuesday', '13:15:00', '14:15:00', 'Lunch Break', 'lunch'),
('Tuesday', '14:15:00', '15:15:00', 'Period 6', 'regular'),
('Tuesday', '15:15:00', '16:15:00', 'Period 7', 'regular'),
('Tuesday', '16:15:00', '18:15:00', 'Lab Session B', 'lab'),

-- Wednesday Schedule
('Wednesday', '08:00:00', '09:00:00', 'Period 1', 'regular'),
('Wednesday', '09:00:00', '10:00:00', 'Period 2', 'regular'),
('Wednesday', '10:00:00', '11:00:00', 'Period 3', 'regular'),
('Wednesday', '11:00:00', '11:15:00', 'Tea Break', 'break'),
('Wednesday', '11:15:00', '12:15:00', 'Period 4', 'regular'),
('Wednesday', '12:15:00', '13:15:00', 'Period 5', 'regular'),
('Wednesday', '13:15:00', '14:15:00', 'Lunch Break', 'lunch'),
('Wednesday', '14:15:00', '15:15:00', 'Period 6', 'regular'),
('Wednesday', '15:15:00', '16:15:00', 'Period 7', 'regular'),
('Wednesday', '16:15:00', '18:15:00', 'Lab Session C', 'lab'),

-- Thursday Schedule
('Thursday', '08:00:00', '09:00:00', 'Period 1', 'regular'),
('Thursday', '09:00:00', '10:00:00', 'Period 2', 'regular'),
('Thursday', '10:00:00', '11:00:00', 'Period 3', 'regular'),
('Thursday', '11:00:00', '11:15:00', 'Tea Break', 'break'),
('Thursday', '11:15:00', '12:15:00', 'Period 4', 'regular'),
('Thursday', '12:15:00', '13:15:00', 'Period 5', 'regular'),
('Thursday', '13:15:00', '14:15:00', 'Lunch Break', 'lunch'),
('Thursday', '14:15:00', '15:15:00', 'Period 6', 'regular'),
('Thursday', '15:15:00', '16:15:00', 'Period 7', 'regular'),
('Thursday', '16:15:00', '18:15:00', 'Lab Session D', 'lab'),

-- Friday Schedule
('Friday', '08:00:00', '09:00:00', 'Period 1', 'regular'),
('Friday', '09:00:00', '10:00:00', 'Period 2', 'regular'),
('Friday', '10:00:00', '11:00:00', 'Period 3', 'regular'),
('Friday', '11:00:00', '11:15:00', 'Tea Break', 'break'),
('Friday', '11:15:00', '12:15:00', 'Period 4', 'regular'),
('Friday', '12:15:00', '13:15:00', 'Period 5', 'regular'),
('Friday', '13:15:00', '14:15:00', 'Lunch Break', 'lunch'),
('Friday', '14:15:00', '15:15:00', 'Period 6', 'regular'),
('Friday', '15:15:00', '16:15:00', 'Period 7', 'regular'),
('Friday', '16:15:00', '18:15:00', 'Lab Session E', 'lab'),

-- Saturday Schedule (Half day)
('Saturday', '08:00:00', '09:00:00', 'Period 1', 'regular'),
('Saturday', '09:00:00', '10:00:00', 'Period 2', 'regular'),
('Saturday', '10:00:00', '11:00:00', 'Period 3', 'regular'),
('Saturday', '11:00:00', '11:15:00', 'Tea Break', 'break'),
('Saturday', '11:15:00', '12:15:00', 'Period 4', 'regular'),
('Saturday', '12:15:00', '13:15:00', 'Period 5', 'regular');

-- ============================================================================
-- 6. STUDENT BATCHES (Academic Groups)
-- ============================================================================

INSERT INTO student_batches (name, batch_code, department_id, year, semester, section, strength, academic_year, class_coordinator_id, intake_year) VALUES
-- CSE Batches
('CSE 1st Year A', 'CSE2024A', 1, 1, 1, 'A', 58, '2024-2025', 2, 2024),
('CSE 1st Year B', 'CSE2024B', 1, 1, 1, 'B', 52, '2024-2025', 3, 2024),
('CSE 2nd Year A', 'CSE2023A', 1, 2, 3, 'A', 55, '2024-2025', 4, 2023),
('CSE 2nd Year B', 'CSE2023B', 1, 2, 3, 'B', 48, '2024-2025', 5, 2023),
('CSE 3rd Year A', 'CSE2022A', 1, 3, 5, 'A', 50, '2024-2025', 2, 2022),
('CSE 4th Year A', 'CSE2021A', 1, 4, 7, 'A', 45, '2024-2025', 1, 2021),

-- ECE Batches
('ECE 1st Year A', 'ECE2024A', 2, 1, 1, 'A', 45, '2024-2025', 7, 2024),
('ECE 2nd Year A', 'ECE2023A', 2, 2, 3, 'A', 42, '2024-2025', 8, 2023),
('ECE 3rd Year A', 'ECE2022A', 2, 3, 5, 'A', 40, '2024-2025', 6, 2022),
('ECE 4th Year A', 'ECE2021A', 2, 4, 7, 'A', 38, '2024-2025', 6, 2021),

-- MECH Batches
('MECH 1st Year A', 'MECH2024A', 3, 1, 1, 'A', 50, '2024-2025', 10, 2024),
('MECH 2nd Year A', 'MECH2023A', 3, 2, 3, 'A', 48, '2024-2025', 9, 2023),
('MECH 3rd Year A', 'MECH2022A', 3, 3, 5, 'A', 45, '2024-2025', 9, 2022),
('MECH 4th Year A', 'MECH2021A', 3, 4, 7, 'A', 42, '2024-2025', 9, 2021),

-- CIVIL Batches
('CIVIL 1st Year A', 'CIVIL2024A', 4, 1, 1, 'A', 40, '2024-2025', 12, 2024),
('CIVIL 2nd Year A', 'CIVIL2023A', 4, 2, 3, 'A', 38, '2024-2025', 11, 2023),
('CIVIL 3rd Year A', 'CIVIL2022A', 4, 3, 5, 'A', 35, '2024-2025', 11, 2022),
('CIVIL 4th Year A', 'CIVIL2021A', 4, 4, 7, 'A', 33, '2024-2025', 11, 2021),

-- IT Batches
('IT 1st Year A', 'IT2024A', 5, 1, 1, 'A', 35, '2024-2025', 14, 2024),
('IT 2nd Year A', 'IT2023A', 5, 2, 3, 'A', 32, '2024-2025', 13, 2023),
('IT 3rd Year A', 'IT2022A', 5, 3, 5, 'A', 30, '2024-2025', 13, 2022),
('IT 4th Year A', 'IT2021A', 5, 4, 7, 'A', 28, '2024-2025', 13, 2021);

-- ============================================================================
-- 7. FACULTY SUBJECT ASSIGNMENTS (Who can teach what)
-- ============================================================================

INSERT INTO faculty_subject_assignments (faculty_id, subject_id, proficiency_level, max_hours_per_week, assignment_type, academic_year, is_primary_instructor) VALUES
-- CSE Faculty Assignments
(1, 1, 5, 8, 'regular', '2024-2025', true),   -- Dr. Rajesh - Programming Fundamentals
(1, 7, 5, 6, 'regular', '2024-2025', true),   -- Dr. Rajesh - Machine Learning
(2, 2, 5, 8, 'regular', '2024-2025', true),   -- Dr. Priya - Data Structures
(2, 3, 5, 8, 'regular', '2024-2025', true),   -- Dr. Priya - Database Systems
(3, 8, 4, 6, 'regular', '2024-2025', true),   -- Prof. Amit - Web Development
(3, 1, 3, 4, 'regular', '2024-2025', false),  -- Prof. Amit - Programming (backup)
(4, 4, 5, 6, 'regular', '2024-2025', true),   -- Dr. Sneha - Computer Networks
(4, 5, 4, 8, 'regular', '2024-2025', true),   -- Dr. Sneha - Operating Systems
(5, 2, 4, 8, 'regular', '2024-2025', false),  -- Prof. Rahul - Data Structures (backup)
(5, 9, 3, 6, 'regular', '2024-2025', true),   -- Prof. Rahul - Compiler Design

-- ECE Faculty Assignments
(6, 11, 5, 8, 'regular', '2024-2025', true),  -- Dr. Suresh - Digital Electronics
(6, 15, 5, 6, 'regular', '2024-2025', true),  -- Dr. Suresh - VLSI Design
(7, 12, 4, 8, 'regular', '2024-2025', true),  -- Prof. Kavita - Microprocessors
(7, 13, 4, 6, 'regular', '2024-2025', true),  -- Prof. Kavita - Communication Systems
(8, 16, 5, 8, 'regular', '2024-2025', true),  -- Dr. Manoj - Embedded Systems
(8, 14, 4, 6, 'regular', '2024-2025', true),  -- Dr. Manoj - Digital Signal Processing

-- MECH Faculty Assignments
(9, 17, 5, 8, 'regular', '2024-2025', true),  -- Dr. Vikram - Engineering Mechanics
(9, 22, 5, 6, 'regular', '2024-2025', true),  -- Dr. Vikram - Automobile Engineering
(10, 18, 5, 8, 'regular', '2024-2025', true), -- Prof. Sunita - Thermodynamics
(10, 19, 4, 6, 'regular', '2024-2025', true), -- Prof. Sunita - Fluid Mechanics

-- MATH Faculty Assignments (Teaching across departments)
(15, 27, 5, 12, 'regular', '2024-2025', true), -- Dr. Ramesh - Engineering Math I
(15, 28, 5, 12, 'regular', '2024-2025', true), -- Dr. Ramesh - Engineering Math II
(16, 29, 4, 8, 'regular', '2024-2025', true),  -- Prof. Sita - Discrete Mathematics
(16, 30, 4, 6, 'regular', '2024-2025', true);  -- Prof. Sita - Numerical Methods

-- ============================================================================
-- 8. BATCH SUBJECT ASSIGNMENTS (What each batch studies)
-- ============================================================================

INSERT INTO batch_subject_assignments (batch_id, subject_id, is_elective, enrollment_count, academic_year, semester) VALUES
-- CSE 1st Year (Semester 1)
(1, 1, false, 58, '2024-2025', 1),  -- Programming Fundamentals
(1, 27, false, 58, '2024-2025', 1), -- Engineering Math I
(2, 1, false, 52, '2024-2025', 1),  -- Programming Fundamentals
(2, 27, false, 52, '2024-2025', 1), -- Engineering Math I

-- CSE 2nd Year (Semester 3)
(3, 2, false, 55, '2024-2025', 3),  -- Data Structures
(3, 29, false, 55, '2024-2025', 3), -- Discrete Mathematics
(4, 2, false, 48, '2024-2025', 3),  -- Data Structures
(4, 29, false, 48, '2024-2025', 3), -- Discrete Mathematics

-- CSE 3rd Year (Semester 5)
(5, 3, false, 50, '2024-2025', 5),  -- Database Systems
(5, 4, false, 50, '2024-2025', 5),  -- Computer Networks
(5, 7, true, 30, '2024-2025', 5),   -- Machine Learning (elective)

-- ECE Batches
(7, 11, false, 45, '2024-2025', 1), -- Digital Electronics for ECE 1st year
(8, 12, false, 42, '2024-2025', 3), -- Microprocessors for ECE 2nd year
(9, 13, false, 40, '2024-2025', 5), -- Communication Systems for ECE 3rd year

-- MATH subjects across multiple departments
(11, 27, false, 50, '2024-2025', 1), -- Engineering Math I for MECH 1st year
(15, 27, false, 40, '2024-2025', 1), -- Engineering Math I for CIVIL 1st year
(19, 27, false, 35, '2024-2025', 1); -- Engineering Math I for IT 1st year

-- ============================================================================
-- 9. SAMPLE TIMETABLES
-- ============================================================================

INSERT INTO timetables (name, department_id, academic_year, semester, status, version, created_by, quality_score, effective_from, effective_to) VALUES
('CSE Semester 1 Timetable', 1, '2024-2025', 1, 'published', 1, 1, 0.92, '2024-07-15', '2024-12-15'),
('CSE Semester 3 Timetable', 1, '2024-2025', 3, 'published', 1, 2, 0.88, '2024-07-15', '2024-12-15'),
('ECE Semester 1 Timetable', 2, '2024-2025', 1, 'approved', 1, 6, 0.85, '2024-07-15', '2024-12-15'),
('MECH Semester 1 Timetable', 3, '2024-2025', 1, 'draft', 1, 9, 0.75, '2024-07-15', '2024-12-15');

-- ============================================================================
-- 10. SAMPLE SCHEDULED CLASSES
-- ============================================================================

-- Sample classes for CSE 1st Year Batch A (Timetable 1)
INSERT INTO scheduled_classes (timetable_id, time_slot_id, subject_id, faculty_id, batch_id, classroom_id, class_type) VALUES
-- Monday schedule for CSE 1st Year A
(1, 1, 1, 1, 1, 1, 'lecture'),   -- Programming Fundamentals, Period 1, Room A101
(1, 2, 27, 15, 1, 2, 'lecture'), -- Engineering Math I, Period 2, Room A102
(1, 5, 1, 1, 1, 6, 'lab'),       -- Programming Lab, Period 5, Lab A-LAB1

-- Tuesday schedule for CSE 1st Year A
(1, 11, 27, 15, 1, 1, 'lecture'), -- Engineering Math I, Period 1, Room A101
(1, 12, 1, 1, 1, 2, 'lecture'),   -- Programming Fundamentals, Period 2, Room A102

-- Sample classes for CSE 2nd Year Batch A (Timetable 2)
(2, 21, 2, 2, 3, 3, 'lecture'),   -- Data Structures, Monday Period 1, Room A103
(2, 22, 29, 16, 3, 1, 'lecture'), -- Discrete Math, Monday Period 2, Room A101
(2, 30, 2, 2, 3, 7, 'lab');       -- Data Structures Lab, Monday Lab Session, Lab A-LAB2

-- ============================================================================
-- 11. SAMPLE COLLEGE EVENTS
-- ============================================================================

INSERT INTO college_events (title, description, event_type, department_id, organizer_id, start_date, end_date, start_time, end_time, venue, classroom_id, expected_participants, status, priority_level, affects_timetable) VALUES
('Annual Tech Fest 2025', 'College-wide technical festival with competitions and workshops', 'technical', 1, 1, '2025-03-15', '2025-03-17', '09:00:00', '17:00:00', 'Main Campus', NULL, 500, 'approved', 5, true),
('AI and ML Workshop', 'Two-day workshop on Artificial Intelligence and Machine Learning', 'workshop', 1, 2, '2025-02-20', '2025-02-21', '10:00:00', '16:00:00', 'Seminar Hall', 29, 80, 'approved', 3, false),
('Industry Connect Seminar', 'Seminar on industry trends and placement opportunities', 'seminar', 1, 1, '2025-01-25', '2025-01-25', '14:00:00', '17:00:00', 'Auditorium', 30, 200, 'approved', 4, false),
('ECE Department Research Conference', 'Annual research conference presenting student and faculty research', 'conference', 2, 6, '2025-04-10', '2025-04-12', '09:00:00', '18:00:00', 'ECE Block', NULL, 150, 'planned', 3, true),
('Sports Day', 'Annual sports competition across all departments', 'sports', NULL, NULL, '2025-02-14', '2025-02-14', '08:00:00', '18:00:00', 'Sports Ground', NULL, 800, 'approved', 5, true),
('Cultural Festival', 'Inter-departmental cultural competitions and performances', 'cultural', NULL, NULL, '2025-03-01', '2025-03-03', '09:00:00', '20:00:00', 'Main Campus', NULL, 1000, 'approved', 4, true);

-- ============================================================================
-- 12. SYSTEM CONFIGURATION
-- ============================================================================

-- Update system settings with realistic values
UPDATE system_settings SET setting_value = '45' WHERE setting_key = 'class_duration_minutes';
UPDATE system_settings SET setting_value = '90' WHERE setting_key = 'lab_duration_minutes';
UPDATE system_settings SET setting_value = '6' WHERE setting_key = 'working_days_per_week';

-- Add department-specific preferences
INSERT INTO department_preferences (department_id, preference_key, preference_value, academic_year) VALUES
(1, 'preferred_lab_duration', '120', '2024-2025'),
(1, 'max_continuous_lectures', '3', '2024-2025'),
(1, 'preferred_start_time', '08:00', '2024-2025'),
(2, 'lab_session_preference', 'afternoon', '2024-2025'),
(2, 'theory_lab_gap', '15', '2024-2025'),
(3, 'workshop_scheduling', 'separate_days', '2024-2025'),
(4, 'field_work_days', 'friday_saturday', '2024-2025'),
(5, 'industry_interaction_slots', 'evening', '2024-2025');

-- ============================================================================
-- DATA VERIFICATION QUERIES
-- ============================================================================

-- Show summary of inserted data
SELECT 'DEPARTMENTS' as entity, COUNT(*) as count FROM departments
UNION ALL
SELECT 'FACULTY', COUNT(*) FROM faculty
UNION ALL
SELECT 'SUBJECTS', COUNT(*) FROM subjects
UNION ALL
SELECT 'CLASSROOMS', COUNT(*) FROM classrooms
UNION ALL
SELECT 'STUDENT_BATCHES', COUNT(*) FROM student_batches
UNION ALL
SELECT 'TIME_SLOTS', COUNT(*) FROM time_slots
UNION ALL
SELECT 'TIMETABLES', COUNT(*) FROM timetables
UNION ALL
SELECT 'SCHEDULED_CLASSES', COUNT(*) FROM scheduled_classes
UNION ALL
SELECT 'COLLEGE_EVENTS', COUNT(*) FROM college_events
UNION ALL
SELECT 'FACULTY_ASSIGNMENTS', COUNT(*) FROM faculty_subject_assignments
UNION ALL
SELECT 'BATCH_ASSIGNMENTS', COUNT(*) FROM batch_subject_assignments
ORDER BY entity;

-- Show department-wise summary
SELECT 
    d.name as department,
    COUNT(DISTINCT f.id) as faculty_count,
    COUNT(DISTINCT s.id) as subject_count,
    COUNT(DISTINCT sb.id) as batch_count
FROM departments d
LEFT JOIN faculty f ON d.id = f.department_id
LEFT JOIN subjects s ON d.id = s.department_id
LEFT JOIN student_batches sb ON d.id = sb.department_id
GROUP BY d.id, d.name
ORDER BY d.name;

SELECT 'PyGram 2025 Sample Data Setup Complete!' AS status,
       'All entities populated with realistic test data' AS message;