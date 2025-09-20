import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Users, Building, Settings, BarChart3, UserCheck, UserX, Crown, 
  ShieldCheck, GraduationCap, Plus, Edit, Trash2, AlertTriangle, Bot,
  BookOpen, MapPin, User, UserPlus, School, DoorOpen, CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const departments = [
  { id: '1', name: 'Computer Engineering', code: 'COMP' },
  { id: '2', name: 'Mechanical Engineering', code: 'MECH' },
  { id: '3', name: 'Civil Engineering', code: 'CIVIL' },
  { id: '4', name: 'Electrical Engineering', code: 'ELEC' },
  { id: '5', name: 'Electronics & Telecommunication', code: 'E&TC' }
];

// Mock data for faculty management
const mockFaculty = [
  { id: '1', name: 'Dr. John Smith', employeeId: 'FAC001', email: 'john.smith@college.edu', department: '1', designation: 'Professor', specialization: 'Data Structures, Algorithms', experience: 15, phone: '+1-234-567-8900' },
  { id: '2', name: 'Prof. Sarah Johnson', employeeId: 'FAC002', email: 'sarah.johnson@college.edu', department: '1', designation: 'Associate Professor', specialization: 'Database Systems, Software Engineering', experience: 12, phone: '+1-234-567-8901' },
  { id: '3', name: 'Dr. Mike Wilson', employeeId: 'FAC003', email: 'mike.wilson@college.edu', department: '2', designation: 'Assistant Professor', specialization: 'Thermodynamics, Heat Transfer', experience: 8, phone: '+1-234-567-8902' },
  { id: '4', name: 'Prof. Emily Davis', employeeId: 'FAC004', email: 'emily.davis@college.edu', department: '3', designation: 'Associate Professor', specialization: 'Structural Engineering', experience: 10, phone: '+1-234-567-8903' }
];

// Mock data for subjects management
const mockSubjects = [
  { id: '1', name: 'Data Structures and Algorithms', code: 'CS201', department: '1', credits: 4, semester: 3, lecturesPerWeek: 3, labsPerWeek: 1, requiresLab: true, type: 'Theory + Lab' },
  { id: '2', name: 'Database Management Systems', code: 'CS301', department: '1', credits: 4, semester: 5, lecturesPerWeek: 3, labsPerWeek: 1, requiresLab: true, type: 'Theory + Lab' },
  { id: '3', name: 'Thermodynamics', code: 'ME301', department: '2', credits: 4, semester: 5, lecturesPerWeek: 4, labsPerWeek: 0, requiresLab: false, type: 'Theory' },
  { id: '4', name: 'Structural Analysis', code: 'CE301', department: '3', credits: 4, semester: 5, lecturesPerWeek: 3, labsPerWeek: 1, requiresLab: true, type: 'Theory + Lab' }
];

// Mock data for classrooms management
const mockClassrooms = [
  { id: '1', name: 'CS Lab 1', department: '1', capacity: 30, type: 'Lab', building: 'Technology Block', floor: 3, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'High-end PCs, Programming Software' },
  { id: '2', name: 'Lecture Hall A', department: '1', capacity: 60, type: 'Lecture', building: 'Technology Block', floor: 2, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'Audio System, Projector' },
  { id: '3', name: 'Manufacturing Lab', department: '2', capacity: 20, type: 'Lab', building: 'Engineering Block', floor: 1, hasProjector: false, hasSmartboard: false, hasAC: false, equipment: 'CNC Machines, Lathes, Milling Machines' },
  { id: '4', name: 'Structures Lab', department: '3', capacity: 25, type: 'Lab', building: 'Engineering Block', floor: 4, hasProjector: true, hasSmartboard: false, hasAC: true, equipment: 'Universal Testing Machine, Strain Gauges' }
];

