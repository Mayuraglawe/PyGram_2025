import { Router, Request, Response } from 'express';
import { getSupabaseAdminClient } from '../../shared/supabase';
import { CreateSubjectRequest, UpdateSubjectRequest, ApiResponse, ApiError } from '../../shared/api';

const router = Router();

// GET /api/subjects - Get all subjects
router.get('/', async (req: Request, res: Response) => {
  try {
    const { department } = req.query;
    const supabase = getSupabaseAdminClient();
    
    let query = supabase
      .from('subjects')
      .select('*')
      .order('name');
    
    if (department) {
      query = query.eq('department_id', department);
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
      message: 'Subjects retrieved successfully'
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

// GET /api/subjects/:id - Get subject by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Subject not found',
        message: error.message,
        status: 404
      };
      return res.status(404).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Subject retrieved successfully'
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

// POST /api/subjects - Create new subject
router.post('/', async (req: Request, res: Response) => {
  try {
    const subjectData: CreateSubjectRequest = req.body;
    const supabase = getSupabaseAdminClient();
    
    // Map to database format
    const insertData = {
      name: subjectData.name,
      code: subjectData.code,
      department_id: subjectData.department_id,
      credits: subjectData.credits,
      lectures_per_week: subjectData.lectures_per_week,
      labs_per_week: subjectData.labs_per_week,
      requires_lab: subjectData.requires_lab,
      semester: subjectData.semester || null,
      year: subjectData.year || null,
      subject_type: subjectData.subject_type || null,
      prerequisites: subjectData.prerequisites || null,
      syllabus: subjectData.syllabus || null,
      is_active: true
    };
    
    const { data, error } = await (supabase
      .from('subjects') as any)
      .insert(insertData)
      .select()
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Failed to create subject',
        message: error.message,
        status: 400
      };
      return res.status(400).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Subject created successfully'
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

// PUT /api/subjects/:id - Update subject
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body: UpdateSubjectRequest = req.body;
    const supabase = getSupabaseAdminClient();
    
    // Map update data
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.code !== undefined) updateData.code = body.code;
    if (body.department_id !== undefined) updateData.department_id = body.department_id;
    if (body.credits !== undefined) updateData.credits = body.credits;
    if (body.lectures_per_week !== undefined) updateData.lectures_per_week = body.lectures_per_week;
    if (body.labs_per_week !== undefined) updateData.labs_per_week = body.labs_per_week;
    if (body.requires_lab !== undefined) updateData.requires_lab = body.requires_lab;
    if (body.semester !== undefined) updateData.semester = body.semester;
    if (body.year !== undefined) updateData.year = body.year;
    if (body.subject_type !== undefined) updateData.subject_type = body.subject_type;
    if (body.prerequisites !== undefined) updateData.prerequisites = body.prerequisites;
    if (body.syllabus !== undefined) updateData.syllabus = body.syllabus;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await (supabase
      .from('subjects') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Failed to update subject',
        message: error.message,
        status: 400
      };
      return res.status(400).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Subject updated successfully'
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

// DELETE /api/subjects/:id - Delete subject
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const apiError: ApiError = {
        error: 'Failed to delete subject',
        message: error.message,
        status: 400
      };
      return res.status(400).json(apiError);
    }

    const response: ApiResponse<typeof data> = {
      data,
      message: 'Subject deleted successfully'
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