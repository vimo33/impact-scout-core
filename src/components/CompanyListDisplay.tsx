import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Chip } from "@/components/ui/chip";
import { ExternalLink, Building2, MapPin, Plus, TrendingUp } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { useAddToShortlist, useShortlist } from "@/hooks/useShortlist";
import { Skeleton } from "@/components/ui/skeleton";

interface CompanyListDisplayProps {
  projectId: string;
}

const CompanyListDisplay = ({ projectId }: CompanyListDisplayProps) => {
  const { data: companies, isLoading, error } = useCompanies(projectId);
  const addToShortlist = useAddToShortlist();
  const { data: shortlist } = useShortlist(projectId);

  const isInShortlist = (companyId: string) => {
    return shortlist?.some(item => item.company_id === companyId) || false;
  };

  const handleAddToShortlist = (companyId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addToShortlist.mutate({ projectId, companyId });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Researched Companies</h2>
          <p className="text-muted-foreground mb-6">
            Companies added to this project through manual research
          </p>
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                  </div>
                </div>
              </CardHeader>
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
      
      <div className="grid gap-4 sm:gap-6">
        {companies.map((company) => {
          const companyInShortlist = isInShortlist(company.id);
          
          return (
            <Card key={company.id} className="group hover:shadow-md transition-shadow">
              {/* Header Row */}
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <Link 
                        to={`/app/projects/${projectId}/companies/${company.id}`}
                        className="flex items-center gap-2 group-hover:text-primary transition-colors"
                      >
                        <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <CardTitle className="text-lg sm:text-xl truncate">
                          {company.company_name}
                        </CardTitle>
                      </Link>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {company.entity_type || 'Company'}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {company.funding_track || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                    
                    {company.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{company.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                  {company.company_description || "No description available"}
                </p>

                {/* Tags */}
                {company.tags && company.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {company.tags.slice(0, 4).map((tag, index) => (
                      <Chip key={index} variant="primary" className="text-xs">
                        {tag}
                      </Chip>
                    ))}
                    {company.tags.length > 4 && (
                      <Chip variant="default" className="text-xs">
                        +{company.tags.length - 4} more
                      </Chip>
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left side - Funding snapshot */}
                  <div className="flex items-center gap-4 text-sm">
                    {company.funding_stage && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{company.funding_stage}</span>
                        {company.total_raised && (
                          <span className="text-muted-foreground hidden sm:inline">• {company.total_raised}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right side - Scores and actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Scores */}
                    <div className="flex items-center gap-2 sm:gap-3 text-sm flex-wrap">
                      {company.relevance_score !== null && (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Match:</span>
                          <Badge variant="secondary" className="text-xs">
                            {company.relevance_score}%
                          </Badge>
                        </div>
                      )}
                      
                      {company.data_completeness_percentage !== null && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs">Complete:</span>
                          <div className="flex items-center gap-1">
                            <Progress 
                              value={company.data_completeness_percentage} 
                              className="w-12 h-2" 
                            />
                            <span className="text-xs font-medium">
                              {company.data_completeness_percentage}%
                            </span>
                          </div>
                        </div>
                      )}

                      {company.missing_kpi_count !== null && company.missing_kpi_count > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {company.missing_kpi_count} missing
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={companyInShortlist ? "secondary" : "default"}
                        onClick={(e) => !companyInShortlist && handleAddToShortlist(company.id, e)}
                        disabled={companyInShortlist || addToShortlist.isPending}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {companyInShortlist ? "In Shortlist" : "Add to Shortlist"}
                      </Button>
                      
                      {company.website_url && (
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          className="p-2"
                        >
                          <a 
                            href={company.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyListDisplay;