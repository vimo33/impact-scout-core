import { Building, Users, MessageSquare, FileText } from "lucide-react";

const PlaceholderPage = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: any; 
  title: string; 
  description: string; 
}) => (
  <div className="p-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-20">
        <Icon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export const CompanyListPlaceholder = () => (
  <PlaceholderPage
    icon={Building}
    title="Company List"
    description="Discover and track impact companies relevant to your investment thesis. This feature is coming soon."
  />
);

export const ShortlistPlaceholder = () => (
  <PlaceholderPage
    icon={Users}
    title="Shortlist"
    description="Manage your curated list of high-potential investment opportunities. This feature is coming soon."
  />
);

export const OutreachPlaceholder = () => (
  <PlaceholderPage
    icon={MessageSquare}
    title="Outreach"
    description="Engage with companies and manage your investment outreach activities. This feature is coming soon."
  />
);

export const ProjectReportPlaceholder = () => (
  <PlaceholderPage
    icon={FileText}
    title="Project Report"
    description="Generate comprehensive reports on your investment research and analysis. This feature is coming soon."
  />
);