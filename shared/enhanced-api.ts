/**
 * Enhanced API Types with Department Isolation Support
 * This file defines all API interfaces, types, and request/response structures
 * with built-in department isolation support
 */

// ============================================================================
// CORE DEPARTMENT TYPES
// ============================================================================

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  colorTheme: string;
  logoUrl?: string;
  isActive: boolean;
  maxStudents: number;
  maxMentors: number;
  headOfDepartment?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStats {
  studentCount: number;
  mentorCount: number;
  maxStudents: number;
  maxMentors: number;
  availableStudentSeats: number;
  availableMentorSeats: number;
}

export interface DepartmentMembership {
  id: string;
  userId: string;
  departmentId: string;
  role: 'admin' | 'mentor' | 'student';
  mentorType?: 'creator' | 'publisher' | 'general';
  isPrimary: boolean;
  joinedAt: string;
}

// ============================================================================
// ENHANCED USER TYPES
// ============================================================================

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'mentor' | 'student';
  mentorType?: 'creator' | 'publisher' | 'general';
  primaryDepartmentId?: string;
  studentId?: string;
  employeeId?: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithDepartments extends User {
  departments: DepartmentMembership[];
  primaryDepartment?: Department;
}

// ============================================================================
// DEPARTMENT-SPECIFIC ENTITY TYPES
// ============================================================================

export interface DepartmentFaculty {
  id: string;
  userId: string;
  departmentId: string;
  name: string;
  employeeId: string;
  designation?: string;
  qualification?: string;
  specialization?: string;
  experienceYears: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentSubject {
  id: string;
  departmentId: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  semester: number;
  year: number;
  lecturesPerWeek: number;
  labsPerWeek: number;
  requiresLab: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentClassroom {
  id: string;
  departmentId: string;
  name: string;
  building?: string;
  floor?: number;
  roomNumber?: string;
  capacity: number;
  type: 'Lecture' | 'Lab' | 'Seminar' | 'Conference';
  hasProjector: boolean;
  hasSmartboard: boolean;
  hasAC: boolean;
  hasWifi: boolean;
  equipmentList?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentBatch {
  id: string;
  departmentId: string;
  name: string;
  year: number;
  semester: number;
  academicYear: string;
  strength: number;
  currentStrength: number;
  classTeacherId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentEvent {
  id: string;
  departmentId: string;
  title: string;
  description?: string;
  eventType: string;
  startDate: string;
  endDate: string;
  venue?: string;
  maxParticipants?: number;
  registrationDeadline?: string;
  isPublic: boolean;
  requiresApproval: boolean;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentTimetable {
  id: string;
  departmentId: string;
  name: string;
  academicYear: string;
  semester: number;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Published' | 'Archived';
  version: number;
  qualityScore: number;
  createdBy: string;
  reviewedBy?: string;
  publishedBy?: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  publishedAt?: string;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

// Authentication & Registration
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'mentor' | 'student';
  mentorType?: 'creator' | 'publisher' | 'general';
  departmentId?: string;
  studentId?: string;
  employeeId?: string;
  phone?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: UserWithDepartments;
  token?: string;
  message?: string;
}

// Department Management
export interface DepartmentListResponse {
  success: boolean;
  departments: Department[];
  stats?: Record<string, DepartmentStats>;
}

export interface DepartmentDetailsResponse {
  success: boolean;
  department?: Department;
  stats?: DepartmentStats;
  members?: UserWithDepartments[];
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
  colorTheme?: string;
  maxStudents?: number;
  maxMentors?: number;
  headOfDepartment?: string;
  contactEmail?: string;
  contactPhone?: string;
}

// Faculty Management
export interface FacultyListRequest {
  departmentId?: string;
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface FacultyListResponse {
  success: boolean;
  faculty: DepartmentFaculty[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateFacultyRequest {
  userId?: string;
  departmentId: string;
  name: string;
  employeeId: string;
  designation?: string;
  qualification?: string;
  specialization?: string;
  experienceYears?: number;
}

// Subject Management
export interface SubjectListRequest {
  departmentId?: string;
  semester?: number;
  year?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SubjectListResponse {
  success: boolean;
  subjects: DepartmentSubject[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSubjectRequest {
  departmentId: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  semester: number;
  year: number;
  lecturesPerWeek?: number;
  labsPerWeek?: number;
  requiresLab?: boolean;
}

// Classroom Management
export interface ClassroomListRequest {
  departmentId?: string;
  type?: 'Lecture' | 'Lab' | 'Seminar' | 'Conference';
  building?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ClassroomListResponse {
  success: boolean;
  classrooms: DepartmentClassroom[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateClassroomRequest {
  departmentId: string;
  name: string;
  building?: string;
  floor?: number;
  roomNumber?: string;
  capacity: number;
  type: 'Lecture' | 'Lab' | 'Seminar' | 'Conference';
  hasProjector?: boolean;
  hasSmartboard?: boolean;
  hasAC?: boolean;
  hasWifi?: boolean;
  equipmentList?: string;
}

// Event Management
export interface EventListRequest {
  departmentId?: string;
  status?: 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  eventType?: string;
  isPublic?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface EventListResponse {
  success: boolean;
  events: DepartmentEvent[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateEventRequest {
  departmentId: string;
  title: string;
  description?: string;
  eventType: string;
  startDate: string;
  endDate: string;
  venue?: string;
  maxParticipants?: number;
  registrationDeadline?: string;
  isPublic?: boolean;
  requiresApproval?: boolean;
}

// Timetable Management
export interface TimetableListRequest {
  departmentId?: string;
  academicYear?: string;
  semester?: number;
  status?: 'Draft' | 'Under Review' | 'Approved' | 'Published' | 'Archived';
  search?: string;
  page?: number;
  limit?: number;
}

export interface TimetableListResponse {
  success: boolean;
  timetables: DepartmentTimetable[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTimetableRequest {
  departmentId: string;
  name: string;
  academicYear: string;
  semester: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

// ============================================================================
// GENERIC API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// ============================================================================
// DEPARTMENT ISOLATION MIDDLEWARE TYPES
// ============================================================================

export interface DepartmentContext {
  user: UserWithDepartments;
  activeDepartmentId?: string;
  userDepartments: string[];
  hasAdminAccess: boolean;
  canAccessDepartment: (departmentId: string) => boolean;
  canManageDepartment: (departmentId: string) => boolean;
}

export interface DepartmentFilterRequest {
  departmentId?: string;
  enforceDepartmentIsolation?: boolean;
  bypassIsolation?: boolean;
}

// ============================================================================
// AUDIT AND LOGGING TYPES
// ============================================================================

export interface DepartmentAccessLog {
  id: string;
  userId: string;
  departmentId: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  additionalData?: Record<string, any>;
  createdAt: string;
}

export interface AuditLogRequest {
  userId?: string;
  departmentId?: string;
  action?: string;
  resourceType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogResponse {
  success: boolean;
  logs: DepartmentAccessLog[];
  total: number;
  page: number;
  limit: number;
}

// ============================================================================
// EXPORT TYPES FOR CLIENT USE
// ============================================================================

// Legacy support - keeping existing types
export interface DemoResponse {
  message: string;
}