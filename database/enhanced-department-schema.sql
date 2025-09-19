-- Enhanced Departmental Workspace Schema for Py-Gram 2k25
-- This schema provides complete isolation between departments

-- ============================================================================
-- CORE DEPARTMENT SYSTEM
-- ============================================================================

-- Departments table (primary department registry)
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    color_theme VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for department branding
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    max_students INTEGER NOT NULL DEFAULT 60,
    max_mentors INTEGER NOT NULL DEFAULT 2,
    -- Department contact information
    head_of_department VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enhanced Users table with department isolation
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Basic user information
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    
    -- Role and department assignment
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'mentor', 'student')),
    mentor_type VARCHAR(20) CHECK (mentor_type IN ('creator', 'publisher', 'general') OR mentor_type IS NULL),
    primary_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    
    -- Student/Employee IDs
    student_id VARCHAR(50),
    employee_id VARCHAR(50),
    
    -- Account status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    
    -- Profile information
    avatar_url TEXT,
    bio TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints
    UNIQUE(primary_department_id, student_id) WHERE student_id IS NOT NULL,
    UNIQUE(primary_department_id, employee_id) WHERE employee_id IS NOT NULL
);

-- Department memberships (users can belong to multiple departments with different roles)
CREATE TABLE IF NOT EXISTS department_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('mentor', 'student', 'admin')),
    mentor_type VARCHAR(20) CHECK (mentor_type IN ('creator', 'publisher', 'general')),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Ensure each user has only one primary department
    UNIQUE(user_id, department_id),
    EXCLUDE (user_id WITH =) WHERE (is_primary = TRUE)
);

-- ============================================================================
-- DEPARTMENT-SPECIFIC DATA TABLES
-- ============================================================================

-- Department-specific faculty (replaces global faculty table)
CREATE TABLE IF NOT EXISTS department_faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    designation VARCHAR(100),
    qualification VARCHAR(255),
    specialization TEXT,
    experience_years INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Ensure faculty belongs to their user's department
    UNIQUE(department_id, employee_id),
    UNIQUE(department_id, user_id)
);

-- Department-specific subjects
CREATE TABLE IF NOT EXISTS department_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL CHECK (credits > 0),
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    year INTEGER NOT NULL CHECK (year > 0),
    lectures_per_week INTEGER NOT NULL DEFAULT 0 CHECK (lectures_per_week >= 0),
    labs_per_week INTEGER NOT NULL DEFAULT 0 CHECK (labs_per_week >= 0),
    requires_lab BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW') NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Subject codes must be unique within a department
    UNIQUE(department_id, code)
);

-- Department-specific classrooms
CREATE TABLE IF NOT EXISTS department_classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    building VARCHAR(100),
    floor INTEGER,
    room_number VARCHAR(20),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    type VARCHAR(20) NOT NULL CHECK (type IN ('Lecture', 'Lab', 'Seminar', 'Conference')),
    -- Equipment and features
    has_projector BOOLEAN NOT NULL DEFAULT FALSE,
    has_smartboard BOOLEAN NOT NULL DEFAULT FALSE,
    has_ac BOOLEAN NOT NULL DEFAULT FALSE,
    has_wifi BOOLEAN NOT NULL DEFAULT TRUE,
    equipment_list TEXT, -- JSON or comma-separated list
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Classroom names must be unique within a department
    UNIQUE(department_id, name),
    UNIQUE(department_id, building, floor, room_number) WHERE room_number IS NOT NULL
);

-- Department-specific student batches
CREATE TABLE IF NOT EXISTS department_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL CHECK (year > 1900),
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    academic_year VARCHAR(20) NOT NULL, -- e.g., "2024-25"
    strength INTEGER NOT NULL CHECK (strength > 0),
    current_strength INTEGER NOT NULL DEFAULT 0 CHECK (current_strength >= 0),
    class_teacher_id UUID REFERENCES department_faculty(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Batch names must be unique within a department for the same academic year
    UNIQUE(department_id, name, academic_year)
);

-- ============================================================================
-- CONTENT ISOLATION TABLES
-- ============================================================================

-- Department-specific events
CREATE TABLE IF NOT EXISTS department_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL DEFAULT 'General',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    venue VARCHAR(255),
    max_participants INTEGER,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    is_public BOOLEAN NOT NULL DEFAULT FALSE, -- Whether visible to other departments
    requires_approval BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Approved', 'Rejected', 'Cancelled')),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Ensure creator belongs to the same department
    CHECK (end_date > start_date)
);

-- Department-specific timetables
CREATE TABLE IF NOT EXISTS department_timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    effective_from DATE NOT NULL,
    effective_to DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Under Review', 'Approved', 'Published', 'Archived')),
    version INTEGER NOT NULL DEFAULT 1,
    quality_score DECIMAL(3,2) DEFAULT 0.0 CHECK (quality_score >= 0.0 AND quality_score <= 1.0),
    -- Workflow tracking
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Creator
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Publisher
    published_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Only one active timetable per department-semester-academic year
    UNIQUE(department_id, academic_year, semester, status) WHERE status = 'Published'
);

