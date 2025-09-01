import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Plus, X, RefreshCw, Copy } from "lucide-react";
import { format } from "date-fns";
import { useSemanticKeywords, useGenerateSemanticKeywords, useUpdateSemanticKeywords } from "@/hooks/useSemanticExpansion";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  project_title: string;
  investment_thesis: string | null;
  created_at: string;
  family_office_id: string | null;
  family_office_name: string | null;
  has_generated_kpis: boolean;
}

interface SemanticKeywordsSectionProps {
  project: Project;
  selectedKeywords?: string[];
  onKeywordSelectionChange?: (keywords: string[]) => void;
  showSelection?: boolean;
}

export const SemanticKeywordsSection = ({ 
  project, 
  selectedKeywords = [], 
  onKeywordSelectionChange,
  showSelection = false 
}: SemanticKeywordsSectionProps) => {
  const [newKeyword, setNewKeyword] = useState("");
  const [editingKeywordSet, setEditingKeywordSet] = useState<string | null>(null);
  const { data: semanticKeywords, isLoading } = useSemanticKeywords(project.id);
  const generateKeywords = useGenerateSemanticKeywords();
  const updateKeywords = useUpdateSemanticKeywords();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!project.investment_thesis) {
      toast({
        title: "Investment Thesis Required",
        description: "Please add an investment thesis first to generate semantic keywords.",
        variant: "destructive",
      });
      return;
    }

    await generateKeywords.mutateAsync({
      projectId: project.id,
      investmentCategory: project.investment_thesis,
    });
  };

  const handleAddKeyword = async (keywordSetId: string, currentKeywords: string[]) => {
    if (!newKeyword.trim()) return;

    const updatedKeywords = [...currentKeywords, newKeyword.trim()];
    await updateKeywords.mutateAsync({
      id: keywordSetId,
      keywords: updatedKeywords,
    });
    setNewKeyword("");
    setEditingKeywordSet(null);
  };

  const handleRemoveKeyword = async (keywordSetId: string, currentKeywords: string[], keywordToRemove: string) => {
    const updatedKeywords = currentKeywords.filter(keyword => keyword !== keywordToRemove);
    await updateKeywords.mutateAsync({
      id: keywordSetId,
      keywords: updatedKeywords,
    });
  };

  const handleCopyKeywords = async (keywords: string[]) => {
    await navigator.clipboard.writeText(keywords.join(", "));
    toast({
      title: "Copied",
      description: "Keywords copied to clipboard.",
    });
  };

  const handleKeywordToggle = (keyword: string, checked: boolean) => {
    if (!onKeywordSelectionChange) return;
    
    let newSelection;
    if (checked) {
      newSelection = [...selectedKeywords, keyword];
    } else {
      newSelection = selectedKeywords.filter(k => k !== keyword);
    }
    onKeywordSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (!onKeywordSelectionChange || !semanticKeywords) return;
    
    const allKeywords = semanticKeywords.flatMap(set => set.keywords);
    onKeywordSelectionChange(allKeywords);
  };

  const handleSelectNone = () => {
    if (!onKeywordSelectionChange) return;
    onKeywordSelectionChange([]);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              Semantic Keywords
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-48" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            Semantic Keywords
          </CardTitle>
          <div className="flex items-center gap-2">
            {semanticKeywords && semanticKeywords.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleGenerate}
                disabled={generateKeywords.isPending}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            {showSelection && semanticKeywords && semanticKeywords.length > 0 && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSelectAll}
                >
                  Select All
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSelectNone}
                >
                  Select None
                </Button>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGenerate}
              disabled={generateKeywords.isPending || !project.investment_thesis}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Keywords
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!semanticKeywords || semanticKeywords.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {!project.investment_thesis 
                ? "Add an investment thesis to generate semantic keywords"
                : "Generate semantic keywords to enhance your research"
              }
            </p>
            <Button 
              onClick={handleGenerate}
              disabled={generateKeywords.isPending || !project.investment_thesis}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {generateKeywords.isPending ? "Generating..." : "Generate Keywords"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {semanticKeywords.map((keywordSet) => (
              <div key={keywordSet.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Keywords Set</p>
                    <p className="text-xs text-muted-foreground">
                      Generated {format(new Date(keywordSet.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCopyKeywords(keywordSet.keywords)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setEditingKeywordSet(editingKeywordSet === keywordSet.id ? null : keywordSet.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {keywordSet.keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center gap-1">
                      {showSelection && (
                        <Checkbox
                          checked={selectedKeywords.includes(keyword)}
                          onCheckedChange={(checked) => handleKeywordToggle(keyword, checked as boolean)}
                        />
                      )}
                      <Badge variant="secondary" className="gap-1">
                        {keyword}
                        {editingKeywordSet === keywordSet.id && (
                          <button
                            onClick={() => handleRemoveKeyword(keywordSet.id, keywordSet.keywords, keyword)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>

                {editingKeywordSet === keywordSet.id && (
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add new keyword..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddKeyword(keywordSet.id, keywordSet.keywords);
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleAddKeyword(keywordSet.id, keywordSet.keywords)}
                      disabled={!newKeyword.trim() || updateKeywords.isPending}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};