import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Users, Calendar, GraduationCap, Building, Mail, Phone, MapPin, Edit, Trash2, UserPlus, Crown, BookOpen, DoorOpen, User, ArrowLeft, CheckCircle } from 'lucide-react';

// Mock data for demonstration
const mockDepartments = [
  {
    id: '1',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    description: 'Department of Computer Science and Engineering focusing on modern computing technologies.',
    head_of_department: { id: '1', first_name: 'Dr. John', last_name: 'Smith', email: 'john.smith@college.edu' },
    established_year: 2010,
    contact_email: 'cse@college.edu',
    contact_phone: '+1-234-567-8900',
    building: 'Technology Block',
    floor_number: 3,
    mentor_count: 3,
    event_count: 15,
    faculty_count: 25,
    student_count: 450,
    is_active: true
  },
  {
    id: '2',
    name: 'Electronics & Communication',
    code: 'ECE',
    description: 'Department of Electronics and Communication Engineering.',
    head_of_department: { id: '2', first_name: 'Dr. Sarah', last_name: 'Johnson', email: 'sarah.johnson@college.edu' },
    established_year: 2008,
    contact_email: 'ece@college.edu',
    contact_phone: '+1-234-567-8901',
    building: 'Engineering Block',
    floor_number: 2,
    mentor_count: 2,
    event_count: 8,
    faculty_count: 20,
    student_count: 380,
    is_active: true
  },
  {
    id: '3',
    name: 'Mechanical Engineering',
    code: 'MECH',
    description: 'Department of Mechanical Engineering.',
    head_of_department: { id: '3', first_name: 'Dr. Michael', last_name: 'Brown', email: 'michael.brown@college.edu' },
    established_year: 2005,
    contact_email: 'mech@college.edu',
    contact_phone: '+1-234-567-8902',
    building: 'Engineering Block',
    floor_number: 1,
    mentor_count: 3,
    event_count: 12,
    faculty_count: 22,
    student_count: 400,
    is_active: true
  },
  {
    id: '4',
    name: 'Civil Engineering',
    code: 'CIVIL',
    description: 'Department of Civil Engineering focusing on infrastructure and construction.',
    head_of_department: { id: '4', first_name: 'Dr. Lisa', last_name: 'Wilson', email: 'lisa.wilson@college.edu' },
    established_year: 2006,
    contact_email: 'civil@college.edu',
    contact_phone: '+1-234-567-8903',
    building: 'Engineering Block',
    floor_number: 4,
    mentor_count: 2,
    event_count: 10,
    faculty_count: 18,
    student_count: 350,
    is_active: true
  },
  {
    id: '5',
    name: 'Electrical Engineering',
    code: 'EEE',
    description: 'Department of Electrical and Electronics Engineering.',
    head_of_department: { id: '5', first_name: 'Dr. David', last_name: 'Garcia', email: 'david.garcia@college.edu' },
    established_year: 2007,
    contact_email: 'eee@college.edu',
    contact_phone: '+1-234-567-8904',
    building: 'Technology Block',
    floor_number: 2,
    mentor_count: 2,
    event_count: 9,
    faculty_count: 19,
    student_count: 370,
    is_active: true
  }
];

const mockUsers = [
  { id: '1', username: 'jsmith', email: 'john.smith@college.edu', first_name: 'Dr. John', last_name: 'Smith', role: 'admin' },
  { id: '2', username: 'sjohnson', email: 'sarah.johnson@college.edu', first_name: 'Dr. Sarah', last_name: 'Johnson', role: 'admin' },
  { id: '3', username: 'mbrown', email: 'michael.brown@college.edu', first_name: 'Dr. Michael', last_name: 'Brown', role: 'admin' },
  { id: '4', username: 'lwilson', email: 'lisa.wilson@college.edu', first_name: 'Dr. Lisa', last_name: 'Wilson', role: 'admin' },
  { id: '5', username: 'dgarcia', email: 'david.garcia@college.edu', first_name: 'Dr. David', last_name: 'Garcia', role: 'admin' },
  { id: '6', username: 'awilson', email: 'alice.wilson@college.edu', first_name: 'Dr. Alice', last_name: 'Wilson', role: 'mentor' }
];

