import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo.js";
import { getFaculty, createFaculty } from "./routes/faculty.js";
import telegramRoutes from "./routes/telegram.js";
import { initializeTelegramService } from "./services/telegramService.js";

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

  // Telegram routes
  app.use("/api/telegram", telegramRoutes);

  return app;
}
