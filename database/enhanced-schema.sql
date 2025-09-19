-- Enhanced Py-Gram 2k25 Database Schema
-- Supporting Multi-Department Event Management System

-- ============================================================================
-- CORE ACADEMIC ENTITIES (Existing + Enhanced)
-- ============================================================================

-- Enhanced Users table with role-based access
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'mentor', 'student')),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments table for college organization
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    head_of_department_id UUID REFERENCES users(id),
    established_year INTEGER,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    building VARCHAR(50),
    floor_number INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Department Assignments (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_department_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    assignment_type VARCHAR(20) NOT NULL CHECK (assignment_type IN ('member', 'mentor', 'student')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, department_id, assignment_type)
);

-- Enhanced Faculty table (linked to users)
CREATE TABLE IF NOT EXISTS faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    designation VARCHAR(50),
    qualification VARCHAR(200),
    experience_years INTEGER DEFAULT 0,
    specialization TEXT,
    joining_date DATE,
    office_room VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    credits INTEGER NOT NULL DEFAULT 3,
    theory_hours INTEGER DEFAULT 0,
    practical_hours INTEGER DEFAULT 0,
    semester INTEGER CHECK (semester BETWEEN 1 AND 8),
    year INTEGER,
    is_elective BOOLEAN DEFAULT false,
    prerequisites TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Classrooms table
CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id),
    building VARCHAR(50),
    floor_number INTEGER,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    room_type VARCHAR(20) DEFAULT 'lecture' CHECK (room_type IN ('lecture', 'lab', 'seminar', 'auditorium')),
    has_projector BOOLEAN DEFAULT false,
    has_smartboard BOOLEAN DEFAULT false,
    has_ac BOOLEAN DEFAULT false,
    has_computer BOOLEAN DEFAULT false,
    equipment_details TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Student Batches
CREATE TABLE IF NOT EXISTS student_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 4),
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    strength INTEGER NOT NULL CHECK (strength > 0),
    academic_year VARCHAR(10) NOT NULL, -- e.g., "2024-25"
    section VARCHAR(10) DEFAULT 'A',
    class_coordinator_id UUID REFERENCES faculty(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- COLLEGE-LEVEL EVENT MANAGEMENT SYSTEM
-- ============================================================================

-- College Events table
CREATE TABLE IF NOT EXISTS college_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'workshop', 'seminar', 'conference', 'cultural', 'sports', 
        'technical', 'orientation', 'examination', 'meeting', 'other'
    )),
    department_id UUID NOT NULL REFERENCES departments(id),
    created_by UUID NOT NULL REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    venue VARCHAR(200),
    classroom_id UUID REFERENCES classrooms(id),
    expected_participants INTEGER,
    budget_allocated DECIMAL(10,2),
    contact_person VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'completed', 'cancelled'
    )),
    priority_level INTEGER DEFAULT 1 CHECK (priority_level BETWEEN 1 AND 5),
    requires_approval BOOLEAN DEFAULT true,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    is_public BOOLEAN DEFAULT true,
    registration_required BOOLEAN DEFAULT false,
    max_registrations INTEGER,
    registration_deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure end_date is not before start_date
    CONSTRAINT valid_date_range CHECK (end_date >= start_date),
    -- Ensure end_time is after start_time for same-day events
    CONSTRAINT valid_time_range CHECK (
        start_date != end_date OR start_time IS NULL OR end_time IS NULL OR end_time > start_time
    )
);

-- Event Queue for Conflict Resolution (First-Come-First-Serve)
CREATE TABLE IF NOT EXISTS event_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES college_events(id) ON DELETE CASCADE,
    queue_position INTEGER NOT NULL,
    requested_date DATE NOT NULL,
    requested_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN (
        'waiting', 'allocated', 'rejected', 'expired'
    )),
    conflict_with_event_id UUID REFERENCES college_events(id),
    allocated_date DATE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(event_id, requested_date)
);

