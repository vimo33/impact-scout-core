import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Chip } from "@/components/ui/chip";
import { useShortlist, useRemoveFromShortlist } from "@/hooks/useShortlist";
import { useCompanies } from "@/hooks/useCompanies";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Building2, MapPin, Trash2, TrendingUp, Users } from "lucide-react";

const Shortlist = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { data: shortlist, isLoading: shortlistLoading } = useShortlist(projectId);
  const { data: companies, isLoading: companiesLoading } = useCompanies(projectId);
  const removeFromShortlist = useRemoveFromShortlist();

  const handleRemoveFromShortlist = (companyId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (projectId) {
      removeFromShortlist.mutate({ projectId, companyId });
    }
  };

  const isLoading = shortlistLoading || companiesLoading;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shortlist</h1>
            <p className="text-muted-foreground mt-2">
              Your curated list of high-potential investment opportunities.
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
      </div>
    );
  }

  if (!shortlist || shortlist.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shortlist</h1>
            <p className="text-muted-foreground mt-2">
              Your curated list of high-potential investment opportunities.
            </p>
          </div>
          <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Your shortlist is empty
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Start adding companies from the Company List to build your curated shortlist of investment opportunities.
            </p>
            <Button asChild>
              <Link to={`/app/projects/${projectId}/companies`}>
                Browse Companies
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get company details for shortlisted items
  const shortlistedCompanies = shortlist.map(shortlistItem => {
    const company = companies?.find(c => c.id === shortlistItem.company_id);
    return {
      ...shortlistItem,
      company
    };
  }).filter(item => item.company); // Filter out any items where company wasn't found

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Shortlist</h1>
          <p className="text-muted-foreground mt-2">
            {shortlistedCompanies.length} {shortlistedCompanies.length === 1 ? 'company' : 'companies'} in your shortlist
          </p>
        </div>

        {/* Shortlisted Companies */}
        <div className="grid gap-4 sm:gap-6">
          {shortlistedCompanies.map((item) => {
            const company = item.company!;
            
            return (
              <Card key={item.id} className="group hover:shadow-md transition-shadow">
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

                    {/* Date Added - Desktop */}
                    <div className="hidden sm:block text-xs text-muted-foreground">
                      Added {new Date(item.added_at).toLocaleDateString()}
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
                      <div className="flex items-center gap-2 sm:gap-3 text-sm">
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
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => handleRemoveFromShortlist(company.id, e)}
                          disabled={removeFromShortlist.isPending}
                          className="text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
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

                  {/* Notes Section */}
                  {item.notes && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-1">Notes:</div>
                      <p className="text-sm text-foreground">{item.notes}</p>
                    </div>
                  )}

                  {/* Date Added - Mobile */}
                  <div className="sm:hidden mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                    Added {new Date(item.added_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Shortlist;