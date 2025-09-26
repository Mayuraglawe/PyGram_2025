# Smart Classroom & Timetable Scheduling System - Database Schema Documentation

## 🏗️ **Schema Overview**

This enhanced PostgreSQL database schema is designed for a comprehensive Smart Classroom and Timetable Scheduling System for colleges. It includes user management, smart classroom integration, automated timetable generation, attendance tracking, and academic management.

## 📊 **Database Structure**

### **1. User Management System**
```
📁 User Management (5 tables)
├── user_roles                   # System roles and permissions
├── users                        # Central user table for all system users
├── user_role_assignments        # Many-to-many user-role relationships
├── faculty                      # Faculty-specific information
├── students                     # Student-specific information
└── admin_staff                  # Administrative staff information
```

**Key Features:**
- **Centralized Authentication**: Single `users` table for all system users
- **Role-Based Access Control**: Flexible permission system
- **Multi-role Support**: Users can have multiple roles across departments
- **Complete Profiles**: Comprehensive user information management

### **2. Smart Classroom System**
```
📁 Smart Classroom (6 tables)
├── smart_equipment              # Catalog of smart devices and equipment
├── classrooms                   # Enhanced classroom information
├── classroom_equipment          # Equipment-classroom assignments
├── room_bookings               # Booking and reservation system
├── classroom_usage_analytics   # IoT data and usage metrics
└── room_utilization_reports    # Generated reports and insights
```

**Smart Features:**
- **IoT Integration**: Device monitoring and control
- **Real-time Analytics**: Energy, temperature, humidity tracking
- **Automated Booking**: Smart room reservation system
- **Equipment Management**: Track and maintain classroom equipment
- **Usage Optimization**: Data-driven room utilization

### **3. Academic Management**
```
📁 Academic Entities (6 tables)
├── departments                  # Academic departments
├── academic_programs           # Degree programs (Bachelor, Master, etc.)
├── subjects                    # Courses with smart classroom requirements
├── student_batches            # Student groups and sections
├── faculty_subject_assignments # Teaching assignments
└── batch_subject_assignments  # Subject enrollments
```

**Academic Features:**
- **Program Management**: Multiple degree types and structures
- **Smart Subject Classification**: Subjects requiring smart classrooms
- **Flexible Batch System**: Year, semester, and section management
- **Assignment Tracking**: Faculty-subject relationships

### **4. Advanced Timetable System**
```
📁 Timetable Management (4 tables)
├── time_slots                  # Class periods and schedules
├── timetables                 # Master timetable records with AI metrics
├── scheduled_classes          # Individual class assignments
└── timetable_change_log       # Audit trail for changes
```

**Advanced Features:**
- **AI-Powered Generation**: Algorithm-based timetable creation
- **Quality Metrics**: Scoring and optimization tracking
- **Conflict Prevention**: Automatic constraint checking
- **Version Control**: Track changes and approvals
- **Smart Integration**: Equipment and room requirements

### **5. Attendance & Assessment**
```
📁 Academic Tracking (3 tables)
├── class_attendance           # Student attendance records
├── assignments               # Academic assignments and projects
└── assignment_submissions    # Student submissions and grading
```

**Modern Features:**
- **Multiple Attendance Methods**: Manual, biometric, RFID, QR code, facial recognition
- **Online/Hybrid Support**: Track physical and online attendance
- **Comprehensive Assessment**: Various assignment types and grading
- **Plagiarism Detection**: Automated checking capabilities

### **6. Communication System**
```
📁 Communication (2 tables)
├── notifications             # Personal notifications
└── announcements            # Public announcements
```

**Communication Features:**
- **Multi-channel Delivery**: App, email, SMS, push notifications
- **Targeted Messaging**: Department, program, or role-specific
- **Priority Management**: Urgent, high, medium, low priorities
- **Scheduled Notifications**: Time-based message delivery

## 🔗 **Key Relationships**

### **User Hierarchy**
```
users (central table)
├── faculty → user_id
├── students → user_id
├── admin_staff → user_id
└── user_role_assignments → user_id
```

### **Academic Structure**
```
departments
├── academic_programs → department_id
├── student_batches → department_id
├── subjects → department_id
└── faculty → department_id
```

### **Smart Classroom Flow**
```
classrooms
├── classroom_equipment → classroom_id
├── room_bookings → classroom_id
├── scheduled_classes → classroom_id
└── classroom_usage_analytics → classroom_id
```