-- Event Notifications
CREATE TABLE IF NOT EXISTS event_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES college_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN (
        'booking_confirmed', 'booking_rejected', 'date_conflict', 
        'event_approved', 'event_reminder', 'queue_update'
    )),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Department Mentor Limits (3 mentors per department)
CREATE TABLE IF NOT EXISTS department_mentor_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    max_mentors INTEGER DEFAULT 3,
    current_mentors INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(department_id),
    CONSTRAINT valid_mentor_count CHECK (current_mentors <= max_mentors)
);

-- ============================================================================
-- ENHANCED TIMETABLE SYSTEM (Existing + Enhanced)
-- ============================================================================

-- Time Slots
CREATE TABLE IF NOT EXISTS time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_type VARCHAR(20) DEFAULT 'regular' CHECK (slot_type IN ('regular', 'lab', 'break')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_time_slot CHECK (end_time > start_time)
);

-- Timetables
CREATE TABLE IF NOT EXISTS timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    academic_year VARCHAR(10) NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN (
        'draft', 'pending_approval', 'approved', 'published', 'archived'
    )),
    created_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    quality_score DECIMAL(5,2),
    generation_algorithm VARCHAR(50),
    generation_time_seconds INTEGER,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE
);

-- Scheduled Classes
CREATE TABLE IF NOT EXISTS scheduled_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timetable_id UUID NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    faculty_id UUID NOT NULL REFERENCES faculty(id),
    student_batch_id UUID NOT NULL REFERENCES student_batches(id),
    classroom_id UUID NOT NULL REFERENCES classrooms(id),
    time_slot_id UUID NOT NULL REFERENCES time_slots(id),
    class_type VARCHAR(20) DEFAULT 'lecture' CHECK (class_type IN ('lecture', 'lab', 'tutorial', 'seminar')),
    duration_minutes INTEGER DEFAULT 60,
    is_recurring BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent double booking
    UNIQUE(faculty_id, time_slot_id, timetable_id),
    UNIQUE(classroom_id, time_slot_id, timetable_id),
    UNIQUE(student_batch_id, time_slot_id, timetable_id)
);

-- Faculty Subject Assignments
CREATE TABLE IF NOT EXISTS faculty_subject_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    proficiency_level INTEGER DEFAULT 3 CHECK (proficiency_level BETWEEN 1 AND 5),
    preferred_time_slots TEXT, -- JSON array of preferred time slot IDs
    max_hours_per_week INTEGER DEFAULT 20,
    assigned_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(faculty_id, subject_id)
);

