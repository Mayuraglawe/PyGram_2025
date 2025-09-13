import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { getSupabaseClient } from "../../shared/supabase";

export interface LoginRequest { username: string; password: string }
export interface LoginResponse { access: string; refresh: string }

// Entities
export interface Faculty { id: number; name: string; employee_id: string; department: string; user?: number | null }
export interface Subject { id: number; name: string; code: string; department: string; credits: number; lectures_per_week: number; labs_per_week: number; requires_lab: boolean }
export interface Classroom { id: number; name: string; capacity: number; type: "Lecture" | "Lab"; has_projector: boolean; has_smartboard: boolean }
export interface StudentBatch { id: number; name: string; year: number; semester: number; strength: number; department: string; subjects: number[] }
export interface TimeSlot { id: number; day_of_week: string; start_time: string; end_time: string }
export interface Timetable { id: number; name: string; status: "Draft" | "Pending Approval" | "Approved" | "Archived"; created_by: number; created_at: string; quality_score: number }
export interface ScheduledClass { id: number; timetable: number; subject: number; faculty: number; student_batch: number; classroom: number; timeslot: number; class_type: "Lecture" | "Lab" }

export interface GenerateRequest { name: string; year: number; semester: number }
export interface GenerateResponse { task_id: string }
export interface GenerateStatusResponse { status: "PENDING" | "SUCCESS" | "FAILURE"; progress?: string; error?: string; new_timetable_id?: number }

// Robust baseQuery that handles network failures and safe body parsing even if other scripts (eg analytics)
// have already read the response body.
const baseUrl = "/api";

