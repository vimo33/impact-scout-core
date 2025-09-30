import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductSolution {
  name: string;
  description: string;
  type?: string;
  status?: string;
  link_url?: string;
}

interface CustomerPartner {
  name: string;
  type: string;
  notes?: string;
  link_url?: string;
}

interface TeamMember {
  name: string;
  role: string;
  linkedin_url?: string;
}

interface Evidence {
  source_references?: string[];
  corporate_profile?: {
    press_releases?: string[];
    technology_summary?: string;
  };
}

interface ClinicalTrial {
  trial_id: string;
  title: string;
  status: string;
  phase: string;
}

interface Pilot {
  partner: string;
  description: string;
  status: string;
}

interface Patent {
  patent_number: string;
  title: string;
  year: number;
}

interface Publication {
  title: string;
  journal: string;
  year: number;
  doi: string;
}

interface NewsItem {
  headline: string;
  date: string;
  source: string;
  url: string;
}

interface Contact {
  name: string;
  title: string;
  email: string;
  linkedin: string;
}

interface Company {
  id: string;
  company_name: string;
  company_description: string | null;
  relevance_score: number | null;
  website_url: string | null;
  project_id: string;
  created_at: string;
  entity_type: string | null;
  funding_track: string | null;
  location: string | null;
  funding_stage: string | null;
  total_raised: string | null;
  key_investors: string[] | null;
  tags: string[] | null;
  mission_statement: string | null;
  technology_summary: string | null;
  opportunity_summary: string | null;
  risk_badges: string[] | null;
  stage_confidence_score: number | null;
  data_completeness_percentage: number | null;
  missing_kpi_count: number | null;
  founded_year: number | null;
  employee_count: string | null;
  hq_city: string | null;
  hq_country: string | null;
  products_solutions: ProductSolution[] | null;
  customers_partners: CustomerPartner[] | null;
  team: TeamMember[] | null;
  clinical_activity: {
    trials: ClinicalTrial[];
    pilots: Pilot[];
  } | null;
  ip_portfolio: {
    patents: Patent[];
    key_publications: Publication[];
  } | null;
  publications: Publication[] | null;
  news_sentiment: {
    recent_news: NewsItem[];
    market_sentiment: string | null;
  } | null;
  news_sentiment_label: string | null;
  contacts: Contact[] | null;
  evidence: Evidence | null;
  category_completeness: Record<string, number> | null;
}

export const useCompanies = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ["companies", projectId],
    queryFn: async (): Promise<Company[]> => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("project_id", projectId)
        .order("relevance_score", { ascending: false, nullsFirst: false });

      if (error) {
        throw error;
      }

      // Cast JSONB fields to proper types
      return (data || []).map(company => ({
        ...company,
        products_solutions: company.products_solutions as unknown as ProductSolution[] | null,
        customers_partners: company.customers_partners as unknown as CustomerPartner[] | null,
        team: company.team as unknown as TeamMember[] | null,
        clinical_activity: company.clinical_activity as unknown as { trials: ClinicalTrial[]; pilots: Pilot[] } | null,
        ip_portfolio: company.ip_portfolio as unknown as { patents: Patent[]; key_publications: Publication[] } | null,
        publications: company.publications as unknown as Publication[] | null,
        news_sentiment: company.news_sentiment as unknown as { recent_news: NewsItem[]; market_sentiment: string | null } | null,
        contacts: company.contacts as unknown as Contact[] | null,
        evidence: company.evidence as unknown as Evidence | null,
        category_completeness: company.category_completeness as unknown as Record<string, number> | null,
      }));
    },
    enabled: !!projectId,
  });
};