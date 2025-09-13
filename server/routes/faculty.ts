import { RequestHandler } from "express";
import { getSupabaseAdminClient } from "../../shared/supabase";

export const getFaculty: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("faculty")
      .select("*")
      .order("name");
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (error) {
    console.error("Faculty fetch error:", error);
    res.status(500).json({ error: "Failed to fetch faculty" });
  }
};

export const createFaculty: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from("faculty")
      .insert(req.body)
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error("Faculty creation error:", error);
    res.status(500).json({ error: "Failed to create faculty" });
  }
};