// Mock faculty data for each department
const mockFaculty = {
  '1': [ // CSE
    { id: 'fac-1', name: 'Dr. John Smith', employeeId: 'FAC001', designation: 'Professor', specialization: 'Data Structures, Algorithms', email: 'john.smith@college.edu', experience: 15 },
    { id: 'fac-2', name: 'Prof. Sarah Johnson', employeeId: 'FAC002', designation: 'Associate Professor', specialization: 'Database Systems, Software Engineering', email: 'sarah.johnson@college.edu', experience: 12 },
    { id: 'fac-3', name: 'Dr. Mike Wilson', employeeId: 'FAC003', designation: 'Assistant Professor', specialization: 'Machine Learning, AI', email: 'mike.wilson@college.edu', experience: 8 },
    { id: 'fac-4', name: 'Prof. Emily Davis', employeeId: 'FAC004', designation: 'Associate Professor', specialization: 'Computer Networks, Cybersecurity', email: 'emily.davis@college.edu', experience: 10 },
    { id: 'fac-5', name: 'Dr. Robert Taylor', employeeId: 'FAC005', designation: 'Professor', specialization: 'Operating Systems, System Programming', email: 'robert.taylor@college.edu', experience: 18 }
  ],
  '2': [ // ECE
    { id: 'fac-6', name: 'Dr. Lisa Chen', employeeId: 'FAC006', designation: 'Professor', specialization: 'Digital Signal Processing, Communications', email: 'lisa.chen@college.edu', experience: 16 },
    { id: 'fac-7', name: 'Prof. Mark Anderson', employeeId: 'FAC007', designation: 'Associate Professor', specialization: 'VLSI Design, Embedded Systems', email: 'mark.anderson@college.edu', experience: 11 },
    { id: 'fac-8', name: 'Dr. Rachel Brown', employeeId: 'FAC008', designation: 'Assistant Professor', specialization: 'Microwave Engineering, Antennas', email: 'rachel.brown@college.edu', experience: 7 },
    { id: 'fac-9', name: 'Prof. David White', employeeId: 'FAC009', designation: 'Associate Professor', specialization: 'Power Electronics, Control Systems', email: 'david.white@college.edu', experience: 13 }
  ],
  '3': [ // MECH
    { id: 'fac-10', name: 'Dr. James Miller', employeeId: 'FAC010', designation: 'Professor', specialization: 'Thermodynamics, Heat Transfer', email: 'james.miller@college.edu', experience: 20 },
    { id: 'fac-11', name: 'Prof. Anna Garcia', employeeId: 'FAC011', designation: 'Associate Professor', specialization: 'Fluid Mechanics, CFD', email: 'anna.garcia@college.edu', experience: 14 },
    { id: 'fac-12', name: 'Dr. Tom Wilson', employeeId: 'FAC012', designation: 'Assistant Professor', specialization: 'Manufacturing, CAD/CAM', email: 'tom.wilson@college.edu', experience: 9 },
    { id: 'fac-13', name: 'Prof. Kate Johnson', employeeId: 'FAC013', designation: 'Associate Professor', specialization: 'Materials Science, Strength of Materials', email: 'kate.johnson@college.edu', experience: 12 }
  ],
  '4': [ // CIVIL
    { id: 'fac-14', name: 'Dr. Lisa Wilson', employeeId: 'FAC014', designation: 'Professor', specialization: 'Structural Engineering, Earthquake Engineering', email: 'lisa.wilson@college.edu', experience: 17 },
    { id: 'fac-15', name: 'Prof. Michael Brown', employeeId: 'FAC015', designation: 'Associate Professor', specialization: 'Transportation Engineering, Highway Design', email: 'michael.brown@college.edu', experience: 13 },
    { id: 'fac-16', name: 'Dr. Sandra Lee', employeeId: 'FAC016', designation: 'Assistant Professor', specialization: 'Environmental Engineering, Water Resources', email: 'sandra.lee@college.edu', experience: 8 },
    { id: 'fac-17', name: 'Prof. Robert Kim', employeeId: 'FAC017', designation: 'Associate Professor', specialization: 'Geotechnical Engineering, Foundation Design', email: 'robert.kim@college.edu', experience: 11 }
  ],
  '5': [ // EEE
    { id: 'fac-18', name: 'Dr. David Garcia', employeeId: 'FAC018', designation: 'Professor', specialization: 'Power Systems, Renewable Energy', email: 'david.garcia@college.edu', experience: 19 },
    { id: 'fac-19', name: 'Prof. Maria Rodriguez', employeeId: 'FAC019', designation: 'Associate Professor', specialization: 'Electric Machines, Motor Drives', email: 'maria.rodriguez@college.edu', experience: 12 },
    { id: 'fac-20', name: 'Dr. Thomas Anderson', employeeId: 'FAC020', designation: 'Assistant Professor', specialization: 'Power Electronics, Grid Integration', email: 'thomas.anderson@college.edu', experience: 9 },
    { id: 'fac-21', name: 'Prof. Jennifer Clark', employeeId: 'FAC021', designation: 'Associate Professor', specialization: 'Control Systems, Automation', email: 'jennifer.clark@college.edu', experience: 14 }
  ]
};

