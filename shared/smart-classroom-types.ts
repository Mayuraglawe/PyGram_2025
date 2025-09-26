// ============================================================================
// SMART CLASSROOM & TIMETABLE SCHEDULING SYSTEM - SHARED TYPE DEFINITIONS
// TypeScript interfaces for type-safe communication between frontend and backend
// ============================================================================

// Base API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export type UserRole = 'admin' | 'mentor' | 'student';
export type MentorType = 'creator' | 'publisher' | 'general';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  is_active: boolean;
  mentor_type?: MentorType;
  departments: Department[];
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  role?: UserRole | 'creator' | 'publisher';
}

export interface LoginResponse extends ApiResponse<User> {
  token: string;
  expires_in: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  departmentId?: string;
  studentId?: string;
  employeeId?: string;
  phone?: string;
}

// ============================================================================
// DEPARTMENT TYPES
// ============================================================================

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  colorTheme: string;
  isActive: boolean;
  maxStudents: number;
  maxMentors: number;
  createdAt: string;
  updatedAt: string;
  head_of_department_id?: string;
  established_year?: number;
  contact_email?: string;
  contact_phone?: string;
  building?: string;
  floor_number?: number;
}

// ============================================================================
// SMART CLASSROOM TYPES
// ============================================================================

export type EquipmentType = 'Smart Board' | 'Projector' | 'Audio System' | 'Camera' | 'Air Conditioner' | 'IoT Device';
export type EquipmentStatus = 'Active' | 'Maintenance' | 'Inactive';
export type ClassroomStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
export type ClassroomType = 'Smart Classroom' | 'Lab' | 'Seminar' | 'Tutorial' | 'Auditorium';

export interface SmartEquipment {
  id: string;
  equipment_name: string;
  equipment_type: EquipmentType;
  brand: string;
  model: string;
  serial_number: string;
  is_smart_enabled: boolean;
  status: EquipmentStatus;
  specifications: Record<string, any>;
  installation_date: string;
  last_maintenance: string;
  purchase_date?: string;
  warranty_expires?: string;
}

export interface SmartClassroom {
  id: string;
  room_number: string;
  room_name: string;
  building: string;
  floor_number: number;
  capacity: number;
  room_type: ClassroomType;
  is_smart_enabled: boolean;
  is_hybrid_enabled: boolean;
  has_live_streaming: boolean;
  has_recording_capability: boolean;
  wifi_ssid: string;
  equipment: SmartEquipment[];
  current_status: ClassroomStatus;
  temperature?: number;
  humidity?: number;
  occupancy_count?: number;
  last_updated?: string;
}

export interface ClassroomUtilizationAnalytics {
  overall_utilization: number;
  peak_hours: string[];
  most_used_rooms: Array<{
    room_number: string;
    room_name: string;
    utilization_rate: number;
    total_hours_used: number;
  }>;
  equipment_status: {
    active: number;
    maintenance: number;
    inactive: number;
  };
  environmental_data: {
    average_temperature: number;
    average_humidity: number;
    energy_consumption: number;
  };
}

// ============================================================================
// ACADEMIC MANAGEMENT TYPES
// ============================================================================

export interface Subject {
  id: string;
  name: string;
  code: string;
  department_id: string;
  program_id?: string;
  credits: number;
  theory_hours: number;
  lab_hours: number;
  requires_lab: boolean;
  requires_smart_classroom: boolean;
  semester: number;
  year: number;
  subject_type: 'core' | 'elective' | 'mandatory';
  description?: string;
  prerequisites?: string[];
}

export interface Faculty {
  id: string;
  user_id: string;
  employee_id: string;
  department_id: string;
  designation: string;
  qualification: string;
  specialization: string;
  experience_years: number;
  joining_date: string;
  max_weekly_hours: number;
  office_location?: string;
  is_active: boolean;
}

export interface StudentBatch {
  id: string;
  batch_name: string;
  batch_code: string;
  program_id?: string;
  department_id: string;
  year: number;
  semester: number;
  section: string;
  current_strength: number;
  max_strength: number;
  academic_year: string;
  class_coordinator_id?: string;
  is_active: boolean;
}

export interface Classroom {
  id: string;
  room_number: string;
  room_name?: string;
  building: string;
  floor_number: number;
  capacity: number;
  room_type: string;
  is_smart_enabled: boolean;
  has_projector: boolean;
  has_whiteboard: boolean;
  has_ac: boolean;
  wifi_available: boolean;
  is_active: boolean;
}

// ============================================================================
// AI TIMETABLE GENERATION TYPES
// ============================================================================

export interface AITimetableConstraints {
  faculty_max_hours?: number;
  lab_sessions_required?: boolean;
  smart_classroom_preference?: boolean;
  no_back_to_back_labs?: boolean;
  lunch_break_mandatory?: boolean;
  faculty_preferences?: Array<{
    faculty_id: string;
    preferred_slots: string[];
    avoid_slots: string[];
  }>;
}

export interface AITimetableRequest {
  department_id: string;
  semester: number;
  academic_year: string;
  constraints: AITimetableConstraints;
  subjects: Subject[];
  batches: StudentBatch[];
  classrooms: Classroom[];
}

export interface TimetableScheduleItem {
  slot_id: string;
  day: string;
  time_slot: string;
  subject_id: string;
  subject_name: string;
  faculty_id: string;
  faculty_name: string;
  batch_id: string;
  batch_name: string;
  classroom_id: string;
  classroom_name: string;
  class_type: 'lecture' | 'lab' | 'tutorial';
  is_smart_classroom: boolean;
}

export interface AITimetableResponse extends ApiResponse {
  generation_id: string;
  quality_score: number;
  algorithm_used: string;
  generation_time_ms: number;
  conflicts_resolved: number;
  optimization_metrics: {
    faculty_utilization: number;
    classroom_utilization: number;
    smart_classroom_usage: number;
    constraint_satisfaction: number;
  };
  schedule: TimetableScheduleItem[];
  suggestions: string[];
  warnings: string[];
}

export interface TimetableGenerationStatus {
  generation_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  current_step: string;
  estimated_completion: string;
  created_at: string;
  error_message?: string;
}

export interface AIAnalytics {
  total_generations: number;
  average_quality_score: number;
  average_generation_time_ms: number;
  success_rate: number;
  most_used_algorithm: string;
  constraint_satisfaction_rate: number;
  faculty_satisfaction_rate: number;
  student_satisfaction_rate: number;
  optimization_improvements: {
    average_conflicts_resolved: number;
    average_utilization_improvement: number;
    average_time_saved_hours: number;
  };
  recent_generations: TimetableGenerationStatus[];
}

// ============================================================================
// TRADITIONAL TIMETABLE TYPES
// ============================================================================

export interface Timetable {
  id: string;
  name: string;
  description?: string;
  department_id: string;
  academic_year: string;
  semester: number;
  status: 'draft' | 'published' | 'archived';
  created_by: string;
  quality_score?: number;
  generation_algorithm?: string;
  effective_from: string;
  effective_to: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduledClass {
  id: string;
  timetable_id: string;
  time_slot_id: string;
  subject_id: string;
  faculty_id: string;
  batch_id: string;
  classroom_id: string;
  class_type: 'lecture' | 'lab' | 'tutorial' | 'seminar';
  is_hybrid_class: boolean;
  recording_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  id: string;
  slot_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_type: 'regular' | 'lab' | 'break' | 'lunch';
  is_break_time: boolean;
}

// ============================================================================
// TELEGRAM INTEGRATION TYPES
// ============================================================================

export interface TelegramConfig {
  bot_token: string;
  webhook_url?: string;
  is_active: boolean;
  allowed_users: string[];
  default_notifications: boolean;
}

export interface TelegramNotification {
  message: string;
  users?: string[];
  department?: string;
  priority: 'low' | 'medium' | 'high';
  notification_type: 'info' | 'warning' | 'success' | 'error';
}

export interface TelegramStatus {
  is_connected: boolean;
  bot_username?: string;
  webhook_status: boolean;
  last_update: string;
  active_users: number;
  messages_sent_today: number;
}

// ============================================================================
// SYSTEM & ANALYTICS TYPES
// ============================================================================

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  database_status: 'connected' | 'disconnected';
  telegram_status: 'active' | 'inactive' | 'error';
  ai_engine_status: 'ready' | 'busy' | 'error';
  memory_usage: number;
  cpu_usage: number;
  uptime: number;
  version: string;
}

export interface DashboardStats {
  total_users: number;
  active_departments: number;
  smart_classrooms: number;
  active_timetables: number;
  ai_generations_today: number;
  system_health: SystemHealth;
  recent_activities: Array<{
    id: string;
    type: string;
    description: string;
    user: string;
    timestamp: string;
  }>;
}

// ============================================================================
// EVENT & NOTIFICATION TYPES
// ============================================================================

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: 'academic' | 'administrative' | 'social' | 'emergency';
  department_id?: string;
  start_datetime: string;
  end_datetime: string;
  location?: string;
  created_by: string;
  is_public: boolean;
  max_participants?: number;
  registration_required: boolean;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  user_id?: string;
  department_id?: string;
  is_read: boolean;
  is_system_notification: boolean;
  action_url?: string;
  expires_at?: string;
  created_at: string;
}