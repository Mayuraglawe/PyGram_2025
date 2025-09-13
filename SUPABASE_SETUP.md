# Supabase Integration Setup Guide

## Prerequisites
1. A Supabase account (https://supabase.com)
2. A new Supabase project created

## Setup Steps

### 1. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor"
3. Run the schema creation script:
   - Copy and paste the contents of `database/schema.sql`
   - Execute the query
4. Optionally, add sample data:
   - Copy and paste the contents of `database/sample-data.sql`
   - Execute the query

### 2. Environment Configuration
1. Copy `.env.example` to `.env`
2. Update the environment variables with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

### 3. Getting Supabase Credentials
From your Supabase dashboard:
1. **Project URL**: Go to Settings → API → Project URL
2. **Anon Key**: Go to Settings → API → Project API keys → `anon` `public`
3. **Service Role Key**: Go to Settings → API → Project API keys → `service_role` (for server-side operations)

### 4. Row Level Security (RLS)
The schema includes basic RLS policies that allow authenticated users to read/write all data. For production, you should:
1. Review and customize the RLS policies based on your authentication requirements
2. Set up proper user roles and permissions
3. Consider implementing more granular access controls

### 5. Testing the Integration
1. Start the development server: `pnpm dev`
2. The application will now use Supabase for:
   - Faculty management
   - Subjects, Classrooms, and Batches (via client-side queries)
   - Timetable generation and storage
   - Real-time conflict detection

### 6. Features Now Available
- **Real Database Persistence**: All data is stored in PostgreSQL via Supabase
- **Real-time Updates**: Supabase provides real-time subscriptions (can be added later)
- **Authentication**: Can integrate Supabase Auth for user management
- **Automatic Backups**: Supabase handles database backups
- **Scalability**: PostgreSQL can handle complex queries and large datasets

### 7. API Fallback Strategy
The application includes a smart fallback strategy:
1. **Primary**: Try Supabase database operations
2. **Secondary**: Fall back to mock data if Supabase fails
3. **Tertiary**: Fall back to traditional API endpoints if available

This ensures your application remains functional even if database connectivity is temporarily unavailable.

### 8. Next Steps
Consider adding:
- Real-time subscriptions for live timetable updates
- Supabase Auth integration for user management
- File storage for faculty photos, documents, etc.
- Advanced queries for conflict detection and optimization
- Database triggers for automatic quality score calculation

## Security Notes
- Never expose your Service Role Key to client-side code
- Use Row Level Security policies to control data access
- Regularly review and update your security policies
- Enable database logging for audit trails