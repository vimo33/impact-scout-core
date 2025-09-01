-- Create table for storing semantic expansion results
CREATE TABLE public.project_semantic_keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  input_category TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.project_semantic_keywords ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view semantic keywords for their own projects" 
ON public.project_semantic_keywords 
FOR SELECT 
USING (project_id IN (
  SELECT id FROM projects WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create semantic keywords for their own projects" 
ON public.project_semantic_keywords 
FOR INSERT 
WITH CHECK (project_id IN (
  SELECT id FROM projects WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update semantic keywords for their own projects" 
ON public.project_semantic_keywords 
FOR UPDATE 
USING (project_id IN (
  SELECT id FROM projects WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete semantic keywords for their own projects" 
ON public.project_semantic_keywords 
FOR DELETE 
USING (project_id IN (
  SELECT id FROM projects WHERE user_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_project_semantic_keywords_updated_at
BEFORE UPDATE ON public.project_semantic_keywords
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();