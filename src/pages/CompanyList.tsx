import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CompanyListDisplay from "@/components/CompanyListDisplay";
import { useProcessManualResearch } from "@/hooks/useProcessManualResearch";
import { Loader2 } from "lucide-react";

const CompanyList = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [researchData, setResearchData] = useState("");
  
  const processManualResearch = useProcessManualResearch();

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