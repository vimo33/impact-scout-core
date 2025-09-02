import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CompanyListDisplay from "@/components/CompanyListDisplay";
import { DeepResearchPromptSection } from "@/components/DeepResearchPromptSection";
import { useProcessManualResearch } from "@/hooks/useProcessManualResearch";
import { useProjectValidation } from "@/hooks/useProjectValidation";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

const CompanyList = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [researchData, setResearchData] = useState("");
  
  const processManualResearch = useProcessManualResearch();
  const { validateProject, project } = useProjectValidation(projectId);
  
  // Validate project completion status
  useEffect(() => {
    const validation = validateProject();
    if (!validation.isValid && validation.redirectPath) {
      navigate(validation.redirectPath);
    }
  }, [projectId, navigate, validateProject]);

  const handleProcessData = () => {
    if (!projectId || !researchData.trim()) return;
    
    processManualResearch.mutate({
      projectId,
      researchJsonString: researchData,
    }, {
      onSuccess: () => {
        // Clear the textarea after successful processing
        setResearchData("");
      }
    });
  };

  const validation = validateProject();
  
  // Show validation errors if project is not ready
  if (!validation.isValid) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              onClick={() => navigate("/app/dashboard")}
              variant="ghost" 
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please complete the following steps before proceeding with company research:
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  {validation.missingSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
                <Button 
                  className="mt-4" 
                  onClick={() => validation.redirectPath && navigate(validation.redirectPath)}
                >
                  Complete Missing Steps
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Research & Longlist</h1>
          <p className="text-muted-foreground mt-2">
            Manage and analyze potential investment targets for this project.
          </p>
        </div>

        {/* Deep Research Prompt Section */}
        <div className="mb-8">
          <DeepResearchPromptSection project={project} />
        </div>

        {/* Manual Data Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Data Input</CardTitle>
            <CardDescription>
              Import deep research data from external analysis tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="research-data">Paste Deep Research JSON Output Here</Label>
              <Textarea
                id="research-data"
                placeholder="Paste your JSON data here... Expected format: { companies: [...] }"
                value={researchData}
                onChange={(e) => setResearchData(e.target.value)}
                className="min-h-[300px] resize-y font-mono text-sm"
              />
            </div>
            <Button 
              onClick={handleProcessData}
              className="w-full sm:w-auto"
              disabled={!researchData.trim() || processManualResearch.isPending}
            >
              {processManualResearch.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {processManualResearch.isPending ? "Processing..." : "Process & Save Companies"}
            </Button>
          </CardContent>
        </Card>

        {/* Company List Display */}
        {projectId && <CompanyListDisplay projectId={projectId} />}
      </div>
    </div>
  );
};

export default CompanyList;