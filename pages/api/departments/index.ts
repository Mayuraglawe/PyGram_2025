import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseAdminClient } from "../../../shared/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const supabase = getSupabaseAdminClient();
      
      if (!supabase) {
        return res.status(500).json({ error: "Supabase client not available" });
      }
      
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name");
      
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      
      res.json(data || []);
    } catch (error) {
      console.error("Departments fetch error:", error);
      res.status(500).json({ error: "Failed to fetch departments" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}