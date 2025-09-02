import { useProject } from "@/hooks/useProject";
import { useSemanticKeywords } from "@/hooks/useSemanticExpansion";
import { useProjectKpiFramework } from "@/hooks/useProjectKpiFramework";

interface ValidationResult {
  isValid: boolean;
  missingSteps: string[];
  redirectPath?: string;
}

export const useProjectValidation = (projectId: string | undefined) => {
  const { data: project } = useProject(projectId);
  const { data: semanticKeywords } = useSemanticKeywords(projectId);
  const { data: kpiFramework } = useProjectKpiFramework(projectId);

  return { 
    validateProject: (): ValidationResult => {
      const missingSteps: string[] = [];
      let redirectPath: string | undefined;

      if (!project) {
        return {
          isValid: false,
          missingSteps: ["Project not found"],
          redirectPath: "/app/dashboard",
        };
      }

      // Check if investment thesis exists
      if (!project.investment_thesis) {
        missingSteps.push("Investment thesis");
        redirectPath = `/app/projects/${projectId}`;
      }

      // Check if semantic keywords are generated
      if (!semanticKeywords || semanticKeywords.length === 0) {
        missingSteps.push("Semantic keywords generation");
        redirectPath = redirectPath || `/app/projects/${projectId}`;
      }

      // Check if KPI framework is generated
      if (!kpiFramework) {
        missingSteps.push("KPI framework generation");
        redirectPath = redirectPath || `/app/projects/${projectId}`;
      }

      // Check if keywords are selected (only if previous steps are complete)
      if (
        project.investment_thesis &&
        semanticKeywords &&
        semanticKeywords.length > 0 &&
        kpiFramework &&
        (!project.selected_keywords || project.selected_keywords.length === 0)
      ) {
        missingSteps.push("Keyword selection");
        redirectPath = redirectPath || `/app/projects/${projectId}`;
      }

      return {
        isValid: missingSteps.length === 0,
        missingSteps,
        redirectPath,
      };
    },
    project, 
    semanticKeywords, 
    kpiFramework 
  };
};