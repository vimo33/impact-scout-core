import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { KpiCard } from "@/components/KpiCard";
import { AddKpiDialog } from "@/components/AddKpiDialog";

const categories = ['Scientific/Technical', 'Operational', 'Financial', 'Impact'];

const Workbench = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addKpiOpen, setAddKpiOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Fetch project details
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch KPI framework
  const { data: framework, isLoading: frameworkLoading } = useQuery({
    queryKey: ['kpi_frameworks', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_frameworks')
        .select('*')
        .eq('project_id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch KPIs
  const { data: kpis = [], isLoading: kpisLoading } = useQuery({
    queryKey: ['kpis', framework?.id],
    queryFn: async () => {
      if (!framework?.id) return [];
      
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('framework_id', framework.id)
        .order('category', { ascending: true })
        .order('kpi_name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!framework?.id,
  });

  // Generate KPIs mutation
  const generateKpisMutation = useMutation({
    mutationFn: async () => {
      if (!project?.investment_thesis) {
        throw new Error('No investment thesis found for this project');
      }

      const { data, error } = await supabase.functions.invoke('generate-kpi-framework', {
        body: {
          project_id: id,
          investment_thesis: project.investment_thesis
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi_frameworks', id] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      toast({
        title: "Success",
        description: "KPIs generated successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate KPIs: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleAddKpi = (category: string) => {
    setSelectedCategory(category);
    setAddKpiOpen(true);
  };

  const getKpisByCategory = (category: string) => {
    return kpis.filter(kpi => kpi.category === category);
  };

  if (projectLoading || frameworkLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Project not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                KPI Workbench
              </h1>
              <p className="text-xl text-muted-foreground">
                {project.project_title}
              </p>
            </div>
            
            <Button 
              onClick={() => generateKpisMutation.mutate()}
              disabled={generateKpisMutation.isPending || !project.investment_thesis}
              className="flex items-center gap-2"
            >
              {generateKpisMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Generate KPIs
            </Button>
          </div>

          {!framework && !kpisLoading && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  No KPI framework found for this project. Click "Generate KPIs" to create one based on your investment thesis.
                </p>
              </CardContent>
            </Card>
          )}

          {framework && (
            <Accordion type="multiple" defaultValue={categories} className="space-y-4">
              {categories.map((category) => {
                const categoryKpis = getKpisByCategory(category);
                
                return (
                  <AccordionItem key={category} value={category} className="border rounded-lg">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <h3 className="text-lg font-semibold">{category}</h3>
                        <span className="text-sm text-muted-foreground">
                          {categoryKpis.length} KPI{categoryKpis.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-4">
                        {categoryKpis.length > 0 ? (
                          <>
                            {categoryKpis.map((kpi) => (
                              <KpiCard key={kpi.id} kpi={kpi} />
                            ))}
                          </>
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No KPIs in this category yet.
                          </p>
                        )}
                        
                        <Button
                          variant="outline"
                          onClick={() => handleAddKpi(category)}
                          className="w-full"
                          disabled={!framework}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New KPI
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>

        <AddKpiDialog
          open={addKpiOpen}
          onOpenChange={setAddKpiOpen}
          frameworkId={framework?.id}
          category={selectedCategory}
        />
      </div>
    </div>
  );
};

export default Workbench;