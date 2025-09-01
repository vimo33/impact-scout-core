import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GenerateKpisFromEnhancedDataParams {
  projectId: string;
  investmentThesis: string;
  selectedKeywords: string[];
}

export const useGenerateKpisFromEnhancedData = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, investmentThesis, selectedKeywords }: GenerateKpisFromEnhancedDataParams) => {
      // Create enhanced input by combining investment thesis with selected keywords
      const enhancedInput = `${investmentThesis}\n\nRelated keywords and concepts: ${selectedKeywords.join(', ')}`;

      // Call the generate-kpi-framework edge function with enhanced data
      const { data: kpiData, error: kpiError } = await supabase.functions.invoke(
        "generate-kpi-framework",
        {
          body: {
            project_id: projectId,
            investment_thesis: enhancedInput,
          },
        }
      );

      if (kpiError) {
        throw kpiError;
      }

      // Update the project to mark KPIs as generated
      const { error: updateError } = await supabase
        .from("projects")
        .update({ has_generated_kpis: true })
        .eq("id", projectId);

      if (updateError) {
        throw updateError;
      }

      return kpiData;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
      toast({
        title: "Success",
        description: "KPI framework generated with enhanced data successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate KPI framework. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating KPIs from enhanced data:", error);
    },
  });
};