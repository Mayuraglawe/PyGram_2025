-- ============================================================================
-- SMART CLASSROOM & TIMETABLE SCHEDULING SYSTEM - COMPLETE DATABASE SCHEMA
-- Enhanced schema for College Management with Smart Classroom Integration
-- ============================================================================

-- ============================================================================
-- 1. USER MANAGEMENT SYSTEM (Core Authentication & Authorization)
-- ============================================================================

-- User Roles - Define different types of users in the system
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT,
    permissions JSONB, -- Store permissions as JSON array
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table - Central user management for all system users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    profile_picture_url TEXT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMPTZ,
    phone_verified_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Role Assignments - Many-to-many relationship between users and roles
CREATE TABLE user_role_assignments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES user_roles(id) ON DELETE CASCADE,
    department_id INTEGER, -- Will reference departments table
    assigned_by INTEGER REFERENCES users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT unique_user_role_dept UNIQUE(user_id, role_id, department_id)
);

-- ============================================================================
-- 2. ENHANCED ACADEMIC ENTITIES
-- ============================================================================

-- Departments table (Enhanced from your original)
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    head_of_department_id INTEGER, -- Will be linked to faculty later
    established_year INTEGER CHECK (established_year > 1900 AND established_year <= EXTRACT(YEAR FROM NOW())),
    contact_email VARCHAR(255) UNIQUE,
    contact_phone VARCHAR(50),
    website_url TEXT,
    building VARCHAR(100),
    floor_number INTEGER CHECK (floor_number > 0),
    budget_allocated DECIMAL(15,2) DEFAULT 0,
    student_capacity INTEGER DEFAULT 0,
    faculty_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Academic Programs - Degree programs offered by departments
