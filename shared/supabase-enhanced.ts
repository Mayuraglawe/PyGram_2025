import { createClient } from '@supabase/supabase-js';

// Enhanced Database types for Py-Gram 2k25 with Event Management System
export interface Database {
  public: {
    Tables: {
      // ============================================================================
      // USER MANAGEMENT & AUTHENTICATION
      // ============================================================================
      users: {
        Row: {
          id: string
          username: string
          email: string
          password_hash: string
          role: 'admin' | 'mentor' | 'student'
          first_name: string
          last_name: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password_hash: string
          role: 'admin' | 'mentor' | 'student'
          first_name: string
          last_name: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password_hash?: string
          role?: 'admin' | 'mentor' | 'student'
          first_name?: string
          last_name?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      
      // ============================================================================
      // DEPARTMENT MANAGEMENT
      // ============================================================================
      departments: {
        Row: {
          id: string
          name: string
          code: string
          description?: string
          head_of_department_id?: string
          established_year?: number
          contact_email?: string
          contact_phone?: string
          building?: string
          floor_number?: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string
          head_of_department_id?: string
          established_year?: number
          contact_email?: string
          contact_phone?: string
          building?: string
          floor_number?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string
          head_of_department_id?: string
          established_year?: number
          contact_email?: string
          contact_phone?: string
          building?: string
          floor_number?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      
      user_department_assignments: {
        Row: {
          id: string
          user_id: string
          department_id: string
          assignment_type: 'member' | 'mentor' | 'student'
          assigned_at: string
          assigned_by?: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          department_id: string
          assignment_type: 'member' | 'mentor' | 'student'
          assigned_at?: string
          assigned_by?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          department_id?: string
          assignment_type?: 'member' | 'mentor' | 'student'
          assigned_at?: string
          assigned_by?: string
          is_active?: boolean
        }
      }

      department_mentor_limits: {
        Row: {
          id: string
          department_id: string
          max_mentors: number
          current_mentors: number
          updated_at: string
        }
        Insert: {
          id?: string
          department_id: string
          max_mentors?: number
          current_mentors?: number
          updated_at?: string
        }
        Update: {
          id?: string
          department_id?: string
          max_mentors?: number
          current_mentors?: number
          updated_at?: string
        }
      }

      // ============================================================================
      // EVENT MANAGEMENT SYSTEM
      // ============================================================================
      college_events: {
        Row: {
          id: string
          title: string
          description?: string
          event_type: 'workshop' | 'seminar' | 'conference' | 'cultural' | 'sports' | 'technical' | 'orientation' | 'examination' | 'meeting' | 'other'
          department_id: string
          created_by: string
          start_date: string
          end_date: string
          start_time?: string
          end_time?: string
          venue?: string
          classroom_id?: string
          expected_participants?: number
          budget_allocated?: number
          contact_person?: string
          contact_email?: string
          contact_phone?: string
          status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
          priority_level: number
          requires_approval: boolean
          approved_by?: string
          approved_at?: string
          rejection_reason?: string
          is_public: boolean
          registration_required: boolean
          max_registrations?: number
          registration_deadline?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          event_type: 'workshop' | 'seminar' | 'conference' | 'cultural' | 'sports' | 'technical' | 'orientation' | 'examination' | 'meeting' | 'other'
          department_id: string
          created_by: string
          start_date: string
          end_date: string
          start_time?: string
          end_time?: string
          venue?: string
          classroom_id?: string
          expected_participants?: number
          budget_allocated?: number
          contact_person?: string
          contact_email?: string
          contact_phone?: string
          status?: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
          priority_level?: number
          requires_approval?: boolean
          approved_by?: string
          approved_at?: string
          rejection_reason?: string
          is_public?: boolean
          registration_required?: boolean
          max_registrations?: number
          registration_deadline?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          event_type?: 'workshop' | 'seminar' | 'conference' | 'cultural' | 'sports' | 'technical' | 'orientation' | 'examination' | 'meeting' | 'other'
          department_id?: string
          created_by?: string
          start_date?: string
          end_date?: string
          start_time?: string
          end_time?: string
          venue?: string
          classroom_id?: string
          expected_participants?: number
          budget_allocated?: number
          contact_person?: string
          contact_email?: string
          contact_phone?: string
          status?: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
          priority_level?: number
          requires_approval?: boolean
          approved_by?: string
          approved_at?: string
          rejection_reason?: string
          is_public?: boolean
          registration_required?: boolean
          max_registrations?: number
          registration_deadline?: string
          created_at?: string
          updated_at?: string
        }
      }

      event_queue: {
        Row: {
          id: string
          event_id: string
          queue_position: number
          requested_date: string
          requested_by: string
          status: 'waiting' | 'allocated' | 'rejected' | 'expired'
          conflict_with_event_id?: string
          allocated_date?: string
          rejection_reason?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          queue_position: number
          requested_date: string
          requested_by: string
          status?: 'waiting' | 'allocated' | 'rejected' | 'expired'
          conflict_with_event_id?: string
          allocated_date?: string
          rejection_reason?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          queue_position?: number
          requested_date?: string
          requested_by?: string
          status?: 'waiting' | 'allocated' | 'rejected' | 'expired'
          conflict_with_event_id?: string
          allocated_date?: string
          rejection_reason?: string
          created_at?: string
          updated_at?: string
        }
      }

      event_notifications: {
        Row: {
          id: string
          event_id: string
          user_id: string
          notification_type: 'booking_confirmed' | 'booking_rejected' | 'date_conflict' | 'event_approved' | 'event_reminder' | 'queue_update'
          title: string
          message: string
          is_read: boolean
          sent_at: string
          read_at?: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          notification_type: 'booking_confirmed' | 'booking_rejected' | 'date_conflict' | 'event_approved' | 'event_reminder' | 'queue_update'
          title: string
          message: string
          is_read?: boolean
          sent_at?: string
          read_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          notification_type?: 'booking_confirmed' | 'booking_rejected' | 'date_conflict' | 'event_approved' | 'event_reminder' | 'queue_update'
          title?: string
          message?: string
          is_read?: boolean
          sent_at?: string
          read_at?: string
        }
      }

      // ============================================================================
      // ENHANCED ACADEMIC ENTITIES
      // ============================================================================
      faculty: {
        Row: {
          id: string
          user_id?: string
          employee_id: string
          department_id: string
          designation?: string
          qualification?: string
          experience_years: number
          specialization?: string
          joining_date?: string
          office_room?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          employee_id: string
          department_id: string
          designation?: string
          qualification?: string
          experience_years?: number
          specialization?: string
          joining_date?: string
          office_room?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          employee_id?: string
          department_id?: string
          designation?: string
          qualification?: string
          experience_years?: number
          specialization?: string
          joining_date?: string
          office_room?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      subjects: {
        Row: {
          id: string
          name: string
          code: string
          department_id: string
          credits: number
          theory_hours: number
          practical_hours: number
          semester: number
          year: number
          is_elective: boolean
          prerequisites?: string
          description?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          department_id: string
          credits?: number
          theory_hours?: number
          practical_hours?: number
          semester: number
          year: number
          is_elective?: boolean
          prerequisites?: string
          description?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          department_id?: string
          credits?: number
          theory_hours?: number
          practical_hours?: number
          semester?: number
          year?: number
          is_elective?: boolean
          prerequisites?: string
          description?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      classrooms: {
        Row: {
          id: string
          name: string
          code: string
          department_id?: string
          building?: string
          floor_number?: number
          capacity: number
          room_type: 'lecture' | 'lab' | 'seminar' | 'auditorium'
          has_projector: boolean
          has_smartboard: boolean
          has_ac: boolean
          has_computer: boolean
          equipment_details?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          department_id?: string
          building?: string
          floor_number?: number
          capacity: number
          room_type?: 'lecture' | 'lab' | 'seminar' | 'auditorium'
          has_projector?: boolean
          has_smartboard?: boolean
          has_ac?: boolean
          has_computer?: boolean
          equipment_details?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          department_id?: string
          building?: string
          floor_number?: number
          capacity?: number
          room_type?: 'lecture' | 'lab' | 'seminar' | 'auditorium'
          has_projector?: boolean
          has_smartboard?: boolean
          has_ac?: boolean
          has_computer?: boolean
          equipment_details?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      student_batches: {
        Row: {
          id: string
          name: string
          code: string
          department_id: string
          year: number
          semester: number
          strength: number
          academic_year: string
          section: string
          class_coordinator_id?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          department_id: string
          year: number
          semester: number
          strength: number
          academic_year: string
          section?: string
          class_coordinator_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          department_id?: string
          year?: number
          semester?: number
          strength?: number
          academic_year?: string
          section?: string
          class_coordinator_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================================================
      // TIMETABLE SYSTEM (Original + Enhanced)
      // ============================================================================
      time_slots: {
        Row: {
          id: string
          day_of_week: number
          start_time: string
          end_time: string
          slot_type: 'regular' | 'lab' | 'break'
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          day_of_week: number
          start_time: string
          end_time: string
          slot_type?: 'regular' | 'lab' | 'break'
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          slot_type?: 'regular' | 'lab' | 'break'
          is_active?: boolean
          created_at?: string
        }
      }

      timetables: {
        Row: {
          id: string
          name: string
          department_id: string
          academic_year: string
          semester: number
          status: 'draft' | 'pending_approval' | 'approved' | 'published' | 'archived'
          created_by: string
          approved_by?: string
          quality_score?: number
          generation_algorithm?: string
          generation_time_seconds?: number
          notes?: string
          is_active: boolean
          created_at: string
          updated_at: string
          approved_at?: string
        }
        Insert: {
          id?: string
          name: string
          department_id: string
          academic_year: string
          semester: number
          status?: 'draft' | 'pending_approval' | 'approved' | 'published' | 'archived'
          created_by: string
          approved_by?: string
          quality_score?: number
          generation_algorithm?: string
          generation_time_seconds?: number
          notes?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          approved_at?: string
        }
        Update: {
          id?: string
          name?: string
          department_id?: string
          academic_year?: string
          semester?: number
          status?: 'draft' | 'pending_approval' | 'approved' | 'published' | 'archived'
          created_by?: string
          approved_by?: string
          quality_score?: number
          generation_algorithm?: string
          generation_time_seconds?: number
          notes?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          approved_at?: string
        }
      }

      scheduled_classes: {
        Row: {
          id: string
          timetable_id: string
          subject_id: string
          faculty_id: string
          student_batch_id: string
          classroom_id: string
          time_slot_id: string
          class_type: 'lecture' | 'lab' | 'tutorial' | 'seminar'
          duration_minutes: number
          is_recurring: boolean
          created_at: string
        }
        Insert: {
          id?: string
          timetable_id: string
          subject_id: string
          faculty_id: string
          student_batch_id: string
          classroom_id: string
          time_slot_id: string
          class_type?: 'lecture' | 'lab' | 'tutorial' | 'seminar'
          duration_minutes?: number
          is_recurring?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          timetable_id?: string
          subject_id?: string
          faculty_id?: string
          student_batch_id?: string
          classroom_id?: string
          time_slot_id?: string
          class_type?: 'lecture' | 'lab' | 'tutorial' | 'seminar'
          duration_minutes?: number
          is_recurring?: boolean
          created_at?: string
        }
      }

      faculty_subject_assignments: {
        Row: {
          id: string
          faculty_id: string
          subject_id: string
          proficiency_level: number
          preferred_time_slots?: string
          max_hours_per_week: number
          assigned_by?: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          faculty_id: string
          subject_id: string
          proficiency_level?: number
          preferred_time_slots?: string
          max_hours_per_week?: number
          assigned_by?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          faculty_id?: string
          subject_id?: string
          proficiency_level?: number
          preferred_time_slots?: string
          max_hours_per_week?: number
          assigned_by?: string
          is_active?: boolean
          created_at?: string
        }
      }

      batch_subject_assignments: {
        Row: {
          id: string
          student_batch_id: string
          subject_id: string
          is_elective: boolean
          enrollment_count?: number
          created_at: string
        }
        Insert: {
          id?: string
          student_batch_id: string
          subject_id: string
          is_elective?: boolean
          enrollment_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          student_batch_id?: string
          subject_id?: string
          is_elective?: boolean
          enrollment_count?: number
          created_at?: string
        }
      }

      generation_tasks: {
        Row: {
          id: string
          status: 'PENDING' | 'SUCCESS' | 'FAILURE'
          progress: string
          error?: string | null
          new_timetable_id?: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          status?: 'PENDING' | 'SUCCESS' | 'FAILURE'
          progress?: string
          error?: string | null
          new_timetable_id?: string | null
        }
        Update: {
          status?: 'PENDING' | 'SUCCESS' | 'FAILURE'
          progress?: string
          error?: string | null
          new_timetable_id?: string | null
        }
      }
    }
  }
}

// Enhanced type definitions for the Event Management System
export type UserRole = 'admin' | 'mentor' | 'student';
export type EventType = 'workshop' | 'seminar' | 'conference' | 'cultural' | 'sports' | 'technical' | 'orientation' | 'examination' | 'meeting' | 'other';
export type EventStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
export type QueueStatus = 'waiting' | 'allocated' | 'rejected' | 'expired';
export type NotificationType = 'booking_confirmed' | 'booking_rejected' | 'date_conflict' | 'event_approved' | 'event_reminder' | 'queue_update';

// Department with relationships
export interface DepartmentWithRelations {
  id: string;
  name: string;
  code: string;
  description?: string;
  head_of_department?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  mentor_count: number;
  event_count: number;
  faculty_count: number;
  student_count: number;
}

// Event with full details
export interface EventWithDetails {
  id: string;
  title: string;
  description?: string;
  event_type: EventType;
  department: {
    id: string;
    name: string;
    code: string;
  };
  created_by: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  venue?: string;
  classroom?: {
    id: string;
    name: string;
    capacity: number;
  };
  status: EventStatus;
  priority_level: number;
  expected_participants?: number;
  conflict_info?: {
    has_conflict: boolean;
    conflicting_events: string[];
    queue_position?: number;
  };
}

// User with department assignments
export interface UserWithDepartments {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  is_active: boolean;
  departments: Array<{
    id: string;
    name: string;
    code: string;
    assignment_type: 'member' | 'mentor' | 'student';
  }>;
}

// Conflict detection result
export interface ConflictDetectionResult {
  hasConflict: boolean;
  conflictingEvents: Array<{
    id: string;
    title: string;
    department: string;
    date: string;
  }>;
  suggestedAlternatives: string[];
  queuePosition?: number;
}

// Supabase client factory function
export function createSupabaseClient(supabaseUrl: string, supabaseKey: string) {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

// Environment variable getters with fallbacks
export function getSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    return import.meta.env.VITE_SUPABASE_URL || '';
  } else {
    return process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  }
}

export function getSupabaseAnonKey(): string {
  if (typeof window !== 'undefined') {
    return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  } else {
    return process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  }
}

export function getSupabaseServiceKey(): string {
  if (typeof window !== 'undefined') {
    throw new Error('Service key should not be used on client-side');
  }
  return process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

// Default client instance
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();
    
    if (!url || !key) {
      console.warn('Supabase credentials not found. Using mock data instead.');
      return null;
    }
    
    supabaseClient = createSupabaseClient(url, key);
  }
  
  return supabaseClient;
}

// Admin client for server-side operations
export function getSupabaseAdminClient() {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();
  
  if (!url || !serviceKey) {
    throw new Error('Supabase URL and Service Role Key are required for admin operations.');
  }
  
  return createSupabaseClient(url, serviceKey);
}