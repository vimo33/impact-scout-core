import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ShortlistItem {
  id: string;
  project_id: string;
  company_id: string;
  user_id: string;
  added_at: string;
  notes: string | null;
}

interface AddToShortlistParams {
  projectId: string;
  companyId: string;
  notes?: string;
}

export const useShortlist = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ["shortlist", projectId],
    queryFn: async (): Promise<ShortlistItem[]> => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      const { data, error } = await supabase
        .from("shortlist")
        .select("*")
        .eq("project_id", projectId)
        .order("added_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: !!projectId,
  });
};

export const useAddToShortlist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, companyId, notes }: AddToShortlistParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("shortlist")
        .insert([
          {
            project_id: projectId,
            company_id: companyId,
            user_id: user.id,
            notes: notes || null,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shortlist", data.project_id] });
      toast({
        title: "Added to Shortlist",
        description: "Company has been added to your shortlist.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message.includes("duplicate") 
          ? "Company is already in your shortlist." 
          : "Failed to add company to shortlist. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useRemoveFromShortlist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, companyId }: { projectId: string; companyId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("shortlist")
        .delete()
        .eq("project_id", projectId)
        .eq("company_id", companyId)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shortlist", variables.projectId] });
      toast({
        title: "Removed from Shortlist",
        description: "Company has been removed from your shortlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove company from shortlist. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useIsInShortlist = (projectId: string | undefined, companyId: string | undefined) => {
  const { data: shortlist } = useShortlist(projectId);
  
  return shortlist?.some(item => item.company_id === companyId) || false;
};