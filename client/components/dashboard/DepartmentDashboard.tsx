import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Shield,
  Bell,
  BarChart3,
  Clock,
  UserCheck,
  Settings,
  Eye,
  EyeOff,
  MapPin,
  Palette,
  User,
  Lock,
  Globe,
  ChevronRight,
  TrendingUp,
  Activity,
  Monitor,
  AlertCircle
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useDepartment, DepartmentThemed } from '@/contexts/DepartmentContext';
import MessageToPrincipal from '@/components/communication/MessageToPrincipal';

// ============================================================================
// DEPARTMENT DASHBOARD COMPONENT
// ============================================================================

/**
 * Department-specific dashboard that showcases complete data isolation
 * This component demonstrates how each department has its own workspace
 */
export default function DepartmentDashboard() {
  const { user } = useAuth();
  const { 
    activeDepartment, 
    userDepartments, 
    departmentStats,
    getDepartmentUsers,
    switchDepartment 
  } = useDepartment();

  const [isolationDemoVisible, setIsolationDemoVisible] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    recentActivity: [],
    quickStats: {
      totalStudents: 0,
      totalFaculty: 0,
      activeTimetables: 0,
      upcomingEvents: 0,
      completionRate: 0
    },
    notifications: [],
    upcomingEvents: [],
    departmentHighlights: [],
    weeklyTimetable: {}
  });

  // Weekly timetable data structure
  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00', 
    '11:00 - 12:00',
    '12:00 - 01:00',
    '01:00 - 02:00',
    '02:00 - 03:00',
    '03:00 - 04:00',
    '04:00 - 05:00'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (activeDepartment) {
      loadDepartmentDashboardData();
    }
  }, [activeDepartment]);

  const loadDepartmentDashboardData = async () => {
    if (!activeDepartment) return;

    // Department-specific data based on the active department
    const departmentSpecificData = getDepartmentSpecificData(activeDepartment.code);
    
    setDashboardData(departmentSpecificData);
  };

  // Generate department-specific content
  const getDepartmentSpecificData = (departmentCode: string) => {
    const baseStats = {
      totalStudents: departmentStats[activeDepartment?.id || '']?.studentCount || 45,
      totalFaculty: departmentStats[activeDepartment?.id || '']?.mentorCount || 2,
      activeTimetables: 3,
      upcomingEvents: 5,
      completionRate: 87
    };

    // Generate sample timetable data
    const generateTimetable = (deptCode: string) => {
      const timetable: Record<string, Record<string, any>> = {};
      
      weekDays.forEach(day => {
        timetable[day] = {};
        timeSlots.forEach((slot, index) => {
          if (slot === '12:00 - 01:00') {
            // Lunch break
            timetable[day][slot] = {
              type: 'break',
              subject: 'LUNCH BREAK',
              faculty: '',
              classroom: '',
              isBreak: true
            };
          } else {
            // Sample subjects based on department
            const subjects = getDepartmentSubjects(deptCode);
            const faculties = getDepartmentFaculties(deptCode);
            const classrooms = ['A101', 'A102', 'B201', 'B202', 'Lab-1', 'Lab-2', 'Lab-3'];
            
            const subjectIndex = (index + day.length) % subjects.length;
            const facultyIndex = (index + day.length) % faculties.length;
            const classroomIndex = (index + day.length) % classrooms.length;
            
            timetable[day][slot] = {
              type: subjects[subjectIndex].includes('Lab') ? 'lab' : 'lecture',
              subject: subjects[subjectIndex],
              faculty: faculties[facultyIndex],
              classroom: classrooms[classroomIndex]
            };
          }
        });
      });
      
      return timetable;
    };

    const getDepartmentSubjects = (code: string) => {
      switch (code) {
        case 'CSE':
          return ['Data Structures', 'Algorithm Analysis', 'Web Development', 'Database Systems', 'AI/ML Lab', 'Software Engineering', 'Computer Networks', 'Operating Systems'];
        case 'MECH':
          return ['Thermodynamics', 'Fluid Mechanics', 'Manufacturing Tech', 'CAD Lab', 'Machine Design', 'Materials Science', 'Heat Transfer', 'Production Engineering'];
        case 'CIVIL':
          return ['Structural Analysis', 'Concrete Technology', 'Surveying', 'Surveying Lab', 'Environmental Engg', 'Construction Management', 'Geotechnical Engg', 'Transportation Engg'];
        case 'EEE':
          return ['Power Systems', 'Control Systems', 'Electric Machines', 'Power Electronics Lab', 'Digital Electronics', 'Microprocessors', 'Circuit Analysis', 'Electrical Measurements'];
        case 'EXTC':
          return ['Communication Systems', 'Signal Processing', 'Microwave Engineering', 'Communication Lab', 'Digital Communication', 'Antenna Theory', 'VLSI Design', 'Embedded Systems'];
        default:
          return ['Subject 1', 'Subject 2', 'Subject 3', 'Lab 1', 'Subject 4', 'Subject 5', 'Subject 6', 'Subject 7'];
      }
    };

    const getDepartmentFaculties = (code: string) => {
      switch (code) {
        case 'CSE':
          return ['Dr. Rajesh Kumar', 'Prof. Priya Sharma', 'Dr. Amit Patel', 'Prof. Sneha Gupta'];
        case 'MECH':
          return ['Dr. Vikram Singh', 'Prof. Meera Joshi', 'Dr. Ravi Verma', 'Prof. Kavita Rao'];
        case 'CIVIL':
          return ['Dr. Suresh Reddy', 'Prof. Anita Menon', 'Dr. Prakash Iyer', 'Prof. Pooja Shah'];
        case 'EEE':
          return ['Dr. Ramesh Nair', 'Prof. Sunita Desai', 'Dr. Mohan Das', 'Prof. Rekha Pillai'];
        case 'EXTC':
          return ['Dr. Kiran Kumar', 'Prof. Deepa Jain', 'Dr. Sanjay Agarwal', 'Prof. Nisha Thakur'];
        default:
          return ['Dr. Faculty 1', 'Prof. Faculty 2', 'Dr. Faculty 3', 'Prof. Faculty 4'];
      }
    };

    switch (departmentCode) {
      case 'CSE':
        return {
          recentActivity: [
            {
              id: 1,
              type: 'workshop',
              description: 'AI/ML Workshop - Machine Learning Fundamentals',
              timestamp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Workshop',
              date: '2025-09-24',
              time: '10:00 AM'
            },
            {
              id: 2,
              type: 'event',
              description: 'Technical Symposium - Code Fest 2025',
              timestamp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Event',
              date: '2025-09-27',
              time: '9:00 AM'
            },
            {
              id: 3,
              type: 'seminar',
              description: 'Industry Expert Seminar - Web Development Trends',
              timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Seminar',
              date: '2025-09-29',
              time: '2:00 PM'
            },
            {
              id: 4,
              type: 'project',
              description: 'Final Year Project Review - Phase 1 Submissions',
              timestamp: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Academic',
              date: '2025-10-02',
              time: '11:00 AM'
            }
          ],
          quickStats: baseStats,
          departmentHighlights: [
            { title: 'AI/ML Research Lab', status: 'Active', color: 'blue' },
            { title: 'Software Development Projects', status: '12 Ongoing', color: 'green' },
            { title: 'Industry Partnerships', status: '8 Companies', color: 'purple' }
          ],
          notifications: [
            {
              id: 1,
              title: 'Code Review Session',
              message: 'Weekly code review session scheduled for Friday',
              priority: 'medium',
              departmentSpecific: true
            },
            {
              id: 2,
              title: 'AI Lab Access',
              message: 'New students can now access the AI/ML lab',
              priority: 'low',
              departmentSpecific: true
            }
          ],
          upcomingEvents: [
            { id: 1, title: 'Tech Symposium 2025', date: '2025-09-25', type: 'Conference', attendees: 150 },
            { id: 2, title: 'Coding Competition', date: '2025-09-30', type: 'Competition', attendees: 80 },
            { id: 3, title: 'Industry Visit - Google', date: '2025-10-05', type: 'Visit', attendees: 45 }
          ],
          weeklyTimetable: generateTimetable('CSE')
        };

      case 'MECH':
        return {
          recentActivity: [
            {
              id: 1,
              type: 'workshop',
              description: 'Advanced CAD/CAM workshop scheduled for mechanical students',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Workshop'
            },
            {
              id: 2,
              type: 'lab_maintenance',
              description: 'Manufacturing lab equipment maintenance completed',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Maintenance'
            },
            {
              id: 3,
              type: 'industry_project',
              description: 'New automation project collaboration with Tata Motors',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Industry'
            }
          ],
          quickStats: { ...baseStats, totalStudents: 52, activeTimetables: 4 },
          departmentHighlights: [
            { title: 'Manufacturing Lab', status: 'Operational', color: 'green' },
            { title: 'Thermal Engineering Projects', status: '8 Active', color: 'orange' },
            { title: 'Industry Collaborations', status: '5 Partners', color: 'blue' }
          ],
          notifications: [
            {
              id: 1,
              title: 'Lab Safety Training',
              message: 'Mandatory safety training for all mechanical lab users',
              priority: 'high',
              departmentSpecific: true
            },
            {
              id: 2,
              title: 'Equipment Upgrade',
              message: 'New CNC machines will be installed next month',
              priority: 'medium',
              departmentSpecific: true
            }
          ],
          upcomingEvents: [
            { id: 1, title: 'Mechanical Engineering Expo', date: '2025-09-28', type: 'Exhibition', attendees: 120 },
            { id: 2, title: 'Robotics Workshop', date: '2025-10-02', type: 'Workshop', attendees: 60 },
            { id: 3, title: 'Industry Expert Lecture', date: '2025-10-08', type: 'Lecture', attendees: 75 }
          ],
          weeklyTimetable: generateTimetable('MECH')
        };

      case 'CIVIL':
        return {
          recentActivity: [
            {
              id: 1,
              type: 'site_visit',
              description: 'Construction site visit to Mumbai Metro project scheduled',
              timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Field Visit'
            },
            {
              id: 2,
              type: 'research',
              description: 'Earthquake simulation lab research project approved',
              timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Research'
            },
            {
              id: 3,
              type: 'seminar',
              description: 'Sustainable construction materials seminar next Friday',
              timestamp: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Academic'
            }
          ],
          quickStats: { ...baseStats, totalStudents: 48, activeTimetables: 3, upcomingEvents: 7 },
          departmentHighlights: [
            { title: 'Structural Testing Lab', status: 'Active', color: 'orange' },
            { title: 'Environmental Projects', status: '6 Running', color: 'green' },
            { title: 'Government Projects', status: '3 Ongoing', color: 'blue' }
          ],
          notifications: [
            {
              id: 1,
              title: 'Site Visit Permission',
              message: 'Permission slips required for Mumbai Metro site visit',
              priority: 'high',
              departmentSpecific: true
            },
            {
              id: 2,
              title: 'Research Grant',
              message: 'New research grant approved for earthquake simulation',
              priority: 'medium',
              departmentSpecific: true
            }
          ],
          upcomingEvents: [
            { id: 1, title: 'Civil Engineering Summit', date: '2025-09-26', type: 'Summit', attendees: 100 },
            { id: 2, title: 'Infrastructure Design Contest', date: '2025-10-01', type: 'Competition', attendees: 50 },
            { id: 3, title: 'Smart City Planning Workshop', date: '2025-10-07', type: 'Workshop', attendees: 70 }
          ],
          weeklyTimetable: generateTimetable('CIVIL')
        };

      case 'EEE':
        return {
          recentActivity: [
            {
              id: 1,
              type: 'project',
              description: 'Smart Grid research project receives funding approval',
              timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Research'
            },
            {
              id: 2,
              type: 'equipment',
              description: 'New oscilloscopes and signal generators installed',
              timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Equipment'
            },
            {
              id: 3,
              type: 'placement',
              description: 'Power Grid Corporation campus recruitment next month',
              timestamp: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Placement'
            }
          ],
          quickStats: { ...baseStats, totalStudents: 55, totalFaculty: 3, activeTimetables: 5 },
          departmentHighlights: [
            { title: 'Power Electronics Lab', status: 'Upgraded', color: 'yellow' },
            { title: 'Renewable Energy Projects', status: '4 Active', color: 'green' },
            { title: 'Industry Tie-ups', status: '7 Companies', color: 'purple' }
          ],
          notifications: [
            {
              id: 1,
              title: 'Lab Equipment Training',
              message: 'Training session for new lab equipment this Thursday',
              priority: 'medium',
              departmentSpecific: true
            },
            {
              id: 2,
              title: 'Placement Drive',
              message: 'Power Grid Corporation recruitment starts next week',
              priority: 'high',
              departmentSpecific: true
            }
          ],
          upcomingEvents: [
            { id: 1, title: 'Power Systems Conference', date: '2025-09-29', type: 'Conference', attendees: 90 },
            { id: 2, title: 'Circuit Design Competition', date: '2025-10-03', type: 'Competition', attendees: 65 },
            { id: 3, title: 'Renewable Energy Seminar', date: '2025-10-10', type: 'Seminar', attendees: 85 }
          ],
          weeklyTimetable: generateTimetable('EEE')
        };

      case 'EXTC':
        return {
          recentActivity: [
            {
              id: 1,
              type: 'innovation',
              description: '5G communication lab setup completed successfully',
              timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Innovation'
            },
            {
              id: 2,
              type: 'internship',
              description: 'Summer internship program with Qualcomm announced',
              timestamp: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Internship'
            },
            {
              id: 3,
              type: 'research',
              description: 'IoT research project wins national level competition',
              timestamp: new Date(Date.now() - 5.8 * 60 * 60 * 1000).toISOString(),
              departmentSpecific: true,
              category: 'Achievement'
            }
          ],
          quickStats: { ...baseStats, totalStudents: 50, activeTimetables: 4, completionRate: 92 },
          departmentHighlights: [
            { title: 'Communication Systems Lab', status: '5G Ready', color: 'blue' },
            { title: 'IoT Development Projects', status: '10 Active', color: 'purple' },
            { title: 'Research Publications', status: '15 This Year', color: 'green' }
          ],
          notifications: [
            {
              id: 1,
              title: '5G Lab Access',
              message: 'Final year students can now access the 5G communication lab',
              priority: 'medium',
              departmentSpecific: true
            },
            {
              id: 2,
              title: 'Internship Applications',
              message: 'Qualcomm internship applications due by Friday',
              priority: 'high',
              departmentSpecific: true
            }
          ],
          upcomingEvents: [
            { id: 1, title: 'Electronics Innovation Fair', date: '2025-09-27', type: 'Fair', attendees: 110 },
            { id: 2, title: 'Wireless Technology Workshop', date: '2025-10-04', type: 'Workshop', attendees: 55 },
            { id: 3, title: 'Telecom Industry Meet', date: '2025-10-09', type: 'Industry Meet', attendees: 95 }
          ],
          weeklyTimetable: generateTimetable('EXTC')
        };

      default:
        return {
          recentActivity: [],
          quickStats: baseStats,
          departmentHighlights: [],
          notifications: [],
          upcomingEvents: [],
          weeklyTimetable: generateTimetable('DEFAULT')
        };
    }
  };

  if (!activeDepartment) {
    return (
      <div className="p-6">
        <Alert>
          <Building2 className="h-4 w-4" />
          <AlertDescription>
            Please select a department to view the dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <DepartmentThemed className="p-6 space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.first_name}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  Ready to explore your {activeDepartment.name} dashboard
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Your Department</p>
                <Badge 
                  className="dept-themed-badge text-white"
                  style={{ backgroundColor: activeDepartment.colorTheme }}
                >
                  {activeDepartment.code}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header with Navigation Icons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div 
            className="w-12 h-12 rounded-full dept-color-indicator flex items-center justify-center"
            data-color={activeDepartment.colorTheme}
          >
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{activeDepartment.name}</h2>
            <p className="text-muted-foreground">{activeDepartment.description}</p>
          </div>
        </div>
        
        {/* Top Right Icons */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Palette className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span className="hidden md:inline">{user?.first_name}</span>
          </Button>
        </div>
      </div>

      {/* Department Badge */}
      <div className="flex items-center space-x-2 mb-6">
        <Badge variant="outline" className="department-isolated">
          Isolated Workspace
        </Badge>
        <Badge 
          className="dept-themed-badge"
          data-color={activeDepartment.colorTheme}
        >
          {activeDepartment.code}
        </Badge>
      </div>

      {/* Department Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Department Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Department</h4>
              <p className="font-semibold">{activeDepartment.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{activeDepartment.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Head of Department</h4>
              <p className="font-semibold">{activeDepartment.headOfDepartment}</p>
              <p className="text-sm text-muted-foreground mt-1">{activeDepartment.contactEmail}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Statistics</h4>
              <div className="flex items-center space-x-4 text-sm">
                <span><strong>{dashboardData.quickStats.totalStudents}</strong> Students</span>
                <span><strong>{dashboardData.quickStats.totalFaculty}</strong> Faculty</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events/Workshops Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Events & Workshops</span>
            <Badge variant="outline" className="ml-2">
              {activeDepartment.code} Only
            </Badge>
          </CardTitle>
          <CardDescription>
            Important upcoming activities and events in {activeDepartment.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData.recentActivity.map((event, index) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow border-l-4" 
                    style={{ borderLeftColor: 
                      event.category === 'Workshop' ? '#3B82F6' :
                      event.category === 'Event' ? '#10B981' :
                      event.category === 'Seminar' ? '#8B5CF6' :
                      event.category === 'Academic' ? '#F59E0B' :
                      '#6B7280'
                    }}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.category === 'Workshop' ? 'bg-blue-100 text-blue-600' :
                        event.category === 'Event' ? 'bg-green-100 text-green-600' :
                        event.category === 'Seminar' ? 'bg-purple-100 text-purple-600' :
                        event.category === 'Academic' ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {event.category === 'Workshop' && <Users className="h-5 w-5" />}
                        {event.category === 'Event' && <Calendar className="h-5 w-5" />}
                        {event.category === 'Seminar' && <BookOpen className="h-5 w-5" />}
                        {event.category === 'Academic' && <GraduationCap className="h-5 w-5" />}
                        {!['Workshop', 'Event', 'Seminar', 'Academic'].includes(event.category) && <Activity className="h-5 w-5" />}
                      </div>
                      <Badge 
                        variant={event.category === 'Workshop' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {event.category}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm leading-tight mb-2">{event.description}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium text-green-600">Upcoming</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Timetable Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Weekly Timetable</span>
            <Badge variant="outline" className="ml-2">
              {activeDepartment.code}
            </Badge>
          </CardTitle>
          <CardDescription>
            Your weekly class schedule from Monday to Saturday
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-50 font-semibold text-left min-w-[120px]">
                    Time
                  </th>
                  {weekDays.map(day => (
                    <th key={day} className="border border-gray-300 p-2 bg-gray-50 font-semibold text-center min-w-[180px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(timeSlot => (
                  <tr key={timeSlot}>
                    <td className="border border-gray-300 p-2 font-medium bg-gray-50">
                      {timeSlot}
                    </td>
                    {weekDays.map(day => {
                      const classData = dashboardData.weeklyTimetable[day]?.[timeSlot];
                      return (
                        <td key={`${day}-${timeSlot}`} className="border border-gray-300 p-2">
                          {classData ? (
                            <div className={`p-3 rounded-lg text-sm ${
                              classData.isBreak 
                                ? 'bg-orange-100 text-orange-800 text-center font-medium' 
                                : classData.type === 'lab' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              <div className="font-semibold mb-1">{classData.subject}</div>
                              {!classData.isBreak && (
                                <>
                                  <div className="flex items-center space-x-1 mb-1">
                                    <User className="h-3 w-3" />
                                    <span className="text-xs">{classData.faculty}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="text-xs">{classData.classroom}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="text-center text-gray-400 text-sm">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DepartmentThemed>
  );
}

// ============================================================================
// DEPARTMENT COMPARISON DEMO COMPONENT
// ============================================================================

/**
 * Component to demonstrate data isolation between departments
 * This would typically be admin-only to show the isolation concept
 */
export function DepartmentIsolationDemo() {
  const { user } = useAuth();
  const { userDepartments, activeDepartment } = useDepartment();
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);

  // Only show to admins or for demo purposes
  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <Card className="border-2 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-yellow-800">
          <Shield className="h-5 w-5" />
          <span>Department Isolation Demonstration</span>
        </CardTitle>
        <CardDescription className="text-yellow-700">
          Admin view: This demonstrates how data is isolated between departments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userDepartments.map((dept) => (
              <Card key={dept.id} className="border-2 hover:border-primary/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full dept-color-indicator"
                        data-color={dept.colorTheme}
                      />
                      <div>
                        <p className="font-medium">{dept.name}</p>
                        <p className="text-sm text-muted-foreground">{dept.code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Data Count</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 100) + 50} records
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    🔒 Only {dept.code} users can see this data
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Each department's data is completely isolated. Students and faculty from 
              Civil Engineering cannot access Computer Science data, and vice versa.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}