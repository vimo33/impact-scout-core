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

export const useSystemPrompts = () => {
  return useQuery({
    queryKey: ["system_prompts"],
    queryFn: async (): Promise<SystemPrompt[]> => {
      const { data, error } = await supabase
        .from("system_prompts")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    },
  });
};