// Mock subjects data for each department
const mockSubjects = {
  '1': [ // CSE
    { id: 'sub-1', name: 'Data Structures and Algorithms', code: 'CS201', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 3, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-2', name: 'Database Management Systems', code: 'CS301', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 5, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-3', name: 'Computer Networks', code: 'CS302', credits: 3, lecturesPerWeek: 3, labsPerWeek: 0, semester: 5, requiresLab: false, type: 'Theory' },
    { id: 'sub-4', name: 'Operating Systems', code: 'CS303', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 4, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-5', name: 'Software Engineering', code: 'CS401', credits: 3, lecturesPerWeek: 3, labsPerWeek: 0, semester: 7, requiresLab: false, type: 'Theory' },
    { id: 'sub-6', name: 'Machine Learning', code: 'CS402', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 7, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-7', name: 'Web Development', code: 'CS403', credits: 3, lecturesPerWeek: 2, labsPerWeek: 2, semester: 6, requiresLab: true, type: 'Practical' }
  ],
  '2': [ // ECE
    { id: 'sub-8', name: 'Digital Signal Processing', code: 'EC301', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 5, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-9', name: 'Communication Systems', code: 'EC302', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 6, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-10', name: 'VLSI Design', code: 'EC401', credits: 3, lecturesPerWeek: 3, labsPerWeek: 0, semester: 7, requiresLab: false, type: 'Theory' },
    { id: 'sub-11', name: 'Embedded Systems', code: 'EC402', credits: 4, lecturesPerWeek: 2, labsPerWeek: 2, semester: 7, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-12', name: 'Microwave Engineering', code: 'EC403', credits: 3, lecturesPerWeek: 3, labsPerWeek: 0, semester: 8, requiresLab: false, type: 'Theory' },
    { id: 'sub-13', name: 'Power Electronics', code: 'EC404', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 6, requiresLab: true, type: 'Theory + Lab' }
  ],
  '3': [ // MECH
    { id: 'sub-14', name: 'Thermodynamics', code: 'ME301', credits: 4, lecturesPerWeek: 4, labsPerWeek: 0, semester: 5, requiresLab: false, type: 'Theory' },
    { id: 'sub-15', name: 'Fluid Mechanics', code: 'ME302', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 5, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-16', name: 'Machine Design', code: 'ME401', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 7, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-17', name: 'Manufacturing Technology', code: 'ME402', credits: 3, lecturesPerWeek: 2, labsPerWeek: 2, semester: 6, requiresLab: true, type: 'Practical' },
    { id: 'sub-18', name: 'Heat Transfer', code: 'ME403', credits: 3, lecturesPerWeek: 3, labsPerWeek: 0, semester: 6, requiresLab: false, type: 'Theory' },
    { id: 'sub-19', name: 'Materials Science', code: 'ME404', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 4, requiresLab: true, type: 'Theory + Lab' }
  ],
  '4': [ // CIVIL
    { id: 'sub-20', name: 'Structural Analysis', code: 'CE301', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 5, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-21', name: 'Concrete Technology', code: 'CE302', credits: 3, lecturesPerWeek: 3, labsPerWeek: 0, semester: 5, requiresLab: false, type: 'Theory' },
    { id: 'sub-22', name: 'Transportation Engineering', code: 'CE401', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 7, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-23', name: 'Environmental Engineering', code: 'CE402', credits: 3, lecturesPerWeek: 3, labsPerWeek: 0, semester: 6, requiresLab: false, type: 'Theory' },
    { id: 'sub-24', name: 'Geotechnical Engineering', code: 'CE403', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 6, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-25', name: 'Construction Management', code: 'CE404', credits: 3, lecturesPerWeek: 3, labsPerWeek: 0, semester: 8, requiresLab: false, type: 'Theory' }
  ],
  '5': [ // EEE
    { id: 'sub-26', name: 'Power Systems', code: 'EE301', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 5, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-27', name: 'Electric Machines', code: 'EE302', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 6, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-28', name: 'Power Electronics', code: 'EE401', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 7, requiresLab: true, type: 'Theory + Lab' },
    { id: 'sub-29', name: 'Control Systems', code: 'EE402', credits: 3, lecturesPerWeek: 3, labsPerWeek: 0, semester: 6, requiresLab: false, type: 'Theory' },
    { id: 'sub-30', name: 'Renewable Energy Systems', code: 'EE403', credits: 3, lecturesPerWeek: 3, labsPerWeek: 0, semester: 8, requiresLab: false, type: 'Theory' },
    { id: 'sub-31', name: 'High Voltage Engineering', code: 'EE404', credits: 4, lecturesPerWeek: 3, labsPerWeek: 1, semester: 7, requiresLab: true, type: 'Theory + Lab' }
  ]
};

// Mock classrooms data for each department
const mockClassrooms = {
  '1': [ // CSE
    { id: 'class-1', name: 'CS Lab 1', capacity: 30, type: 'Lab', building: 'Technology Block', floor: 3, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'High-end PCs, Programming Software' },
    { id: 'class-2', name: 'CS Lab 2', capacity: 30, type: 'Lab', building: 'Technology Block', floor: 3, hasProjector: true, hasSmartboard: false, hasAC: true, equipment: 'PCs, Development Environment' },
    { id: 'class-3', name: 'Lecture Hall A', capacity: 60, type: 'Lecture', building: 'Technology Block', floor: 2, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'Audio System, Projector' },
    { id: 'class-4', name: 'Lecture Hall B', capacity: 60, type: 'Lecture', building: 'Technology Block', floor: 2, hasProjector: true, hasSmartboard: false, hasAC: true, equipment: 'Projector, Whiteboard' },
    { id: 'class-5', name: 'Seminar Room 1', capacity: 25, type: 'Seminar', building: 'Technology Block', floor: 3, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'Conference Setup' }
  ],
  '2': [ // ECE
    { id: 'class-6', name: 'Electronics Lab 1', capacity: 25, type: 'Lab', building: 'Engineering Block', floor: 2, hasProjector: true, hasSmartboard: false, hasAC: true, equipment: 'Oscilloscopes, Function Generators' },
    { id: 'class-7', name: 'Communications Lab', capacity: 25, type: 'Lab', building: 'Engineering Block', floor: 2, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'Signal Analyzers, DSP Kits' },
    { id: 'class-8', name: 'ECE Lecture Room A', capacity: 50, type: 'Lecture', building: 'Engineering Block', floor: 1, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'Audio-Visual System' },
    { id: 'class-9', name: 'ECE Lecture Room B', capacity: 50, type: 'Lecture', building: 'Engineering Block', floor: 1, hasProjector: true, hasSmartboard: false, hasAC: true, equipment: 'Projector, Sound System' },
    { id: 'class-10', name: 'VLSI Design Lab', capacity: 20, type: 'Lab', building: 'Engineering Block', floor: 3, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'CAD Workstations, Design Software' }
  ],
  '3': [ // MECH
    { id: 'class-11', name: 'Manufacturing Lab', capacity: 20, type: 'Lab', building: 'Engineering Block', floor: 1, hasProjector: false, hasSmartboard: false, hasAC: false, equipment: 'CNC Machines, Lathes, Milling Machines' },
    { id: 'class-12', name: 'Fluid Mechanics Lab', capacity: 25, type: 'Lab', building: 'Engineering Block', floor: 1, hasProjector: true, hasSmartboard: false, hasAC: true, equipment: 'Flow Measurement Apparatus' },
    { id: 'class-13', name: 'MECH Lecture Hall A', capacity: 55, type: 'Lecture', building: 'Engineering Block', floor: 2, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'Projection System' },
    { id: 'class-14', name: 'MECH Lecture Hall B', capacity: 55, type: 'Lecture', building: 'Engineering Block', floor: 2, hasProjector: true, hasSmartboard: false, hasAC: true, equipment: 'Audio System' },
    { id: 'class-15', name: 'CAD Lab', capacity: 30, type: 'Lab', building: 'Engineering Block', floor: 3, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'CAD Workstations, Design Software' }
  ],
  '4': [ // CIVIL
    { id: 'class-16', name: 'Structures Lab', capacity: 25, type: 'Lab', building: 'Engineering Block', floor: 4, hasProjector: true, hasSmartboard: false, hasAC: true, equipment: 'Universal Testing Machine, Strain Gauges' },
    { id: 'class-17', name: 'Concrete Testing Lab', capacity: 20, type: 'Lab', building: 'Engineering Block', floor: 4, hasProjector: false, hasSmartboard: false, hasAC: false, equipment: 'Compression Testing Machine, Concrete Mixer' },
    { id: 'class-18', name: 'CIVIL Lecture Hall A', capacity: 50, type: 'Lecture', building: 'Engineering Block', floor: 4, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'Audio-Visual System' },
    { id: 'class-19', name: 'CIVIL Lecture Hall B', capacity: 50, type: 'Lecture', building: 'Engineering Block', floor: 4, hasProjector: true, hasSmartboard: false, hasAC: true, equipment: 'Projector, Sound System' },
    { id: 'class-20', name: 'Survey Lab', capacity: 30, type: 'Lab', building: 'Engineering Block', floor: 3, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'Total Station, Theodolite, GPS' }
  ],
  '5': [ // EEE
    { id: 'class-21', name: 'Power Systems Lab', capacity: 25, type: 'Lab', building: 'Technology Block', floor: 2, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'Power Analyzers, Protection Relays' },
    { id: 'class-22', name: 'Machines Lab', capacity: 20, type: 'Lab', building: 'Technology Block', floor: 2, hasProjector: false, hasSmartboard: false, hasAC: false, equipment: 'DC/AC Motors, Generators, Dynamometer' },
    { id: 'class-23', name: 'EEE Lecture Hall A', capacity: 55, type: 'Lecture', building: 'Technology Block', floor: 1, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'Audio-Visual System' },
    { id: 'class-24', name: 'EEE Lecture Hall B', capacity: 55, type: 'Lecture', building: 'Technology Block', floor: 1, hasProjector: true, hasSmartboard: false, hasAC: true, equipment: 'Projector, Sound System' },
    { id: 'class-25', name: 'Control Systems Lab', capacity: 30, type: 'Lab', building: 'Technology Block', floor: 3, hasProjector: true, hasSmartboard: true, hasAC: true, equipment: 'MATLAB Simulink, Control Hardware' }
  ]
};

interface DepartmentFormData {
  name: string;
  code: string;
  description: string;
  head_of_department_id: string;
  established_year: number;
  contact_email: string;
  contact_phone: string;
  building: string;
  floor_number: number;
}

export default function Departments() {
  const [departments, setDepartments] = useState(mockDepartments);
  const [selectedDepartmentForView, setSelectedDepartmentForView] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [isAssignMentorOpen, setIsAssignMentorOpen] = useState(false);
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    code: '',
    description: '',
    head_of_department_id: '',
    established_year: new Date().getFullYear(),
    contact_email: '',
    contact_phone: '',
    building: '',
    floor_number: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDepartment) {
      // Update existing department
      const updatedDepartment = {
        ...selectedDepartment,
        ...formData,
        head_of_department: mockUsers.find(u => u.id === formData.head_of_department_id)
      };
      setDepartments(departments.map(d => d.id === selectedDepartment.id ? updatedDepartment : d));
      setIsEditDialogOpen(false);
    } else {
      // Add new department
      const newDepartment = {
        id: Date.now().toString(),
        ...formData,
        head_of_department: mockUsers.find(u => u.id === formData.head_of_department_id),
        mentor_count: 0,
        event_count: 0,
        faculty_count: 0,
        student_count: 0,
        is_active: true
      };
      setDepartments([...departments, newDepartment]);
      setIsAddDialogOpen(false);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      head_of_department_id: '',
      established_year: new Date().getFullYear(),
      contact_email: '',
      contact_phone: '',
      building: '',
      floor_number: 1
    });
    setSelectedDepartment(null);
  };

  const handleEdit = (department: any) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description || '',
      head_of_department_id: department.head_of_department?.id || '',
      established_year: department.established_year || new Date().getFullYear(),
      contact_email: department.contact_email || '',
      contact_phone: department.contact_phone || '',
      building: department.building || '',
      floor_number: department.floor_number || 1
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (departmentId: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== departmentId));
    }
  };

  const DepartmentForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Department Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Computer Science & Engineering"
            required
          />
        </div>
        <div>
          <Label htmlFor="code">Department Code</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="CSE"
            maxLength={10}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the department..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="head">Head of Department</Label>
          <Select value={formData.head_of_department_id} onValueChange={(value) => setFormData({ ...formData, head_of_department_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Head of Department" />
            </SelectTrigger>
            <SelectContent>
              {mockUsers.filter(u => u.role === 'admin' || u.role === 'mentor').map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="year">Established Year</Label>
          <Input
            id="year"
            type="number"
            value={formData.established_year}
            onChange={(e) => setFormData({ ...formData, established_year: parseInt(e.target.value) })}
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Contact Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            placeholder="dept@college.edu"
          />
        </div>
        <div>
          <Label htmlFor="phone">Contact Phone</Label>
          <Input
            id="phone"
            value={formData.contact_phone}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            placeholder="+1-234-567-8900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="building">Building</Label>
          <Input
            id="building"
            value={formData.building}
            onChange={(e) => setFormData({ ...formData, building: e.target.value })}
            placeholder="Technology Block"
          />
        </div>
        <div>
          <Label htmlFor="floor">Floor Number</Label>
          <Input
            id="floor"
            type="number"
            value={formData.floor_number}
            onChange={(e) => setFormData({ ...formData, floor_number: parseInt(e.target.value) })}
            min="0"
            max="20"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button type="submit">
          {selectedDepartment ? 'Update Department' : 'Add Department'}
        </Button>
      </div>
    </form>
  );

  // Department Details View Component
  const DepartmentDetailsView = ({ department }: { department: any }) => {
    const faculty = mockFaculty[department.id] || [];
    const subjects = mockSubjects[department.id] || [];
    const classrooms = mockClassrooms[department.id] || [];

    return (
      <div className="p-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDepartmentForView(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Departments
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{department.name}</h1>
            <p className="text-gray-600 mt-1">
              <Badge variant="secondary" className="mr-2">{department.code}</Badge>
              Complete department information and resources
            </p>
          </div>
        </div>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Department Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-600">{faculty.length}</p>
                <p className="text-sm text-gray-600">Faculty Members</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-600">{subjects.length}</p>
                <p className="text-sm text-gray-600">Subjects Offered</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <DoorOpen className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-purple-600">{classrooms.length}</p>
                <p className="text-sm text-gray-600">Classrooms Available</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <GraduationCap className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold text-orange-600">{department.student_count}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="faculty" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
          </TabsList>

          <TabsContent value="faculty" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Faculty Members ({faculty.length})
                </CardTitle>
                <CardDescription>
                  Complete list of faculty members in {department.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {faculty.map((member: any) => (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.designation}</p>
                          <p className="text-sm text-blue-600 font-medium">ID: {member.employeeId}</p>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Specialization:</p>
                            <p className="text-sm text-gray-600">{member.specialization}</p>
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-3 w-3 mr-1" />
                              {member.email}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {member.experience} years exp.
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Subjects Offered ({subjects.length})
                </CardTitle>
                <CardDescription>
                  Curriculum and subjects taught in {department.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Subject Code</th>
                        <th className="text-left p-3 font-medium">Subject Name</th>
                        <th className="text-left p-3 font-medium">Credits</th>
                        <th className="text-left p-3 font-medium">Semester</th>
                        <th className="text-left p-3 font-medium">Lectures/Week</th>
                        <th className="text-left p-3 font-medium">Labs/Week</th>
                        <th className="text-left p-3 font-medium">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject: any) => (
                        <tr key={subject.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{subject.code}</td>
                          <td className="p-3">{subject.name}</td>
                          <td className="p-3">{subject.credits}</td>
                          <td className="p-3">Sem {subject.semester}</td>
                          <td className="p-3">{subject.lecturesPerWeek}</td>
                          <td className="p-3">{subject.labsPerWeek}</td>
                          <td className="p-3">
                            <Badge variant={subject.requiresLab ? "default" : "secondary"} className="text-xs">
                              {subject.type}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classrooms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DoorOpen className="h-5 w-5 mr-2" />
                  Classrooms & Labs ({classrooms.length})
                </CardTitle>
                <CardDescription>
                  Available classrooms and laboratory facilities in {department.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {classrooms.map((classroom: any) => (
                    <Card key={classroom.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{classroom.name}</h4>
                            <p className="text-sm text-gray-600">
                              {classroom.building}, Floor {classroom.floor}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={classroom.type === 'Lab' ? 'default' : 'secondary'} className="text-xs">
                                {classroom.type}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                Capacity: {classroom.capacity}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Facilities */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Facilities:</p>
                          <div className="flex flex-wrap gap-1">
                            {classroom.hasProjector && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Projector
                              </Badge>
                            )}
                            {classroom.hasSmartboard && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Smartboard
                              </Badge>
                            )}
                            {classroom.hasAC && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                AC
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Equipment */}
                        {classroom.equipment && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-700">Equipment:</p>
                            <p className="text-xs text-gray-600">{classroom.equipment}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // If a department is selected for viewing, show the details view
  if (selectedDepartmentForView) {
    return <DepartmentDetailsView department={selectedDepartmentForView} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-1">Manage college departments and their configurations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>
                Create a new department with complete details and configurations.
              </DialogDescription>
            </DialogHeader>
            <DepartmentForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Departments</p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Mentors</p>
                <p className="text-2xl font-bold text-gray-900">{departments.reduce((sum, d) => sum + d.mentor_count, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-gray-900">{departments.reduce((sum, d) => sum + d.event_count, 0)}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{departments.reduce((sum, d) => sum + d.student_count, 0)}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-based Access Alert */}
      <Alert>
        <Users className="h-4 w-4" />
        <AlertDescription>
          <strong>Access Control:</strong> Each department can have a maximum of 3 mentors who can create events. 
          Students have view-only access to events. Admins have full access to all departments.
        </AlertDescription>
      </Alert>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{department.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="mr-2">{department.code}</Badge>
                    Est. {department.established_year}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(department)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(department.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Head of Department */}
              {department.head_of_department && (
                <div className="flex items-center text-sm">
                  <Crown className="h-4 w-4 mr-2 text-yellow-600" />
                  <span className="font-medium">
                    {department.head_of_department.first_name} {department.head_of_department.last_name}
                  </span>
                </div>
              )}

              {/* Description */}
              {department.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {department.description}
                </p>
              )}

              {/* Contact Information */}
              <div className="space-y-1">
                {department.contact_email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-3 w-3 mr-2" />
                    {department.contact_email}
                  </div>
                )}
                {department.contact_phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-3 w-3 mr-2" />
                    {department.contact_phone}
                  </div>
                )}
                {department.building && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-2" />
                    {department.building}{department.floor_number && `, Floor ${department.floor_number}`}
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{department.mentor_count}/3</p>
                  <p className="text-xs text-gray-600">Mentors</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{department.event_count}</p>
                  <p className="text-xs text-gray-600">Events</p>
                </div>
              </div>

              {/* Assign Mentor Button */}
              <div className="space-y-2">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedDepartmentForView(department)}
                >
                  <Building className="h-4 w-4 mr-2" />
                  View Department Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={department.mentor_count >= 3}
                  onClick={() => {
                    setSelectedDepartment(department);
                    setIsAssignMentorOpen(true);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {department.mentor_count >= 3 ? 'Mentor Limit Reached' : 'Assign Mentor'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department information and configurations.
            </DialogDescription>
          </DialogHeader>
          <DepartmentForm />
        </DialogContent>
      </Dialog>

      {/* Assign Mentor Dialog */}
      <Dialog open={isAssignMentorOpen} onOpenChange={setIsAssignMentorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Mentor</DialogTitle>
            <DialogDescription>
              Assign a mentor to {selectedDepartment?.name}. Maximum 3 mentors per department.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select User</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user to assign as mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.filter(u => u.role === 'mentor').map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAssignMentorOpen(false)}>
                Cancel
              </Button>
              <Button>
                Assign Mentor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}