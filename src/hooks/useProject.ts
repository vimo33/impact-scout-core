import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  project_title: string;
  investment_thesis: string | null;
  created_at: string;
  family_office_id: string | null;
  family_office_name: string | null;
  has_generated_kpis: boolean;
  selected_keywords: string[];
}

export const useProject = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async (): Promise<Project> => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      const { data, error } = await supabase
        .from("projects")
        .select(`
          id,
          project_title,
          investment_thesis,
          created_at,
          family_office_id,
          has_generated_kpis,
          selected_keywords,
          family_offices:family_office_id(name)
        `)
        .eq("id", projectId)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Project not found");
      }

      return {
        ...data,
        family_office_name: data.family_offices?.name || null,
        selected_keywords: (data.selected_keywords as string[]) || [],
      };
    },
    enabled: !!projectId,
  });
};