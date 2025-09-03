import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProjectSubNavigationProps {
  projectId: string;
}

const navigationItems = [
  { id: 'overview', label: 'Overview', path: '' },
  { id: 'workbench', label: 'KPI Workbench', path: '/workbench' },
  { id: 'companies', label: 'Company List', path: '/companies' },
  { id: 'shortlist', label: 'Shortlist', path: '/shortlist' },
  { id: 'outreach', label: 'Outreach', path: '/outreach' },
  { id: 'report', label: 'Project Report', path: '/report' }
];

const ProjectSubNavigation = ({ projectId }: ProjectSubNavigationProps) => {
  const location = useLocation();
  const basePath = `/app/projects/${projectId}`;

  const getActiveRoute = (pathname: string) => {
    if (pathname === basePath) return 'overview';
    if (pathname.startsWith(`${basePath}/workbench`)) return 'workbench';
    if (pathname.startsWith(`${basePath}/companies`)) return 'companies';
    if (pathname.startsWith(`${basePath}/shortlist`)) return 'shortlist';
    if (pathname.startsWith(`${basePath}/outreach`)) return 'outreach';
    if (pathname.startsWith(`${basePath}/report`)) return 'report';
    return 'overview';
  };

  const activeRoute = getActiveRoute(location.pathname);

  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex space-x-1 py-2">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              to={`${basePath}${item.path}`}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                "px-4 py-2",
                activeRoute === item.id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-accent/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ProjectSubNavigation;