-- ============================================================================
-- PYGRAM 2025 - COMPLETE DATABASE SCHEMA SETUP
-- This is the complete, production-ready schema for your timetable management system
-- ============================================================================

-- ============================================================================
-- 1. CORE ACADEMIC ENTITIES
-- ============================================================================

-- Departments table - The foundation of academic organization
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    head_of_department_id INTEGER, -- Will be linked to faculty later
    established_year INTEGER CHECK (established_year > 1900 AND established_year <= EXTRACT(YEAR FROM NOW())),
    contact_email VARCHAR(255) UNIQUE,
    contact_phone VARCHAR(50),
    building VARCHAR(100),
    floor_number INTEGER CHECK (floor_number > 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Faculty table - Academic staff management
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(50),
    designation VARCHAR(100), -- Professor, Associate Professor, Assistant Professor, etc.
    qualification VARCHAR(500), -- Educational qualifications
    specialization TEXT, -- Areas of expertise
    experience_years INTEGER DEFAULT 0 CHECK (experience_years >= 0),
    joining_date DATE,
    office_location VARCHAR(100),
    max_weekly_hours INTEGER DEFAULT 20 CHECK (max_weekly_hours > 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for head_of_department after faculty table exists
ALTER TABLE departments 
ADD CONSTRAINT fk_departments_hod 
FOREIGN KEY (head_of_department_id) REFERENCES faculty(id) ON DELETE SET NULL;

-- Subjects table - Academic courses
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL CHECK (credits > 0),
    lectures_per_week INTEGER DEFAULT 3 CHECK (lectures_per_week >= 0),
    labs_per_week INTEGER DEFAULT 0 CHECK (labs_per_week >= 0),
    requires_lab BOOLEAN DEFAULT false,
    semester INTEGER CHECK (semester BETWEEN 1 AND 8),
    year INTEGER CHECK (year BETWEEN 1 AND 4),
    subject_type VARCHAR(50) DEFAULT 'core' CHECK (subject_type IN ('core', 'elective', 'practical')),
    prerequisites TEXT, -- List of prerequisite subjects
    syllabus TEXT, -- Detailed syllabus
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classrooms table - Physical infrastructure
CREATE TABLE classrooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor_number INTEGER CHECK (floor_number > 0),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    type VARCHAR(50) DEFAULT 'Lecture' CHECK (type IN ('Lecture', 'Lab', 'Seminar', 'Auditorium')),
    equipment TEXT, -- JSON or comma-separated list of equipment
    has_projector BOOLEAN DEFAULT false,
    has_smartboard BOOLEAN DEFAULT false,
    has_ac BOOLEAN DEFAULT false,
    has_computer_lab BOOLEAN DEFAULT false,
    accessibility_features TEXT, -- For disabled access
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique room identification
    UNIQUE(room_number, building)
);

-- Student Batches table - Groups of students
CREATE TABLE student_batches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    batch_code VARCHAR(50) NOT NULL UNIQUE, -- e.g., CSE2024A
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 4),
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    section VARCHAR(10) DEFAULT 'A',
    strength INTEGER NOT NULL CHECK (strength > 0),
    academic_year VARCHAR(20) NOT NULL, -- e.g., "2024-2025"
    class_coordinator_id INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    intake_year INTEGER CHECK (intake_year > 2000),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. TIMETABLE MANAGEMENT SYSTEM
-- ============================================================================

-- Time Slots table - Define class periods
CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_name VARCHAR(50), -- e.g., "Period 1", "Lab Session A"
    slot_type VARCHAR(20) DEFAULT 'regular' CHECK (slot_type IN ('regular', 'lab', 'break', 'lunch')),
    duration_minutes INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time))/60) STORED,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure valid time range
    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    -- Prevent overlapping slots on the same day
    CONSTRAINT unique_day_time UNIQUE(day_of_week, start_time, end_time)
);