CREATE TABLE academic_programs (
    id SERIAL PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    program_code VARCHAR(50) NOT NULL UNIQUE,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    degree_type VARCHAR(50) NOT NULL CHECK (degree_type IN ('Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate')),
    duration_years INTEGER NOT NULL CHECK (duration_years > 0),
    total_credits INTEGER NOT NULL CHECK (total_credits > 0),
    description TEXT,
    admission_requirements TEXT,
    career_prospects TEXT,
    accreditation_info TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Faculty table (Enhanced)
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    designation VARCHAR(100), -- Professor, Associate Professor, Assistant Professor, etc.
    qualification VARCHAR(500), -- Educational qualifications
    specialization TEXT, -- Areas of expertise
    experience_years INTEGER DEFAULT 0 CHECK (experience_years >= 0),
    joining_date DATE NOT NULL,
    salary DECIMAL(12,2),
    office_location VARCHAR(100),
    office_hours TEXT, -- JSON or text format for office hours
    research_interests TEXT,
    publications_count INTEGER DEFAULT 0,
    max_weekly_hours INTEGER DEFAULT 20 CHECK (max_weekly_hours > 0),
    preferred_subjects JSONB, -- Array of subject IDs they prefer to teach
    availability_schedule JSONB, -- Weekly availability schedule
    performance_rating DECIMAL(3,2) CHECK (performance_rating >= 0 AND performance_rating <= 5),
    is_coordinator BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table - Individual student records
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL UNIQUE, -- Roll number or student ID
    program_id INTEGER NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    admission_year INTEGER NOT NULL CHECK (admission_year > 2000),
    current_year INTEGER NOT NULL CHECK (current_year BETWEEN 1 AND 6),
    current_semester INTEGER NOT NULL CHECK (current_semester BETWEEN 1 AND 12),
    admission_type VARCHAR(50) CHECK (admission_type IN ('Regular', 'Lateral', 'Transfer', 'Foreign')),
    fee_status VARCHAR(50) DEFAULT 'Pending' CHECK (fee_status IN ('Paid', 'Pending', 'Partial', 'Defaulter')),
    gpa DECIMAL(4,2) CHECK (gpa >= 0 AND gpa <= 10),
    cgpa DECIMAL(4,2) CHECK (cgpa >= 0 AND cgpa <= 10),
    attendance_percentage DECIMAL(5,2) DEFAULT 0 CHECK (attendance_percentage >= 0 AND attendance_percentage <= 100),
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    guardian_email VARCHAR(255),
    blood_group VARCHAR(5),
    hostel_resident BOOLEAN DEFAULT false,
    hostel_room_number VARCHAR(20),
    transport_required BOOLEAN DEFAULT false,
    medical_conditions TEXT,
    is_active BOOLEAN DEFAULT true,
    graduation_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Staff table - Administrative personnel
CREATE TABLE admin_staff (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    designation VARCHAR(100) NOT NULL,
    responsibilities TEXT,
    access_level INTEGER DEFAULT 1 CHECK (access_level BETWEEN 1 AND 10),
    office_location VARCHAR(100),
    joining_date DATE NOT NULL,
    salary DECIMAL(12,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. SMART CLASSROOM SYSTEM
-- ============================================================================

-- Smart Classroom Equipment - Catalog of smart equipment
CREATE TABLE smart_equipment (
    id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(100) NOT NULL CHECK (equipment_type IN (
        'Smart Board', 'Projector', 'Audio System', 'Camera', 'Microphone',
        'Air Conditioner', 'Lighting', 'Computer', 'IoT Sensor', 'Network Device'
    )),
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    purchase_date DATE,
    warranty_period_months INTEGER DEFAULT 0,
    warranty_expiry DATE,
    purchase_cost DECIMAL(12,2),
    specifications JSONB, -- Technical specifications
    operating_instructions TEXT,
    maintenance_schedule JSONB, -- Maintenance intervals and procedures
    is_smart_enabled BOOLEAN DEFAULT false,
    iot_device_id VARCHAR(100), -- For IoT integration
    api_endpoint TEXT, -- For remote control
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Maintenance', 'Broken', 'Retired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced Classrooms table (Smart Classroom enabled)
CREATE TABLE classrooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL,
    room_name VARCHAR(100), -- Friendly name for the room
    building VARCHAR(100) NOT NULL,
    floor_number INTEGER CHECK (floor_number > 0),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    room_type VARCHAR(50) DEFAULT 'Lecture' CHECK (room_type IN (
        'Lecture', 'Lab', 'Seminar', 'Auditorium', 'Tutorial', 'Smart Classroom', 'Hybrid'
    )),
    area_sqm DECIMAL(8,2), -- Room area in square meters
    is_smart_enabled BOOLEAN DEFAULT false,
    is_hybrid_enabled BOOLEAN DEFAULT false, -- For online/offline hybrid classes
    has_live_streaming BOOLEAN DEFAULT false,
    has_recording_capability BOOLEAN DEFAULT false,
    max_online_participants INTEGER DEFAULT 0,
    wifi_ssid VARCHAR(100),
    wifi_password VARCHAR(255),
    room_controller_ip VARCHAR(45), -- IP address for room automation
    emergency_contact VARCHAR(20),
    accessibility_features TEXT,
    booking_policy TEXT,
    usage_cost_per_hour DECIMAL(8,2) DEFAULT 0,
    maintenance_notes TEXT,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    is_available BOOLEAN DEFAULT true,
    is_bookable BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(room_number, building)
);

-- Classroom Equipment Assignments - Link equipment to classrooms
CREATE TABLE classroom_equipment (
    id SERIAL PRIMARY KEY,
    classroom_id INTEGER NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    equipment_id INTEGER NOT NULL REFERENCES smart_equipment(id) ON DELETE CASCADE,
    installation_date DATE,
    location_in_room VARCHAR(100), -- Where in the room is this equipment
    is_operational BOOLEAN DEFAULT true,
    last_serviced_date DATE,
    next_service_date DATE,
    usage_hours INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_equipment_classroom UNIQUE(classroom_id, equipment_id)
);

-- Room Booking System
CREATE TABLE room_bookings (
    id SERIAL PRIMARY KEY,
    classroom_id INTEGER NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    booked_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_type VARCHAR(50) DEFAULT 'Regular' CHECK (booking_type IN (
        'Regular', 'Event', 'Maintenance', 'Emergency', 'External'
    )),
    purpose TEXT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    expected_participants INTEGER CHECK (expected_participants > 0),
    equipment_required JSONB, -- Array of required equipment
    special_requirements TEXT,
    booking_status VARCHAR(50) DEFAULT 'Pending' CHECK (booking_status IN (
        'Pending', 'Approved', 'Rejected', 'Confirmed', 'Cancelled', 'Completed'
    )),
    approved_by INTEGER REFERENCES users(id),
    approval_date TIMESTAMPTZ,
    rejection_reason TEXT,
    actual_participants INTEGER,
    feedback TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_booking_time CHECK (end_time > start_time)
);

-- Smart Classroom Usage Analytics
CREATE TABLE classroom_usage_analytics (
    id SERIAL PRIMARY KEY,
    classroom_id INTEGER NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    usage_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    actual_participants INTEGER DEFAULT 0,
    equipment_used JSONB, -- Array of equipment IDs used
    energy_consumption DECIMAL(10,2), -- kWh consumed
    temperature_avg DECIMAL(5,2), -- Average temperature
    humidity_avg DECIMAL(5,2), -- Average humidity
    noise_level_avg DECIMAL(5,2), -- Average noise level in dB
    air_quality_index INTEGER, -- Air quality rating
    feedback_score DECIMAL(3,2), -- Average user feedback
    issues_reported TEXT,
    maintenance_required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. ENHANCED TIMETABLE SYSTEM
-- ============================================================================

-- Student Batches table (Enhanced)
CREATE TABLE student_batches (
    id SERIAL PRIMARY KEY,
    batch_name VARCHAR(100) NOT NULL,
    batch_code VARCHAR(50) NOT NULL UNIQUE,
    program_id INTEGER NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 6),
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 12),
    section VARCHAR(10) DEFAULT 'A',
    current_strength INTEGER NOT NULL CHECK (current_strength >= 0),
    max_strength INTEGER NOT NULL CHECK (max_strength > 0),
    academic_year VARCHAR(20) NOT NULL,
    class_coordinator_id INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    mentor_id INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    intake_year INTEGER CHECK (intake_year > 2000),
    preferred_classroom_type VARCHAR(50),
    special_requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_strength CHECK (current_strength <= max_strength)
);

-- Subjects table (Enhanced)
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES academic_programs(id) ON DELETE SET NULL,
    credits INTEGER NOT NULL CHECK (credits > 0),
    theory_hours INTEGER DEFAULT 0 CHECK (theory_hours >= 0),
    lab_hours INTEGER DEFAULT 0 CHECK (lab_hours >= 0),
    tutorial_hours INTEGER DEFAULT 0 CHECK (tutorial_hours >= 0),
    requires_lab BOOLEAN DEFAULT false,
    requires_smart_classroom BOOLEAN DEFAULT false,
    semester INTEGER CHECK (semester BETWEEN 1 AND 12),
    year INTEGER CHECK (year BETWEEN 1 AND 6),
    subject_type VARCHAR(50) DEFAULT 'core' CHECK (subject_type IN ('core', 'elective', 'practical', 'project')),
    prerequisites JSONB, -- Array of prerequisite subject IDs
    learning_outcomes TEXT,
    syllabus TEXT,
    textbooks JSONB, -- Array of recommended textbooks
    reference_materials JSONB,
    assessment_pattern JSONB, -- Marks distribution
    minimum_attendance_required DECIMAL(5,2) DEFAULT 75.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time Slots table (Enhanced)
CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    slot_name VARCHAR(50) NOT NULL, -- e.g., "Period 1", "Lab Session A"
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_type VARCHAR(20) DEFAULT 'regular' CHECK (slot_type IN ('regular', 'lab', 'tutorial', 'break', 'lunch', 'exam')),
    duration_minutes INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time))/60) STORED,
    is_break_time BOOLEAN DEFAULT false,
    break_type VARCHAR(20) CHECK (break_type IN ('Short', 'Lunch', 'Tea')),
    priority_level INTEGER DEFAULT 1 CHECK (priority_level BETWEEN 1 AND 10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    CONSTRAINT unique_day_time UNIQUE(day_of_week, start_time, end_time)
);

