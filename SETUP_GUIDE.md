# Anonymous Reporter - Database Setup Guide

## Problem
Your application is currently running in **demo mode** because it can't find Supabase environment variables. Reports are not being saved to a real database.

## Solution Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Note down your project URL and anon key

### 2. Set up Database
1. In your Supabase dashboard, go to the SQL Editor
2. Run the following SQL files in order:
   - `FIXED-database-setup.sql` (creates tables and structure)
   - `FIXED-sample-data.sql` (adds sample data)

### 3. Create Environment File
Create a `.env` file in the project root with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Test the Application
1. Restart your development server
2. Try submitting a report
3. Check if it appears in the reports list

## Database Schema
The application uses two main tables:
- `reports` - stores anonymous reports
- `locations` - stores Polish location data

## Security Features
- Row Level Security (RLS) enabled
- Anonymous access for report submission
- No personal data collection
- Encrypted data storage

## Troubleshooting
- Make sure your Supabase project is active
- Check that RLS policies are properly set
- Verify environment variables are loaded
- Check browser console for errors
