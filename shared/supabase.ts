import { createClient } from '@supabase/supabase-js';

// Database types for Py-Gram 2025 timetable system
export interface Database {
  public: {
    Tables: {
      faculty: {
        Row: {
          id: number;
          name: string;
          employee_id: string;
          department: string;
          user_id?: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          employee_id: string;
          department: string;
          user_id?: number | null;
        };
        Update: {
          name?: string;
          employee_id?: string;
          department?: string;
          user_id?: number | null;
        };
      };
      subjects: {
        Row: {
          id: number;
          name: string;
          code: string;
          department: string;
          credits: number;
          lectures_per_week: number;
          labs_per_week: number;
          requires_lab: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          code: string;
          department: string;
          credits: number;
          lectures_per_week: number;
          labs_per_week: number;
          requires_lab: boolean;
        };
        Update: {
          name?: string;
          code?: string;
          department?: string;
          credits?: number;
          lectures_per_week?: number;
          labs_per_week?: number;
          requires_lab?: boolean;
        };
      };
      classrooms: {
        Row: {
          id: number;
          name: string;
          capacity: number;
          type: 'Lecture' | 'Lab';
          has_projector: boolean;
          has_smartboard: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          capacity: number;
          type: 'Lecture' | 'Lab';
          has_projector: boolean;
          has_smartboard: boolean;
        };
        Update: {
          name?: string;
          capacity?: number;
          type?: 'Lecture' | 'Lab';
          has_projector?: boolean;
          has_smartboard?: boolean;
        };
      };
      student_batches: {
        Row: {
          id: number;
          name: string;
          year: number;
          semester: number;
          strength: number;
          department: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          year: number;
          semester: number;
          strength: number;
          department: string;
        };
        Update: {
          name?: string;
          year?: number;
          semester?: number;
          strength?: number;
          department?: string;
        };
      };
      batch_subjects: {
        Row: {
          id: number;
          batch_id: number;
          subject_id: number;
          created_at: string;
        };
        Insert: {
          batch_id: number;
          subject_id: number;
        };
        Update: {
          batch_id?: number;
          subject_id?: number;
        };
      };
      time_slots: {
        Row: {
          id: number;
          day_of_week: string;
          start_time: string;
          end_time: string;
          created_at: string;
        };
        Insert: {
          day_of_week: string;
          start_time: string;
          end_time: string;
        };
        Update: {
          day_of_week?: string;
          start_time?: string;
          end_time?: string;
        };
      };
      timetables: {
        Row: {
          id: number;
          name: string;
          status: 'Draft' | 'Pending Approval' | 'Approved' | 'Archived';
          created_by: number;
          created_at: string;
          updated_at: string;
          quality_score: number;
        };
        Insert: {
          name: string;
          status?: 'Draft' | 'Pending Approval' | 'Approved' | 'Archived';
          created_by: number;
          quality_score?: number;
        };
        Update: {
          name?: string;
          status?: 'Draft' | 'Pending Approval' | 'Approved' | 'Archived';
          quality_score?: number;
        };
      };
      scheduled_classes: {
        Row: {
          id: number;
          timetable_id: number;
          subject_id: number;
          faculty_id: number;
          student_batch_id: number;
          classroom_id: number;
          timeslot_id: number;
          class_type: 'Lecture' | 'Lab';
          created_at: string;
        };
        Insert: {
          timetable_id: number;
          subject_id: number;
          faculty_id: number;
          student_batch_id: number;
          classroom_id: number;
          timeslot_id: number;
          class_type: 'Lecture' | 'Lab';
        };
        Update: {
          timetable_id?: number;
          subject_id?: number;
          faculty_id?: number;
          student_batch_id?: number;
          classroom_id?: number;
          timeslot_id?: number;
          class_type?: 'Lecture' | 'Lab';
        };
      };
      generation_tasks: {
        Row: {
          id: string;
          status: 'PENDING' | 'SUCCESS' | 'FAILURE';
          progress: string;
          error?: string | null;
          new_timetable_id?: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          status?: 'PENDING' | 'SUCCESS' | 'FAILURE';
          progress?: string;
          error?: string | null;
          new_timetable_id?: number | null;
        };
        Update: {
          status?: 'PENDING' | 'SUCCESS' | 'FAILURE';
          progress?: string;
          error?: string | null;
          new_timetable_id?: number | null;
        };
      };
    };
  };
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
    // Client-side: check for public env vars
    return import.meta.env.VITE_SUPABASE_URL || '';
  } else {
    // Server-side: check process.env
    return process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  }
}

export function getSupabaseAnonKey(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use public anon key
    return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  } else {
    // Server-side: can use service role key for admin operations
    return process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  }
}

export function getSupabaseServiceKey(): string {
  // Only available server-side for admin operations
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
      throw new Error('Supabase URL and Anon Key are required. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
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