-- ============================================================================
-- USER SESSION AND PREFERENCES
-- ============================================================================

-- User sessions with department context
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    active_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Department-specific user preferences
CREATE TABLE IF NOT EXISTS department_user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    preferences JSONB NOT NULL DEFAULT '{}',
    dashboard_layout JSONB,
    notification_settings JSONB,
    theme_preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(user_id, department_id)
);

-- ============================================================================
-- AUDIT AND SECURITY TABLES
-- ============================================================================

-- Department access audit log
CREATE TABLE IF NOT EXISTS department_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    error_message TEXT,
    additional_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Cross-department data sharing permissions
CREATE TABLE IF NOT EXISTS department_sharing_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    target_department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL, -- 'events', 'timetables', 'announcements'
    permission_level VARCHAR(20) NOT NULL CHECK (permission_level IN ('read', 'read_write', 'admin')),
    granted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(source_department_id, target_department_id, resource_type)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User and department indexes
CREATE INDEX IF NOT EXISTS idx_users_primary_department ON users(primary_department_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Department membership indexes
CREATE INDEX IF NOT EXISTS idx_dept_memberships_user ON department_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_dept_memberships_dept ON department_memberships(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_memberships_role ON department_memberships(role);

-- Department-specific data indexes
CREATE INDEX IF NOT EXISTS idx_dept_faculty_dept ON department_faculty(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_faculty_user ON department_faculty(user_id);
CREATE INDEX IF NOT EXISTS idx_dept_subjects_dept ON department_subjects(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_classrooms_dept ON department_classrooms(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_batches_dept ON department_batches(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_events_dept ON department_events(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_timetables_dept ON department_timetables(department_id);

-- Session and audit indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_dept_access_logs_user ON department_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_dept_access_logs_dept ON department_access_logs(department_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_access_logs ENABLE ROW LEVEL SECURITY;

-- Department isolation policies
-- Users can only see departments they belong to (except admins)
CREATE POLICY "users_can_see_own_departments" ON departments
    FOR SELECT
    USING (
        auth.role() = 'admin' OR
        id IN (
            SELECT department_id 
            FROM department_memberships 
            WHERE user_id = auth.uid()
        )
    );

-- Users can only see other users from their departments
CREATE POLICY "users_see_departmental_users" ON users
    FOR SELECT
    USING (
        auth.role() = 'admin' OR
        auth.uid() = id OR
        primary_department_id IN (
            SELECT department_id 
            FROM department_memberships 
            WHERE user_id = auth.uid()
        )
    );

-- Department-specific data policies
CREATE POLICY "dept_faculty_isolation" ON department_faculty
    FOR ALL
    USING (
        auth.role() = 'admin' OR
        department_id IN (
            SELECT department_id 
            FROM department_memberships 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "dept_subjects_isolation" ON department_subjects
    FOR ALL
    USING (
        auth.role() = 'admin' OR
        department_id IN (
            SELECT department_id 
            FROM department_memberships 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "dept_classrooms_isolation" ON department_classrooms
    FOR ALL
    USING (
        auth.role() = 'admin' OR
        department_id IN (
            SELECT department_id 
            FROM department_memberships 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "dept_batches_isolation" ON department_batches
    FOR ALL
    USING (
        auth.role() = 'admin' OR
        department_id IN (
            SELECT department_id 
            FROM department_memberships 
            WHERE user_id = auth.uid()
        )
    );

-- Event isolation (can see public events from other departments)
CREATE POLICY "dept_events_isolation" ON department_events
    FOR SELECT
    USING (
        auth.role() = 'admin' OR
        is_public = TRUE OR
        department_id IN (
            SELECT department_id 
            FROM department_memberships 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "dept_events_modification" ON department_events
    FOR ALL
    USING (
        auth.role() = 'admin' OR
        department_id IN (
            SELECT department_id 
            FROM department_memberships 
            WHERE user_id = auth.uid() 
            AND role IN ('mentor', 'admin')
        )
    );

-- Timetable isolation
CREATE POLICY "dept_timetables_isolation" ON department_timetables
    FOR ALL
    USING (
        auth.role() = 'admin' OR
        department_id IN (
            SELECT department_id 
            FROM department_memberships 
            WHERE user_id = auth.uid()
        )
    );

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_departments_updated_at 
    BEFORE UPDATE ON departments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_faculty_updated_at 
    BEFORE UPDATE ON department_faculty 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_subjects_updated_at 
    BEFORE UPDATE ON department_subjects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_classrooms_updated_at 
    BEFORE UPDATE ON department_classrooms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_batches_updated_at 
    BEFORE UPDATE ON department_batches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_events_updated_at 
    BEFORE UPDATE ON department_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_timetables_updated_at 
    BEFORE UPDATE ON department_timetables 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure department membership consistency
CREATE OR REPLACE FUNCTION ensure_department_membership()
RETURNS TRIGGER AS $$
BEGIN
    -- When a user's primary department is set, ensure they have membership
    IF NEW.primary_department_id IS NOT NULL THEN
        INSERT INTO department_memberships (user_id, department_id, role, is_primary)
        VALUES (NEW.id, NEW.primary_department_id, NEW.role, TRUE)
        ON CONFLICT (user_id, department_id) DO UPDATE SET
            is_primary = TRUE,
            role = EXCLUDED.role;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER ensure_user_dept_membership 
    AFTER INSERT OR UPDATE OF primary_department_id ON users 
    FOR EACH ROW EXECUTE FUNCTION ensure_department_membership();

-- Function to log department access
CREATE OR REPLACE FUNCTION log_department_access()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO department_access_logs (
        user_id, 
        department_id, 
        action, 
        resource_type, 
        resource_id
    ) VALUES (
        auth.uid(),
        COALESCE(NEW.department_id, OLD.department_id),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id)
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply access logging to key tables
CREATE TRIGGER log_dept_events_access 
    AFTER INSERT OR UPDATE OR DELETE ON department_events 
    FOR EACH ROW EXECUTE FUNCTION log_department_access();

CREATE TRIGGER log_dept_timetables_access 
    AFTER INSERT OR UPDATE OR DELETE ON department_timetables 
    FOR EACH ROW EXECUTE FUNCTION log_department_access();

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert default departments
INSERT INTO departments (name, code, description, color_theme, max_students, max_mentors) VALUES
('Computer Science & Engineering', 'CSE', 'Computer Science and Engineering Department', '#3B82F6', 60, 2),
('Mechanical Engineering', 'MECH', 'Mechanical Engineering Department', '#10B981', 60, 2),
('Civil Engineering', 'CIVIL', 'Civil Engineering Department', '#F59E0B', 60, 2),
('Electrical Engineering', 'EEE', 'Electrical and Electronics Engineering Department', '#EF4444', 60, 2),
('Electronics & Telecommunication', 'EXTC', 'Electronics and Telecommunication Engineering Department', '#8B5CF6', 60, 2)
ON CONFLICT (code) DO NOTHING;

-- Create admin user (can access all departments)
INSERT INTO users (
    username, email, password_hash, first_name, last_name, 
    role, is_active, email_verified
) VALUES (
    'admin', 'admin@college.edu', '$2b$10$dummy_hash', 'System', 'Administrator',
    'admin', TRUE, TRUE
) ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- VIEWS FOR EASIER DATA ACCESS
-- ============================================================================

-- View for user's department information
CREATE OR REPLACE VIEW user_department_view AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    u.mentor_type,
    d.id as department_id,
    d.name as department_name,
    d.code as department_code,
    d.color_theme,
    dm.is_primary
FROM users u
JOIN department_memberships dm ON u.id = dm.user_id
JOIN departments d ON dm.department_id = d.id
WHERE u.is_active = TRUE AND d.is_active = TRUE;

-- View for department statistics
CREATE OR REPLACE VIEW department_stats_view AS
SELECT 
    d.id,
    d.name,
    d.code,
    COUNT(CASE WHEN dm.role = 'student' THEN 1 END) as student_count,
    COUNT(CASE WHEN dm.role = 'mentor' THEN 1 END) as mentor_count,
    d.max_students,
    d.max_mentors,
    (d.max_students - COUNT(CASE WHEN dm.role = 'student' THEN 1 END)) as available_student_seats,
    (d.max_mentors - COUNT(CASE WHEN dm.role = 'mentor' THEN 1 END)) as available_mentor_seats
FROM departments d
LEFT JOIN department_memberships dm ON d.id = dm.department_id
LEFT JOIN users u ON dm.user_id = u.id AND u.is_active = TRUE
WHERE d.is_active = TRUE
GROUP BY d.id, d.name, d.code, d.max_students, d.max_mentors;

-- Comments for documentation
COMMENT ON TABLE departments IS 'Core department registry with branding and configuration';
COMMENT ON TABLE users IS 'Enhanced user table with department assignment and role management';
COMMENT ON TABLE department_memberships IS 'Many-to-many relationship between users and departments';
COMMENT ON TABLE department_faculty IS 'Department-specific faculty information';
COMMENT ON TABLE department_subjects IS 'Subjects isolated by department';
COMMENT ON TABLE department_classrooms IS 'Classrooms isolated by department';
COMMENT ON TABLE department_batches IS 'Student batches isolated by department';
COMMENT ON TABLE department_events IS 'Events with department isolation and optional cross-department visibility';
COMMENT ON TABLE department_timetables IS 'Timetables with complete department isolation';
COMMENT ON TABLE department_access_logs IS 'Audit trail for department data access';