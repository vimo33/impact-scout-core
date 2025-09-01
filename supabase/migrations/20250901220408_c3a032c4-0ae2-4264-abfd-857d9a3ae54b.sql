-- Fix RLS policies for company_kpi_data table
CREATE POLICY "Users can access KPI data for their own projects" 
ON public.company_kpi_data 
FOR SELECT 
USING (company_id IN (
  SELECT c.id FROM companies c 
  JOIN projects p ON c.project_id = p.id 
  WHERE p.user_id = auth.uid()
));

CREATE POLICY "Users can create KPI data for their own projects" 
ON public.company_kpi_data 
FOR INSERT 
WITH CHECK (company_id IN (
  SELECT c.id FROM companies c 
  JOIN projects p ON c.project_id = p.id 
  WHERE p.user_id = auth.uid()
));

CREATE POLICY "Users can update KPI data for their own projects" 
ON public.company_kpi_data 
FOR UPDATE 
USING (company_id IN (
  SELECT c.id FROM companies c 
  JOIN projects p ON c.project_id = p.id 
  WHERE p.user_id = auth.uid()
));

CREATE POLICY "Users can delete KPI data for their own projects" 
ON public.company_kpi_data 
FOR DELETE 
USING (company_id IN (
  SELECT c.id FROM companies c 
  JOIN projects p ON c.project_id = p.id 
  WHERE p.user_id = auth.uid()
));