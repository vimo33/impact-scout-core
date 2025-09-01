import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UpdateProjectParams {
  id: string;
  investment_thesis: string;
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, investment_thesis }: UpdateProjectParams) => {
      const { data, error } = await supabase
        .from("projects")
        .update({
          investment_thesis,
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
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
      toast({
        title: "Success",
        description: "Investment thesis updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update investment thesis. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating project:", error);
    },
  });
};