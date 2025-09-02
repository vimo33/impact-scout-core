import { formatKpiFrameworkForPrompt } from "@/hooks/useProjectKpiFramework";

interface TemplateData {
  investment_thesis?: string;
  keywords?: string[];
  kpi_framework?: string;
}

export const processTemplate = (template: string, data: TemplateData): string => {
  let processedTemplate = template;

  // Replace investment thesis placeholder
  const investmentThesis = data.investment_thesis || "Not specified";
  processedTemplate = processedTemplate.replace(/\$\{investment_thesis\}/g, investmentThesis);

  // Replace keywords placeholder with properly formatted JSON
  const keywordsJson = data.keywords && data.keywords.length > 0 
    ? JSON.stringify(data.keywords, null, 2)
    : "[]";
  processedTemplate = processedTemplate.replace(/\$\{keywords\}/g, keywordsJson);

  // Replace KPI framework placeholder
  const kpiFramework = data.kpi_framework || "*No KPI framework available*";
  processedTemplate = processedTemplate.replace(/\$\{kpi_framework\}/g, kpiFramework);

  return processedTemplate;
};