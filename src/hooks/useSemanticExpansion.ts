import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SemanticKeywords {
  id: string;
  project_id: string;
  input_category: string;
  keywords: string[];
  created_at: string;
  updated_at: string;
}

interface GenerateSemanticKeywordsParams {
  projectId: string;
  investmentCategory: string;
}

export const useSemanticKeywords = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ["semantic-keywords", projectId],
    queryFn: async (): Promise<SemanticKeywords[]> => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      const { data, error } = await supabase
        .from("project_semantic_keywords")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: !!projectId,
  });
};

export const useGenerateSemanticKeywords = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, investmentCategory }: GenerateSemanticKeywordsParams) => {
      // Call the semantic expansion edge function
      const { data: semanticData, error: semanticError } = await supabase.functions.invoke(
        "semantic-expansion",
        {
          body: { investment_category: investmentCategory },
        }
      );

      if (semanticError) {
        throw semanticError;
      }

      if (!semanticData?.keywords) {
        throw new Error("No keywords generated");
      }

      // Save the results to the database
      const { data, error } = await supabase
        .from("project_semantic_keywords")
        .insert({
          project_id: projectId,
          input_category: investmentCategory,
          keywords: semanticData.keywords,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["semantic-keywords", data.project_id] });
      toast({
        title: "Success",
        description: "Semantic keywords generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate semantic keywords. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating semantic keywords:", error);
    },
  });
};

export const useUpdateSemanticKeywords = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, keywords }: { id: string; keywords: string[] }) => {
      const { data, error } = await supabase
        .from("project_semantic_keywords")
        .update({
          keywords,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["semantic-keywords", data.project_id] });
      toast({
        title: "Success",
        description: "Keywords updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update keywords. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating keywords:", error);
    },
  });
};