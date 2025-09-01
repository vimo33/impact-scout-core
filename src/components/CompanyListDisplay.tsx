import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Building2, ExternalLink } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";

interface CompanyListDisplayProps {
  projectId: string;
}

const CompanyListDisplay = ({ projectId }: CompanyListDisplayProps) => {
  const { data: companies, isLoading, error } = useCompanies(projectId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Researched Companies</h2>
          <p className="text-muted-foreground mb-6">
            Companies added to this project through manual research
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-56">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-5 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Researched Companies</h2>
          <p className="text-muted-foreground mb-6">
            Companies added to this project through manual research
          </p>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Companies</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : "Something went wrong"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Researched Companies</h2>
          <p className="text-muted-foreground mb-6">
            Companies added to this project through manual research
          </p>
        </div>
        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No companies have been added yet
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Paste your research JSON above to get started and see companies appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Researched Companies</h2>
        <p className="text-muted-foreground mb-6">
          {companies.length} {companies.length === 1 ? 'company' : 'companies'} found for this project
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card key={company.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-fit">
            <Link to={`/app/projects/${projectId}/companies/${company.id}`} className="block">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {company.relevance_score !== null && (
                      <Badge variant="secondary" className="text-xs">
                        {company.relevance_score}% match
                      </Badge>
                    )}
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                  {company.company_name}
                </CardTitle>
                
                {company.website_url && (
                  <div className="flex items-center space-x-2 mb-2">
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">
                      {company.website_url.replace(/^https?:\/\//, '')}
                    </span>
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {company.company_description 
                    ? `${company.company_description.substring(0, 150)}${company.company_description.length > 150 ? '...' : ''}`
                    : "No description available"
                  }
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompanyListDisplay;