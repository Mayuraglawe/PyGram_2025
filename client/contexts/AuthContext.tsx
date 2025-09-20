import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User roles and permissions
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
  mentor_type?: MentorType; // For faculty mentors only
  departments: Array<{
    id: string;
    name: string;
    code: string;
    assignment_type: 'member' | 'mentor' | 'student';
  }>;
}

export interface RegistrationData {
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

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, role?: UserRole | 'creator' | 'publisher') => Promise<boolean>;
  register: (userData: RegistrationData) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string, departmentId?: string) => boolean;
  canCreateEvent: (departmentId: string) => boolean;
  isMentorInDepartment: (departmentId: string) => boolean;
  isAdminOrMentor: () => boolean;
  getDepartmentQuota: (departmentId: string) => { students: number; mentors: number; maxStudents: number; maxMentors: number };
  canRegisterInDepartment: (departmentId: string, role: UserRole) => boolean;
  getDepartmentUsers: (departmentId: string, role?: UserRole) => User[];
  // New timetable workflow methods
  canCreateTimetableDraft: (departmentId: string) => boolean;
  canPublishTimetable: (departmentId: string) => boolean;
  canEditTimetable: (timetableId: string, departmentId: string) => boolean;
  isCreatorMentor: () => boolean;
  isPublisherMentor: () => boolean;
}

