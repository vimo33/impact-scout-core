import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProcessManualResearchParams {
  projectId: string;
  researchJsonString: string;
}

interface ProcessManualResearchResponse {
  success: boolean;
  message: string;
  results: {
    companiesProcessed: number;
    kpiRecordsCreated: number;
  };
}

export const useProcessManualResearch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, researchJsonString }: ProcessManualResearchParams): Promise<ProcessManualResearchResponse> => {
      // Validate JSON format before sending
      try {
        JSON.parse(researchJsonString);
      } catch (error) {
        throw new Error("Invalid JSON format. Please check your input and try again.");
      }

      const { data, error } = await supabase.functions.invoke("process-manual-research", {
        body: {
          project_id: projectId,
          research_json_string: researchJsonString,
        },
      });

      if (error) {
        throw error;
      }

      return data as ProcessManualResearchResponse;
    },
    onSuccess: (data, variables) => {
      // Invalidate companies query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["companies", variables.projectId] });
      
      toast({
        title: "Success",
        description: `Successfully processed and saved ${data.results.companiesProcessed} companies.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process research data. Please try again.",
        variant: "destructive",
      });
      console.error("Error processing manual research:", error);
    },
  });
};