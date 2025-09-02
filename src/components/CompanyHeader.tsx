import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, ExternalLink, Plus } from "lucide-react";
import { useAddToShortlist, useIsInShortlist } from "@/hooks/useShortlist";

interface Company {
  id: string;
  company_name: string;
  entity_type: string | null;
  funding_track: string | null;
  location: string | null;
  website_url: string | null;
}

interface CompanyHeaderProps {
  company: Company;
  projectId: string;
}

const CompanyHeader = ({ company, projectId }: CompanyHeaderProps) => {
  const addToShortlist = useAddToShortlist();
  const isInShortlist = useIsInShortlist(projectId, company.id);

  const handleAddToShortlist = () => {
    if (!isInShortlist) {
      addToShortlist.mutate({ projectId, companyId: company.id });
    }
  };

  return (
    <div className="border-b pb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">{company.company_name}</h1>
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="outline">
              {company.entity_type || 'Company'}
            </Badge>
            <Badge variant="secondary">
              {company.funding_track || 'Unknown'}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {company.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{company.location}</span>
              </div>
            )}
            {company.website_url && (
              <a 
                href={company.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>{company.website_url.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
        </div>

        <Button
          size="lg"
          variant={isInShortlist ? "secondary" : "default"}
          onClick={handleAddToShortlist}
          disabled={isInShortlist || addToShortlist.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isInShortlist ? "In Shortlist" : "Add to Shortlist"}
        </Button>
      </div>
    </div>
  );
};

export default CompanyHeader;