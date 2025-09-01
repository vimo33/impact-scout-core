import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

const SettingsPrompts = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/app/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span>›</span>
          <span className="text-foreground">Settings</span>
          <span>›</span>
          <span className="text-foreground">Prompt Management</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage system prompts and AI behavior</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-center py-12">
            <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Prompt Management</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Control the AI's core logic and behavior through system prompt management. This feature is coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPrompts;