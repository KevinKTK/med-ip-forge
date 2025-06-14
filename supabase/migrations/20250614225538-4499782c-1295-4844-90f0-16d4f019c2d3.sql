
-- Add new columns to the projects table for enhanced project management
ALTER TABLE public.projects 
ADD COLUMN images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN detailed_description TEXT,
ADD COLUMN marketing_materials JSONB DEFAULT '{}'::jsonb,
ADD COLUMN project_status TEXT DEFAULT 'draft',
ADD COLUMN owner_wallet_address TEXT;

-- Create a storage bucket for project assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-assets', 'project-assets', true);

-- Create RLS policies for the project-assets bucket
CREATE POLICY "Anyone can view project assets" ON storage.objects
FOR SELECT USING (bucket_id = 'project-assets');

CREATE POLICY "Authenticated users can upload project assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own project assets" ON storage.objects
FOR UPDATE USING (bucket_id = 'project-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own project assets" ON storage.objects
FOR DELETE USING (bucket_id = 'project-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