### **Timetable Dependencies**
```
scheduled_classes (central scheduling table)
├── timetable_id → timetables
├── time_slot_id → time_slots
├── subject_id → subjects
├── faculty_id → faculty
├── batch_id → student_batches
└── classroom_id → classrooms
```

## 🚀 **Smart Features Implementation**

### **1. IoT Integration**
- **Equipment Monitoring**: Real-time status of smart boards, projectors, AC, lighting
- **Environmental Sensors**: Temperature, humidity, air quality tracking
- **Energy Management**: Power consumption monitoring and optimization
- **Automated Control**: Remote device operation and scheduling

### **2. AI-Powered Timetabling**
- **Constraint Satisfaction**: Automatic conflict detection and resolution
- **Optimization Algorithms**: Resource utilization and preference matching
- **Quality Scoring**: Algorithm-based timetable evaluation
- **Learning Patterns**: Continuous improvement based on usage data

### **3. Hybrid Learning Support**
- **Online/Offline Classes**: Seamless switching between modes
- **Recording Capabilities**: Automatic class recording for smart classrooms
- **Live Streaming**: Real-time class broadcasting
- **Virtual Attendance**: Online participant tracking

### **4. Advanced Analytics**
- **Usage Patterns**: Classroom and equipment utilization analysis
- **Performance Metrics**: Student and faculty performance tracking
- **Predictive Maintenance**: Equipment failure prediction
- **Resource Optimization**: Data-driven decision making

## 📋 **Sample Queries**

### **Get Smart Classroom Availability**
```sql
SELECT c.room_number, c.capacity, c.is_smart_enabled,
       CASE WHEN rb.id IS NULL THEN 'Available' ELSE 'Booked' END as status
FROM classrooms c
LEFT JOIN room_bookings rb ON c.id = rb.classroom_id 
    AND rb.booking_date = CURRENT_DATE 
    AND rb.booking_status = 'Confirmed'
WHERE c.is_smart_enabled = true
ORDER BY c.capacity DESC;
```

### **Faculty Workload Analysis**
```sql
SELECT f.name, u.email, 
       COUNT(sc.id) as total_classes,
       SUM(ts.duration_minutes)/60 as weekly_hours,
       f.max_weekly_hours,
       ROUND((SUM(ts.duration_minutes)/60.0 / f.max_weekly_hours) * 100, 2) as workload_percentage
FROM faculty f
JOIN users u ON f.user_id = u.id
LEFT JOIN scheduled_classes sc ON f.id = sc.faculty_id
LEFT JOIN time_slots ts ON sc.time_slot_id = ts.id
WHERE f.is_active = true
GROUP BY f.id, f.name, u.email, f.max_weekly_hours
ORDER BY workload_percentage DESC;
```

### **Smart Equipment Status Dashboard**
```sql
SELECT se.equipment_name, se.equipment_type, se.status,
       c.room_number, c.building,
       ce.is_operational,
       ce.last_serviced_date,
       ce.next_service_date
FROM smart_equipment se
JOIN classroom_equipment ce ON se.id = ce.equipment_id
JOIN classrooms c ON ce.classroom_id = c.id
WHERE se.is_smart_enabled = true
ORDER BY c.building, c.room_number, se.equipment_type;
```

## 🔧 **Configuration Options**

The system includes comprehensive configuration through the `system_settings` table:

- **Academic Calendar**: Year start, semester duration, holidays
- **Class Scheduling**: Duration, breaks, maximum hours
- **Smart Features**: IoT monitoring, facial recognition, energy tracking
- **Notifications**: Email, SMS, push notification settings
- **Security**: Authentication methods, access controls

## 🛡️ **Security Features**

- **Password Hashing**: Secure password storage
- **Role-Based Access**: Granular permission control
- **Audit Trails**: Complete change logging
- **Data Validation**: Constraint checking and triggers
- **Multi-factor Authentication**: Support for various auth methods

## 📈 **Scalability Considerations**

- **Optimized Indexes**: Performance-tuned for common queries
- **Partitioning Ready**: Large tables designed for partitioning
- **Caching Friendly**: Structure supports Redis/Memcached integration
- **API Ready**: Schema designed for REST/GraphQL APIs
- **Microservices Compatible**: Modular design for service separation

This schema provides a solid foundation for building a comprehensive Smart Classroom and Timetable Scheduling System that can scale from small colleges to large universities while maintaining performance and flexibility.