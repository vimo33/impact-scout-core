-- Extend companies table with new fields for enhanced UI
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS entity_type TEXT DEFAULT 'Company';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS funding_track TEXT DEFAULT 'Unknown';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS funding_stage TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS total_raised TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS key_investors TEXT[] DEFAULT '{}';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS mission_statement TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS technology_summary TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS opportunity_summary TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS risk_badges TEXT[] DEFAULT '{}';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS stage_confidence_score INTEGER DEFAULT 50;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS data_completeness_percentage INTEGER DEFAULT 25;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS missing_kpi_count INTEGER DEFAULT 0;

-- Create shortlist table
CREATE TABLE IF NOT EXISTS public.shortlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  company_id UUID NOT NULL,
  user_id UUID NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  UNIQUE(project_id, company_id, user_id)
);

-- Enable RLS on shortlist table
ALTER TABLE public.shortlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shortlist
CREATE POLICY "Users can view their own shortlist items" 
ON public.shortlist 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own shortlist" 
ON public.shortlist 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own shortlist" 
ON public.shortlist 
FOR DELETE 
USING (auth.uid() = user_id);

-- Update sample data for demonstration
UPDATE public.companies 
SET 
  entity_type = CASE 
    WHEN RANDOM() < 0.6 THEN 'Company'
    WHEN RANDOM() < 0.8 THEN 'Lab'
    ELSE 'Spin-out'
  END,
  funding_track = CASE 
    WHEN RANDOM() < 0.4 THEN 'VC-Early'
    WHEN RANDOM() < 0.6 THEN 'Grant-Winner'
    WHEN RANDOM() < 0.8 THEN 'Bootstrapped'
    ELSE 'Clinical/Pilot'
  END,
  location = CASE 
    WHEN RANDOM() < 0.3 THEN 'Boston, USA'
    WHEN RANDOM() < 0.5 THEN 'London, UK'
    WHEN RANDOM() < 0.7 THEN 'Zurich, Switzerland'
    ELSE 'Berlin, Germany'
  END,
  funding_stage = CASE 
    WHEN RANDOM() < 0.3 THEN 'Seed'
    WHEN RANDOM() < 0.6 THEN 'Series A'
    WHEN RANDOM() < 0.8 THEN 'Grant'
    ELSE 'Bootstrapped'
  END,
  total_raised = CASE 
    WHEN RANDOM() < 0.4 THEN '$2.5M'
    WHEN RANDOM() < 0.7 THEN '$8.1M'
    ELSE '$15.3M'
  END,
  tags = ARRAY['biotech', 'AI/ML', 'telemedicine']::TEXT[],
  key_investors = ARRAY['Andreessen Horowitz', 'Sequoia Capital']::TEXT[],
  stage_confidence_score = (RANDOM() * 40 + 60)::INTEGER,
  data_completeness_percentage = (RANDOM() * 30 + 70)::INTEGER,
  missing_kpi_count = (RANDOM() * 5)::INTEGER
WHERE entity_type IS NULL;