export default function Admin() {
  const { hasPermission, user, getDepartmentQuota, getDepartmentUsers } = useAuth();
  const [departmentQuotas, setDepartmentQuotas] = useState<Record<string, any>>({});
  const [departmentUsers, setDepartmentUsers] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  
  // Faculty management state
  const [faculty, setFaculty] = useState(mockFaculty);
  const [facultyDialogOpen, setFacultyDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any>(null);
  const [facultyForm, setFacultyForm] = useState({
    name: '', employeeId: '', email: '', department: '', designation: '', 
    specialization: '', experience: 0, phone: ''
  });
  
  // Subjects management state
  const [subjects, setSubjects] = useState(mockSubjects);
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '', code: '', department: '', credits: 3, semester: 1, 
    lecturesPerWeek: 3, labsPerWeek: 0, requiresLab: false, type: 'Theory'
  });
  
  // Classrooms management state
  const [classrooms, setClassrooms] = useState(mockClassrooms);
  const [classroomDialogOpen, setClassroomDialogOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<any>(null);
  const [classroomForm, setClassroomForm] = useState({
    name: '', department: '', capacity: 30, type: 'Lecture', building: '', 
    floor: 1, hasProjector: false, hasSmartboard: false, hasAC: false, equipment: ''
  });

  // Load department data
  useEffect(() => {
    const loadDepartmentData = async () => {
      const quotas: Record<string, any> = {};
      const users: Record<string, any[]> = {};
      
      for (const dept of departments) {
        quotas[dept.id] = getDepartmentQuota(dept.id);
        users[dept.id] = getDepartmentUsers(dept.id);
      }
      
      setDepartmentQuotas(quotas);
      setDepartmentUsers(users);
      setLoading(false);
    };

    loadDepartmentData();
  }, [getDepartmentQuota, getDepartmentUsers]);

  // Check if user has admin permissions
  if (!hasPermission('manage_system')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const totalUsers = Object.values(departmentUsers).reduce((total, users) => total + users.length, 0);
  const totalCapacity = departments.length * 62; // 60 students + 2 mentors per dept

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage departments, users, and system settings</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {totalCapacity - totalUsers} slots remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
              <p className="text-xs text-muted-foreground">
                Engineering departments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Capacity</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((totalUsers / totalCapacity) * 100)}%</div>
              <Progress value={(totalUsers / totalCapacity) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Departments</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(departmentUsers).filter(users => users.length > 0).length}
              </div>
              <p className="text-xs text-muted-foreground">
                With registered users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="departments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="telegram">Telegram Bot</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Department Management */}
          <TabsContent value="departments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>
                  Monitor department capacity and user distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map(dept => {
                    const quota = departmentQuotas[dept.id] || { studentCount: 0, mentorCount: 0 };
                    const users = departmentUsers[dept.id] || [];
                    const students = users.filter(u => u.role === 'student').length;
                    const mentors = users.filter(u => u.role === 'mentor').length;
                    const studentUtilization = (students / 60) * 100;
                    const mentorUtilization = (mentors / 2) * 100;

                    return (
                      <Card key={dept.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Building className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{dept.name}</h3>
                              <p className="text-sm text-muted-foreground">{dept.code}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={studentUtilization > 90 ? "destructive" : studentUtilization > 70 ? "secondary" : "outline"}>
                              {students}/60 Students
                            </Badge>
                            <Badge variant={mentorUtilization > 90 ? "destructive" : mentorUtilization > 50 ? "secondary" : "outline"}>
                              {mentors}/2 Mentors
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Student Capacity</span>
                              <span>{students}/60 ({Math.round(studentUtilization)}%)</span>
                            </div>
                            <Progress value={studentUtilization} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Mentor Capacity</span>
                              <span>{mentors}/2 ({Math.round(mentorUtilization)}%)</span>
                            </div>
                            <Progress value={mentorUtilization} className="h-2" />
                          </div>
                        </div>

                        {(studentUtilization > 90 || mentorUtilization > 90) && (
                          <Alert className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              This department is near capacity. Consider reviewing quotas or managing registrations.
                            </AlertDescription>
                          </Alert>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Faculty Management */}
          <TabsContent value="faculty">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Faculty Management</h2>
                <Dialog open={facultyDialogOpen} onOpenChange={setFacultyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingFaculty(null);
                      setFacultyForm({
                        name: '', employeeId: '', email: '', department: '', designation: '', 
                        specialization: '', experience: 0, phone: ''
                      });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Faculty
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}</DialogTitle>
                      <DialogDescription>
                        {editingFaculty ? 'Update faculty information' : 'Add a new faculty member to the system'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={facultyForm.name}
                            onChange={(e) => setFacultyForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Dr. John Smith"
                          />
                        </div>
                        <div>
                          <Label htmlFor="employeeId">Employee ID</Label>
                          <Input
                            id="employeeId"
                            value={facultyForm.employeeId}
                            onChange={(e) => setFacultyForm(prev => ({ ...prev, employeeId: e.target.value }))}
                            placeholder="FAC001"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={facultyForm.email}
                            onChange={(e) => setFacultyForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="john.smith@college.edu"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={facultyForm.phone}
                            onChange={(e) => setFacultyForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1-234-567-8900"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Select
                            value={facultyForm.department}
                            onValueChange={(value) => setFacultyForm(prev => ({ ...prev, department: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="designation">Designation</Label>
                          <Select
                            value={facultyForm.designation}
                            onValueChange={(value) => setFacultyForm(prev => ({ ...prev, designation: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Designation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Professor">Professor</SelectItem>
                              <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                              <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                              <SelectItem value="Lecturer">Lecturer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Textarea
                          id="specialization"
                          value={facultyForm.specialization}
                          onChange={(e) => setFacultyForm(prev => ({ ...prev, specialization: e.target.value }))}
                          placeholder="Data Structures, Algorithms, Software Engineering"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience">Experience (Years)</Label>
                        <Input
                          id="experience"
                          type="number"
                          value={facultyForm.experience}
                          onChange={(e) => setFacultyForm(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                          placeholder="10"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setFacultyDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        if (editingFaculty) {
                          setFaculty(prev => prev.map(f => 
                            f.id === editingFaculty.id ? { ...facultyForm, id: editingFaculty.id } : f
                          ));
                        } else {
                          setFaculty(prev => [...prev, { ...facultyForm, id: Date.now().toString() }]);
                        }
                        setFacultyDialogOpen(false);
                      }}>
                        {editingFaculty ? 'Update' : 'Add'} Faculty
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {faculty.map((member) => {
                  const dept = departments.find(d => d.id === member.department);
                  return (
                    <Card key={member.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <User className="h-5 w-5" />
                              <h3 className="text-lg font-semibold">{member.name}</h3>
                              <Badge variant="secondary">{member.designation}</Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Employee ID:</span> {member.employeeId}
                              </div>
                              <div>
                                <span className="font-medium">Department:</span> {dept?.name}
                              </div>
                              <div>
                                <span className="font-medium">Experience:</span> {member.experience} years
                              </div>
                              <div>
                                <span className="font-medium">Email:</span> {member.email}
                              </div>
                              <div>
                                <span className="font-medium">Phone:</span> {member.phone}
                              </div>
                              <div className="col-span-2">
                                <span className="font-medium">Specialization:</span> {member.specialization}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingFaculty(member);
                                setFacultyForm(member);
                                setFacultyDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this faculty member?')) {
                                  setFaculty(prev => prev.filter(f => f.id !== member.id));
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage users across all departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map(dept => {
                    const users = departmentUsers[dept.id] || [];
                    const students = users.filter(u => u.role === 'student');
                    const mentors = users.filter(u => u.role === 'mentor');

                    return (
                      <Card key={dept.id} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {dept.name}
                          </h3>
                          <Badge variant="outline">
                            {users.length} Total Users
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Students */}
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                              <GraduationCap className="h-4 w-4" />
                              Students ({students.length}/60)
                            </h4>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {students.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic">No students registered</p>
                              ) : (
                                students.map(student => (
                                  <div key={student.id} className="flex items-center justify-between text-xs bg-muted/50 p-2 rounded">
                                    <span>{student.firstName} {student.lastName}</span>
                                    <span className="text-muted-foreground">{student.username}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Mentors */}
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                              <ShieldCheck className="h-4 w-4" />
                              Mentors ({mentors.length}/2)
                            </h4>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {mentors.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic">No mentors assigned</p>
                              ) : (
                                mentors.map(mentor => (
                                  <div key={mentor.id} className="flex items-center justify-between text-xs bg-muted/50 p-2 rounded">
                                    <span>{mentor.firstName} {mentor.lastName}</span>
                                    <span className="text-muted-foreground">{mentor.username}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Management */}
          <TabsContent value="subjects">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Subjects Management</h2>
                <Dialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingSubject(null);
                      setSubjectForm({
                        name: '', code: '', department: '', credits: 3, semester: 1, 
                        lecturesPerWeek: 3, labsPerWeek: 0, requiresLab: false, type: 'Theory'
                      });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subject
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
                      <DialogDescription>
                        {editingSubject ? 'Update subject information' : 'Add a new subject to the system'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="subjectName">Subject Name</Label>
                          <Input
                            id="subjectName"
                            value={subjectForm.name}
                            onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Data Structures and Algorithms"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subjectCode">Subject Code</Label>
                          <Input
                            id="subjectCode"
                            value={subjectForm.code}
                            onChange={(e) => setSubjectForm(prev => ({ ...prev, code: e.target.value }))}
                            placeholder="CS201"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="subjectDepartment">Department</Label>
                          <Select
                            value={subjectForm.department}
                            onValueChange={(value) => setSubjectForm(prev => ({ ...prev, department: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="subjectType">Subject Type</Label>
                          <Select
                            value={subjectForm.type}
                            onValueChange={(value) => setSubjectForm(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Theory">Theory</SelectItem>
                              <SelectItem value="Lab">Lab</SelectItem>
                              <SelectItem value="Theory + Lab">Theory + Lab</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="credits">Credits</Label>
                          <Input
                            id="credits"
                            type="number"
                            value={subjectForm.credits}
                            onChange={(e) => setSubjectForm(prev => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
                            placeholder="3"
                          />
                        </div>
                        <div>
                          <Label htmlFor="semester">Semester</Label>
                          <Input
                            id="semester"
                            type="number"
                            value={subjectForm.semester}
                            onChange={(e) => setSubjectForm(prev => ({ ...prev, semester: parseInt(e.target.value) || 1 }))}
                            placeholder="5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lecturesPerWeek">Lectures/Week</Label>
                          <Input
                            id="lecturesPerWeek"
                            type="number"
                            value={subjectForm.lecturesPerWeek}
                            onChange={(e) => setSubjectForm(prev => ({ ...prev, lecturesPerWeek: parseInt(e.target.value) || 3 }))}
                            placeholder="3"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="labsPerWeek">Labs/Week</Label>
                          <Input
                            id="labsPerWeek"
                            type="number"
                            value={subjectForm.labsPerWeek}
                            onChange={(e) => setSubjectForm(prev => ({ ...prev, labsPerWeek: parseInt(e.target.value) || 0 }))}
                            placeholder="1"
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Switch
                            id="requiresLab"
                            checked={subjectForm.requiresLab}
                            onCheckedChange={(checked) => setSubjectForm(prev => ({ ...prev, requiresLab: checked }))}
                          />
                          <Label htmlFor="requiresLab">Requires Lab</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setSubjectDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        if (editingSubject) {
                          setSubjects(prev => prev.map(s => 
                            s.id === editingSubject.id ? { ...subjectForm, id: editingSubject.id } : s
                          ));
                        } else {
                          setSubjects(prev => [...prev, { ...subjectForm, id: Date.now().toString() }]);
                        }
                        setSubjectDialogOpen(false);
                      }}>
                        {editingSubject ? 'Update' : 'Add'} Subject
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {subjects.map((subject) => {
                  const dept = departments.find(d => d.id === subject.department);
                  return (
                    <Card key={subject.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <BookOpen className="h-5 w-5" />
                              <h3 className="text-lg font-semibold">{subject.name}</h3>
                              <Badge variant="secondary">{subject.code}</Badge>
                              <Badge variant={subject.requiresLab ? "default" : "outline"}>
                                {subject.type}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Department:</span> {dept?.name}
                              </div>
                              <div>
                                <span className="font-medium">Credits:</span> {subject.credits}
                              </div>
                              <div>
                                <span className="font-medium">Semester:</span> {subject.semester}
                              </div>
                              <div>
                                <span className="font-medium">Lectures/Week:</span> {subject.lecturesPerWeek}
                              </div>
                              {subject.labsPerWeek > 0 && (
                                <div>
                                  <span className="font-medium">Labs/Week:</span> {subject.labsPerWeek}
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <span className="font-medium">Lab Required:</span>
                                {subject.requiresLab ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <span className="text-muted-foreground">No</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingSubject(subject);
                                setSubjectForm(subject);
                                setSubjectDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this subject?')) {
                                  setSubjects(prev => prev.filter(s => s.id !== subject.id));
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Telegram Bot */}
          <TabsContent value="telegram" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span>Telegram Bot Configuration</span>
                </CardTitle>
                <CardDescription>
                  Configure and manage the Telegram bot for principal communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Bot Status</h4>
                      <p className="text-sm text-muted-foreground">Current bot connection status</p>
                    </div>
                    <Badge variant="outline">Online</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Messages Sent</h4>
                      <p className="text-sm text-muted-foreground">Total messages sent to principal</p>
                    </div>
                    <Badge variant="secondary">-</Badge>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button asChild>
                    <Link to="/telegram-setup">
                      <Bot className="h-4 w-4 mr-2" />
                      Configure Bot
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild>
                    <a href="/api/telegram/status" target="_blank" rel="noopener noreferrer">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Check Status
                    </a>
                  </Button>
                </div>

                <Alert>
                  <Bot className="h-4 w-4" />
                  <AlertDescription>
                    The Telegram bot allows publishers to send messages directly to the principal. 
                    Complete the setup in the configuration page to activate this feature.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classrooms Management */}
          <TabsContent value="classrooms">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Classrooms Management</h2>
                <Dialog open={classroomDialogOpen} onOpenChange={setClassroomDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingClassroom(null);
                      setClassroomForm({
                        name: '', department: '', capacity: 30, type: 'Lecture', building: '', 
                        floor: 1, hasProjector: false, hasSmartboard: false, hasAC: false, equipment: ''
                      });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Classroom
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingClassroom ? 'Edit Classroom' : 'Add New Classroom'}</DialogTitle>
                      <DialogDescription>
                        {editingClassroom ? 'Update classroom information' : 'Add a new classroom to the system'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="classroomName">Classroom Name</Label>
                          <Input
                            id="classroomName"
                            value={classroomForm.name}
                            onChange={(e) => setClassroomForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="CS Lab 1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="classroomDepartment">Department</Label>
                          <Select
                            value={classroomForm.department}
                            onValueChange={(value) => setClassroomForm(prev => ({ ...prev, department: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="classroomType">Room Type</Label>
                          <Select
                            value={classroomForm.type}
                            onValueChange={(value) => setClassroomForm(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Lecture">Lecture Hall</SelectItem>
                              <SelectItem value="Lab">Laboratory</SelectItem>
                              <SelectItem value="Tutorial">Tutorial Room</SelectItem>
                              <SelectItem value="Seminar">Seminar Hall</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="capacity">Capacity</Label>
                          <Input
                            id="capacity"
                            type="number"
                            value={classroomForm.capacity}
                            onChange={(e) => setClassroomForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 30 }))}
                            placeholder="30"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="building">Building</Label>
                          <Input
                            id="building"
                            value={classroomForm.building}
                            onChange={(e) => setClassroomForm(prev => ({ ...prev, building: e.target.value }))}
                            placeholder="Technology Block"
                          />
                        </div>
                        <div>
                          <Label htmlFor="floor">Floor</Label>
                          <Input
                            id="floor"
                            type="number"
                            value={classroomForm.floor}
                            onChange={(e) => setClassroomForm(prev => ({ ...prev, floor: parseInt(e.target.value) || 1 }))}
                            placeholder="1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="equipment">Equipment & Facilities</Label>
                        <Textarea
                          id="equipment"
                          value={classroomForm.equipment}
                          onChange={(e) => setClassroomForm(prev => ({ ...prev, equipment: e.target.value }))}
                          placeholder="High-end PCs, Programming Software, Projector"
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="hasProjector"
                            checked={classroomForm.hasProjector}
                            onCheckedChange={(checked) => setClassroomForm(prev => ({ ...prev, hasProjector: checked }))}
                          />
                          <Label htmlFor="hasProjector">Projector</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="hasSmartboard"
                            checked={classroomForm.hasSmartboard}
                            onCheckedChange={(checked) => setClassroomForm(prev => ({ ...prev, hasSmartboard: checked }))}
                          />
                          <Label htmlFor="hasSmartboard">Smart Board</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="hasAC"
                            checked={classroomForm.hasAC}
                            onCheckedChange={(checked) => setClassroomForm(prev => ({ ...prev, hasAC: checked }))}
                          />
                          <Label htmlFor="hasAC">Air Conditioning</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setClassroomDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        if (editingClassroom) {
                          setClassrooms(prev => prev.map(c => 
                            c.id === editingClassroom.id ? { ...classroomForm, id: editingClassroom.id } : c
                          ));
                        } else {
                          setClassrooms(prev => [...prev, { ...classroomForm, id: Date.now().toString() }]);
                        }
                        setClassroomDialogOpen(false);
                      }}>
                        {editingClassroom ? 'Update' : 'Add'} Classroom
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {classrooms.map((classroom) => {
                  const dept = departments.find(d => d.id === classroom.department);
                  return (
                    <Card key={classroom.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <DoorOpen className="h-5 w-5" />
                              <h3 className="text-lg font-semibold">{classroom.name}</h3>
                              <Badge variant="secondary">{classroom.type}</Badge>
                              <Badge variant="outline">
                                Capacity: {classroom.capacity}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                              <div>
                                <span className="font-medium">Department:</span> {dept?.name}
                              </div>
                              <div>
                                <span className="font-medium">Building:</span> {classroom.building}
                              </div>
                              <div>
                                <span className="font-medium">Floor:</span> {classroom.floor}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {classroom.hasProjector && (
                                <Badge variant="outline" className="text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Projector
                                </Badge>
                              )}
                              {classroom.hasSmartboard && (
                                <Badge variant="outline" className="text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Smart Board
                                </Badge>
                              )}
                              {classroom.hasAC && (
                                <Badge variant="outline" className="text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  AC
                                </Badge>
                              )}
                            </div>
                            {classroom.equipment && (
                              <div className="text-sm">
                                <span className="font-medium">Equipment:</span> {classroom.equipment}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingClassroom(classroom);
                                setClassroomForm(classroom);
                                setClassroomDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this classroom?')) {
                                  setClassrooms(prev => prev.filter(c => c.id !== classroom.id));
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure department-centric platform settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Department Configuration</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="studentQuota">Default Student Quota per Department</Label>
                        <Input id="studentQuota" type="number" defaultValue={60} />
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum number of students allowed per department
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="mentorQuota">Default Mentor Quota per Department</Label>
                        <Input id="mentorQuota" type="number" defaultValue={2} />
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum number of mentors allowed per department
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Data Segregation</h3>
                    
                    <div className="space-y-3">
                      <Alert>
                        <Settings className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Department-Centric Architecture:</strong><br />
                          • Users only see content from their own department<br />
                          • Strict quota enforcement (60 students + 2 mentors)<br />
                          • Admin has global oversight across all departments
                        </AlertDescription>
                      </Alert>
                      
                      <div className="pt-4">
                        <Button className="w-full">
                          Update System Configuration
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}