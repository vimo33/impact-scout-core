import { formatKpiFrameworkForPrompt } from "@/hooks/useProjectKpiFramework";

interface TemplateData {
  investment_thesis?: string;
  keywords?: string[];
  kpi_framework?: string;
  region?: string;
  entity_types?: string;
  time_horizon?: string;
  funding_threshold?: string;
  exclude_sectors?: string;
  focus_therapeutic_area?: string;
  min_publications?: string;
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

  // Replace additional placeholders with defaults
  const region = data.region || "Global (focus on Switzerland, EU, UK, US)";
  processedTemplate = processedTemplate.replace(/\$\{region\}/g, region);

  const entityTypes = data.entity_types || "Company, Lab, Research Group, Consortium, Spin-out";
  processedTemplate = processedTemplate.replace(/\$\{entity_types\}/g, entityTypes);

  const timeHorizon = data.time_horizon || "last 12 months";
  processedTemplate = processedTemplate.replace(/\$\{time_horizon\}/g, timeHorizon);

  const fundingThreshold = data.funding_threshold || "< 100M USD";
  processedTemplate = processedTemplate.replace(/\$\{funding_threshold\}/g, fundingThreshold);

  const excludeSectors = data.exclude_sectors || "None specified";
  processedTemplate = processedTemplate.replace(/\$\{exclude_sectors\}/g, excludeSectors);

  const focusTherapeuticArea = data.focus_therapeutic_area || "All therapeutic areas";
  processedTemplate = processedTemplate.replace(/\$\{focus_therapeutic_area\}/g, focusTherapeuticArea);

  const minPublications = data.min_publications || "1";
  processedTemplate = processedTemplate.replace(/\$\{min_publications\}/g, minPublications);

  return processedTemplate;
};