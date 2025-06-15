
-- Add missing columns to projects table
ALTER TABLE projects 
ADD COLUMN images jsonb DEFAULT '[]'::jsonb,
ADD COLUMN project_status text DEFAULT 'draft' CHECK (project_status IN ('draft', 'published', 'funded', 'completed')),
ADD COLUMN marketing_materials jsonb DEFAULT '{}'::jsonb,
ADD COLUMN owner_wallet_address text;

-- Update the existing status column constraint to include new statuses
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('active', 'completed', 'cancelled', 'draft', 'published', 'funded'));
