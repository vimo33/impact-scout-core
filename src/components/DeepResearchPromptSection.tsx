import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProjectKpiFramework, formatKpiFrameworkForPrompt } from "@/hooks/useProjectKpiFramework";

interface Project {
  id: string;
  project_title: string;
  investment_thesis: string | null;
  selected_keywords: string[];
}

interface DeepResearchPromptSectionProps {
  project: Project;
}

const DEEP_RESEARCH_CONTEXT = `You are a world-class Senior Investment Analyst and Research Agent operating within the "Impact Scout AI" platform. Your exclusive mission is to serve a bespoke consultancy for the Swiss family office ecosystem. Your work must be defined by rigor, precision, objectivity, and a deep understanding of multi-faceted due diligence. You are not just a search engine; you are a synthesizer of complex information, tasked with identifying and analyzing high-potential impact investments.`;

const DEEP_RESEARCH_TASK = `Conduct a multi-source deep research investigation to identify and analyze companies that align with the provided Investment Thesis. For each promising company you identify, you must perform a detailed analysis and evaluate it against the approved KPI Framework. Your final output will be a structured, data-rich report ready for automated processing and expert human review.`;

const DEEP_RESEARCH_GUIDELINES = `Guidelines (Multi-Step Research & Analysis Workflow)

Think step-by-step. First, formulate your plan, then execute the research across all specified sources, and finally, synthesize and score the results according to the required output format.

Step 1: Deconstruct & Plan
Analyze the Investment Thesis and Keywords to formulate a set of 3-5 core research questions that will guide your investigation.
Identify the key entities, technologies, and market segments to focus on.

Step 2: Multi-Source Data Ingestion
Execute a comprehensive search and data extraction plan across the following domains. You must gather information from all of them.

A. Corporate & Financial Data:
Scrape company websites for mission statements, technology descriptions, team information, and press releases.
Query financial data sources (like Crunchbase, PitchBook) for funding history, investors, and firmographics.
Search for SEC filings (e.g., 10-K, 8-K) for public companies to find financial statements and risk factors.

B. News & Market Sentiment:
Analyze recent news articles (last 12 months) to understand public perception, recent partnerships, and product launches.
Perform a sentiment analysis (Positive, Neutral, Negative) on the collected news.

C. Scientific & Technical Validation:
Search academic databases (like Google Scholar, ArXiv, PubMed) for papers published by or citing the company's technology or key personnel.
Assess the scientific credibility and novelty of their approach.

D. Intellectual Property Analysis:
Search patent registries (like Google Patents, USPTO) for patents filed by the company.
Analyze the scope and number of granted patents to evaluate the strength of their intellectual property.

Step 3: Synthesize & Analyze Against KPIs
For each company identified, synthesize the information gathered from all sources to create a profile.
Meticulously map the collected data points to the specific metrics in the Approved KPI Framework.
For each KPI where a data point is found, create a corresponding object for the kpi_data array in the final JSON output. Each object must contain the kpi_name, the found data_value, and the source_url.
If a data point for a specific KPI cannot be found, do not include it in the kpi_data array.

Step 4: Scoring & Ranking
Calculate a final relevance_score (out of 100) for each company. This score must be a weighted average of the following three factors:
Semantic Similarity (40 points): How closely does the company's core mission and technology align with the Investment Thesis?
KPI Data Availability (40 points): What percentage of the approved KPIs have corresponding data points that you were able to locate?
News Sentiment (20 points): What is the prevailing sentiment of recent news coverage? (Positive = 20, Neutral = 10, Negative = 0).

Step 5: Final Output Generation
Present your findings as a single, structured JSON object. This object must contain one key: "companies".
The value for the "companies" key must be a JSON array, where each object in the array represents one company and strictly follows the schema defined below.`;

const DEEP_RESEARCH_CONSTRAINTS = `Constraints

Objectivity is Paramount: You must remain a neutral and unbiased analyst. Report the facts as found.
Source Provenance: For every key data point, especially within the kpi_data array, you must cite the source URL. This is non-negotiable for Explainable AI (XAI).
Public Information Only: Your research is limited to publicly available information. Do not infer or assume non-public data.
Strict Adherence to Format: The final output must be a single, valid JSON object, strictly following the schema defined below. Do not include any conversational text, explanations, or markdown formatting outside of the JSON structure.`;

const JSON_SCHEMA = `{
  "companies": [
    {
      "company_name": "string",
      "company_description": "string (optional)",
      "website_url": "string (optional)",
      "relevance_score": "number (optional)",
      "kpi_data": [
        {
          "kpi_name": "string",
          "data_value": "string or number",
          "source_url": "string"
        }
      ]
    }
  ]
}`;

export const DeepResearchPromptSection = ({ project }: DeepResearchPromptSectionProps) => {
  const { toast } = useToast();
  const { data: kpiFramework } = useProjectKpiFramework(project.id);

  const generatePrompt = () => {
    const investmentThesis = project.investment_thesis || "No investment thesis provided";
    const keywords = project.selected_keywords.length > 0 
      ? project.selected_keywords.join(", ") 
      : "No keywords selected";
    const kpiFrameworkText = formatKpiFrameworkForPrompt(kpiFramework);

    return `Context

${DEEP_RESEARCH_CONTEXT}

Task

${DEEP_RESEARCH_TASK}

Input Data

Investment Thesis & Keywords:
Investment Thesis: "${investmentThesis}"
Keywords: "${keywords}"

Approved KPI Framework:
${kpiFrameworkText}

${DEEP_RESEARCH_GUIDELINES}

${DEEP_RESEARCH_CONSTRAINTS}

JSON Output Schema

\`\`\`json
${JSON_SCHEMA}
\`\`\``;
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
          className="min-h-[200px] font-mono text-xs"
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
      </CardContent>
    </Card>
  );
};