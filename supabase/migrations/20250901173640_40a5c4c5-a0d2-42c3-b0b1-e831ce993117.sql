-- Drop existing separate RLS policies for system_prompts
DROP POLICY IF EXISTS "Authenticated users can view system prompts" ON public.system_prompts;
DROP POLICY IF EXISTS "Authenticated users can create system prompts" ON public.system_prompts;
DROP POLICY IF EXISTS "Authenticated users can update system prompts" ON public.system_prompts;
DROP POLICY IF EXISTS "Authenticated users can delete system prompts" ON public.system_prompts;

-- Create consolidated RLS policy for all actions
CREATE POLICY "Allow all authenticated users to manage prompts" 
ON public.system_prompts 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);