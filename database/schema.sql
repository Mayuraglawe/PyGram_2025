-- Py-Gram 2k25 Database Schema
-- Run this in your Supabase SQL editor to create the required tables

-- Enable RLS (Row Level Security) by default
-- You can customize these policies based on your auth requirements

-- Faculty table
CREATE TABLE faculty (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    user_id BIGINT REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Subjects table
CREATE TABLE subjects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL CHECK (credits > 0),
    lectures_per_week INTEGER NOT NULL DEFAULT 0 CHECK (lectures_per_week >= 0),
    labs_per_week INTEGER NOT NULL DEFAULT 0 CHECK (labs_per_week >= 0),
    requires_lab BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Classrooms table
CREATE TABLE classrooms (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    type VARCHAR(20) NOT NULL CHECK (type IN ('Lecture', 'Lab')),
    has_projector BOOLEAN NOT NULL DEFAULT FALSE,
    has_smartboard BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Student batches table
CREATE TABLE student_batches (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL CHECK (year > 1900),
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    strength INTEGER NOT NULL CHECK (strength > 0),
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(name, year, semester)
);

-- Junction table for batch-subject relationships
CREATE TABLE batch_subjects (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL REFERENCES student_batches(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(batch_id, subject_id)
);

-- Time slots table
CREATE TABLE time_slots (
    id BIGSERIAL PRIMARY KEY,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CHECK (end_time > start_time),
    UNIQUE(day_of_week, start_time, end_time)
);

-- Timetables table
CREATE TABLE timetables (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending Approval', 'Approved', 'Archived')),
    created_by BIGINT REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    quality_score DECIMAL(3,2) DEFAULT 0.0 CHECK (quality_score >= 0.0 AND quality_score <= 1.0)
);

-- Scheduled classes table
CREATE TABLE scheduled_classes (
    id BIGSERIAL PRIMARY KEY,
    timetable_id BIGINT NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    faculty_id BIGINT NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    student_batch_id BIGINT NOT NULL REFERENCES student_batches(id) ON DELETE CASCADE,
    classroom_id BIGINT NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    timeslot_id BIGINT NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    class_type VARCHAR(10) NOT NULL CHECK (class_type IN ('Lecture', 'Lab')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints to prevent conflicts
    UNIQUE(timetable_id, faculty_id, timeslot_id),           -- Faculty can't be in two places at once
    UNIQUE(timetable_id, classroom_id, timeslot_id),         -- Classroom can't host two classes at once
    UNIQUE(timetable_id, student_batch_id, timeslot_id)      -- Batch can't attend two classes at once
);

-- Generation tasks table (for async timetable generation)
CREATE TABLE generation_tasks (
    id TEXT PRIMARY KEY,
    status VARCHAR(10) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILURE')),
    progress VARCHAR(10) DEFAULT '0%',
    error TEXT,
    new_timetable_id BIGINT REFERENCES timetables(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classrooms_updated_at BEFORE UPDATE ON classrooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_batches_updated_at BEFORE UPDATE ON student_batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timetables_updated_at BEFORE UPDATE ON timetables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generation_tasks_updated_at BEFORE UPDATE ON generation_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_faculty_department ON faculty(department);
CREATE INDEX idx_faculty_employee_id ON faculty(employee_id);
CREATE INDEX idx_subjects_department ON subjects(department);
CREATE INDEX idx_subjects_code ON subjects(code);
CREATE INDEX idx_classrooms_type ON classrooms(type);
CREATE INDEX idx_student_batches_department ON student_batches(department);
CREATE INDEX idx_student_batches_year_semester ON student_batches(year, semester);
CREATE INDEX idx_time_slots_day_time ON time_slots(day_of_week, start_time);
CREATE INDEX idx_scheduled_classes_timetable ON scheduled_classes(timetable_id);
CREATE INDEX idx_scheduled_classes_faculty_timeslot ON scheduled_classes(faculty_id, timeslot_id);
CREATE INDEX idx_scheduled_classes_classroom_timeslot ON scheduled_classes(classroom_id, timeslot_id);
CREATE INDEX idx_scheduled_classes_batch_timeslot ON scheduled_classes(student_batch_id, timeslot_id);
CREATE INDEX idx_generation_tasks_status ON generation_tasks(status);

-- Enable Row Level Security (RLS) - customize these policies as needed
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_tasks ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you can customize these based on your auth requirements)
-- For now, allow authenticated users to read/write everything
-- In production, you might want more granular policies

CREATE POLICY "Allow authenticated users to read faculty" ON faculty FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify faculty" ON faculty FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read subjects" ON subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify subjects" ON subjects FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read classrooms" ON classrooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify classrooms" ON classrooms FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read student_batches" ON student_batches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify student_batches" ON student_batches FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read batch_subjects" ON batch_subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify batch_subjects" ON batch_subjects FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read time_slots" ON time_slots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify time_slots" ON time_slots FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read timetables" ON timetables FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify timetables" ON timetables FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read scheduled_classes" ON scheduled_classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify scheduled_classes" ON scheduled_classes FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read generation_tasks" ON generation_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify generation_tasks" ON generation_tasks FOR ALL TO authenticated USING (true);