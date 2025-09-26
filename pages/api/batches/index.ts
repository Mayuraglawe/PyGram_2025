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
        .from("batches")
        .select("*")
        .order("name");
      
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      
      res.json(data || []);
    } catch (error) {
      console.error("Batches fetch error:", error);
      res.status(500).json({ error: "Failed to fetch batches" });
    }
  } else if (req.method === 'POST') {
    try {
      const supabase = getSupabaseAdminClient();
      
      if (!supabase) {
        return res.status(500).json({ error: "Supabase client not available" });
      }
      
      const { data, error } = await supabase
        .from("batches")
        .insert(req.body)
        .select()
        .single();
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(201).json(data);
    } catch (error) {
      console.error("Batch creation error:", error);
      res.status(500).json({ error: "Failed to create batch" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}