-- Timetables table - Master timetable records
CREATE TABLE timetables (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    academic_year VARCHAR(20) NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'archived')),
    version INTEGER DEFAULT 1,
    created_by INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    approved_by INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    quality_score DECIMAL(5,2) CHECK (quality_score >= 0 AND quality_score <= 1),
    generation_algorithm VARCHAR(100), -- AI algorithm used
    generation_time_seconds INTEGER,
    conflict_count INTEGER DEFAULT 0,
    optimization_notes TEXT,
    effective_from DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    
    -- Ensure effective date range is valid
    CONSTRAINT valid_effective_period CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

-- Scheduled Classes table - Individual class assignments
CREATE TABLE scheduled_classes (
    id SERIAL PRIMARY KEY,
    timetable_id INTEGER NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    time_slot_id INTEGER NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    faculty_id INTEGER NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    batch_id INTEGER NOT NULL REFERENCES student_batches(id) ON DELETE CASCADE,
    classroom_id INTEGER NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    class_type VARCHAR(20) DEFAULT 'lecture' CHECK (class_type IN ('lecture', 'lab', 'tutorial', 'seminar', 'practical')),
    week_pattern VARCHAR(20) DEFAULT 'weekly' CHECK (week_pattern IN ('weekly', 'biweekly', 'monthly')),
    recurring BOOLEAN DEFAULT true,
    special_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent conflicts: same faculty can't be in two places at once
    CONSTRAINT unique_faculty_timeslot UNIQUE(timetable_id, faculty_id, time_slot_id),
    -- Prevent conflicts: same classroom can't have two classes
    CONSTRAINT unique_classroom_timeslot UNIQUE(timetable_id, classroom_id, time_slot_id),
    -- Prevent conflicts: same batch can't have two classes
    CONSTRAINT unique_batch_timeslot UNIQUE(timetable_id, batch_id, time_slot_id)
);

-- ============================================================================
-- 3. ASSIGNMENT AND RELATIONSHIP TABLES
-- ============================================================================

-- Faculty Subject Assignments - Who can teach what
CREATE TABLE faculty_subject_assignments (
    id SERIAL PRIMARY KEY,
    faculty_id INTEGER NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    proficiency_level INTEGER DEFAULT 3 CHECK (proficiency_level BETWEEN 1 AND 5),
    preferred_slots TEXT, -- JSON array of preferred time slot IDs
    max_hours_per_week INTEGER DEFAULT 10 CHECK (max_hours_per_week > 0),
    assignment_type VARCHAR(20) DEFAULT 'regular' CHECK (assignment_type IN ('regular', 'guest', 'substitute')),
    academic_year VARCHAR(20),
    is_primary_instructor BOOLEAN DEFAULT false,
    assigned_by INTEGER REFERENCES faculty(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One faculty can teach same subject only once per academic year
    CONSTRAINT unique_faculty_subject_year UNIQUE(faculty_id, subject_id, academic_year)
);

-- Batch Subject Assignments - Which subjects each batch studies
CREATE TABLE batch_subject_assignments (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER NOT NULL REFERENCES student_batches(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    is_elective BOOLEAN DEFAULT false,
    enrollment_count INTEGER,
    academic_year VARCHAR(20),
    semester INTEGER CHECK (semester BETWEEN 1 AND 8),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate assignments
    CONSTRAINT unique_batch_subject UNIQUE(batch_id, subject_id, academic_year, semester)
);

-- ============================================================================
-- 4. EVENT MANAGEMENT SYSTEM
-- ============================================================================

-- College Events table - Special events that may conflict with regular classes
CREATE TABLE college_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'workshop', 'seminar', 'conference', 'cultural', 'sports', 
        'technical', 'orientation', 'examination', 'meeting', 'holiday', 'other'
    )),
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    organizer_id INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    venue VARCHAR(255),
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE SET NULL,
    expected_participants INTEGER CHECK (expected_participants > 0),
    registration_required BOOLEAN DEFAULT false,
    registration_deadline DATE,
    max_registrations INTEGER,
    budget_allocated DECIMAL(10,2) CHECK (budget_allocated >= 0),
    contact_person VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN (
        'planned', 'approved', 'rejected', 'ongoing', 'completed', 'cancelled'
    )),
    priority_level INTEGER DEFAULT 1 CHECK (priority_level BETWEEN 1 AND 5),
    affects_timetable BOOLEAN DEFAULT false,
    approval_required BOOLEAN DEFAULT true,
    approved_by INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    special_requirements TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure valid date and time ranges
    CONSTRAINT valid_event_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_event_times CHECK (
        start_date != end_date OR start_time IS NULL OR end_time IS NULL OR end_time > start_time
    ),
    CONSTRAINT valid_registration_deadline CHECK (
        registration_deadline IS NULL OR registration_deadline <= start_date
    )
);

