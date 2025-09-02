import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SystemPrompt {
  id: string;
  prompt_name: string;
  prompt_text: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export const useSystemPrompt = (promptName: string | undefined) => {
  return useQuery({
    queryKey: ["system_prompt", promptName],
    queryFn: async (): Promise<SystemPrompt | null> => {
      if (!promptName) {
        throw new Error("Prompt name is required");
      }

      const { data, error } = await supabase
        .from("system_prompts")
        .select("*")
        .eq("prompt_name", promptName)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!promptName,
  });
};