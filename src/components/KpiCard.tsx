import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface KpiCardProps {
  kpi: {
    id: string;
    kpi_name: string;
    kpi_description: string | null;
    category: string;
    framework_id: string;
  };
}

export const KpiCard = ({ kpi }: KpiCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(kpi.kpi_name);
  const [editDescription, setEditDescription] = useState(kpi.kpi_description || '');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update KPI mutation
  const updateKpiMutation = useMutation({
    mutationFn: async (updates: { kpi_name: string; kpi_description: string }) => {
      const { error } = await supabase
        .from('kpis')
        .update(updates)
        .eq('id', kpi.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "KPI updated successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update KPI: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete KPI mutation
  const deleteKpiMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('kpis')
        .delete()
        .eq('id', kpi.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      toast({
        title: "Success",
        description: "KPI deleted successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete KPI: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "KPI name is required",
        variant: "destructive"
      });
      return;
    }

    updateKpiMutation.mutate({
      kpi_name: editName.trim(),
      kpi_description: editDescription.trim()
    });
  };

  const handleCancel = () => {
    setEditName(kpi.kpi_name);
    setEditDescription(kpi.kpi_description || '');
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="font-semibold"
                placeholder="KPI Name"
              />
            ) : (
              <CardTitle className="text-lg">{kpi.kpi_name}</CardTitle>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  disabled={updateKpiMutation.isPending}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={updateKpiMutation.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete KPI</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{kpi.kpi_name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteKpiMutation.mutate()}
                        disabled={deleteKpiMutation.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="KPI Description"
            className="min-h-[80px]"
          />
        ) : kpi.kpi_description ? (
          <CardDescription className="text-sm leading-relaxed">
            {kpi.kpi_description}
          </CardDescription>
        ) : (
          <CardDescription className="text-sm italic text-muted-foreground">
            No description provided
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
};