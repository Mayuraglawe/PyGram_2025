import { Router, Request, Response } from 'express';
import { getSupabaseAdminClient } from '../../shared/supabase';
import { CreateStudentBatchRequest, UpdateStudentBatchRequest, ApiResponse, ApiError } from '../../shared/api';

const router = Router();

// GET /api/batches - Get all student batches
router.get('/', async (req: Request, res: Response) => {
  try {
    const { department, year, semester } = req.query;
    const supabase = getSupabaseAdminClient();
    
    let query = supabase
      .from('student_batches')
      .select('*')
      .order('name');
    
    if (department) {
      query = query.eq('department', department);
    }
    if (year) {
      query = query.eq('year', year);
    }
    if (semester) {
      query = query.eq('semester', semester);
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
      message: 'Student batches retrieved successfully'
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

// GET /api/batches/:id - Get batch by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('student_batches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Student batch not found',
        message: error.message,
        status: 404
      };
      return res.status(404).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Student batch retrieved successfully'
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

// POST /api/batches - Create new student batch
router.post('/', async (req: Request, res: Response) => {
  try {
    const batchData: CreateStudentBatchRequest = req.body;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('student_batches')
      .insert(batchData as any)
      .select()
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Failed to create student batch',
        message: error.message,
        status: 400
      };
      return res.status(400).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Student batch created successfully'
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

// PUT /api/batches/:id - Update student batch
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateStudentBatchRequest = req.body;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('student_batches') as any)
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Failed to update student batch',
        message: error.message,
        status: 400
      };
      return res.status(400).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Student batch updated successfully'
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

// DELETE /api/batches/:id - Delete student batch
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('student_batches')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Failed to delete student batch',
        message: error.message,
        status: 400
      };
      return res.status(400).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Student batch deleted successfully'
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