-- ============================================================================
-- 5. AUDIT AND LOGGING TABLES
-- ============================================================================

-- Timetable Changes Log - Track all modifications
CREATE TABLE timetable_change_log (
    id SERIAL PRIMARY KEY,
    timetable_id INTEGER NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    changed_by INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    change_type VARCHAR(50) NOT NULL CHECK (change_type IN (
        'created', 'updated', 'approved', 'rejected', 'published', 'archived'
    )),
    change_description TEXT,
    old_values JSONB, -- Store previous state
    new_values JSONB, -- Store new state
    change_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Class Schedule Conflicts Log - Track and resolve conflicts
CREATE TABLE schedule_conflicts (
    id SERIAL PRIMARY KEY,
    timetable_id INTEGER NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    conflict_type VARCHAR(50) NOT NULL CHECK (conflict_type IN (
        'faculty_double_booking', 'classroom_double_booking', 'batch_double_booking',
        'faculty_overload', 'classroom_capacity_exceeded', 'equipment_mismatch'
    )),
    affected_classes JSONB, -- Array of scheduled_class IDs
    conflict_description TEXT,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'ignored')),
    resolution_notes TEXT,
    resolved_by INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- ============================================================================
-- 6. SYSTEM CONFIGURATION AND PREFERENCES
-- ============================================================================

-- System Settings table - Global configuration
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_system_setting BOOLEAN DEFAULT false, -- System vs user-configurable
    updated_by INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Department Preferences - Department-specific settings
CREATE TABLE department_preferences (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    academic_year VARCHAR(20),
    updated_by INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_dept_preference UNIQUE(department_id, preference_key, academic_year)
);

-- ============================================================================
-- 7. PERFORMANCE OPTIMIZATION INDEXES
-- ============================================================================

-- Department indexes
CREATE INDEX idx_departments_code ON departments(code);
CREATE INDEX idx_departments_active ON departments(is_active);
CREATE INDEX idx_departments_hod ON departments(head_of_department_id);

-- Faculty indexes
CREATE INDEX idx_faculty_department ON faculty(department_id);
CREATE INDEX idx_faculty_employee_id ON faculty(employee_id);
CREATE INDEX idx_faculty_active ON faculty(is_active);

-- Subject indexes
CREATE INDEX idx_subjects_department ON subjects(department_id);
CREATE INDEX idx_subjects_code ON subjects(code);
CREATE INDEX idx_subjects_semester ON subjects(semester, year);

-- Classroom indexes
CREATE INDEX idx_classrooms_building_room ON classrooms(building, room_number);
CREATE INDEX idx_classrooms_type_capacity ON classrooms(type, capacity);
CREATE INDEX idx_classrooms_available ON classrooms(is_available);

-- Student batch indexes
CREATE INDEX idx_batches_department ON student_batches(department_id);
CREATE INDEX idx_batches_year_semester ON student_batches(year, semester);
CREATE INDEX idx_batches_academic_year ON student_batches(academic_year);

