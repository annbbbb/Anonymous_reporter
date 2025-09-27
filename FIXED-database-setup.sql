-- FIXED Database Setup - handles ENUM conversion properly
-- This script can be run multiple times without errors

-- 1. Create ENUM types if they don't exist
DO $$ 
BEGIN
    -- Create report_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
        CREATE TYPE report_status AS ENUM ('pending', 'in_review', 'resolved', 'rejected');
    END IF;
    
    -- Create report_priority enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_priority') THEN
        CREATE TYPE report_priority AS ENUM ('low', 'medium', 'high', 'critical');
    END IF;
END $$;

-- 2. Add new columns to reports table (if they don't exist)
DO $$ 
BEGIN
    -- Add priority column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'priority') THEN
        ALTER TABLE reports ADD COLUMN priority report_priority DEFAULT 'medium';
    END IF;
    
    -- Add AI analysis columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'ai_analysis') THEN
        ALTER TABLE reports ADD COLUMN ai_analysis JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'ai_suggested_category') THEN
        ALTER TABLE reports ADD COLUMN ai_suggested_category VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'ai_urgency_score') THEN
        ALTER TABLE reports ADD COLUMN ai_urgency_score INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'ai_confidence_score') THEN
        ALTER TABLE reports ADD COLUMN ai_confidence_score DECIMAL(3,2) DEFAULT 0.0;
    END IF;
END $$;

-- 3. Update existing columns to use ENUMs (SAFE METHOD)
DO $$ 
BEGIN
    -- Update status column to use ENUM (if it's still VARCHAR)
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'reports' AND column_name = 'status' 
               AND udt_name = 'varchar') THEN
        
        -- Remove default first
        BEGIN
            ALTER TABLE reports ALTER COLUMN status DROP DEFAULT;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
        
        -- Change type
        ALTER TABLE reports ALTER COLUMN status TYPE report_status USING status::report_status;
        
        -- Add new default
        ALTER TABLE reports ALTER COLUMN status SET DEFAULT 'pending'::report_status;
    END IF;
    
    -- Update priority column to use ENUM (if it's still VARCHAR)
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'reports' AND column_name = 'priority' 
               AND udt_name = 'varchar') THEN
        
        -- Remove default first
        BEGIN
            ALTER TABLE reports ALTER COLUMN priority DROP DEFAULT;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
        
        -- Change type
        ALTER TABLE reports ALTER COLUMN priority TYPE report_priority USING priority::report_priority;
        
        -- Add new default
        ALTER TABLE reports ALTER COLUMN priority SET DEFAULT 'medium'::report_priority;
    END IF;
END $$;

-- 4. Create policies only if they don't exist
DO $$ 
BEGIN
    -- Policy for locations read access
    IF NOT EXISTS (SELECT 1 FROM pg_policies 
                   WHERE tablename = 'locations' AND policyname = 'Allow anonymous read access to locations') THEN
        CREATE POLICY "Allow anonymous read access to locations" ON locations
          FOR SELECT USING (true);
    END IF;
    
    -- Policy for reports insert
    IF NOT EXISTS (SELECT 1 FROM pg_policies 
                   WHERE tablename = 'reports' AND policyname = 'Allow anonymous insert to reports') THEN
        CREATE POLICY "Allow anonymous insert to reports" ON reports
          FOR INSERT WITH CHECK (true);
    END IF;
    
    -- Policy for reports read access
    IF NOT EXISTS (SELECT 1 FROM pg_policies 
                   WHERE tablename = 'reports' AND policyname = 'Allow anonymous read access to reports') THEN
        CREATE POLICY "Allow anonymous read access to reports" ON reports
          FOR SELECT USING (true);
    END IF;
END $$;

-- 5. Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_priority ON reports(priority);
CREATE INDEX IF NOT EXISTS idx_locations_voivodeship ON locations(voivodeship);
CREATE INDEX IF NOT EXISTS idx_locations_postal_code ON locations(postal_code);

-- 6. Enable RLS if not already enabled
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- 7. Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create trigger if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_reports_updated_at') THEN
        CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Success message
SELECT 'Database setup completed successfully!' as message;