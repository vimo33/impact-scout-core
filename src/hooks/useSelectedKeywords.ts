import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UpdateSelectedKeywordsParams {
  projectId: string;
  selectedKeywords: string[];
}

export const useUpdateSelectedKeywords = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, selectedKeywords }: UpdateSelectedKeywordsParams) => {
      const { data, error } = await supabase
        .from("projects")
        .update({ selected_keywords: selectedKeywords })
        .eq("id", projectId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save keyword selection. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating selected keywords:", error);
    },
  });
};