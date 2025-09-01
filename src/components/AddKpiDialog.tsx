import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddKpiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frameworkId?: string;
  category: string;
}

export const AddKpiDialog = ({ open, onOpenChange, frameworkId, category }: AddKpiDialogProps) => {
  const [kpiName, setKpiName] = useState('');
  const [kpiDescription, setKpiDescription] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createKpiMutation = useMutation({
    mutationFn: async (newKpi: {
      framework_id: string;
      kpi_name: string;
      kpi_description: string;
      category: string;
    }) => {
      const { error } = await supabase
        .from('kpis')
        .insert([newKpi]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      setKpiName('');
      setKpiDescription('');
      onOpenChange(false);
      toast({
        title: "Success",
        description: "KPI added successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add KPI: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!frameworkId) {
      toast({
        title: "Error",
        description: "No framework ID available",
        variant: "destructive"
      });
      return;
    }

    if (!kpiName.trim()) {
      toast({
        title: "Error",
        description: "KPI name is required",
        variant: "destructive"
      });
      return;
    }

    createKpiMutation.mutate({
      framework_id: frameworkId,
      kpi_name: kpiName.trim(),
      kpi_description: kpiDescription.trim(),
      category: category
    });
  };

  const handleCancel = () => {
    setKpiName('');
    setKpiDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New KPI</DialogTitle>
            <DialogDescription>
              Add a new KPI to the {category} category.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="kpi-name">KPI Name *</Label>
              <Input
                id="kpi-name"
                value={kpiName}
                onChange={(e) => setKpiName(e.target.value)}
                placeholder="Enter KPI name..."
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="kpi-description">Description</Label>
              <Textarea
                id="kpi-description"
                value={kpiDescription}
                onChange={(e) => setKpiDescription(e.target.value)}
                placeholder="Enter KPI description..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createKpiMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createKpiMutation.isPending}
            >
              {createKpiMutation.isPending ? "Adding..." : "Add KPI"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};