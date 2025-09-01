import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/useProject";
import ProjectSubNavigation from "@/components/ProjectSubNavigation";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

const ProjectLayout = ({ children }: ProjectLayoutProps) => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(id);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-border bg-card p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-9 w-32" />
            </div>
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
        <div className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex gap-1 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24" />
              ))}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!project || !id) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">Project not found</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/app/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Project Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="max-w-6xl mx-auto">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/app/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">
            {project.project_title}
          </h1>
        </div>
      </div>

      {/* Sub Navigation */}
      <ProjectSubNavigation projectId={id} />

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default ProjectLayout;