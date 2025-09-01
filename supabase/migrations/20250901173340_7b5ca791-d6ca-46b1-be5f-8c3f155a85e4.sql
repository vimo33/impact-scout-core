-- Create system_prompts table for managing AI prompts
CREATE TABLE public.system_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_name TEXT NOT NULL UNIQUE,
  prompt_text TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.system_prompts ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to manage system prompts
CREATE POLICY "Authenticated users can view system prompts" 
ON public.system_prompts 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create system prompts" 
ON public.system_prompts 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update system prompts" 
ON public.system_prompts 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete system prompts" 
ON public.system_prompts 
FOR DELETE 
TO authenticated 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_system_prompts_updated_at
BEFORE UPDATE ON public.system_prompts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();