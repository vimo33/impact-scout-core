import { Settings, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSystemPrompts } from "@/hooks/useSystemPrompts";
import { useUpdatePrompt } from "@/hooks/useUpdatePrompt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const SettingsPrompts = () => {
  const { data: prompts, isLoading, error } = useSystemPrompts();
  const updatePromptMutation = useUpdatePrompt();
  const [editingPrompts, setEditingPrompts] = useState<Record<string, string>>({});

  const handlePromptChange = (promptId: string, value: string) => {
    setEditingPrompts(prev => ({
      ...prev,
      [promptId]: value
    }));
  };

  const handleSavePrompt = async (promptId: string, originalText: string) => {
    const updatedText = editingPrompts[promptId] ?? originalText;
    
    if (updatedText.trim() === "") {
      return;
    }

    await updatePromptMutation.mutateAsync({
      id: promptId,
      prompt_text: updatedText,
    });

    // Clear the editing state for this prompt
    setEditingPrompts(prev => {
      const newState = { ...prev };
      delete newState[promptId];
      return newState;
    });
  };

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
            <h1 className="text-3xl font-bold text-foreground">System Prompt Management</h1>
            <p className="text-muted-foreground mt-1">Manage and configure AI system prompts and behavior</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-10 w-32 mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  {error.message?.includes('insufficient_privilege') || error.message?.includes('policy') ? (
                    <>
                      <h2 className="text-xl font-semibold mb-2 text-destructive">Access Denied</h2>
                      <p className="text-muted-foreground">
                        Administrator access is required to manage system prompts. Contact your system administrator to request access.
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold mb-2 text-destructive">Error Loading Prompts</h2>
                      <p className="text-muted-foreground">
                        Failed to load system prompts. Please refresh the page or try again later.
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && !error && prompts && prompts.length === 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No System Prompts Found</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    No system prompts have been configured yet. Contact your administrator to set up initial prompts.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && !error && prompts && prompts.length > 0 && (
            <div className="space-y-6">
              {prompts.map((prompt) => {
                const isEditing = promptId => editingPrompts.hasOwnProperty(promptId);
                const currentText = editingPrompts[prompt.id] ?? prompt.prompt_text;
                const hasChanges = editingPrompts[prompt.id] !== undefined && editingPrompts[prompt.id] !== prompt.prompt_text;
                const isSaving = updatePromptMutation.isPending;

                return (
                  <Card key={prompt.id}>
                    <CardHeader>
                      <CardTitle className="text-xl">{prompt.prompt_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={currentText}
                        onChange={(e) => handlePromptChange(prompt.id, e.target.value)}
                        className="min-h-[200px] resize-y"
                        placeholder="Enter system prompt text..."
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Last updated: {new Date(prompt.updated_at).toLocaleDateString()}
                        </div>
                        <Button
                          onClick={() => handleSavePrompt(prompt.id, prompt.prompt_text)}
                          disabled={!hasChanges || isSaving || currentText.trim() === ""}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPrompts;