import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface KpiFrameworkData {
  framework: {
    id: string;
    framework_name: string;
    version: number;
    created_at: string;
  };
  kpis: Array<{
    id: string;
    kpi_name: string;
    kpi_description: string | null;
    category: string;
  }>;
}

export const useProjectKpiFramework = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ["project-kpi-framework", projectId],
    queryFn: async (): Promise<KpiFrameworkData | null> => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      // First, get the KPI framework for this project
      const { data: framework, error: frameworkError } = await supabase
        .from("kpi_frameworks")
        .select("id, framework_name, version, created_at")
        .eq("project_id", projectId)
        .maybeSingle();

      if (frameworkError) {
        throw frameworkError;
      }

      if (!framework) {
        return null;
      }

      // Then get all KPIs for this framework
      const { data: kpis, error: kpisError } = await supabase
        .from("kpis")
        .select("id, kpi_name, kpi_description, category")
        .eq("framework_id", framework.id)
        .order("category", { ascending: true })
        .order("kpi_name", { ascending: true });

      if (kpisError) {
        throw kpisError;
      }

      return {
        framework,
        kpis: kpis || [],
      };
    },
    enabled: !!projectId,
  });
};

export const formatKpiFrameworkForPrompt = (frameworkData: KpiFrameworkData | null): string => {
  if (!frameworkData || !frameworkData.kpis.length) {
    return "No KPI framework available - please generate KPIs first.";
  }

  const categories = ['Scientific/Technical', 'Operational', 'Financial', 'Impact'];
  let markdown = "";

  categories.forEach(category => {
    const categoryKpis = frameworkData.kpis.filter(kpi => kpi.category === category);
    if (categoryKpis.length > 0) {
      markdown += `${category}:\n`;
      categoryKpis.forEach(kpi => {
        markdown += `"${kpi.kpi_name}"\n`;
        if (kpi.kpi_description) {
          markdown += `  (${kpi.kpi_description})\n`;
        }
      });
      markdown += "\n";
    }
  });

  return markdown.trim();
};