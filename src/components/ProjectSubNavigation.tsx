import { useLocation, Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
        <NavigationMenu>
          <NavigationMenuList className="space-x-1">
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.id}>
                <Link to={`${basePath}${item.path}`}>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "px-4 py-2",
                      activeRoute === item.id
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent/50"
                    )}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default ProjectSubNavigation;