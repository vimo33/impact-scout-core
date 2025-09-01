import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Folder, Plus, ExternalLink, Building2 } from "lucide-react";
import { format } from "date-fns";

interface Project {
  id: string;
  project_title: string;
  investment_thesis: string | null;
  created_at: string;
  user_id: string;
  family_office_id: string | null;
  family_office_name: string | null;
}

interface FamilyOffice {
  id: string;
  name: string;
}

const useFamilyOffices = () => {
  return useQuery({
    queryKey: ["family_offices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("family_offices")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return (data || []) as FamilyOffice[];
    },
  });
};

const useProjects = (familyOfficeFilter: string, sortOrder: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["projects", user?.id, familyOfficeFilter, sortOrder],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      let query = supabase
        .from("projects")
        .select(`
          id,
          project_title,
          investment_thesis,
          created_at,
          user_id,
          family_office_id,
          family_offices:family_office_id(name)
        `)
        .eq("user_id", user.id);

      // Apply family office filter
      if (familyOfficeFilter !== "all") {
        if (familyOfficeFilter === "unassigned") {
          query = query.is("family_office_id", null);
        } else {
          query = query.eq("family_office_id", familyOfficeFilter);
        }
      }

      // Apply sorting
      const ascending = sortOrder === "oldest";
      query = query.order("created_at", { ascending });

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to flatten the family office name
      const transformedData = (data || []).map(project => ({
        ...project,
        family_office_name: project.family_offices?.name || null
      }));

      return transformedData as Project[];
    },
    enabled: !!user,
  });
};

const Dashboard = () => {
  const [familyOfficeFilter, setFamilyOfficeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  
  const { data: familyOffices } = useFamilyOffices();
  const { data: projects, isLoading, error } = useProjects(familyOfficeFilter, sortOrder);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-12">
            <Skeleton className="h-10 w-48 mb-4" />
            <Skeleton className="h-6 w-96 mb-8" />
            <Skeleton className="h-12 w-48" />
          </div>
            
          {/* Projects Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-48">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Projects</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : "Something went wrong"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                My Projects
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage your impact investment research projects
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link to="/app/new-project">
                <Plus className="mr-2 h-5 w-5" />
                New Project
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter and Sort Controls */}
        <div className="mb-8 p-4 border rounded-lg bg-card">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Filter by Family Office
              </label>
              <Select value={familyOfficeFilter} onValueChange={setFamilyOfficeFilter}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="All Family Offices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Family Offices</SelectItem>
                  <SelectItem value="unassigned">Unassigned Projects</SelectItem>
                  {familyOffices?.map((office) => (
                    <SelectItem key={office.id} value={office.id}>
                      {office.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Sort by Date
              </label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Newest First" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                <Link to={`/app/projects/${project.id}`} className="block">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 mb-3">
                        <Folder className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(project.created_at), "MMMM d, yyyy")}
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                      {project.project_title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {project.family_office_name || "Unassigned"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {project.investment_thesis 
                        ? `${project.investment_thesis.substring(0, 120)}${project.investment_thesis.length > 120 ? '...' : ''}`
                        : "No investment thesis provided"
                      }
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Folder className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                No Projects Yet
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Get started by creating your first impact investment research project. 
                Define your thesis and let AI generate a tailored KPI framework.
              </p>
              <Button asChild size="lg">
                <Link to="/app/new-project">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Project
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;