// Permission definitions
const PERMISSIONS = {
  // Event permissions
  view_public_events: ['admin', 'mentor', 'student'],
  create_events: ['admin', 'mentor'],
  edit_events: ['admin', 'mentor'],
  delete_events: ['admin', 'mentor'],
  approve_events: ['admin'],
  register_for_events: ['admin', 'mentor', 'student'],
  view_event_queue: ['admin', 'mentor'],
  
  // Department permissions
  view_departments: ['admin', 'mentor', 'student'],
  view_department_data: ['admin', 'mentor'],
  create_departments: ['admin'],
  edit_departments: ['admin'],
  delete_departments: ['admin'],
  assign_mentors: ['admin'],
  
  // User management permissions
  view_users: ['admin'],
  create_users: ['admin'],
  edit_users: ['admin'],
  delete_users: ['admin'],
  
  // Timetable permissions
  view_timetables: ['admin', 'mentor', 'student'],
  create_timetables: ['admin', 'mentor'],
  edit_timetables: ['admin', 'mentor'],
  delete_timetables: ['admin'],
  
  // New timetable workflow permissions
  create_timetable_drafts: ['admin', 'mentor'], // Creator mentor only
  publish_timetables: ['admin', 'mentor'], // Publisher mentor only
  edit_published_timetables: ['admin', 'mentor'], // Both Creator and Publisher
  
  // Analytics permissions
  view_analytics: ['admin', 'mentor'],
  export_data: ['admin']
} as const;

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@college.edu',
    role: 'admin',
    first_name: 'System',
    last_name: 'Administrator',
    is_active: true,
    departments: [] // Admins have access to all departments
  },
  {
    id: '2',
    username: 'Pygram2k25',
    email: 'creator@college.edu',
    role: 'mentor',
    mentor_type: 'creator',
    first_name: 'Dr. John',
    last_name: 'Smith',
    is_active: true,
    departments: [
      {
        id: '1',
        name: 'Computer Science',
        code: 'CS',
        assignment_type: 'mentor'
      }
    ]
  },
  {
    id: '3',
    username: 'pygram2k25',
    email: 'publisher@college.edu',
    role: 'mentor',
    mentor_type: 'publisher',
    first_name: 'Prof. Sarah',
    last_name: 'Johnson',
    is_active: true,
    departments: [
      {
        id: '1',
        name: 'Computer Science',
        code: 'CS',
        assignment_type: 'mentor'
      }
    ]
  },
  {
    id: '4',
    username: 'prof.brown',
    email: 'brown@college.edu',
    role: 'mentor',
    mentor_type: 'creator',
    first_name: 'Prof. Mike',
    last_name: 'Brown',
    is_active: true,
    departments: [
      {
        id: '2',
        name: 'Mechanical Engineering',
        code: 'MECH',
        assignment_type: 'mentor'
      }
    ]
  },
  {
    id: '5',
    username: 'dr.garcia',
    email: 'garcia@college.edu',
    role: 'mentor',
    mentor_type: 'publisher',
    first_name: 'Dr. Maria',
    last_name: 'Garcia',
    is_active: true,
    departments: [
      {
        id: '2',
        name: 'Mechanical Engineering',
        code: 'MECH',
        assignment_type: 'mentor'
      }
    ]
  },
  {
    id: '6',
    username: 'student1',
    email: 'student1@college.edu',
    role: 'student',
    first_name: 'Alice',
    last_name: 'Johnson',
    is_active: true,
    departments: [
      {
        id: '1',
        name: 'Computer Engineering',
        code: 'COMP',
        assignment_type: 'student'
      }
    ]
  },
  {
    id: '7',
    username: 'bob.student',
    email: 'bob@college.edu',
    role: 'student',
    first_name: 'Bob',
    last_name: 'Williams',
    is_active: true,
    departments: [
      {
        id: '2',
        name: 'Mechanical Engineering',
        code: 'MECH',
        assignment_type: 'student'
      }
    ]
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const departments = [
    { id: '1', name: 'Computer Engineering', code: 'COMP' },
    { id: '2', name: 'Mechanical Engineering', code: 'MECH' },
    { id: '3', name: 'Civil Engineering', code: 'CIVIL' },
    { id: '4', name: 'Electrical Engineering', code: 'ELEC' },
    { id: '5', name: 'Electronics & Telecommunication Engineering', code: 'EXTC' }
  ];

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, role?: UserRole | 'creator' | 'publisher'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Handle Admin login (hardcoded credentials)
    if (username === 'Admin' && password === 'Admin@123') {
      const adminUser: User = {
        id: 'admin_system',
        username: 'Admin',
        email: 'admin@college.edu',
        role: 'admin',
        first_name: 'System',
        last_name: 'Administrator',
        is_active: true,
        departments: [] // Admins have access to all departments
      };
      
      const authToken = `admin_token_${Date.now()}`;
      
      setUser(adminUser);
      localStorage.setItem('auth_user', JSON.stringify(adminUser));
      localStorage.setItem('auth_token', authToken);
      
      setIsLoading(false);
      return true;
    }

    // Handle Creator role
    if (username === 'Pygram2k25' && password === 'Pygram2k25') {
      const creatorUser: User = {
        id: 'creator_demo',
        username: 'Pygram2k25',
        email: 'creator@college.edu',
        role: 'mentor',
        mentor_type: 'creator',
        first_name: 'Dr. John',
        last_name: 'Smith',
        is_active: true,
        departments: [
          {
            id: '1',
            name: 'Computer Science',
            code: 'CS',
            assignment_type: 'mentor'
          }
        ]
      };
      
      const authToken = `creator_token_${Date.now()}`;
      
      setUser(creatorUser);
      localStorage.setItem('auth_user', JSON.stringify(creatorUser));
      localStorage.setItem('auth_token', authToken);
      
      setIsLoading(false);
      return true;
    }
    
    // Handle Publisher role
    if (username === 'pygram2k25' && password === 'pygram2k25') {
      const publisherUser: User = {
        id: 'publisher_demo',
        username: 'pygram2k25',
        email: 'publisher@college.edu',
        role: 'mentor',
        mentor_type: 'publisher',
        first_name: 'Prof. Sarah',
        last_name: 'Johnson',
        is_active: true,
        departments: [
          {
            id: '1',
            name: 'Computer Science',
            code: 'CS',
            assignment_type: 'mentor'
          }
        ]
      };
      
      const authToken = `publisher_token_${Date.now()}`;
      
      setUser(publisherUser);
      localStorage.setItem('auth_user', JSON.stringify(publisherUser));
      localStorage.setItem('auth_token', authToken);
      
      setIsLoading(false);
      return true;
    }
    
    // Universal demo account - works for any role (for other roles like admin, student)
    if (username === 'demo' && password === 'demo') {
      // Determine the role (use provided role or default to student)
      const userRole = (role === 'creator' || role === 'publisher') ? 'mentor' : (role as UserRole) || 'student';
      const mentorType = role === 'creator' ? 'creator' : role === 'publisher' ? 'publisher' : undefined;
      
      // Create department assignment based on role
      const getDepartmentAssignment = (userRole: UserRole) => {
        switch (userRole) {
          case 'admin':
            return []; // Admins have access to all departments
          case 'mentor':
            return [
              {
                id: '1',
                name: 'Computer Science & Engineering',
                code: 'CSE',
                assignment_type: 'mentor' as const
              }
            ];
          case 'student':
          default:
            return [
              {
                id: '1',
                name: 'Computer Science & Engineering',
                code: 'CSE',
                assignment_type: 'student' as const
              }
            ];
        }
      };
      
      // Create dynamic user with the appropriate role
      const universalUser: User = {
        id: `demo_${userRole}_${Date.now()}`,
        username: 'demo',
        email: `demo.${userRole}@college.edu`,
        role: userRole,
        mentor_type: mentorType,
        first_name: 'Demo',
        last_name: userRole.charAt(0).toUpperCase() + userRole.slice(1),
        is_active: true,
        departments: getDepartmentAssignment(userRole)
      };
      
      const authToken = `universal_token_${userRole}_${Date.now()}`;
      
      setUser(universalUser);
      localStorage.setItem('auth_user', JSON.stringify(universalUser));
      localStorage.setItem('auth_token', authToken);
      
      setIsLoading(false);
      return true;
    }
    
    // Mock authentication for existing demo users
    const foundUser = mockUsers.find(u => u.username === username);
    
    // Accept common demo passwords for testing, plus specific mentor passwords
    const validPasswords = ['password', 'admin123', 'mentor123', 'student123'];
    
    // Special case for our mentors with specific passwords
    const isValidCredentials = (
      (foundUser && validPasswords.includes(password)) ||
      (username === 'Pygram2k25' && password === 'Pygram2k25') ||
      (username === 'pygram2k25' && password === 'pygram2k25')
    );
    
    if (foundUser && isValidCredentials) {
      const authToken = `mock_token_${foundUser.id}_${Date.now()}`;
      
      setUser(foundUser);
      localStorage.setItem('auth_user', JSON.stringify(foundUser));
      localStorage.setItem('auth_token', authToken);
      
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: RegistrationData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if username or email already exists
      const existingUser = mockUsers.find(u => 
        u.username === userData.username || u.email === userData.email
      );
      
      if (existingUser) {
        setIsLoading(false);
        return false; // User already exists
      }
      
      // Mock departments for reference (this would come from API in production)
      const mockDepartments = [
        { id: 'dept-1', name: 'Computer Science & Engineering', code: 'CSE' },
        { id: 'dept-2', name: 'Mechanical Engineering', code: 'MECH' },
        { id: 'dept-3', name: 'Civil Engineering', code: 'CIVIL' },
        { id: 'dept-4', name: 'Electrical Engineering', code: 'EEE' },
        { id: 'dept-5', name: 'Electronics & Telecommunication', code: 'EXTC' }
      ];
      
      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        first_name: userData.firstName,
        last_name: userData.lastName,
        is_active: true,
        departments: userData.departmentId ? [{
          id: userData.departmentId,
          name: mockDepartments.find(d => d.id === userData.departmentId)?.name || 'Unknown',
          code: mockDepartments.find(d => d.id === userData.departmentId)?.code || 'UNK',
          assignment_type: userData.role === 'mentor' ? 'mentor' : 
                          userData.role === 'student' ? 'student' : 'member'
        }] : []
      };
      
      // In a real app, this would be sent to the server
      // For now, we'll just simulate successful registration and log them in
      const authToken = `mock_token_${newUser.id}_${Date.now()}`;
      
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      localStorage.setItem('auth_token', authToken);
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  };

  const hasPermission = (permission: string, departmentId?: string): boolean => {
    if (!user) return false;
    
    const permissionList = PERMISSIONS[permission as keyof typeof PERMISSIONS];
    if (!permissionList) return false;
    
    const hasRolePermission = (permissionList as readonly string[]).includes(user.role);
    
    // For department-specific permissions, check if user belongs to the department
    if (departmentId && hasRolePermission) {
      if (user.role === 'admin') return true;
      return user.departments.some(dept => dept.id === departmentId);
    }
    
    return hasRolePermission;
  };

  const canCreateEvent = (departmentId: string): boolean => {
    if (!user) return false;
    
    // Admins can create events for any department
    if (user.role === 'admin') return true;
    
    // Check if user is a mentor in the specified department
    if (user.role === 'mentor') {
      return user.departments.some(
        dept => dept.id === departmentId && dept.assignment_type === 'mentor'
      );
    }
    
    return false;
  };

  const isMentorInDepartment = (departmentId: string): boolean => {
    if (!user) return false;
    
    return user.departments.some(
      dept => dept.id === departmentId && dept.assignment_type === 'mentor'
    );
  };

  const isAdminOrMentor = (): boolean => {
    return user?.role === 'admin' || user?.role === 'mentor';
  };

  // Department quota management
  const getDepartmentQuota = (departmentId: string) => {
    const allUsers = [...mockUsers];
    const departmentUsers = allUsers.filter(u => 
      u.departments.some(d => d.id === departmentId)
    );
    
    const students = departmentUsers.filter(u => u.role === 'student').length;
    const mentors = departmentUsers.filter(u => u.role === 'mentor').length;
    
    return {
      students,
      mentors,
      maxStudents: 60,  // As per requirements
      maxMentors: 2     // As per requirements
    };
  };

  const canRegisterInDepartment = (departmentId: string, role: UserRole): boolean => {
    if (role === 'admin') return true; // Admins are not department-specific
    
    const quota = getDepartmentQuota(departmentId);
    
    if (role === 'student') {
      return quota.students < quota.maxStudents;
    } else if (role === 'mentor') {
      return quota.mentors < quota.maxMentors;
    }
    
    return false;
  };

  const getDepartmentUsers = (departmentId: string, role?: UserRole): User[] => {
    if (!user || (user.role !== 'admin' && !user.departments.some(d => d.id === departmentId))) {
      return []; // Users can only see users from their own department (except admins)
    }
    
    const allUsers = [...mockUsers];
    let departmentUsers = allUsers.filter(u => 
      u.departments.some(d => d.id === departmentId)
    );
    
    if (role) {
      departmentUsers = departmentUsers.filter(u => u.role === role);
    }
    
    return departmentUsers;
  };

  // New timetable workflow methods
  const canCreateTimetableDraft = (departmentId: string): boolean => {
    if (!user) return false;
    
    // Admins can create drafts for any department
    if (user.role === 'admin') return true;
    
    // Only Creator mentors can create drafts
    if (user.role === 'mentor' && user.mentor_type === 'creator') {
      return user.departments.some(
        dept => dept.id === departmentId && dept.assignment_type === 'mentor'
      );
    }
    
    return false;
  };

  const canPublishTimetable = (departmentId: string): boolean => {
    if (!user) return false;
    
    // Admins can publish for any department
    if (user.role === 'admin') return true;
    
    // Only Publisher mentors can publish
    if (user.role === 'mentor' && user.mentor_type === 'publisher') {
      return user.departments.some(
        dept => dept.id === departmentId && dept.assignment_type === 'mentor'
      );
    }
    
    return false;
  };

  const canEditTimetable = (timetableId: string, departmentId: string): boolean => {
    if (!user) return false;
    
    // Admins can edit any timetable
    if (user.role === 'admin') return true;
    
    // Both Creator and Publisher mentors can edit timetables in their department
    if (user.role === 'mentor' && (user.mentor_type === 'creator' || user.mentor_type === 'publisher')) {
      return user.departments.some(
        dept => dept.id === departmentId && dept.assignment_type === 'mentor'
      );
    }
    
    return false;
  };

  const isCreatorMentor = (): boolean => {
    return user?.role === 'mentor' && user?.mentor_type === 'creator';
  };

  const isPublisherMentor = (): boolean => {
    return user?.role === 'mentor' && user?.mentor_type === 'publisher';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasPermission,
    canCreateEvent,
    isMentorInDepartment,
    isAdminOrMentor,
    getDepartmentQuota,
    canRegisterInDepartment,
    getDepartmentUsers,
    // New timetable workflow methods
    canCreateTimetableDraft,
    canPublishTimetable,
    canEditTimetable,
    isCreatorMentor,
    isPublisherMentor
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for route protection
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  departmentId?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission, 
  departmentId, 
  fallback 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, hasPermission } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to role selection page for first-time users
    window.location.href = '/role-selection';
    return null;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return fallback || <div className="flex items-center justify-center min-h-screen">You don't have permission to access this page.</div>;
  }

  if (requiredPermission && !hasPermission(requiredPermission, departmentId)) {
    return fallback || <div className="flex items-center justify-center min-h-screen">You don't have permission to access this feature.</div>;
  }

  return <>{children}</>;
}

// Hook for role checks
export function useRole() {
  const { user } = useAuth();
  
  return {
    isAdmin: user?.role === 'admin',
    isMentor: user?.role === 'mentor',
    isStudent: user?.role === 'student',
    role: user?.role
  };
}

// Hook for department access
export function useDepartmentAccess() {
  const { user, canCreateEvent, isMentorInDepartment } = useAuth();
  
  return {
    getUserDepartments: () => user?.departments || [],
    getMentorDepartments: () => 
      user?.departments.filter(dept => dept.assignment_type === 'mentor') || [],
    getStudentDepartments: () => 
      user?.departments.filter(dept => dept.assignment_type === 'student') || [],
    canCreateEvent,
    isMentorInDepartment,
    hasAccessToDepartment: (departmentId: string) => 
      user?.role === 'admin' || 
      user?.departments.some(dept => dept.id === departmentId)
  };
}

// Role-based component gate
interface RoleGateProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Permission-based component gate
interface PermissionGateProps {
  children: ReactNode;
  permission: string;
  departmentId?: string;
  fallback?: ReactNode;
}

export function PermissionGate({ children, permission, departmentId, fallback = null }: PermissionGateProps) {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(permission, departmentId)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}