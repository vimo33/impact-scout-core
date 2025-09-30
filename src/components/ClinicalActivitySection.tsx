import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Microscope } from "lucide-react";

interface ClinicalTrial {
  trial_id: string;
  title: string;
  status: string;
  phase: string;
}

interface Pilot {
  partner: string;
  description: string;
  status: string;
}

interface ClinicalActivitySectionProps {
  clinicalActivity: {
    trials: ClinicalTrial[];
    pilots: Pilot[];
  } | null;
}

export const ClinicalActivitySection = ({ clinicalActivity }: ClinicalActivitySectionProps) => {
  const hasTrials = clinicalActivity?.trials && clinicalActivity.trials.length > 0;
  const hasPilots = clinicalActivity?.pilots && clinicalActivity.pilots.length > 0;

  if (!hasTrials && !hasPilots) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="w-5 h-5" />
            Clinical Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No clinical activity data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Microscope className="w-5 h-5" />
          Clinical Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trials">
          <TabsList>
            <TabsTrigger value="trials">Clinical Trials ({clinicalActivity?.trials?.length || 0})</TabsTrigger>
            <TabsTrigger value="pilots">Pilots ({clinicalActivity?.pilots?.length || 0})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trials" className="space-y-4 mt-4">
            {hasTrials ? (
              clinicalActivity!.trials.map((trial, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold">{trial.title}</h4>
                    <Badge variant="outline">{trial.status}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>ID: {trial.trial_id}</span>
                    <span>Phase: {trial.phase}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No clinical trials data</p>
            )}
          </TabsContent>
          
          <TabsContent value="pilots" className="space-y-4 mt-4">
            {hasPilots ? (
              clinicalActivity!.pilots.map((pilot, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold">{pilot.partner}</h4>
                    <Badge variant="outline">{pilot.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{pilot.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No pilots data</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
