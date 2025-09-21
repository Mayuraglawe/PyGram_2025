import { Router, Request, Response } from 'express';
import { getSupabaseAdminClient } from '../../shared/supabase';
import { CreateTimetableRequest, UpdateTimetableRequest, ApiResponse, ApiError } from '../../shared/api';

const router = Router();

// GET /api/timetables - Get all timetables
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const supabase = getSupabaseAdminClient();
    
    let query = supabase
      .from('timetables')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      const apiError: ApiError = {
        error: 'Database error',
        message: error.message,
        status: 500
      };
      return res.status(500).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data: data || [],
      message: 'Timetables retrieved successfully'
    };
    res.json(response);
  } catch (error) {
    const apiError: ApiError = {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
    res.status(500).json(apiError);
  }
});

// GET /api/timetables/:id - Get timetable by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('timetables')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Timetable not found',
        message: error.message,
        status: 404
      };
      return res.status(404).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Timetable retrieved successfully'
    };
    res.json(response);
  } catch (error) {
    const apiError: ApiError = {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
    res.status(500).json(apiError);
  }
});

// GET /api/timetables/:id/classes - Get scheduled classes for a timetable
router.get('/:id/classes', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('scheduled_classes')
      .select(`
        *,
        subjects(name, code),
        faculty(name, employee_id),
        student_batches(name),
        classrooms(name, type),
        time_slots(day_of_week, start_time, end_time)
      `)
      .eq('timetable_id', id);

    if (error) {
      const apiError: ApiError = {
        error: 'Database error',
        message: error.message,
        status: 500
      };
      return res.status(500).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data: data || [],
      message: 'Scheduled classes retrieved successfully'
    };
    res.json(response);
  } catch (error) {
    const apiError: ApiError = {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
    res.status(500).json(apiError);
  }
});

// POST /api/timetables - Create new timetable
router.post('/', async (req: Request, res: Response) => {
  try {
    const timetableData: CreateTimetableRequest = req.body;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('timetables')
      .insert(timetableData as any)
      .select()
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Failed to create timetable',
        message: error.message,
        status: 400
      };
      return res.status(400).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Timetable created successfully'
    };
    res.status(201).json(response);
  } catch (error) {
    const apiError: ApiError = {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
    res.status(500).json(apiError);
  }
});

// PUT /api/timetables/:id - Update timetable
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateTimetableRequest = req.body;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('timetables') as any)
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Failed to update timetable',
        message: error.message,
        status: 400
      };
      return res.status(400).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Timetable updated successfully'
    };
    res.json(response);
  } catch (error) {
    const apiError: ApiError = {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
    res.status(500).json(apiError);
  }
});

// DELETE /api/timetables/:id - Delete timetable
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('timetables')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Failed to delete timetable',
        message: error.message,
        status: 400
      };
      return res.status(400).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Timetable deleted successfully'
    };
    res.json(response);
  } catch (error) {
    const apiError: ApiError = {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
    res.status(500).json(apiError);
  }
});

export default router;