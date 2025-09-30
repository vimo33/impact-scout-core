-- Add missing fields to companies table for full JSON template support

-- Add company metadata fields
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS founded_year integer,
ADD COLUMN IF NOT EXISTS employee_count text,
ADD COLUMN IF NOT EXISTS hq_city text,
ADD COLUMN IF NOT EXISTS hq_country text;

-- Add complex data fields as JSONB
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS products_solutions jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS clinical_activity jsonb DEFAULT '{"trials": [], "pilots": []}'::jsonb,
ADD COLUMN IF NOT EXISTS ip_portfolio jsonb DEFAULT '{"patents": [], "key_publications": []}'::jsonb,
ADD COLUMN IF NOT EXISTS publications jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS news_sentiment jsonb DEFAULT '{"recent_news": [], "market_sentiment": null}'::jsonb,
ADD COLUMN IF NOT EXISTS contacts jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS category_completeness jsonb DEFAULT '{}'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN public.companies.founded_year IS 'Year the company was founded';
COMMENT ON COLUMN public.companies.employee_count IS 'Current employee count or range';
COMMENT ON COLUMN public.companies.hq_city IS 'Headquarters city';
COMMENT ON COLUMN public.companies.hq_country IS 'Headquarters country';
COMMENT ON COLUMN public.companies.products_solutions IS 'Array of product/solution objects with name and description';
COMMENT ON COLUMN public.companies.clinical_activity IS 'Clinical trials and pilot programs data';
COMMENT ON COLUMN public.companies.ip_portfolio IS 'Patents and key publications';
COMMENT ON COLUMN public.companies.publications IS 'Scientific publications array';
COMMENT ON COLUMN public.companies.news_sentiment IS 'Recent news articles and market sentiment';
COMMENT ON COLUMN public.companies.contacts IS 'Array of contact information';
COMMENT ON COLUMN public.companies.category_completeness IS 'Data completeness percentage by category';