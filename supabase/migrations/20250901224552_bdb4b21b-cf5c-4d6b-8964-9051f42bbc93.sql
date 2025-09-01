-- Add has_generated_kpis field to projects table to track completion state
ALTER TABLE public.projects 
ADD COLUMN has_generated_kpis BOOLEAN NOT NULL DEFAULT false;

-- Update existing projects that have KPI frameworks to set has_generated_kpis = true
UPDATE public.projects 
SET has_generated_kpis = true 
WHERE id IN (
  SELECT DISTINCT project_id 
  FROM public.kpi_frameworks
);