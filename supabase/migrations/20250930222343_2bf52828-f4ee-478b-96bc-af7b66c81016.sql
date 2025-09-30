-- Add new fields to companies table for complete data mapping
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS customers_partners jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS team jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS evidence jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS news_sentiment_label text;

-- Add comments for documentation
COMMENT ON COLUMN public.companies.customers_partners IS 'Array of customer and partner information with name, type, notes, and link_url';
COMMENT ON COLUMN public.companies.team IS 'Array of team member information with name, role, and linkedin_url';
COMMENT ON COLUMN public.companies.evidence IS 'Object containing source_references array and corporate_profile data';
COMMENT ON COLUMN public.companies.news_sentiment_label IS 'Overall market sentiment label: positive, neutral, or negative';