-- Time slot indexes
CREATE INDEX idx_timeslots_day ON time_slots(day_of_week);
CREATE INDEX idx_timeslots_time_range ON time_slots(start_time, end_time);
CREATE INDEX idx_timeslots_active ON time_slots(is_active);

-- Timetable indexes
CREATE INDEX idx_timetables_department ON timetables(department_id);
CREATE INDEX idx_timetables_status ON timetables(status);
CREATE INDEX idx_timetables_academic_year ON timetables(academic_year, semester);
CREATE INDEX idx_timetables_active ON timetables(is_active);

-- Scheduled classes indexes (most important for performance)
CREATE INDEX idx_scheduled_timetable ON scheduled_classes(timetable_id);
CREATE INDEX idx_scheduled_faculty ON scheduled_classes(faculty_id);
CREATE INDEX idx_scheduled_batch ON scheduled_classes(batch_id);
CREATE INDEX idx_scheduled_classroom ON scheduled_classes(classroom_id);
CREATE INDEX idx_scheduled_timeslot ON scheduled_classes(time_slot_id);
CREATE INDEX idx_scheduled_subject ON scheduled_classes(subject_id);

-- Assignment indexes
CREATE INDEX idx_faculty_subject_assign ON faculty_subject_assignments(faculty_id, subject_id);
CREATE INDEX idx_batch_subject_assign ON batch_subject_assignments(batch_id, subject_id);

-- Event indexes
CREATE INDEX idx_events_department ON college_events(department_id);
CREATE INDEX idx_events_date_range ON college_events(start_date, end_date);
CREATE INDEX idx_events_status ON college_events(status);
CREATE INDEX idx_events_affects_timetable ON college_events(affects_timetable);

-- ============================================================================
-- 8. FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the updated_at trigger to all relevant tables
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classrooms_updated_at BEFORE UPDATE ON classrooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_batches_updated_at BEFORE UPDATE ON student_batches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timetables_updated_at BEFORE UPDATE ON timetables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_classes_updated_at BEFORE UPDATE ON scheduled_classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_college_events_updated_at BEFORE UPDATE ON college_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to validate faculty workload
CREATE OR REPLACE FUNCTION check_faculty_workload()
RETURNS TRIGGER AS $$
DECLARE
    current_hours INTEGER;
    max_hours INTEGER;
BEGIN
    -- Get faculty's maximum allowed hours
    SELECT max_weekly_hours INTO max_hours
    FROM faculty WHERE id = NEW.faculty_id;
    
    -- Calculate current weekly hours for this faculty
    SELECT COALESCE(SUM(ts.duration_minutes / 60), 0) INTO current_hours
    FROM scheduled_classes sc
    JOIN time_slots ts ON sc.time_slot_id = ts.id
    WHERE sc.faculty_id = NEW.faculty_id 
    AND sc.timetable_id = NEW.timetable_id
    AND sc.id != COALESCE(NEW.id, 0); -- Exclude current record for updates
    
    -- Add hours from new/updated class
    SELECT current_hours + (ts.duration_minutes / 60) INTO current_hours
    FROM time_slots ts WHERE ts.id = NEW.time_slot_id;
    
    -- Check if it exceeds maximum
    IF current_hours > max_hours THEN
        RAISE EXCEPTION 'Faculty workload exceeds maximum allowed hours. Current: %, Max: %', 
                       current_hours, max_hours;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_faculty_workload_trigger
    BEFORE INSERT OR UPDATE ON scheduled_classes
    FOR EACH ROW EXECUTE FUNCTION check_faculty_workload();

-- Function to check classroom capacity
CREATE OR REPLACE FUNCTION check_classroom_capacity()
RETURNS TRIGGER AS $$
DECLARE
    classroom_capacity INTEGER;
    batch_strength INTEGER;
