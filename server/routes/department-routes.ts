import { Request, Response, NextFunction } from 'express';
import { 
  DepartmentContext, 
  UserWithDepartments, 
  ApiResponse,
  DepartmentAccessLog 
} from '../../shared/enhanced-api';

/**
 * Enhanced API Routes with Department Isolation Middleware
 * This module provides middleware and route handlers that enforce
 * department-based data isolation and access control
 */

// ============================================================================
// DEPARTMENT ISOLATION MIDDLEWARE
// ============================================================================

/**
 * Enhanced request interface with department context
 */
export interface DepartmentRequest extends Request {
  departmentContext?: DepartmentContext;
  user?: UserWithDepartments;
}

/**
 * Middleware to inject department context into requests
 * This middleware should run after authentication middleware
 */
export const injectDepartmentContext = (
  req: DepartmentRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Extract user's department memberships
    const userDepartments = user.departments?.map(d => d.departmentId) || [];
    const activeDepartmentId = req.headers['x-active-department'] as string || 
                              user.primaryDepartmentId;

    // Check if user has admin access
    const hasAdminAccess = user.role === 'admin';

    // Create department context
    const departmentContext: DepartmentContext = {
      user,
      activeDepartmentId,
      userDepartments,
      hasAdminAccess,
      canAccessDepartment: (departmentId: string) => {
        return hasAdminAccess || userDepartments.includes(departmentId);
      },
      canManageDepartment: (departmentId: string) => {
        if (hasAdminAccess) return true;
        const membership = user.departments?.find(d => d.departmentId === departmentId);
        return membership?.role === 'mentor' && 
               (membership.mentorType === 'creator' || membership.mentorType === 'publisher');
      }
    };

    req.departmentContext = departmentContext;
    next();
  } catch (error) {
    console.error('Department context injection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize department context'
    });
  }
};

/**
 * Middleware to enforce department access control
 */
export const requireDepartmentAccess = (options: {
  departmentIdParam?: string;
  requiredRole?: 'mentor' | 'student';
  requireManagement?: boolean;
  allowAdmin?: boolean;
} = {}) => {
  return (req: DepartmentRequest, res: Response, next: NextFunction) => {
    try {
      const context = req.departmentContext;
      
      if (!context) {
        return res.status(500).json({
          success: false,
          error: 'Department context not initialized'
        });
      }

      // Admin bypass (if allowed)
      if (options.allowAdmin !== false && context.hasAdminAccess) {
        return next();
      }

      // Get department ID from request
      const departmentId = req.params[options.departmentIdParam || 'departmentId'] ||
                          req.query.departmentId as string ||
                          req.body.departmentId ||
                          context.activeDepartmentId;

      if (!departmentId) {
        return res.status(400).json({
          success: false,
          error: 'Department ID is required'
        });
      }

      // Check department access
      if (!context.canAccessDepartment(departmentId)) {
        logDepartmentAccess(context.user.id, departmentId, 'ACCESS_DENIED', false, 'Insufficient permissions');
        return res.status(403).json({
          success: false,
          error: 'Access denied: You do not have permission to access this department'
        });
      }

      // Check role requirements
      if (options.requiredRole) {
        const membership = context.user.departments?.find(d => d.departmentId === departmentId);
        if (!membership || membership.role !== options.requiredRole) {
          return res.status(403).json({
            success: false,
            error: `Access denied: ${options.requiredRole} role required`
          });
        }
      }

      // Check management permissions
      if (options.requireManagement && !context.canManageDepartment(departmentId)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: Department management permissions required'
        });
      }

      // Log successful access
      logDepartmentAccess(context.user.id, departmentId, 'ACCESS_GRANTED', true);
      
      next();
    } catch (error) {
      console.error('Department access control error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify department access'
      });
    }
  };
};

/**
 * Middleware to filter data by department
 */
export const filterByDepartment = (
  req: DepartmentRequest, 
  res: Response, 
  next: NextFunction
) => {
  const context = req.departmentContext;
  
  if (!context) {
    return res.status(500).json({
      success: false,
      error: 'Department context not initialized'
    });
  }

  // Add department filter to query if not admin
  if (!context.hasAdminAccess) {
    const activeDepartmentId = context.activeDepartmentId;
    if (activeDepartmentId && !req.query.departmentId) {
      req.query.departmentId = activeDepartmentId;
    }
  }

  next();
};

// ============================================================================
// DEPARTMENT MANAGEMENT ROUTES
// ============================================================================

/**
 * Get user's accessible departments
 */
