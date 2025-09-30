import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Chip } from "@/components/ui/chip";
import { useCompanies } from "@/hooks/useCompanies";
import { format } from "date-fns";
import CompanyHeader from "@/components/CompanyHeader";
import KpiBreakdownTabs from "@/components/KpiBreakdownTabs";
import { ProductsSolutionsSection } from "@/components/ProductsSolutionsSection";
import { ClinicalActivitySection } from "@/components/ClinicalActivitySection";
import { IPPortfolioSection } from "@/components/IPPortfolioSection";
import { NewsSentimentSection } from "@/components/NewsSentimentSection";
import { ContactsSection } from "@/components/ContactsSection";
import { CategoryCompletenessWidget } from "@/components/CategoryCompletenessWidget";
import { 
  Building2,
  Calendar,
  MapPin,
  Users as UsersIcon
} from "lucide-react";

const CompanyDetail = () => {
  const { id: projectId, companyId } = useParams<{ id: string; companyId: string }>();
  const { data: companies, isLoading } = useCompanies(projectId);
  
  const company = companies?.find(c => c.id === companyId);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
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
        <div className="max-w-6xl mx-auto text-center">
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Company Header */}
        <CompanyHeader company={company} projectId={projectId!} />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Summary Block */}
            <Card>
              <CardHeader>
                <CardTitle>Company Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.mission_statement && (
                  <div>
                    <h4 className="font-semibold mb-2">Mission Statement</h4>
                    <p className="text-foreground">{company.mission_statement}</p>
                  </div>
                )}
                
                {company.technology_summary && (
                  <div>
                    <h4 className="font-semibold mb-2">Technology Summary</h4>
                    <p className="text-foreground">{company.technology_summary}</p>
                  </div>
                )}
                
                {company.opportunity_summary && (
                  <div>
                    <h4 className="font-semibold mb-2">Opportunity Summary</h4>
                    <p className="text-foreground">{company.opportunity_summary}</p>
                  </div>
                )}

                {!company.mission_statement && !company.technology_summary && !company.opportunity_summary && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-foreground">
                      {company.company_description || "No description available"}
                    </p>
                  </div>
                )}

                {company.risk_badges && company.risk_badges.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Risk Factors</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.risk_badges.map((risk, index) => (
                        <Badge key={index} variant="destructive">
                          {risk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* KPI Breakdown */}
            <KpiBreakdownTabs companyId={company.id} />

            {/* Products & Solutions */}
            <ProductsSolutionsSection products={company.products_solutions} />

            {/* Clinical Activity */}
            <ClinicalActivitySection clinicalActivity={company.clinical_activity} />

            {/* Scientific & IP */}
            <IPPortfolioSection ipPortfolio={company.ip_portfolio} />

            {/* News & Sentiment */}
            <NewsSentimentSection newsSentiment={company.news_sentiment} />

            {/* Contacts */}
            <ContactsSection contacts={company.contacts} />
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            {/* Analysis Snapshot */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.relevance_score !== null && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Relevance Score</span>
                      <Badge variant="secondary">{company.relevance_score}%</Badge>
                    </div>
                    <Progress value={company.relevance_score} className="h-2" />
                  </div>
                )}

                {company.data_completeness_percentage !== null && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Data Completeness</span>
                      <Badge variant="secondary">{company.data_completeness_percentage}%</Badge>
                    </div>
                    <Progress value={company.data_completeness_percentage} className="h-2" />
                  </div>
                )}

                {company.stage_confidence_score !== null && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Stage Confidence</span>
                      <Badge variant="secondary">{company.stage_confidence_score}%</Badge>
                    </div>
                    <Progress value={company.stage_confidence_score} className="h-2" />
                  </div>
                )}

                {company.missing_kpi_count !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Missing KPIs</span>
                    <Badge variant={company.missing_kpi_count > 0 ? "destructive" : "default"}>
                      {company.missing_kpi_count}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Completeness */}
            <CategoryCompletenessWidget categoryCompleteness={company.category_completeness} />

            {/* Funding & Grants */}
            <Card>
              <CardHeader>
                <CardTitle>Funding & Grants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.funding_stage && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Stage</span>
                    <Badge>{company.funding_stage}</Badge>
                  </div>
                )}
                {company.total_raised && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Raised</span>
                    <span className="text-sm font-semibold">{company.total_raised}</span>
                  </div>
                )}
                {company.key_investors && company.key_investors.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground block mb-2">Key Investors</span>
                    <div className="flex flex-wrap gap-1">
                      {company.key_investors.map((investor, index) => (
                        <Chip key={index}>{investor}</Chip>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.founded_year && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Founded:</span>
                    <span className="font-medium">{company.founded_year}</span>
                  </div>
                )}
                {company.employee_count && (
                  <div className="flex items-center gap-2 text-sm">
                    <UsersIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Employees:</span>
                    <span className="font-medium">{company.employee_count}</span>
                  </div>
                )}
                {(company.hq_city || company.hq_country) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Headquarters:</span>
                    <span className="font-medium">
                      {[company.hq_city, company.hq_country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Added:</span>
                  <span className="font-medium">{format(new Date(company.created_at), "MMM d, yyyy")}</span>
                </div>
                {company.tags && company.tags.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground block mb-2">Tags</span>
                    <div className="flex flex-wrap gap-1">
                      {company.tags.map((tag, index) => (
                        <Chip key={index}>{tag}</Chip>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