-- Timetables table (Enhanced)
CREATE TABLE timetables (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    program_id INTEGER REFERENCES academic_programs(id) ON DELETE SET NULL,
    academic_year VARCHAR(20) NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 12),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'archived', 'cancelled')),
    version INTEGER DEFAULT 1,
    previous_version_id INTEGER REFERENCES timetables(id),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    published_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- AI/Algorithm metrics
    generation_algorithm VARCHAR(100), -- AI algorithm used
    quality_score DECIMAL(5,4) CHECK (quality_score >= 0 AND quality_score <= 1),
    optimization_score DECIMAL(5,4) CHECK (optimization_score >= 0 AND optimization_score <= 1),
    generation_time_seconds INTEGER,
    conflict_count INTEGER DEFAULT 0,
    
    -- Effectiveness metrics
    resource_utilization DECIMAL(5,4), -- Classroom/faculty utilization rate
    student_satisfaction_score DECIMAL(3,2),
    faculty_satisfaction_score DECIMAL(3,2),
    
    -- Dates and validity
    effective_from DATE,
    effective_to DATE,
    approval_deadline DATE,
    
    -- Additional information
    optimization_notes TEXT,
    approval_notes TEXT,
    rejection_reason TEXT,
    
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    
    CONSTRAINT valid_effective_period CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