async function handleSupabaseRequest(urlPath: string, method: string, body?: any) {
  try {
    const supabase = getSupabaseClient();
    
    // Remove /api prefix for processing
    const path = urlPath.replace(/^\/api/, "");
    
    // Faculty endpoints
    if (method === "GET" && path === "/faculty/") {
      const { data, error } = await supabase
        .from("faculty")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return { data: data || [] };
    }
    
    if (method === "POST" && path === "/faculty/") {
      const { data, error } = await supabase
        .from("faculty")
        .insert([body])
        .select()
        .single();
      
      if (error) throw error;
      return { data };
    }
    
    // Subjects endpoints
    if (method === "GET" && path === "/subjects/") {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return { data: data || [] };
    }
    
    if (method === "POST" && path === "/subjects/") {
      const { data, error } = await supabase
        .from("subjects")
        .insert([body])
        .select()
        .single();
      
      if (error) throw error;
      return { data };
    }
    
    // Classrooms endpoints
    if (method === "GET" && path === "/classrooms/") {
      const { data, error } = await supabase
        .from("classrooms")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return { data: data || [] };
    }
    
    if (method === "POST" && path === "/classrooms/") {
      const { data, error } = await supabase
        .from("classrooms")
        .insert([body])
        .select()
        .single();
      
      if (error) throw error;
      return { data };
    }
    
    // Student batches endpoints
    if (method === "GET" && path === "/batches/") {
      const { data, error } = await supabase
        .from("student_batches")
        .select(`
          *,
          batch_subjects (
            subject_id,
            subjects (*)
          )
        `)
        .order("name");
      
      if (error) throw error;
      
      // Transform the data to match expected format
      const transformedData = data?.map(batch => ({
        ...batch,
        subjects: batch.batch_subjects?.map(bs => bs.subject_id) || []
      })) || [];
      
      return { data: transformedData };
    }
    
    if (method === "POST" && path === "/batches/") {
      const { subjects, ...batchData } = body;
      
      // Insert batch first
      const { data: newBatch, error: batchError } = await supabase
        .from("student_batches")
        .insert([batchData])
        .select()
        .single();
      
      if (batchError) throw batchError;
      
      // Insert batch-subject relationships
      if (subjects && subjects.length > 0) {
        const batchSubjects = subjects.map((subjectId: number) => ({
          batch_id: newBatch.id,
          subject_id: subjectId
        }));
        
        const { error: relationError } = await supabase
          .from("batch_subjects")
          .insert(batchSubjects);
        
        if (relationError) throw relationError;
      }
      
      return { data: { ...newBatch, subjects: subjects || [] } };
    }
    
    // Timetables endpoints
    if (method === "GET" && path === "/timetables/") {
      const { data, error } = await supabase
        .from("timetables")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return { data: data || [] };
    }
    
    if (method === "GET" && /^\/timetables\/\d+\/$/.test(path)) {
      const match = path.match(/^\/timetables\/(\d+)\//);
      const id = match ? Number(match[1]) : null;
      
      if (!id) throw new Error("Invalid timetable ID");
      
      // Get timetable
      const { data: timetable, error: timetableError } = await supabase
        .from("timetables")
        .select("*")
        .eq("id", id)
        .single();
      
      if (timetableError) throw timetableError;
      
      // Get scheduled classes with related data
      const { data: classes, error: classesError } = await supabase
        .from("scheduled_classes")
        .select(`
          *,
          subjects (name),
          faculty (name),
          classrooms (name),
          time_slots (*)
        `)
        .eq("timetable_id", id);
      
      if (classesError) throw classesError;
      
      // Transform data to match expected format
      const transformedClasses = classes?.map(cls => ({
        id: cls.id,
        timetable: cls.timetable_id,
        subject: cls.subject_id,
        faculty: cls.faculty_id,
        student_batch: cls.student_batch_id,
        classroom: cls.classroom_id,
        timeslot: cls.timeslot_id,
        class_type: cls.class_type,
        subject_name: cls.subjects?.name,
        faculty_name: cls.faculty?.name,
        room_name: cls.classrooms?.name,
        timeslot_detail: cls.time_slots
      })) || [];
      
      return { data: { timetable, classes: transformedClasses } };
    }
    
    if (method === "POST" && /^\/timetables\/\d+\/approve\/$/.test(path)) {
      const match = path.match(/^\/timetables\/(\d+)\/approve\//);
      const id = match ? Number(match[1]) : null;
      
      if (!id) throw new Error("Invalid timetable ID");
      
      const { error } = await supabase
        .from("timetables")
        .update({ status: "Approved" })
        .eq("id", id);
      
      if (error) throw error;
      return { data: { ok: true } };
    }
    
    // Generation endpoints
    if (method === "POST" && path === "/timetables/generate/") {
      const taskId = Math.random().toString(36).slice(2, 10);
      
      // Store generation task
      const { error } = await supabase
        .from("generation_tasks")
        .insert([{
          id: taskId,
          status: "PENDING",
          progress: "0%"
        }]);
      
      if (error) throw error;
      
      // Simulate async generation process
      setTimeout(async () => {
        try {
          // Update progress
          await supabase
            .from("generation_tasks")
            .update({ progress: "25%" })
            .eq("id", taskId);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await supabase
            .from("generation_tasks")
            .update({ progress: "60%" })
            .eq("id", taskId);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await supabase
            .from("generation_tasks")
            .update({ progress: "95%" })
            .eq("id", taskId);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Create new timetable
          const { data: newTimetable, error: timetableError } = await supabase
            .from("timetables")
            .insert([{
              name: body.name,
              status: "Draft",
              quality_score: 0.85 + Math.random() * 0.1 // Random quality score
            }])
            .select()
            .single();
          
          if (timetableError) throw timetableError;
          
          // Mark task as complete
          await supabase
            .from("generation_tasks")
            .update({
              status: "SUCCESS",
              progress: "100%",
              new_timetable_id: newTimetable.id
            })
            .eq("id", taskId);
        } catch (error) {
          // Mark task as failed
          await supabase
            .from("generation_tasks")
            .update({
              status: "FAILURE",
              error: String(error)
            })
            .eq("id", taskId);
        }
      }, 100);
      
      return { data: { task_id: taskId } };
    }
    
    if (method === "GET" && /^\/timetables\/generate\/status\/.+\/$/.test(path)) {
      const match = path.match(/^\/timetables\/generate\/status\/(.+)\//);
      const taskId = match?.[1];
      
      if (!taskId) throw new Error("Invalid task ID");
      
      const { data, error } = await supabase
        .from("generation_tasks")
        .select("*")
        .eq("id", taskId)
        .single();
      
      if (error) {
        // If task not found, return default pending status
        if (error.code === 'PGRST116') {
          return { data: { status: "PENDING" } };
        }
        throw error;
      }
      
      return { data };
    }
    
    return null;
  } catch (error) {
    console.error("Supabase request error:", error);
    throw error;
  }
}

async function handleMockRequest(urlPath: string, method: string, body?: any) {
  // Simple in-memory mock store for frontend-only dev mode when backend is unavailable
  const __mockTasks: Record<string, { status: string; progress?: string; new_timetable_id?: number }> = {};
  let __nextTimetableId = 2;

  function makeId() {
    return Math.random().toString(36).slice(2, 10);
  }

  function mockDelay(ms = 300) {
    return new Promise((res) => setTimeout(res, ms));
  }

  // normalize path without baseUrl
  const path = urlPath.replace(/^\/api/, "");
  // Simple routes
  if (method === "GET" && path === "/faculty/") {
    await mockDelay(100);
    return { data: [{ id: 1, name: "Dr. Alice", employee_id: "E001", department: "CSE" }] };
  }
  if (method === "GET" && path === "/subjects/") {
    await mockDelay(100);
    return { data: [
      { id: 1, name: "Algorithms", code: "CS201", department: "CSE", credits: 4, lectures_per_week: 3, labs_per_week: 1, requires_lab: true },
      { id: 2, name: "Databases", code: "CS301", department: "CSE", credits: 3, lectures_per_week: 2, labs_per_week: 1, requires_lab: true },
    ] };
  }
  if (method === "GET" && path === "/classrooms/") {
    await mockDelay(80);
    return { data: [
      { id: 1, name: "Room 101", capacity: 60, type: "Lecture", has_projector: true, has_smartboard: false },
      { id: 2, name: "Lab A", capacity: 24, type: "Lab", has_projector: false, has_smartboard: true },
    ] };
  }
  if (method === "GET" && path === "/batches/") {
    await mockDelay(80);
    return { data: [
      { id: 1, name: "CSE 2025 Batch A", year: 2025, semester: 1, strength: 58, department: "CSE", subjects: [1,2] }
    ] };
  }
  if (method === "GET" && path === "/timetables/") {
    await mockDelay(120);
    return { data: [ { id: 1, name: "Sample Timetable", status: "Approved", created_by: 1, created_at: new Date().toISOString(), quality_score: 0.92 } ] };
  }
  if (method === "GET" && /^\/timetables\/\d+\/$/.test(path)) {
    await mockDelay(120);
    const match = path.match(/^\/timetables\/(\d+)\//);
    const id = match ? Number(match[1]) : 1;
    return { data: { timetable: { id, name: `Timetable ${id}`, status: "Approved", created_by: 1, created_at: new Date().toISOString(), quality_score: 0.9 }, classes: [] } };
  }

  if (method === "POST" && path === "/timetables/generate/") {
    // create mock task
    const taskId = makeId();
    __mockTasks[taskId] = { status: "PENDING", progress: "0%", new_timetable_id: undefined };
    // simulate progression
    (async () => {
      await mockDelay(500);
      __mockTasks[taskId].status = "PENDING";
      __mockTasks[taskId].progress = "25%";
      await mockDelay(800);
      __mockTasks[taskId].progress = "60%";
      await mockDelay(800);
      __mockTasks[taskId].progress = "95%";
      await mockDelay(400);
      __mockTasks[taskId].status = "SUCCESS";
      __mockTasks[taskId].progress = "100%";
      __mockTasks[taskId].new_timetable_id = __nextTimetableId++;
    })();
    return { data: { task_id: taskId } };
  }

  if (method === "GET" && /^\/timetables\/generate\/status\/.+\/$/.test(path)) {
    const m = path.match(/^\/timetables\/generate\/status\/(.+)\//);
    const id = m && m[1];
    await mockDelay(80);
    if (id && __mockTasks[id]) return { data: __mockTasks[id] };
    return { data: { status: "PENDING" } };
  }

  // For other POSTs that create resources, echo back
  if (method === "POST") {
    await mockDelay(100);
    const id = Math.floor(Math.random() * 1000) + 10;
    return { data: { id, ...body } };
  }

  return null;
}
  // normalize path without baseUrl
  const path = urlPath.replace(/^\/api/, "");
  // Simple routes
  if (method === "GET" && path === "/faculty/") {
    await mockDelay(100);
    return { data: [{ id: 1, name: "Dr. Alice", employee_id: "E001", department: "CSE" }] };
  }
  if (method === "GET" && path === "/subjects/") {
    await mockDelay(100);
    return { data: [
      { id: 1, name: "Algorithms", code: "CS201", department: "CSE", credits: 4, lectures_per_week: 3, labs_per_week: 1, requires_lab: true },
      { id: 2, name: "Databases", code: "CS301", department: "CSE", credits: 3, lectures_per_week: 2, labs_per_week: 1, requires_lab: true },
    ] };
  }
  if (method === "GET" && path === "/classrooms/") {
    await mockDelay(80);
    return { data: [
      { id: 1, name: "Room 101", capacity: 60, type: "Lecture", has_projector: true, has_smartboard: false },
      { id: 2, name: "Lab A", capacity: 24, type: "Lab", has_projector: false, has_smartboard: true },
    ] };
  }
  if (method === "GET" && path === "/batches/") {
    await mockDelay(80);
    return { data: [
      { id: 1, name: "CSE 2025 Batch A", year: 2025, semester: 1, strength: 58, department: "CSE", subjects: [1,2] }
    ] };
  }
  if (method === "GET" && path === "/timetables/") {
    await mockDelay(120);
    return { data: [ { id: 1, name: "Sample Timetable", status: "Approved", created_by: 1, created_at: new Date().toISOString(), quality_score: 0.92 } ] };
  }
  if (method === "GET" && /^\/timetables\/\d+\/$/.test(path)) {
    await mockDelay(120);
    const match = path.match(/^\/timetables\/(\d+)\//);
    const id = match ? Number(match[1]) : 1;
    return { data: { timetable: { id, name: `Timetable ${id}`, status: "Approved", created_by: 1, created_at: new Date().toISOString(), quality_score: 0.9 }, classes: [] } };
  }

  if (method === "POST" && path === "/timetables/generate/") {
    // create mock task
    const taskId = makeId();
    __mockTasks[taskId] = { status: "PENDING", progress: "0%", new_timetable_id: undefined };
    // simulate progression
    (async () => {
      await mockDelay(500);
      __mockTasks[taskId].status = "PENDING";
      __mockTasks[taskId].progress = "25%";
      await mockDelay(800);
      __mockTasks[taskId].progress = "60%";
      await mockDelay(800);
      __mockTasks[taskId].progress = "95%";
      await mockDelay(400);
      __mockTasks[taskId].status = "SUCCESS";
      __mockTasks[taskId].progress = "100%";
      __mockTasks[taskId].new_timetable_id = __nextTimetableId++;
    })();
    return { data: { task_id: taskId } };
  }

  if (method === "GET" && /^\/timetables\/generate\/status\/.+\/$/.test(path)) {
    const m = path.match(/^\/timetables\/generate\/status\/(.+)\//);
    const id = m && m[1];
    await mockDelay(80);
    if (id && __mockTasks[id]) return { data: __mockTasks[id] };
    return { data: { status: "PENDING" } };
  }

  // For other POSTs that create resources, echo back
  if (method === "POST") {
    await mockDelay(100);
    const id = Math.floor(Math.random() * 1000) + 10;
    return { data: { id, ...body } };
  }

  return null;
}

const customBaseQuery: BaseQueryFn<{
  url: string;
  method?: string;
  body?: any;
  params?: Record<string, any>;
}, unknown, unknown> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? `${baseUrl}${args}` : `${baseUrl}${args.url}`;
  const method = (args as any).method ?? "GET";
  const body = (args as any).body;

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  try {
    const token = localStorage.getItem("access_token");
    if (token) headers["authorization"] = `Bearer ${token}`;
  } catch {}

  const init: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  // If backend not available or network fails, try Supabase first, then fallback to mocks
  try {
    // First attempt to use Supabase for real database operations
    const supabaseResp = await handleSupabaseRequest(url.replace(/^https?:\/\/[\w\.-]+/, ""), method, body);
    if (supabaseResp) return supabaseResp as any;
  } catch (supabaseErr) {
    console.debug("Supabase request failed, falling back to mock:", supabaseErr);
    
    // Fallback to mock data if Supabase fails
    try {
      const mockResp = await handleMockRequest(url.replace(/^https?:\/\/[\w\.-]+/, ""), method, body);
      if (mockResp) return mockResp as any;
    } catch (mErr) {
      console.debug("Mock handler error", mErr);
    }
  }

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { error: { status: "OFFLINE", error: "No network connection" } } as any;
  }

  try {
    const res = await fetch(url, init);

    // Attempt to safely read the body. Use clone+text to avoid some "body used" scenarios.
    let data: any = undefined;
    try {
      const txt = await res.clone().text();
      const ctype = res.headers.get("content-type") || "";
      if (ctype.includes("application/json")) {
        try { data = txt ? JSON.parse(txt) : undefined; } catch (e) { data = txt; }
      } else {
        data = txt;
      }
    } catch (readError) {
      // If the body was already used by other instrumentation (eg analytics), we gracefully degrade.
      // Avoid noisy warnings coming from analytics scripts.
      console.debug("Response body could not be read (may have been consumed):", readError);
      data = undefined;
    }

    if (!res.ok) {
      return { error: { status: res.status, data } } as any;
    }

    return { data } as any;
  } catch (fetchError) {
    // Network failure or CORS/blocked request
    // Try Supabase as fallback
    try {
      const supabaseResp = await handleSupabaseRequest(url.replace(/^https?:\/\/[\w\.-]+/, ""), method, body);
      if (supabaseResp) return supabaseResp as any;
    } catch (supabaseErr) {
      console.debug("Supabase fallback error", supabaseErr);
    }
    
    // Final fallback to mock
    try {
      const mockResp = await handleMockRequest(url.replace(/^https?:\/\/[\w\.-]+/, ""), method, body);
      if (mockResp) return mockResp as any;
    } catch (mErr) {
      console.debug("Mock fallback error", mErr);
    }

    // Avoid noisy stack traces; return structured error for UI to handle.
    console.debug("Network request failed in customBaseQuery:", fetchError);
    return { error: { status: "FETCH_ERROR", error: String(fetchError) } } as any;
  }
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: [
    "Faculty",
    "Subject",
    "Classroom",
    "StudentBatch",
    "Timetable",
    "ScheduledClass",
  ],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/token/", method: "POST", body }),
    }),

    register: builder.mutation<any, { username: string; email?: string; password: string; role?: string }>({
      query: (body) => ({ url: "/auth/register/", method: "POST", body }),
    }),

    // CRUD endpoints
    getFaculty: builder.query<Faculty[], void>({ query: () => ({ url: "/faculty/", method: "GET" }), providesTags: ["Faculty"] }),
    addFaculty: builder.mutation<Faculty, Partial<Faculty>>({
      query: (body) => ({ url: "/faculty/", method: "POST", body }),
      invalidatesTags: ["Faculty"],
    }),

    getSubjects: builder.query<Subject[], void>({ query: () => ({ url: "/subjects/", method: "GET" }), providesTags: ["Subject"] }),

    getClassrooms: builder.query<Classroom[], void>({ query: () => ({ url: "/classrooms/", method: "GET" }), providesTags: ["Classroom"] }),

    getBatches: builder.query<StudentBatch[], void>({ query: () => ({ url: "/batches/", method: "GET" }), providesTags: ["StudentBatch"] }),

    // Timetables
    listTimetables: builder.query<Timetable[], void>({ query: () => ({ url: "/timetables/", method: "GET" }), providesTags: ["Timetable"] }),
    getTimetableById: builder.query<{ timetable: Timetable; classes: ScheduledClass[] }, number>({
      query: (id) => ({ url: `/timetables/${id}/`, method: "GET" }),
      providesTags: ["Timetable", "ScheduledClass"],
    }),
    approveTimetable: builder.mutation<{ ok: boolean }, number>({
      query: (id) => ({ url: `/timetables/${id}/approve/`, method: "POST" }),
      invalidatesTags: ["Timetable"],
    }),

    // Generation
    generateTimetable: builder.mutation<GenerateResponse, GenerateRequest>({
      query: (body) => ({ url: "/timetables/generate/", method: "POST", body }),
    }),
    getGenerationStatus: builder.query<GenerateStatusResponse, string>({
      query: (taskId) => ({ url: `/timetables/generate/status/${taskId}/`, method: "GET" }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetFacultyQuery,
  useAddFacultyMutation,
  useGetSubjectsQuery,
  useGetClassroomsQuery,
  useGetBatchesQuery,
  useListTimetablesQuery,
  useGetTimetableByIdQuery,
  useApproveTimetableMutation,
  useGenerateTimetableMutation,
  useGetGenerationStatusQuery,
} = api;
