import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProjectKpiFramework, formatKpiFrameworkForPrompt } from "@/hooks/useProjectKpiFramework";
import { useSystemPrompt } from "@/hooks/useSystemPrompt";
import { processTemplate } from "@/lib/templateProcessor";

interface Project {
  id: string;
  project_title: string;
  investment_thesis: string | null;
  selected_keywords: string[];
}

interface DeepResearchPromptSectionProps {
  project: Project;
}

export const DeepResearchPromptSection = ({ project }: DeepResearchPromptSectionProps) => {
  const { toast } = useToast();
  const { data: kpiFramework } = useProjectKpiFramework(project.id);
  const { data: promptTemplate, isLoading: isLoadingPrompt, error: promptError } = useSystemPrompt("deep_research_prompt");

  const generatePrompt = () => {
    if (!promptTemplate) {
      return "Loading prompt template...";
    }

    // Prepare template data
    const templateData = {
      investment_thesis: project?.investment_thesis || "No investment thesis specified",
      keywords: project?.selected_keywords || [],
      kpi_framework: formatKpiFrameworkForPrompt(kpiFramework)
    };

    return processTemplate(promptTemplate.prompt_text, templateData);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatePrompt());
      toast({
        title: "Copied",
        description: "Deep research prompt copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (promptError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2 text-destructive">Error Loading Prompt Template</h2>
            <p className="text-muted-foreground">
              Failed to load the deep research prompt template. Please refresh the page or try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-muted-foreground" />
          Deep Research Prompt
        </CardTitle>
        <CardDescription>
          Use this AI-generated research prompt to conduct comprehensive company analysis. 
          Copy the prompt below, run it in your preferred AI research tool, and paste the JSON results in the next section.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingPrompt ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-40 ml-auto" />
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Research prompt ready with your project data</span>
              </div>
              <Button onClick={handleCopyPrompt} variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy Prompt
              </Button>
            </div>
            
            <Textarea
              value={generatePrompt()}
              readOnly
              className="min-h-[400px] font-mono text-xs"
              placeholder="Research prompt will appear here..."
            />
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Instructions:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Click "Copy Prompt" to copy the research instructions</li>
                <li>Paste the prompt into Claude, ChatGPT, or your preferred AI research tool</li>
                <li>Run the comprehensive research analysis</li>
                <li>Copy the JSON results and paste them in the "Manual Research Data" section below</li>
              </ol>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};