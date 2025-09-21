import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getFaculty, createFaculty } from "./routes/faculty";
import telegramRoutes from "./routes/telegram";
import { initializeTelegramService } from "./services/telegramService";
import { 
  getUserDepartments, 
  getDepartmentDetails,
  getFacultyByDepartment,
  injectDepartmentContext,
  requireDepartmentAccess 
} from "./routes/department-routes";
import subjectRoutes from "./routes/subject-routes";
import classroomRoutes from "./routes/classroom-routes";
import batchRoutes from "./routes/batch-routes";
import timetableRoutes from "./routes/timetable-routes";
import newGenerationRoutes from "./routes/new-generation-routes";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize Telegram service
  initializeTelegramService().then((success) => {
    if (success) {
      console.log("✅ Telegram service initialized successfully");
    } else {
      console.log("⚠️ Telegram service initialization failed - check environment variables");
    }
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Faculty routes
  app.get("/api/faculty/", getFaculty);
  app.post("/api/faculty/", createFaculty);

  // Department routes (enhanced)
  app.get("/api/departments", getUserDepartments);
  app.get("/api/departments/:departmentId", getDepartmentDetails);
  app.get("/api/departments/:departmentId/faculty", getFacultyByDepartment);

  // Subject routes
  app.use("/api/subjects", subjectRoutes);

  // Classroom routes
  app.use("/api/classrooms", classroomRoutes);

  // Batch routes
  app.use("/api/batches", batchRoutes);

  // Timetable routes
  app.use("/api/timetables", timetableRoutes);

  // New Generation routes (Exam and Assignment Information)
  app.use("/api/new-generation", newGenerationRoutes);

  // Telegram routes
  app.use("/api/telegram", telegramRoutes);

  return app;
}
