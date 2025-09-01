-- Create family_offices table
CREATE TABLE public.family_offices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on family_offices
ALTER TABLE public.family_offices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for family_offices
CREATE POLICY "Authenticated users can read all offices" 
ON public.family_offices 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can insert new offices" 
ON public.family_offices 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Add family_office_id column to projects table
ALTER TABLE public.projects 
ADD COLUMN family_office_id UUID;

-- Add foreign key constraint
ALTER TABLE public.projects 
ADD CONSTRAINT fk_projects_family_office 
FOREIGN KEY (family_office_id) 
REFERENCES public.family_offices(id) 
ON DELETE SET NULL;

-- Add DELETE policy for projects table
CREATE POLICY "Users can only DELETE their own projects" 
ON public.projects 
FOR DELETE 
USING (auth.uid() = user_id);