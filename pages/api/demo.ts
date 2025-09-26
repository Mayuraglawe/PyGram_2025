import type { NextApiRequest, NextApiResponse } from 'next'
import { DemoResponse } from "../../shared/api";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const response: DemoResponse = {
    message: "Hello from Next.js API server",
  };
  res.status(200).json(response);
}