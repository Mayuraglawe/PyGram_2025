-- ============================================================================
-- PYGRAM 2025 - ROW LEVEL SECURITY (RLS) POLICIES
-- Run this AFTER creating the main schema to secure your database
-- ============================================================================

-- ============================================================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

-- Enable RLS on all tables that need protection
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_subject_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_subject_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_change_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. PUBLIC READ ACCESS POLICIES (For general data visibility)
-- ============================================================================

-- Allow everyone to read departments (public information)
CREATE POLICY "Public read access to departments" ON departments
    FOR SELECT USING (is_active = true);

-- Allow everyone to read faculty basic info (public directory)
CREATE POLICY "Public read access to faculty" ON faculty
    FOR SELECT USING (is_active = true);

-- Allow everyone to read subjects (course catalog)
CREATE POLICY "Public read access to subjects" ON subjects
    FOR SELECT USING (true);

-- Allow everyone to read classrooms (facility information)
CREATE POLICY "Public read access to classrooms" ON classrooms
    FOR SELECT USING (is_available = true);

-- Allow everyone to read student batches (academic structure)
CREATE POLICY "Public read access to student_batches" ON student_batches
    FOR SELECT USING (is_active = true);

-- Allow everyone to read time slots (schedule structure)
CREATE POLICY "Public read access to time_slots" ON time_slots
    FOR SELECT USING (is_active = true);

-- Allow everyone to read published timetables
CREATE POLICY "Public read access to published timetables" ON timetables
    FOR SELECT USING (status = 'published' AND is_active = true);

-- Allow everyone to read scheduled classes for published timetables
CREATE POLICY "Public read access to scheduled_classes" ON scheduled_classes
    FOR SELECT USING (
        timetable_id IN (
            SELECT id FROM timetables 
            WHERE status = 'published' AND is_active = true
        )
    );

-- Allow everyone to read public events
CREATE POLICY "Public read access to college_events" ON college_events
    FOR SELECT USING (status IN ('approved', 'ongoing', 'completed'));

-- ============================================================================
-- 3. AUTHENTICATED USER POLICIES (For logged-in users)
-- ============================================================================

-- Create a helper function to check if user is authenticated
CREATE OR REPLACE FUNCTION auth.is_authenticated()
RETURNS boolean AS $$
BEGIN
    RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a helper function to get user role
CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS text AS $$
BEGIN
    -- This would integrate with your authentication system
    -- For now, we'll assume roles are stored in user metadata
    RETURN COALESCE(
        (auth.jwt() ->> 'role')::text,
        'student'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. ADMIN ACCESS POLICIES (Full access for administrators)
-- ============================================================================

-- Admins can do everything on all tables
CREATE POLICY "Admin full access to departments" ON departments
    FOR ALL USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin full access to faculty" ON faculty
    FOR ALL USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin full access to subjects" ON subjects
    FOR ALL USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin full access to classrooms" ON classrooms
    FOR ALL USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin full access to student_batches" ON student_batches
    FOR ALL USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin full access to time_slots" ON time_slots
    FOR ALL USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin full access to timetables" ON timetables
    FOR ALL USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin full access to scheduled_classes" ON scheduled_classes
    FOR ALL USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin full access to college_events" ON college_events
    FOR ALL USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin full access to faculty_subject_assignments" ON faculty_subject_assignments
    FOR ALL USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin full access to batch_subject_assignments" ON batch_subject_assignments
    FOR ALL USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin read access to timetable_change_log" ON timetable_change_log
    FOR SELECT USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin read access to schedule_conflicts" ON schedule_conflicts
    FOR SELECT USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin full access to system_settings" ON system_settings
    FOR ALL USING (auth.get_user_role() = 'admin');

CREATE POLICY "Admin full access to department_preferences" ON department_preferences
    FOR ALL USING (auth.get_user_role() = 'admin');

-- ============================================================================
-- 5. FACULTY/HOD ACCESS POLICIES (Department-level access)
-- ============================================================================

-- Create helper function to check if user is HOD of a department
CREATE OR REPLACE FUNCTION auth.is_hod_of_department(dept_id integer)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM departments d
        JOIN faculty f ON d.head_of_department_id = f.id
        WHERE d.id = dept_id 
        AND f.employee_id = auth.jwt() ->> 'employee_id'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to check if user is faculty of a department
CREATE OR REPLACE FUNCTION auth.is_faculty_of_department(dept_id integer)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM faculty f
        WHERE f.department_id = dept_id 
        AND f.employee_id = auth.jwt() ->> 'employee_id'
        AND f.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- HODs can manage their department's data
CREATE POLICY "HOD manage own department" ON departments
    FOR ALL USING (
        auth.get_user_role() IN ('hod', 'faculty') AND
        auth.is_hod_of_department(id)
    );

-- Faculty can manage subjects in their department
CREATE POLICY "Faculty manage department subjects" ON subjects
    FOR ALL USING (
        auth.get_user_role() = 'faculty' AND
        (auth.is_hod_of_department(department_id) OR auth.is_faculty_of_department(department_id))
    );

-- Faculty can manage student batches in their department
CREATE POLICY "Faculty manage department batches" ON student_batches
    FOR ALL USING (
        auth.get_user_role() = 'faculty' AND
        (auth.is_hod_of_department(department_id) OR auth.is_faculty_of_department(department_id))
    );

-- Faculty can create/manage timetables for their department
CREATE POLICY "Faculty manage department timetables" ON timetables
    FOR ALL USING (
        auth.get_user_role() = 'faculty' AND
        (auth.is_hod_of_department(department_id) OR auth.is_faculty_of_department(department_id))
    );

-- Faculty can create events for their department
CREATE POLICY "Faculty create department events" ON college_events
    FOR INSERT WITH CHECK (
        auth.get_user_role() = 'faculty' AND
        (auth.is_hod_of_department(department_id) OR auth.is_faculty_of_department(department_id))
    );

-- Faculty can update their own events
CREATE POLICY "Faculty update own events" ON college_events
    FOR UPDATE USING (
        organizer_id = (
            SELECT id FROM faculty 
            WHERE employee_id = auth.jwt() ->> 'employee_id'
        )
    );

-- ============================================================================
-- 6. STUDENT ACCESS POLICIES (Limited read access)
-- ============================================================================

-- Students can view their own batch information
CREATE POLICY "Students view own batch info" ON student_batches
    FOR SELECT USING (
        auth.get_user_role() = 'student' AND
        id = (auth.jwt() ->> 'batch_id')::integer
    );

-- Students can view timetables for their batch
CREATE POLICY "Students view own timetables" ON timetables
    FOR SELECT USING (
        auth.get_user_role() = 'student' AND
        status = 'published' AND
        id IN (
            SELECT DISTINCT sc.timetable_id 
            FROM scheduled_classes sc
            WHERE sc.batch_id = (auth.jwt() ->> 'batch_id')::integer
        )
    );

-- Students can view their scheduled classes
CREATE POLICY "Students view own scheduled_classes" ON scheduled_classes
    FOR SELECT USING (
        auth.get_user_role() = 'student' AND
        batch_id = (auth.jwt() ->> 'batch_id')::integer
    );

-- ============================================================================
-- 7. AUDIT AND LOGGING POLICIES
-- ============================================================================

-- System automatically logs changes (no user restrictions)
CREATE POLICY "System logging policy" ON timetable_change_log
    FOR INSERT WITH CHECK (true);

-- System automatically logs conflicts (no user restrictions)
CREATE POLICY "System conflict logging policy" ON schedule_conflicts
    FOR INSERT WITH CHECK (true);

-- Faculty can view change logs for their department's timetables
CREATE POLICY "Faculty view department change logs" ON timetable_change_log
    FOR SELECT USING (
        auth.get_user_role() = 'faculty' AND
        timetable_id IN (
            SELECT id FROM timetables t
            WHERE auth.is_faculty_of_department(t.department_id)
        )
    );

-- ============================================================================
-- 8. BYPASS POLICIES FOR SERVICE ACCOUNTS
-- ============================================================================

-- Create a service role that can bypass RLS for system operations
-- This would be used by your application's backend services

-- For your Node.js/Express server, you'll need a service role
-- that can perform operations without RLS restrictions

-- First, create the service role (run this as superuser)
-- CREATE ROLE service_account WITH LOGIN PASSWORD 'your_service_password';
-- GRANT USAGE ON SCHEMA public TO service_account;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_account;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_account;

-- Create bypass policies for service account
CREATE POLICY "Service account bypass" ON departments
    FOR ALL USING (current_user = 'service_account');

CREATE POLICY "Service account bypass" ON faculty
    FOR ALL USING (current_user = 'service_account');

CREATE POLICY "Service account bypass" ON subjects
    FOR ALL USING (current_user = 'service_account');

CREATE POLICY "Service account bypass" ON classrooms
    FOR ALL USING (current_user = 'service_account');

CREATE POLICY "Service account bypass" ON student_batches
    FOR ALL USING (current_user = 'service_account');

CREATE POLICY "Service account bypass" ON time_slots
    FOR ALL USING (current_user = 'service_account');

CREATE POLICY "Service account bypass" ON timetables
    FOR ALL USING (current_user = 'service_account');

CREATE POLICY "Service account bypass" ON scheduled_classes
    FOR ALL USING (current_user = 'service_account');

CREATE POLICY "Service account bypass" ON college_events
    FOR ALL USING (current_user = 'service_account');

CREATE POLICY "Service account bypass" ON faculty_subject_assignments
    FOR ALL USING (current_user = 'service_account');

CREATE POLICY "Service account bypass" ON batch_subject_assignments
    FOR ALL USING (current_user = 'service_account');

-- ============================================================================
-- 9. TESTING AND VERIFICATION
-- ============================================================================

-- Create a view to test policy effectiveness
CREATE VIEW policy_test_summary AS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- SECURITY SETUP COMPLETE
-- ============================================================================

SELECT 'PyGram 2025 Row Level Security Setup Complete!' AS status,
       'Policies: ' || COUNT(*) || ' created successfully' AS summary
FROM pg_policies 
WHERE schemaname = 'public';