-- Student Batch Subject Assignments
CREATE TABLE IF NOT EXISTS batch_subject_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_batch_id UUID NOT NULL REFERENCES student_batches(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    is_elective BOOLEAN DEFAULT false,
    enrollment_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_batch_id, subject_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- Department indexes
CREATE INDEX idx_departments_code ON departments(code);
CREATE INDEX idx_departments_active ON departments(is_active);

-- Event indexes
CREATE INDEX idx_events_department ON college_events(department_id);
CREATE INDEX idx_events_date_range ON college_events(start_date, end_date);
CREATE INDEX idx_events_status ON college_events(status);
CREATE INDEX idx_events_created_by ON college_events(created_by);

-- Queue indexes
CREATE INDEX idx_queue_date ON event_queue(requested_date);
CREATE INDEX idx_queue_status ON event_queue(status);
CREATE INDEX idx_queue_position ON event_queue(queue_position);

-- Notification indexes
CREATE INDEX idx_notifications_user ON event_notifications(user_id);
CREATE INDEX idx_notifications_unread ON event_notifications(user_id, is_read);

-- Timetable indexes
CREATE INDEX idx_timetables_department ON timetables(department_id);
CREATE INDEX idx_timetables_status ON timetables(status);
CREATE INDEX idx_scheduled_classes_timetable ON scheduled_classes(timetable_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_college_events_updated_at BEFORE UPDATE ON college_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_queue_updated_at BEFORE UPDATE ON event_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timetables_updated_at BEFORE UPDATE ON timetables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to enforce mentor limits per department
CREATE OR REPLACE FUNCTION check_mentor_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    max_limit INTEGER;
BEGIN
    IF NEW.assignment_type = 'mentor' AND NEW.is_active = true THEN
        -- Get current mentor count and limit for the department
        SELECT 
            COALESCE(COUNT(*), 0),
            COALESCE(dml.max_mentors, 3)
        INTO current_count, max_limit
        FROM user_department_assignments uda
        LEFT JOIN department_mentor_limits dml ON dml.department_id = NEW.department_id
        WHERE uda.department_id = NEW.department_id 
        AND uda.assignment_type = 'mentor' 
        AND uda.is_active = true
        AND uda.id != COALESCE(NEW.id, uuid_generate_v4());
        
        IF current_count >= max_limit THEN
            RAISE EXCEPTION 'Department already has maximum number of mentors (%). Cannot add more.', max_limit;
        END IF;
        
        -- Update the current count
        INSERT INTO department_mentor_limits (department_id, current_mentors)
        VALUES (NEW.department_id, current_count + 1)
        ON CONFLICT (department_id) 
        DO UPDATE SET current_mentors = current_count + 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_mentor_limit
    BEFORE INSERT OR UPDATE ON user_department_assignments
    FOR EACH ROW EXECUTE FUNCTION check_mentor_limit();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;

-- Users can see their own data and admins can see all
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (id = auth.uid() OR 
                     (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Event visibility policies
CREATE POLICY "Public events visible to all" ON college_events
    FOR SELECT USING (is_public = true OR 
                     created_by = auth.uid() OR 
                     (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Mentors can create events for their departments
CREATE POLICY "Mentors can create department events" ON college_events
    FOR INSERT WITH CHECK (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'mentor') AND
        department_id IN (
            SELECT department_id FROM user_department_assignments 
            WHERE user_id = auth.uid() AND assignment_type = 'mentor' AND is_active = true
        )
    );

-- Users can see their own notifications
CREATE POLICY "Users see own notifications" ON event_notifications
    FOR SELECT USING (user_id = auth.uid());

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert sample departments
INSERT INTO departments (name, code, description, established_year, contact_email) VALUES
('Computer Science & Engineering', 'CSE', 'Department of Computer Science and Engineering', 2010, 'cse@college.edu'),
('Electronics & Communication', 'ECE', 'Department of Electronics and Communication Engineering', 2008, 'ece@college.edu'),
('Mechanical Engineering', 'MECH', 'Department of Mechanical Engineering', 2005, 'mech@college.edu'),
('Civil Engineering', 'CIVIL', 'Department of Civil Engineering', 2005, 'civil@college.edu'),
('Information Technology', 'IT', 'Department of Information Technology', 2012, 'it@college.edu');

-- Insert sample time slots
INSERT INTO time_slots (day_of_week, start_time, end_time, slot_type) VALUES
(1, '09:00:00', '10:00:00', 'regular'), -- Monday 9-10 AM
(1, '10:00:00', '11:00:00', 'regular'), -- Monday 10-11 AM
(1, '11:00:00', '12:00:00', 'regular'), -- Monday 11-12 PM
(1, '12:00:00', '13:00:00', 'break'),   -- Monday 12-1 PM (Lunch)
(1, '13:00:00', '14:00:00', 'regular'), -- Monday 1-2 PM
(1, '14:00:00', '15:00:00', 'regular'), -- Monday 2-3 PM
(1, '15:00:00', '16:00:00', 'regular'), -- Monday 3-4 PM
(1, '16:00:00', '17:00:00', 'regular'); -- Monday 4-5 PM

-- Repeat for other days (Tuesday = 2, Wednesday = 3, etc.)
-- This is a simplified version - in practice, you'd generate for all 7 days

COMMENT ON TABLE college_events IS 'College-level events managed by departments with conflict resolution';
COMMENT ON TABLE event_queue IS 'Queue system for resolving date conflicts using first-come-first-serve';
COMMENT ON TABLE department_mentor_limits IS 'Enforces maximum 3 mentors per department who can create events';
COMMENT ON TABLE event_notifications IS 'System notifications for event management and conflicts';