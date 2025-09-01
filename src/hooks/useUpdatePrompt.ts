import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UpdatePromptParams {
  id: string;
  prompt_text: string;
}

export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, prompt_text }: UpdatePromptParams) => {
      const { data, error } = await supabase
        .from("system_prompts")
        .update({
          prompt_text,
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
      queryClient.invalidateQueries({ queryKey: ["system_prompts"] });
      toast({
        title: "Success",
        description: `${data.prompt_name} has been updated successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update prompt. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating prompt:", error);
    },
  });
};