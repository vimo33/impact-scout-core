import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Calendar } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { format } from "date-fns";

const CompanyDetail = () => {
  const { id: projectId, companyId } = useParams<{ id: string; companyId: string }>();
  const { data: companies, isLoading } = useCompanies(projectId);
  
  const company = companies?.find(c => c.id === companyId);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
          <p className="text-muted-foreground">
            The requested company could not be found in this project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Company Header */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">{company.company_name}</h1>
            {company.relevance_score !== null && (
              <Badge variant="secondary">
                {company.relevance_score}% match
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Added {format(new Date(company.created_at), "MMMM d, yyyy")}</span>
            </div>
            {company.website_url && (
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <a 
                  href={company.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {company.website_url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Company Description */}
        <Card>
          <CardHeader>
            <CardTitle>Company Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              {company.company_description || "No description available"}
            </p>
          </CardContent>
        </Card>

        {/* KPI Data Section - Placeholder for future implementation */}
        <Card>
          <CardHeader>
            <CardTitle>KPI Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              KPI data collection and display coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDetail;