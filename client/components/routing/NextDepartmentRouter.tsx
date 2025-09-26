import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useDepartment } from '@/contexts/DepartmentContext';
import { Loader2, Building2, Users, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ============================================================================
// NEXT.JS DEPARTMENT ROUTER COMPONENT
// ============================================================================

/**
 * NextDepartmentRouter - Routes users to their department workspace after authentication
 * This component ensures that users are automatically directed to their department
 * context and provides department switching capabilities
 */
export function NextDepartmentRouter({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    activeDepartment, 
    userDepartments, 
    isLoading: deptLoading, 
    switchDepartment,
    isChangingDepartment 
  } = useDepartment();
  const router = useRouter();

  // ============================================================================
  // AUTHENTICATION & ROUTING LOGIC
  // ============================================================================

  useEffect(() => {
    console.log('🏢 NextDepartmentRouter Check:', {
      pathname: router.pathname,
      isAuthenticated,
      authLoading,
      deptLoading,
      user: user?.username,
      userDepartments: userDepartments?.length,
      timestamp: new Date().toISOString()
    });

    if (authLoading || deptLoading) {
      console.log('⏳ Waiting for auth/dept loading to complete');
      return;
    }

    // Public routes that don't require authentication
    const publicRoutes = ['/signin', '/register', '/role-selection', '/'];
    const isPublicRoute = publicRoutes.includes(router.pathname);

    console.log('🔍 Route Analysis:', {
      pathname: router.pathname,
      isPublicRoute,
      publicRoutes
    });

    // If not authenticated and not on a public route, redirect to signin
    if (!isAuthenticated && !isPublicRoute) {
      console.log('🚨 Redirecting to signin - not authenticated');
      router.push('/signin');
      return;
    }

    // If authenticated but no departments assigned, redirect to role selection
    if (isAuthenticated && user && (!userDepartments || userDepartments.length === 0) && !isPublicRoute) {
      console.log('🚨 Redirecting to role-selection - no departments');
      router.push('/role-selection');
      return;
    }

    // If authenticated with departments but no active department selected
    if (isAuthenticated && userDepartments && userDepartments.length > 0 && !activeDepartment && !isPublicRoute) {
      // Auto-select first department if only one available
      if (userDepartments.length === 1) {
        switchDepartment(userDepartments[0].id);
      }
      // If multiple departments, let user choose (they'll see department selector)
    }

  }, [isAuthenticated, user, userDepartments, activeDepartment, authLoading, deptLoading, router]);

  // ============================================================================
  // LOADING STATES
  // ============================================================================

  if (authLoading || deptLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">Loading your workspace...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // DEPARTMENT SELECTION UI
  // ============================================================================

  // Show department selector if user has multiple departments but none selected
  if (isAuthenticated && userDepartments && userDepartments.length > 1 && !activeDepartment && !isChangingDepartment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Select Your Department</CardTitle>
            <CardDescription>
              You have access to multiple departments. Please choose which department you'd like to work with.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {userDepartments.map((dept) => (
                <Card 
                  key={dept.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                  onClick={() => switchDepartment(dept.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{dept.name}</h3>
                          <p className="text-sm text-muted-foreground">{dept.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{dept.role}</span>
                        </Badge>
                        {dept.isAdmin && (
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Shield className="h-3 w-3" />
                            <span>Admin</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Need access to a different department?
              </p>
              <Button variant="outline" onClick={() => router.push('/role-selection')}>
                Request Department Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // DEPARTMENT SWITCHING LOADING
  // ============================================================================

  if (isChangingDepartment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">Switching department...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // RENDER CHILDREN
  // ============================================================================

  return <>{children}</>;
}

export default NextDepartmentRouter;