-- Scheduled Classes table (Enhanced)
CREATE TABLE scheduled_classes (
    id SERIAL PRIMARY KEY,
    timetable_id INTEGER NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    time_slot_id INTEGER NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    faculty_id INTEGER NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    batch_id INTEGER NOT NULL REFERENCES student_batches(id) ON DELETE CASCADE,
    classroom_id INTEGER NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    
    -- Class details
    class_type VARCHAR(20) DEFAULT 'lecture' CHECK (class_type IN ('lecture', 'lab', 'tutorial', 'seminar', 'practical', 'exam', 'project')),
    week_pattern VARCHAR(20) DEFAULT 'weekly' CHECK (week_pattern IN ('weekly', 'biweekly', 'monthly', 'alternate')),
    recurring BOOLEAN DEFAULT true,
    
    -- Smart classroom features
    is_hybrid_class BOOLEAN DEFAULT false,
    recording_required BOOLEAN DEFAULT false,
    live_streaming_required BOOLEAN DEFAULT false,
    equipment_required JSONB, -- Array of required equipment IDs
    
    -- Attendance and participation
    expected_attendance INTEGER,
    attendance_mandatory BOOLEAN DEFAULT true,
    
    -- Additional information
    topic VARCHAR(255),
    learning_objective TEXT,
    preparation_notes TEXT,
    special_instructions TEXT,
    
    -- Status and tracking
    class_status VARCHAR(50) DEFAULT 'scheduled' CHECK (class_status IN (
        'scheduled', 'ongoing', 'completed', 'cancelled', 'postponed', 'rescheduled'
    )),
    cancellation_reason TEXT,
    reschedule_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    conducted_at TIMESTAMPTZ,
    
    -- Prevent conflicts
    CONSTRAINT unique_faculty_timeslot UNIQUE(timetable_id, faculty_id, time_slot_id),
    CONSTRAINT unique_classroom_timeslot UNIQUE(timetable_id, classroom_id, time_slot_id),
    CONSTRAINT unique_batch_timeslot UNIQUE(timetable_id, batch_id, time_slot_id)
);

