/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// ===== DATABASE MODEL TYPES =====

// Base types for all models
export interface BaseModel {
  id: number;
  created_at: string;
  updated_at: string;
}

// Department types
export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  head_of_department_id?: number | null;
  established_year?: number | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  building?: string | null;
  floor_number?: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string | null;
  head_of_department_id?: number | null;
  established_year?: number | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  building?: string | null;
  floor_number?: number | null;
}

export interface UpdateDepartmentRequest extends Partial<CreateDepartmentRequest> {}

// Faculty types
export interface Faculty extends BaseModel {
  name: string;
  employee_id: string;
  department_id: number;
  email?: string | null;
  phone_number?: string | null;
  designation?: string | null;
  qualification?: string | null;
  specialization?: string | null;
  experience_years?: number | null;
  joining_date?: string | null;
  office_location?: string | null;
  max_weekly_hours?: number | null;
  is_active: boolean;
  user_id?: string | null;
  deleted_at?: string | null;
}

export interface CreateFacultyRequest {
  name: string;
  employee_id: string;
  department_id: number;
  email?: string | null;
  phone_number?: string | null;
  designation?: string | null;
  qualification?: string | null;
  specialization?: string | null;
  experience_years?: number | null;
  joining_date?: string | null;
  office_location?: string | null;
  max_weekly_hours?: number | null;
  user_id?: string | null;
}

export interface UpdateFacultyRequest extends Partial<CreateFacultyRequest> {}

// Subject types
export interface Subject extends BaseModel {
  name: string;
  code: string;
  department_id: number;
  credits: number;
  lectures_per_week: number;
  labs_per_week: number;
  requires_lab: boolean;
  semester?: number | null;
  year?: number | null;
  subject_type?: 'core' | 'elective' | 'practical' | null;
  prerequisites?: string | null;
  syllabus?: string | null;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface CreateSubjectRequest {
  name: string;
  code: string;
  department_id: number;
  credits: number;
  lectures_per_week: number;
  labs_per_week: number;
  requires_lab: boolean;
  semester?: number | null;
  year?: number | null;
  subject_type?: 'core' | 'elective' | 'practical' | null;
  prerequisites?: string | null;
  syllabus?: string | null;
}

export interface UpdateSubjectRequest extends Partial<CreateSubjectRequest> {}

// Classroom types
export interface Classroom extends BaseModel {
  room_number: string;
  building: string;
  floor_number?: number | null;
  capacity: number;
  type: 'lecture' | 'lab' | 'seminar' | 'auditorium';
  equipment?: string | null;
  has_projector: boolean;
  has_smartboard: boolean;
  has_ac: boolean;
  has_computer_lab: boolean;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface CreateClassroomRequest {
  room_number: string;
  building: string;
  floor_number?: number | null;
  capacity: number;
  type: 'lecture' | 'lab' | 'seminar' | 'auditorium';
  equipment?: string | null;
  has_projector?: boolean;
  has_smartboard?: boolean;
  has_ac?: boolean;
  has_computer_lab?: boolean;
}

export interface UpdateClassroomRequest extends Partial<CreateClassroomRequest> {}

// Student Batch types
export interface StudentBatch extends BaseModel {
  name: string;
  batch_code: string;
  department_id: number;
  year: number;
  semester: number;
  section?: string | null;
  strength: number;
  academic_year: string;
  class_coordinator_id?: number | null;
  intake_year: number;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface CreateStudentBatchRequest {
  name: string;
  batch_code: string;
  department_id: number;
  year: number;
  semester: number;
  section?: string | null;
  strength: number;
  academic_year: string;
  class_coordinator_id?: number | null;
  intake_year: number;
}

export interface UpdateStudentBatchRequest extends Partial<CreateStudentBatchRequest> {}

// Time Slot types
export interface TimeSlot {
  id: number;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  start_time: string;
  end_time: string;
  slot_name: string;
  slot_type: 'regular' | 'lab' | 'break' | 'lunch';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTimeSlotRequest {
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  start_time: string;
  end_time: string;
  slot_name: string;
  slot_type: 'regular' | 'lab' | 'break' | 'lunch';
}

// Timetable types
export interface Timetable extends BaseModel {
  name: string;
  department_id: number;
  academic_year: string;
  semester: number;
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'archived';
  version: number;
  created_by: number;
  approved_by?: number | null;
  quality_score?: number | null;
  effective_from?: string | null;
  effective_to?: string | null;
  notes?: string | null;
  deleted_at?: string | null;
}

export interface CreateTimetableRequest {
  name: string;
  department_id: number;
  academic_year: string;
  semester: number;
  status?: 'draft' | 'pending_review' | 'approved' | 'published' | 'archived';
  version?: number;
  created_by: number;
  approved_by?: number | null;
  quality_score?: number | null;
  effective_from?: string | null;
  effective_to?: string | null;
  notes?: string | null;
}

export interface UpdateTimetableRequest extends Partial<CreateTimetableRequest> {}

// Scheduled Class types
export interface ScheduledClass {
  id: number;
  timetable_id: number;
  subject_id: number;
  faculty_id: number;
  student_batch_id: number;
  classroom_id: number;
  timeslot_id: number;
  class_type: 'Lecture' | 'Lab';
  created_at: string;
}

export interface CreateScheduledClassRequest {
  timetable_id: number;
  subject_id: number;
  faculty_id: number;
  student_batch_id: number;
  classroom_id: number;
  timeslot_id: number;
  class_type: 'Lecture' | 'Lab';
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}