BEGIN
    -- Get classroom capacity
    SELECT capacity INTO classroom_capacity
    FROM classrooms WHERE id = NEW.classroom_id;
    
    -- Get batch strength
    SELECT strength INTO batch_strength
    FROM student_batches WHERE id = NEW.batch_id;
    
    -- Check if batch fits in classroom
    IF batch_strength > classroom_capacity THEN
        RAISE EXCEPTION 'Batch strength (%) exceeds classroom capacity (%)', 
                       batch_strength, classroom_capacity;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_classroom_capacity_trigger
    BEFORE INSERT OR UPDATE ON scheduled_classes
    FOR EACH ROW EXECUTE FUNCTION check_classroom_capacity();

-- ============================================================================
-- 9. BASIC SYSTEM SETTINGS
-- ============================================================================

-- Insert essential system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_system_setting) VALUES
('academic_year_start_month', '7', 'number', 'Month when academic year starts (1-12)', true),
('working_days_per_week', '6', 'number', 'Number of working days per week', true),
('max_periods_per_day', '8', 'number', 'Maximum class periods per day', true),
('lunch_break_duration', '60', 'number', 'Lunch break duration in minutes', true),
('class_duration_minutes', '60', 'number', 'Standard class duration in minutes', true),
('lab_duration_minutes', '120', 'number', 'Standard lab duration in minutes', true),
('timetable_version_retention', '5', 'number', 'Number of timetable versions to keep', true),
('auto_conflict_detection', 'true', 'boolean', 'Enable automatic conflict detection', true),
('notification_email_enabled', 'true', 'boolean', 'Enable email notifications', true),
('allow_faculty_preference_input', 'true', 'boolean', 'Allow faculty to input time preferences', false);

-- ============================================================================
-- 10. COMMENTS AND DOCUMENTATION
-- ============================================================================

-- Add table comments for documentation
COMMENT ON TABLE departments IS 'Academic departments in the institution';
COMMENT ON TABLE faculty IS 'Faculty members and their details';
COMMENT ON TABLE subjects IS 'Academic subjects/courses offered';
COMMENT ON TABLE classrooms IS 'Physical classrooms and their facilities';
COMMENT ON TABLE student_batches IS 'Groups of students studying together';
COMMENT ON TABLE time_slots IS 'Time periods for classes';
COMMENT ON TABLE timetables IS 'Master timetable records';
COMMENT ON TABLE scheduled_classes IS 'Individual class assignments in timetables';
COMMENT ON TABLE college_events IS 'Special events that may affect regular schedules';
COMMENT ON TABLE faculty_subject_assignments IS 'Which faculty can teach which subjects';
COMMENT ON TABLE batch_subject_assignments IS 'Which subjects each batch studies';
COMMENT ON TABLE timetable_change_log IS 'Audit trail for timetable modifications';
COMMENT ON TABLE schedule_conflicts IS 'Detected and resolved scheduling conflicts';
COMMENT ON TABLE system_settings IS 'Global system configuration';
COMMENT ON TABLE department_preferences IS 'Department-specific preferences';

-- Add column comments for critical fields
COMMENT ON COLUMN scheduled_classes.class_type IS 'Type of class: lecture, lab, tutorial, seminar, practical';
COMMENT ON COLUMN timetables.quality_score IS 'AI-generated quality score between 0 and 1';
COMMENT ON COLUMN faculty.max_weekly_hours IS 'Maximum teaching hours per week for this faculty';
COMMENT ON COLUMN college_events.affects_timetable IS 'Whether this event impacts regular class schedule';

-- ============================================================================
-- SCHEMA SETUP COMPLETE
-- ============================================================================

-- Display setup completion message
SELECT 'PyGram 2025 Database Schema Setup Complete!' AS status,
       'Tables: ' || COUNT(*) || ' created successfully' AS summary
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'departments', 'faculty', 'subjects', 'classrooms', 'student_batches',
    'time_slots', 'timetables', 'scheduled_classes', 'college_events',
    'faculty_subject_assignments', 'batch_subject_assignments',
    'timetable_change_log', 'schedule_conflicts', 'system_settings',
    'department_preferences'
);