-- ============================================================================
-- 5. ATTENDANCE AND ASSESSMENT SYSTEM
-- ============================================================================

-- Class Attendance Records
CREATE TABLE class_attendance (
    id SERIAL PRIMARY KEY,
    scheduled_class_id INTEGER NOT NULL REFERENCES scheduled_classes(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    attendance_status VARCHAR(20) DEFAULT 'absent' CHECK (attendance_status IN ('present', 'absent', 'late', 'excused')),
    arrival_time TIME,
    departure_time TIME,
    attendance_mode VARCHAR(20) DEFAULT 'physical' CHECK (attendance_mode IN ('physical', 'online', 'hybrid')),
    marked_by INTEGER REFERENCES users(id), -- Who marked the attendance
    marking_method VARCHAR(50) CHECK (marking_method IN ('manual', 'biometric', 'rfid', 'qr_code', 'face_recognition')),
    device_info TEXT, -- Information about the device used for marking
    location_coordinates POINT, -- GPS coordinates if applicable
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_student_class_attendance UNIQUE(scheduled_class_id, student_id)
);

-- Assignments and Assessments
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    batch_id INTEGER NOT NULL REFERENCES student_batches(id) ON DELETE CASCADE,
    faculty_id INTEGER NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assignment_type VARCHAR(50) CHECK (assignment_type IN ('homework', 'project', 'quiz', 'exam', 'presentation', 'lab_report')),
    total_marks INTEGER NOT NULL CHECK (total_marks > 0),
    weightage DECIMAL(5,2) DEFAULT 0 CHECK (weightage >= 0 AND weightage <= 100),
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    submission_method VARCHAR(50) CHECK (submission_method IN ('online', 'physical', 'hybrid')),
    instructions TEXT,
    rubric JSONB, -- Grading rubric
    is_group_assignment BOOLEAN DEFAULT false,
    max_group_size INTEGER,
    late_submission_allowed BOOLEAN DEFAULT false,
    late_penalty_percentage DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_due_date CHECK (due_date >= assigned_date)
);

-- Student Submissions
CREATE TABLE assignment_submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    submission_content TEXT,
    file_attachments JSONB, -- Array of file URLs/paths
    submission_status VARCHAR(50) DEFAULT 'submitted' CHECK (submission_status IN ('draft', 'submitted', 'graded', 'returned')),
    is_late_submission BOOLEAN DEFAULT false,
    plagiarism_score DECIMAL(5,2), -- Plagiarism check score
    marks_obtained DECIMAL(6,2),
    feedback TEXT,
    graded_by INTEGER REFERENCES faculty(id),
    graded_at TIMESTAMPTZ,
    
    CONSTRAINT unique_student_assignment UNIQUE(assignment_id, student_id),
    CONSTRAINT valid_marks CHECK (marks_obtained >= 0)
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
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Department Preferences - Department-specific settings
CREATE TABLE department_preferences (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    academic_year VARCHAR(20),
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_dept_preference UNIQUE(department_id, preference_key, academic_year)
);

-- ============================================================================
-- 7. COMMUNICATION AND NOTIFICATION SYSTEM
-- ============================================================================

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN (
        'timetable_change', 'class_cancelled', 'assignment_due', 'grade_posted',
        'event_reminder', 'system_alert', 'announcement', 'fee_reminder'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    delivery_method VARCHAR(50) DEFAULT 'app' CHECK (delivery_method IN ('app', 'email', 'sms', 'push')),
    related_entity_type VARCHAR(50), -- e.g., 'scheduled_class', 'assignment'
    related_entity_id INTEGER,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    is_archived BOOLEAN DEFAULT false,
    scheduled_for TIMESTAMPTZ, -- For scheduled notifications
    sent_at TIMESTAMPTZ,
    delivery_status VARCHAR(50) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(50) CHECK (announcement_type IN (
        'general', 'academic', 'administrative', 'event', 'emergency', 'maintenance'
    )),
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_audience VARCHAR(50) DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'faculty', 'staff', 'department')),
    target_department_id INTEGER REFERENCES departments(id),
    target_program_id INTEGER REFERENCES academic_programs(id),
    target_year INTEGER,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    is_pinned BOOLEAN DEFAULT false,
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_until DATE,
    view_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. PERFORMANCE INDEXES
