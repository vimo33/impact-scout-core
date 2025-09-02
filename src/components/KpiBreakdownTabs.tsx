import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiData {
  id: string;
  kpi_id: string;
  data_value: string | null;
  status: string;
  source_url: string | null;
  kpi: {
    kpi_name: string;
    kpi_description: string | null;
    category: string;
  };
}

interface KpiBreakdownTabsProps {
  companyId: string;
}

const useCompanyKpiData = (companyId: string) => {
  return useQuery({
    queryKey: ["company-kpi-data", companyId],
    queryFn: async (): Promise<KpiData[]> => {
      const { data, error } = await supabase
        .from("company_kpi_data")
        .select(`
          id,
          kpi_id,
          data_value,
          status,
          source_url,
          kpi:kpis(
            kpi_name,
            kpi_description,
            category
          )
        `)
        .eq("company_id", companyId);

      if (error) {
        throw error;
      }

      return data as KpiData[] || [];
    },
  });
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'complete':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'partial':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default:
      return <XCircle className="h-4 w-4 text-red-500" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    complete: 'default',
    partial: 'secondary',
    pending: 'destructive'
  } as const;

  return (
    <Badge variant={variants[status as keyof typeof variants] || 'destructive'}>
      {status}
    </Badge>
  );
};

const KpiBreakdownTabs = ({ companyId }: KpiBreakdownTabsProps) => {
  const { data: kpiData, isLoading, error } = useCompanyKpiData(companyId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>KPI Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !kpiData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>KPI Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unable to load KPI data for this company.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (kpiData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>KPI Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No KPI data available for this company yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group KPIs by category
  const kpisByCategory = kpiData.reduce((acc, kpi) => {
    const category = kpi.kpi.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(kpi);
    return acc;
  }, {} as Record<string, KpiData[]>);

  const categories = Object.keys(kpisByCategory);

  return (
    <Card>
      <CardHeader>
        <CardTitle>KPI Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {kpisByCategory[category].map((kpi) => (
                <div key={kpi.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon status={kpi.status} />
                      <h4 className="font-medium">{kpi.kpi.kpi_name}</h4>
                    </div>
                    {kpi.kpi.kpi_description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {kpi.kpi.kpi_description}
                      </p>
                    )}
                    {kpi.data_value && (
                      <p className="text-sm font-medium">{kpi.data_value}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <StatusBadge status={kpi.status} />
                    {kpi.source_url && (
                      <a 
                        href={kpi.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default KpiBreakdownTabs;