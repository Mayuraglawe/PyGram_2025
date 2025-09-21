import { RequestHandler } from "express";
import { Request, Response } from "express";
import { DemoResponse } from "../../shared/api";

export const handleDemo: RequestHandler = (req, res) => {
  const response: DemoResponse = {
    message: "Hello from Express server",
  };
  res.status(200).json(response);
};