-- ============================================================================

-- User management indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_user_role_assignments_user ON user_role_assignments(user_id);
CREATE INDEX idx_user_role_assignments_role ON user_role_assignments(role_id);

-- Academic entity indexes
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_program ON students(program_id);
CREATE INDEX idx_students_department ON students(department_id);
CREATE INDEX idx_students_year_semester ON students(current_year, current_semester);

CREATE INDEX idx_faculty_user ON faculty(user_id);
CREATE INDEX idx_faculty_department ON faculty(department_id);
CREATE INDEX idx_faculty_employee_id ON faculty(employee_id);

CREATE INDEX idx_admin_staff_user ON admin_staff(user_id);
CREATE INDEX idx_admin_staff_department ON admin_staff(department_id);

-- Smart classroom indexes
CREATE INDEX idx_classrooms_smart_enabled ON classrooms(is_smart_enabled);
CREATE INDEX idx_classrooms_building_room ON classrooms(building, room_number);
CREATE INDEX idx_classrooms_type_capacity ON classrooms(room_type, capacity);
CREATE INDEX idx_classroom_equipment_classroom ON classroom_equipment(classroom_id);
CREATE INDEX idx_room_bookings_classroom_date ON room_bookings(classroom_id, booking_date);
CREATE INDEX idx_room_bookings_status ON room_bookings(booking_status);

-- Timetable indexes
CREATE INDEX idx_scheduled_classes_timetable ON scheduled_classes(timetable_id);
CREATE INDEX idx_scheduled_classes_faculty ON scheduled_classes(faculty_id);
CREATE INDEX idx_scheduled_classes_batch ON scheduled_classes(batch_id);
CREATE INDEX idx_scheduled_classes_classroom ON scheduled_classes(classroom_id);
CREATE INDEX idx_scheduled_classes_timeslot ON scheduled_classes(time_slot_id);
CREATE INDEX idx_scheduled_classes_subject ON scheduled_classes(subject_id);

-- Attendance indexes
CREATE INDEX idx_class_attendance_class ON class_attendance(scheduled_class_id);
CREATE INDEX idx_class_attendance_student ON class_attendance(student_id);
CREATE INDEX idx_class_attendance_status ON class_attendance(attendance_status);

-- Communication indexes
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_type_priority ON notifications(notification_type, priority);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_announcements_published ON announcements(is_published);
CREATE INDEX idx_announcements_target ON announcements(target_audience, target_department_id);

-- System configuration indexes
CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX idx_system_settings_type ON system_settings(setting_type);
CREATE INDEX idx_department_preferences_dept ON department_preferences(department_id);
CREATE INDEX idx_department_preferences_key ON department_preferences(preference_key);

-- ============================================================================
-- 9. TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_staff_updated_at BEFORE UPDATE ON admin_staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classrooms_updated_at BEFORE UPDATE ON classrooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timetables_updated_at BEFORE UPDATE ON timetables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scheduled_classes_updated_at BEFORE UPDATE ON scheduled_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_department_preferences_updated_at BEFORE UPDATE ON department_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key constraints after all tables are created
ALTER TABLE user_role_assignments ADD CONSTRAINT fk_user_role_assignments_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;
ALTER TABLE departments ADD CONSTRAINT fk_departments_hod FOREIGN KEY (head_of_department_id) REFERENCES faculty(id) ON DELETE SET NULL;

