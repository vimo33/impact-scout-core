import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ExternalLink } from "lucide-react";

interface Evidence {
  source_references?: string[];
  corporate_profile?: {
    press_releases?: string[];
    technology_summary?: string;
  };
}

interface EvidenceReferencesSectionProps {
  evidence: Evidence | null;
}

export const EvidenceReferencesSection = ({ evidence }: EvidenceReferencesSectionProps) => {
  const hasSourceReferences = evidence?.source_references && evidence.source_references.length > 0;
  const hasPressReleases = evidence?.corporate_profile?.press_releases && evidence.corporate_profile.press_releases.length > 0;
  const hasTechnologySummary = evidence?.corporate_profile?.technology_summary;

  if (!hasSourceReferences && !hasPressReleases && !hasTechnologySummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Evidence & References
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No evidence or reference information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Evidence & References
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasTechnologySummary && (
          <div>
            <h4 className="font-semibold mb-2">Technology Summary</h4>
            <p className="text-sm text-muted-foreground">{evidence.corporate_profile?.technology_summary}</p>
          </div>
        )}

        {hasSourceReferences && (
          <div>
            <h4 className="font-semibold mb-3">Source References</h4>
            <ul className="space-y-2">
              {evidence.source_references?.map((url, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasPressReleases && (
          <div>
            <h4 className="font-semibold mb-3">Press Releases</h4>
            <ul className="space-y-2">
              {evidence.corporate_profile?.press_releases?.map((url, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
