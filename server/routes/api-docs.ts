import { Router, RequestHandler } from "express";
import { Request, Response } from "express";

const router = Router();

// API Documentation endpoint
export const getAPIDocumentation: RequestHandler = (req: Request, res: Response) => {
  const documentation = {
    title: "The Academic Campass  API Documentation",
    version: "1.0.0",
    description: "Comprehensive API for Smart Classroom & Timetable Scheduling System",
    base_url: `${req.protocol}://${req.get('host')}/api`,
    endpoints: {
      authentication: {
        description: "User authentication and authorization",
        endpoints: [
          {
            method: "POST",
            path: "/auth/login",
            description: "User login",
            parameters: ["username", "password", "role"]
          },
          {
            method: "POST",
            path: "/auth/register",
            description: "User registration",
            parameters: ["firstName", "lastName", "email", "username", "password", "role", "departmentId"]
          },
          {
            method: "POST",
            path: "/auth/logout",
            description: "User logout"
          }
        ]
      },
      departments: {
        description: "Department management",
        endpoints: [
          {
            method: "GET",
            path: "/departments",
            description: "Get all departments for authenticated user"
          },
          {
            method: "GET",
            path: "/departments/:departmentId",
            description: "Get specific department details"
          },
          {
            method: "GET",
            path: "/departments/:departmentId/faculty",
            description: "Get faculty members for a department"
          }
        ]
      },
      faculty: {
        description: "Faculty management",
        endpoints: [
          {
            method: "GET",
            path: "/faculty",
            description: "Get all faculty members"
          },
          {
            method: "POST",
            path: "/faculty",
            description: "Create new faculty member"
          }
        ]
      },
      subjects: {
        description: "Subject and course management",
        endpoints: [
          {
            method: "GET",
            path: "/subjects",
            description: "Get all subjects"
          },
          {
            method: "POST",
            path: "/subjects",
            description: "Create new subject"
          },
          {
            method: "PUT",
            path: "/subjects/:id",
            description: "Update existing subject"
          },
          {
            method: "DELETE",
            path: "/subjects/:id",
            description: "Delete subject"
          }
        ]
      },
      classrooms: {
        description: "Classroom management",
        endpoints: [
          {
            method: "GET",
            path: "/classrooms",
            description: "Get all classrooms"
          },
          {
            method: "POST",
            path: "/classrooms",
            description: "Create new classroom"
          },
          {
            method: "PUT",
            path: "/classrooms/:id",
            description: "Update classroom details"
          },
          {
            method: "DELETE",
            path: "/classrooms/:id",
            description: "Delete classroom"
          }
        ]
      },
      smart_classrooms: {
        description: "Smart classroom and IoT equipment management",
        endpoints: [
          {
            method: "GET",
            path: "/smart-classrooms",
            description: "Get all smart classrooms with equipment",
            query_params: ["building", "floor", "status", "type"]
          },
          {
            method: "GET",
            path: "/smart-classrooms/:id",
            description: "Get specific smart classroom details"
          },
          {
            method: "PUT",
            path: "/smart-classrooms/:id/status",
            description: "Update classroom status and environmental data",
            parameters: ["status", "occupancy_count", "temperature", "humidity"]
          },
          {
            method: "GET",
            path: "/smart-classrooms/:id/equipment",
            description: "Get equipment for specific classroom"
          },
          {
            method: "PUT",
            path: "/smart-classrooms/:classroomId/equipment/:equipmentId",
            description: "Update equipment status",
            parameters: ["status", "last_maintenance"]
          },
          {
            method: "GET",
            path: "/smart-classrooms/analytics/utilization",
            description: "Get classroom utilization analytics"
          }
        ]
      },
      batches: {
        description: "Student batch management",
        endpoints: [
          {
            method: "GET",
            path: "/batches",
            description: "Get all student batches"
          },
          {
            method: "POST",
            path: "/batches",
            description: "Create new batch"
          },
          {
            method: "PUT",
            path: "/batches/:id",
            description: "Update batch details"
          },
          {
            method: "DELETE",
            path: "/batches/:id",
            description: "Delete batch"
          }
        ]
      },
      timetables: {
        description: "Traditional timetable management",
        endpoints: [
          {
            method: "GET",
            path: "/timetables",
            description: "Get all timetables"
          },
          {
            method: "POST",
            path: "/timetables",
            description: "Create new timetable"
          },
          {
            method: "PUT",
            path: "/timetables/:id",
            description: "Update timetable"
          },
          {
            method: "DELETE",
            path: "/timetables/:id",
            description: "Delete timetable"
          }
        ]
      },
      ai_timetable: {
        description: "AI-powered timetable generation and optimization",
        endpoints: [
          {
            method: "POST",
            path: "/ai-timetable/generate",
            description: "Generate AI-powered timetable",
            parameters: [
              "department_id", "semester", "academic_year", "constraints", 
              "subjects", "batches", "classrooms"
            ]
          },
          {
            method: "GET",
            path: "/ai-timetable/status/:generationId",
            description: "Get AI generation status"
          },
          {
            method: "GET",
            path: "/ai-timetable/result/:generationId",
            description: "Get AI generation result"
          },
          {
            method: "POST",
            path: "/ai-timetable/optimize",
            description: "Optimize existing timetable",
            parameters: ["timetable_id", "optimization_goals"]
          },
          {
            method: "GET",
            path: "/ai-timetable/analytics",
            description: "Get AI generation analytics and metrics"
          }
        ]
      },
      telegram: {
        description: "Telegram bot integration",
        endpoints: [
          {
            method: "POST",
            path: "/telegram/setup",
            description: "Setup Telegram bot configuration"
          },
          {
            method: "GET",
            path: "/telegram/status",
            description: "Get Telegram bot status"
          },
          {
            method: "POST",
            path: "/telegram/send-notification",
            description: "Send notification via Telegram",
            parameters: ["message", "users", "department"]
          }
        ]
      },
      new_generation: {
        description: "Next-generation features and exam management",
        endpoints: [
          {
            method: "GET",
            path: "/new-generation/exams",
            description: "Get exam schedules and information"
          },
          {
            method: "POST",
            path: "/new-generation/assignments",
            description: "Create assignment information"
          }
        ]
      },
      system: {
        description: "System utilities and health checks",
        endpoints: [
          {
            method: "GET",
            path: "/ping",
            description: "Health check endpoint"
          },
          {
            method: "GET",
            path: "/demo",
            description: "Demo endpoint for testing"
          },
          {
            method: "GET",
            path: "/docs",
            description: "This API documentation"
          }
        ]
      }
    },
    authentication: {
      type: "Bearer Token",
      description: "Most endpoints require authentication. Include the auth token in the Authorization header.",
      header_format: "Authorization: Bearer <your_token_here>"
    },
    response_format: {
      success: {
        success: true,
        data: "Response data here",
        message: "Optional success message"
      },
      error: {
        success: false,
        message: "Error description",
        error: "Optional error details"
      }
    },
    features: [
      "Role-based access control (Admin, Mentor, Student)",
      "Department isolation and security",
      "Smart classroom IoT integration",
      "AI-powered timetable generation",
      "Real-time Telegram notifications",
      "Comprehensive analytics and reporting",
      "Equipment maintenance tracking",
      "Environmental monitoring",
      "Conflict detection and resolution",
      "Quality scoring and optimization"
    ],
    tech_stack: {
      backend: "Node.js + Express + TypeScript",
      frontend: "React + Next.js + TypeScript",
      database: "PostgreSQL",
      authentication: "JWT + Role-based access",
      real_time: "Telegram Bot API",
      ai_engine: "Custom genetic algorithm implementation"
    }
  };

  res.json(documentation);
};

// GET /api/docs - API Documentation
router.get('/', getAPIDocumentation);

export default router;