-- ============================================================================
-- 10. INITIAL DATA SETUP
-- ============================================================================

-- Insert default user roles
INSERT INTO user_roles (role_name, role_description, permissions) VALUES
('Super Admin', 'Full system access', '["all"]'),
('Admin', 'Administrative access', '["manage_users", "manage_departments", "manage_timetables", "view_reports"]'),
('Faculty', 'Teaching staff access', '["view_timetables", "mark_attendance", "create_assignments", "grade_submissions"]'),
('Student', 'Student access', '["view_timetables", "submit_assignments", "view_grades", "view_attendance"]'),
('HOD', 'Head of Department access', '["manage_department", "approve_timetables", "view_department_reports"]'),
('Coordinator', 'Program coordinator access', '["manage_program", "coordinate_activities"]'),
('Support Staff', 'Technical support access', '["manage_equipment", "handle_bookings"]');

-- Insert default system settings (from your original schema)
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_system_setting) VALUES
('academic_year_start_month', '7', 'number', 'Month when academic year starts (1-12)', true),
('working_days_per_week', '6', 'number', 'Number of working days per week', true),
('max_periods_per_day', '8', 'number', 'Maximum class periods per day', true),
('lunch_break_duration', '60', 'number', 'Lunch break duration in minutes', true),
('class_duration_minutes', '60', 'number', 'Standard class duration in minutes', true),
('lab_duration_minutes', '120', 'number', 'Standard lab duration in minutes', true),
('tutorial_duration_minutes', '60', 'number', 'Standard tutorial duration in minutes', true),
('minimum_break_between_classes', '10', 'number', 'Minimum break between classes in minutes', true),
('max_continuous_hours_faculty', '4', 'number', 'Maximum continuous teaching hours for faculty', true),
('max_daily_hours_student', '8', 'number', 'Maximum daily class hours for students', true),
('smart_classroom_booking_advance_days', '30', 'number', 'How many days in advance smart classrooms can be booked', true),
('attendance_marking_window_minutes', '30', 'number', 'Time window for marking attendance', true),
('auto_conflict_detection', 'true', 'boolean', 'Enable automatic conflict detection', true),
('notification_email_enabled', 'true', 'boolean', 'Enable email notifications', true),
('notification_sms_enabled', 'false', 'boolean', 'Enable SMS notifications', true),
('smart_equipment_monitoring', 'true', 'boolean', 'Enable IoT equipment monitoring', true),
('energy_consumption_tracking', 'true', 'boolean', 'Track classroom energy consumption', true),
('facial_recognition_attendance', 'false', 'boolean', 'Enable facial recognition for attendance', true),
('plagiarism_check_enabled', 'true', 'boolean', 'Enable plagiarism checking for submissions', true);

-- ============================================================================
-- SCHEMA SETUP COMPLETE
-- ============================================================================

SELECT 'Smart Classroom & Timetable Scheduling System Database Schema Setup Complete!' AS status,
       'Tables: ' || COUNT(*) || ' created successfully' AS summary
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Display all created tables
SELECT table_name, 
       CASE 
           WHEN table_name LIKE '%user%' OR table_name = 'students' OR table_name = 'faculty' OR table_name = 'admin_staff' THEN 'User Management'
           WHEN table_name LIKE '%classroom%' OR table_name LIKE '%equipment%' OR table_name LIKE '%booking%' THEN 'Smart Classroom'
           WHEN table_name LIKE '%timetable%' OR table_name LIKE '%scheduled%' OR table_name LIKE '%time_slot%' THEN 'Timetable System'
           WHEN table_name LIKE '%attendance%' OR table_name LIKE '%assignment%' THEN 'Academic Management'
           WHEN table_name LIKE '%notification%' OR table_name LIKE '%announcement%' THEN 'Communication'
           ELSE 'Core Academic'
       END AS category
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY category, table_name;