export const getUserDepartments = async (req: DepartmentRequest, res: Response) => {
  try {
    const context = req.departmentContext!;
    
    // Mock implementation - replace with actual database queries
    const mockDepartments = [
      {
        id: 'dept-1',
        name: 'Computer Science & Engineering',
        code: 'CSE',
        description: 'Advanced computing and software development',
        colorTheme: '#3B82F6',
        isActive: true,
        maxStudents: 60,
        maxMentors: 2,
        headOfDepartment: 'Dr. John Smith',
        contactEmail: 'cse@college.edu',
        contactPhone: '+1-234-567-8900',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'dept-2',
        name: 'Mechanical Engineering',
        code: 'MECH',
        description: 'Mechanical systems and manufacturing',
        colorTheme: '#10B981',
        isActive: true,
        maxStudents: 60,
        maxMentors: 2,
        headOfDepartment: 'Prof. Sarah Johnson',
        contactEmail: 'mech@college.edu',
        contactPhone: '+1-234-567-8901',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    // Filter departments based on user access
    const accessibleDepartments = context.hasAdminAccess 
      ? mockDepartments 
      : mockDepartments.filter(dept => context.canAccessDepartment(dept.id));

    const stats = accessibleDepartments.reduce((acc, dept) => {
      acc[dept.id] = {
        studentCount: Math.floor(Math.random() * 50) + 10,
        mentorCount: Math.floor(Math.random() * 2) + 1,
        maxStudents: dept.maxStudents,
        maxMentors: dept.maxMentors,
        availableStudentSeats: 0,
        availableMentorSeats: 0,
      };
      acc[dept.id].availableStudentSeats = acc[dept.id].maxStudents - acc[dept.id].studentCount;
      acc[dept.id].availableMentorSeats = acc[dept.id].maxMentors - acc[dept.id].mentorCount;
      return acc;
    }, {} as any);

    res.json({
      success: true,
      departments: accessibleDepartments,
      stats
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch departments'
    });
  }
};

/**
 * Get department details with isolation
 */
export const getDepartmentDetails = async (req: DepartmentRequest, res: Response) => {
  try {
    const context = req.departmentContext!;
    const departmentId = req.params.departmentId;

    if (!context.canAccessDepartment(departmentId)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this department'
      });
    }

    // Mock department details - replace with actual database query
    const department = {
      id: departmentId,
      name: 'Computer Science & Engineering',
      code: 'CSE',
      description: 'Advanced computing and software development',
      colorTheme: '#3B82F6',
      isActive: true,
      maxStudents: 60,
      maxMentors: 2,
      headOfDepartment: 'Dr. John Smith',
      contactEmail: 'cse@college.edu',
      contactPhone: '+1-234-567-8900',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const stats = {
      studentCount: 45,
      mentorCount: 2,
      maxStudents: 60,
      maxMentors: 2,
      availableStudentSeats: 15,
      availableMentorSeats: 0,
    };

    res.json({
      success: true,
      department,
      stats
    });
  } catch (error) {
    console.error('Get department details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch department details'
    });
  }
};

// ============================================================================
// FACULTY ROUTES WITH DEPARTMENT FILTERING
// ============================================================================

/**
 * Get faculty filtered by department
 */
export const getFacultyByDepartment = async (req: DepartmentRequest, res: Response) => {
  try {
    const context = req.departmentContext!;
    const departmentId = req.query.departmentId as string || context.activeDepartmentId;

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        error: 'Department ID is required'
      });
    }

    if (!context.canAccessDepartment(departmentId)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this department'
      });
    }

    // Mock faculty data - replace with actual database query
    const faculty = [
      {
        id: 'faculty-1',
        userId: 'user-1',
        departmentId,
        name: 'Dr. John Smith',
        employeeId: 'FAC001',
        designation: 'Professor',
        qualification: 'PhD in Computer Science',
        specialization: 'Machine Learning, AI',
        experienceYears: 15,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'faculty-2',
        userId: 'user-2',
        departmentId,
        name: 'Prof. Sarah Johnson',
        employeeId: 'FAC002',
        designation: 'Associate Professor',
        qualification: 'PhD in Software Engineering',
        specialization: 'Web Development, Database Systems',
        experienceYears: 10,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    res.json({
      success: true,
      faculty,
      total: faculty.length,
      page: 1,
      limit: 10
    });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch faculty'
    });
  }
};

// ============================================================================
// AUDIT LOGGING HELPERS
// ============================================================================

/**
 * Log department access for audit purposes
 */
const logDepartmentAccess = (
  userId: string,
  departmentId: string,
  action: string,
  success: boolean,
  errorMessage?: string
) => {
  // Mock implementation - replace with actual database logging
  const logEntry: DepartmentAccessLog = {
    id: `log-${Date.now()}`,
    userId,
    departmentId,
    action,
    success,
    errorMessage,
    createdAt: new Date().toISOString()
  };

  console.log('Department Access Log:', logEntry);
  
  // In production, save to database
  // await saveAccessLog(logEntry);
};

/**
 * Get department access logs (admin only)
 */
export const getDepartmentAccessLogs = async (req: DepartmentRequest, res: Response) => {
  try {
    const context = req.departmentContext!;
    
    if (!context.hasAdminAccess) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    // Mock logs - replace with actual database query
    const logs: DepartmentAccessLog[] = [
      {
        id: 'log-1',
        userId: 'user-1',
        departmentId: 'dept-1',
        action: 'ACCESS_GRANTED',
        resourceType: 'faculty',
        success: true,
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      logs,
      total: logs.length,
      page: 1,
      limit: 10
    });
  } catch (error) {
    console.error('Get access logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch access logs'
    });
  }
};

// ============================================================================
// DEPARTMENT SWITCHING
// ============================================================================

/**
 * Switch user's active department
 */
export const switchActiveDepartment = async (req: DepartmentRequest, res: Response) => {
  try {
    const context = req.departmentContext!;
    const { departmentId } = req.body;

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        error: 'Department ID is required'
      });
    }

    if (!context.canAccessDepartment(departmentId)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this department'
      });
    }

    // Log the department switch
    logDepartmentAccess(context.user.id, departmentId, 'DEPARTMENT_SWITCH', true);

    res.json({
      success: true,
      message: 'Department switched successfully',
      activeDepartmentId: departmentId
    });
  } catch (error) {
    console.error('Switch department error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to switch department'
    });
  }
};