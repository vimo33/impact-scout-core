-- Enable Row Level Security on kpi_frameworks and kpis tables
ALTER TABLE public.kpi_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;

-- RLS Policies for kpi_frameworks table
CREATE POLICY "Users can view KPI frameworks for their own projects" 
ON public.kpi_frameworks 
FOR SELECT 
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create KPI frameworks for their own projects" 
ON public.kpi_frameworks 
FOR INSERT 
WITH CHECK (
  project_id IN (
    SELECT id FROM public.projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update KPI frameworks for their own projects" 
ON public.kpi_frameworks 
FOR UPDATE 
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete KPI frameworks for their own projects" 
ON public.kpi_frameworks 
FOR DELETE 
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE user_id = auth.uid()
  )
);

-- RLS Policies for kpis table
CREATE POLICY "Users can view KPIs for their own projects" 
ON public.kpis 
FOR SELECT 
USING (
  framework_id IN (
    SELECT kf.id FROM public.kpi_frameworks kf
    JOIN public.projects p ON kf.project_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create KPIs for their own projects" 
ON public.kpis 
FOR INSERT 
WITH CHECK (
  framework_id IN (
    SELECT kf.id FROM public.kpi_frameworks kf
    JOIN public.projects p ON kf.project_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update KPIs for their own projects" 
ON public.kpis 
FOR UPDATE 
USING (
  framework_id IN (
    SELECT kf.id FROM public.kpi_frameworks kf
    JOIN public.projects p ON kf.project_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete KPIs for their own projects" 
ON public.kpis 
FOR DELETE 
USING (
  framework_id IN (
    SELECT kf.id FROM public.kpi_frameworks kf
    JOIN public.projects p ON kf.project_id = p.id
    WHERE p.user_id = auth.uid()
  )
);