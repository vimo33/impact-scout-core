import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";

interface Patent {
  patent_number: string;
  title: string;
  year: number;
}

interface Publication {
  title: string;
  journal: string;
  year: number;
  doi: string;
}

interface IPPortfolioSectionProps {
  ipPortfolio: {
    patents: Patent[];
    key_publications: Publication[];
  } | null;
}

export const IPPortfolioSection = ({ ipPortfolio }: IPPortfolioSectionProps) => {
  const hasPatents = ipPortfolio?.patents && ipPortfolio.patents.length > 0;
  const hasPublications = ipPortfolio?.key_publications && ipPortfolio.key_publications.length > 0;

  if (!hasPatents && !hasPublications) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Scientific & IP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No IP or publication data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Scientific & IP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patents">
          <TabsList>
            <TabsTrigger value="patents">Patents ({ipPortfolio?.patents?.length || 0})</TabsTrigger>
            <TabsTrigger value="publications">Publications ({ipPortfolio?.key_publications?.length || 0})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patents" className="space-y-3 mt-4">
            {hasPatents ? (
              ipPortfolio!.patents.map((patent, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-1">
                  <h4 className="font-medium text-sm">{patent.title}</h4>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{patent.patent_number}</span>
                    <span>{patent.year}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No patents data</p>
            )}
          </TabsContent>
          
          <TabsContent value="publications" className="space-y-3 mt-4">
            {hasPublications ? (
              ipPortfolio!.key_publications.map((pub, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-1">
                  <h4 className="font-medium text-sm">{pub.title}</h4>
                  <p className="text-xs text-muted-foreground">{pub.journal} ({pub.year})</p>
                  {pub.doi && (
                    <a 
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      DOI: {pub.doi}
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No publications data</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
