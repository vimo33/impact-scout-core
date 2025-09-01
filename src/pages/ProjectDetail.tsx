import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Settings, Building2, Calendar, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { useProject } from "@/hooks/useProject";
import { InvestmentThesisSection } from "@/components/InvestmentThesisSection";
import { SemanticKeywordsSection } from "@/components/SemanticKeywordsSection";
import { useGenerateKpisFromEnhancedData } from "@/hooks/useGenerateKpisFromEnhancedData";
import { useSemanticKeywords } from "@/hooks/useSemanticExpansion";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(id);
  const { data: semanticKeywords } = useSemanticKeywords(id);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const generateKpis = useGenerateKpisFromEnhancedData();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/app/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-48" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                  <Skeleton className="h-10 w-48" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Error Loading Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {error instanceof Error ? error.message : "Failed to load project details. Please try again."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const handleGenerateKpis = async () => {
    if (!project.investment_thesis) return;

    try {
      await generateKpis.mutateAsync({
        projectId: project.id,
        investmentThesis: project.investment_thesis,
        selectedKeywords,
      });
      
      // Navigate to workbench after successful KPI generation
      navigate(`/app/projects/${project.id}/workbench`);
    } catch (error) {
      console.error("Error generating KPIs:", error);
    }
  };

  const canGenerateKpis = project.investment_thesis && 
                         semanticKeywords && 
                         semanticKeywords.length > 0 && 
                         !project.has_generated_kpis;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/app/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
            
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {project.project_title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Project Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Family Office */}
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Family Office</p>
                      <p className="text-base">
                        {project.family_office_name || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  {/* Creation Date */}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="text-base">
                        {format(new Date(project.created_at), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>


                {/* Action Buttons */}
                <div className="pt-4 border-t">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {canGenerateKpis && (
                      <Button 
                        onClick={handleGenerateKpis}
                        disabled={selectedKeywords.length === 0 || generateKpis.isPending}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {generateKpis.isPending ? "Generating..." : `Generate KPIs with Enhanced Data (${selectedKeywords.length} keywords)`}
                      </Button>
                    )}
                    {project.has_generated_kpis && (
                      <Button asChild>
                        <Link to={`/app/projects/${id}/workbench`}>
                          <Settings className="mr-2 h-4 w-4" />
                          Open KPI Workbench
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            </Card>
          </div>

          {/* Enhanced Investment Thesis Section */}
          <div className="mb-8">
            <InvestmentThesisSection project={project} />
          </div>

          {/* Semantic Keywords Section */}
          <div className="mb-8">
            <SemanticKeywordsSection 
              project={project}
              selectedKeywords={selectedKeywords}
              onKeywordSelectionChange={setSelectedKeywords}
              showSelection={canGenerateKpis}
            />
          </div>
        </div>
      </div>
    );
};

export default ProjectDetail;