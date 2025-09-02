-- Add selected_keywords field to projects table
ALTER TABLE public.projects 
ADD COLUMN selected_keywords JSON DEFAULT '[]'::json;