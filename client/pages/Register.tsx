import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, EyeOff, UserPlus, Crown, Shield, GraduationCap, Users, Building, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Department } from '@/contexts/DepartmentContext';

// Enhanced departments with department isolation features
const departments: Department[] = [
  { 
    id: 'dept-1', 
    name: 'Computer Science & Engineering', 
    code: 'CSE',
    // description: 'Advanced computing, software development, and emerging technologies',
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
    // description: 'Mechanical systems, manufacturing, and automation',
    colorTheme: '#10B981',
    isActive: true,
    maxStudents: 60,
    maxMentors: 2,
    headOfDepartment: 'Prof. Sarah Johnson',
    contactEmail: 'mech@college.edu',
    contactPhone: '+1-234-567-8901',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: 'dept-3', 
    name: 'Civil Engineering', 
    code: 'CIVIL',
    // description: 'Infrastructure, construction, and environmental engineering',
    colorTheme: '#F59E0B',
    isActive: true,
    maxStudents: 60,
    maxMentors: 2,
    headOfDepartment: 'Dr. Michael Brown',
    contactEmail: 'civil@college.edu',
    contactPhone: '+1-234-567-8902',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: 'dept-4', 
    name: 'Electrical Engineering', 
    code: 'EEE',
    // description: 'Power systems, electronics, and electrical design',
    colorTheme: '#EF4444',
    isActive: true,
    maxStudents: 60,
    maxMentors: 2,
    headOfDepartment: 'Dr. Lisa Wilson',
    contactEmail: 'eee@college.edu',
    contactPhone: '+1-234-567-8903',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: 'dept-5', 
    name: 'Electronics & Telecommunication', 
    code: 'EXTC',
    // description: 'Communication systems, signal processing, and networking',
    colorTheme: '#8B5CF6',
    isActive: true,
    maxStudents: 60,
    maxMentors: 2,
    headOfDepartment: 'Prof. David Garcia',
    contactEmail: 'extc@college.edu',
    contactPhone: '+1-234-567-8904',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const roleDescriptions = {
  admin: {
    title: 'Administrator',
    description: 'Full system access - Manage departments, approve events, system settings',
    icon: Crown,
    color: 'bg-purple-100 text-purple-800',
    permissions: ['Full system control', 'Department management', 'Event approval', 'User management']
  },
  creator: {
    title: 'Faculty Mentor (Creator)',
    description: 'Create and draft timetables for department review',
    icon: Shield,
    color: 'bg-green-100 text-green-800',
    permissions: ['Create timetables', 'Draft schedules', 'Submit for approval', 'Manage department events']
  },
  publisher: {
    title: 'Faculty Mentor (hod)',
    description: 'Review and approve timetables from creators',
    icon: Crown,
    color: 'bg-blue-100 text-blue-800',
    permissions: ['Review timetables', 'Approve/reject schedules', 'Publish final timetables', 'Department oversight']
  },
  student: {
    title: 'Student',
    description: 'View and participate - Access events, register, view schedules',
    icon: GraduationCap,
    color: 'bg-orange-100 text-orange-800',
    permissions: ['View events', 'Register for events', 'View schedules', 'Profile management']
  }
};

export default function Register() {
  const { register: registerUser, canRegisterInDepartment, getDepartmentQuota } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [departmentQuotas, setDepartmentQuotas] = useState<Record<string, any>>({});
  const [lastQuotaUpdate, setLastQuotaUpdate] = useState<Date>(new Date());
  
  // Get role from URL params if navigated from role selection
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const preSelectedRole = searchParams.get('role');
  const errorParam = searchParams.get('error');

  // Redirect admin registration attempts to signin
  useEffect(() => {
    if (preSelectedRole === 'admin') {
      navigate('/signin?role=admin');
      return;
    }
  }, [preSelectedRole, navigate]);

  // Get role options based on pre-selected role or show all (exclude admin)
  const roleOptions = preSelectedRole 
    ? preSelectedRole === 'admin' ? [] : [preSelectedRole] // No admin registration
    : ['student', 'creator', 'publisher']; // Removed 'admin'

  // Check if user was redirected here due to missing department
  const needsDepartment = errorParam === 'no-department';

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '', // Will be college student ID
    password: '',
    confirmPassword: '',
    role: 'student', // Default to student only
    departmentId: '',
    phone: ''
  });

  // Load department quotas when component mounts and refresh periodically for real-time updates
  useEffect(() => {
    const loadQuotas = async () => {
      const quotas: Record<string, any> = {};
      for (const dept of departments) {
        quotas[dept.id] = getDepartmentQuota(dept.id);
      }
      setDepartmentQuotas(quotas);
      setLastQuotaUpdate(new Date());
    };
    
    // Load quotas initially
    loadQuotas();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadQuotas, 30000);
    
    // Also update when window regains focus
    const handleFocus = () => loadQuotas();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [getDepartmentQuota]);

  // Refresh quotas when role changes to show accurate data
  useEffect(() => {
    if (formData.role) {
      const loadQuotas = async () => {
        const quotas: Record<string, any> = {};
        for (const dept of departments) {
          quotas[dept.id] = getDepartmentQuota(dept.id);
        }
        setDepartmentQuotas(quotas);
        setLastQuotaUpdate(new Date());
      };
      loadQuotas();
    }
  }, [formData.role, getDepartmentQuota]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'College email is required';
    if (!formData.username.trim()) return 'College Student ID is required';
    if (formData.username.length < 3) return 'Student ID must be at least 3 characters';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.departmentId) return 'Please select your department';
    if (!formData.phone.trim()) return 'Phone number is required';
    
    // Email validation for college domain
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid college email address';
    
    // Check if email is college domain
    if (!formData.email.includes('@stvincentngp.edu.in')) {
      return 'Please use your college email address (e.g., @stvincentngp.edu.in)';
    }
    
    // Quota validation for department registration
    if (formData.departmentId) {
      if (!canRegisterInDepartment(formData.departmentId, 'student')) {
        const quota = departmentQuotas[formData.departmentId];
        if (quota) {
          const currentUsers = quota.students;
          return `Department student quota exceeded. Maximum 60 students allowed (currently ${currentUsers}/60).`;
        }
        return `Registration not available for students in this department.`;
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate registration API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock registration success
      const success = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username, // College Student ID
        password: formData.password,
        role: 'student',
        departmentId: formData.departmentId,
        studentId: formData.username, // Use username as student ID
        phone: formData.phone
      });

      if (success) {
        // Registration successful, redirect to dashboard
        navigate('/');
      } else {
        setError('Registration failed. Username or email may already be taken.');
      }
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRole = formData.role ? roleDescriptions[formData.role as keyof typeof roleDescriptions] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
          <CardDescription>
            Create your student account to access Py-Gram 2k25
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">College Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john.doe@stvincentngp.edu.in"
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Use your official St. Vincent college email address</p>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91-9876543210"
                  required
                />
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Information</h3>
              
              <div>
                <Label htmlFor="username">College Student ID (Username) *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="e.g., CSE2021001"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">This will be your username for login</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-5 w-5" />
                Department Selection
              </h3>
              
              <div>
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Choose Your Department *
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Select the department you belong to
                </p>
                <Select value={formData.departmentId} onValueChange={(value) => handleInputChange('departmentId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => {
                      const quota = departmentQuotas[dept.id];
                      const canRegister = canRegisterInDepartment(dept.id, 'student');
                      const currentCount = quota ? quota.students : 0;
                      const maxCount = dept.maxStudents;
                      
                      return (
                        <SelectItem key={dept.id} value={dept.id} disabled={!canRegister}>
                          <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: dept.colorTheme }}
                                />
                                <span className="font-medium">{dept.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {dept.code}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <span className={`text-xs ${canRegister ? 'text-green-600' : 'text-red-600'}`}>
                                  {currentCount}/{maxCount} students
                                </span>
                                {canRegister && (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {dept.description}
                            </p>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                  </Select>
                </div>
              </div>            {/* Submit Button */}
            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Student Account
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground space-y-2">
                <div>
                  Already have an account?{' '}
                  <Link to="/signin" className="text-primary hover:underline font-medium">
                    Sign in here
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
