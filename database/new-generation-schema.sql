-- New Generation Feature: Exam and Assignment Information Tables
-- These tables will store exam schedules and assignment deadlines that creators can share

-- ============================================================================
-- NEW GENERATION FEATURE TABLES
-- ============================================================================

-- Exam Information table for storing exam schedules
CREATE TABLE IF NOT EXISTS exam_information (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('midterm', 'endterm')),
    subject VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration VARCHAR(50), -- e.g., "3 hours", "120 minutes"
    instructions TEXT,
    topics TEXT, -- Syllabus or topics to be covered
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignment Information table for storing assignment deadlines
CREATE TABLE IF NOT EXISTS assignment_information (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    due_date DATE NOT NULL,
    due_time TIME,
    description TEXT,
    submission_format VARCHAR(100), -- e.g., "PDF document", "ZIP file with code"
    max_marks VARCHAR(20), -- e.g., "100", "50 points"
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Exam information indexes
CREATE INDEX idx_exam_info_department ON exam_information(department_id);
CREATE INDEX idx_exam_info_creator ON exam_information(creator_id);
CREATE INDEX idx_exam_info_date ON exam_information(date);
CREATE INDEX idx_exam_info_type ON exam_information(type);

-- Assignment information indexes
CREATE INDEX idx_assignment_info_department ON assignment_information(department_id);
CREATE INDEX idx_assignment_info_creator ON assignment_information(creator_id);
CREATE INDEX idx_assignment_info_due_date ON assignment_information(due_date);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATE
-- ============================================================================

-- Apply updated_at triggers to new tables
CREATE TRIGGER update_exam_information_updated_at BEFORE UPDATE ON exam_information
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignment_information_updated_at BEFORE UPDATE ON assignment_information
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE exam_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_information ENABLE ROW LEVEL SECURITY;

-- All users can view exam information from their department
CREATE POLICY "Department members can view exam info" ON exam_information
    FOR SELECT USING (
        department_id IN (
            SELECT department_id FROM user_department_assignments 
            WHERE user_id = auth.uid() AND is_active = true
        ) OR 
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
    );

-- Only creators and admins can insert/update/delete exam information
CREATE POLICY "Creators can manage exam info" ON exam_information
    FOR ALL USING (
        creator_id = auth.uid() OR 
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
    );

-- All users can view assignment information from their department
CREATE POLICY "Department members can view assignment info" ON assignment_information
    FOR SELECT USING (
        department_id IN (
            SELECT department_id FROM user_department_assignments 
            WHERE user_id = auth.uid() AND is_active = true
        ) OR 
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
    );

-- Only creators and admins can insert/update/delete assignment information
CREATE POLICY "Creators can manage assignment info" ON assignment_information
    FOR ALL USING (
        creator_id = auth.uid() OR 
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
    );

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Note: Sample data would be inserted after users and departments are created
-- Example insertions (uncomment and modify as needed):

/*
-- Sample exam information (replace UUIDs with actual values)
INSERT INTO exam_information (type, subject, date, time, duration, instructions, topics, creator_id, department_id) VALUES
('midterm', 'Data Structures and Algorithms', '2025-10-15', '10:00:00', '3 hours', 'Bring calculators. No mobile phones allowed.', 'Arrays, Linked Lists, Stacks, Queues, Trees', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
('endterm', 'Database Management Systems', '2025-12-20', '14:00:00', '3 hours', 'Open book exam. Laptops not allowed.', 'SQL, Normalization, Transactions, Indexing', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001');

-- Sample assignment information (replace UUIDs with actual values)
INSERT INTO assignment_information (title, subject, due_date, due_time, description, submission_format, max_marks, creator_id, department_id) VALUES
('Database Design Project', 'Database Management Systems', '2025-11-30', '23:59:00', 'Design and implement a complete database system for a library management application.', 'ZIP file containing SQL scripts and documentation', '100', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
('Binary Tree Implementation', 'Data Structures and Algorithms', '2025-10-25', '18:00:00', 'Implement various binary tree operations in C++.', 'Single C++ file with comments', '50', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001');
*/

COMMENT ON TABLE exam_information IS 'Stores exam schedules shared by creators with students and publishers';
COMMENT ON TABLE assignment_information IS 'Stores assignment deadlines and details shared by creators with students and publishers';