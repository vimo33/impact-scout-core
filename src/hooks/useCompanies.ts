import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  company_name: string;
  company_description: string | null;
  relevance_score: number | null;
  website_url: string | null;
  project_id: string;
  created_at: string;
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

      return data || [];
    },
    enabled: !!projectId,
  });
};