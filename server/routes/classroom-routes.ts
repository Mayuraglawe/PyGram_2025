import { Router, Request, Response } from 'express';
import { getSupabaseAdminClient } from '../../shared/supabase';
import { CreateClassroomRequest, UpdateClassroomRequest, ApiResponse, ApiError } from '../../shared/api';

const router = Router();

// GET /api/classrooms - Get all classrooms
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const supabase = getSupabaseAdminClient();
    
    let query = supabase
      .from('classrooms')
      .select('*')
      .order('room_number');
    
    if (type) {
      query = query.eq('type', type);
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
      message: 'Classrooms retrieved successfully'
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

// GET /api/classrooms/:id - Get classroom by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Classroom not found',
        message: error.message,
        status: 404
      };
      return res.status(404).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Classroom retrieved successfully'
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

// POST /api/classrooms - Create new classroom
router.post('/', async (req: Request, res: Response) => {
  try {
    const classroomData: CreateClassroomRequest = req.body;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('classrooms')
      .insert(classroomData as any)
      .select()
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Failed to create classroom',
        message: error.message,
        status: 400
      };
      return res.status(400).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Classroom created successfully'
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

// PUT /api/classrooms/:id - Update classroom
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateClassroomRequest = req.body;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('classrooms') as any)
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Failed to update classroom',
        message: error.message,
        status: 400
      };
      return res.status(400).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Classroom updated successfully'
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

// DELETE /api/classrooms/:id - Delete classroom
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('classrooms')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Failed to delete classroom',
        message: error.message,
        status: 400
      };
      return res.status(400).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Classroom deleted successfully'
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