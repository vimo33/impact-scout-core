import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X, Copy, Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { useUpdateProject } from "@/hooks/useUpdateProject";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  project_title: string;
  investment_thesis: string | null;
  created_at: string;
  family_office_id: string | null;
  family_office_name: string | null;
}

interface InvestmentThesisSectionProps {
  project: Project;
}

export const InvestmentThesisSection = ({ project }: InvestmentThesisSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedThesis, setEditedThesis] = useState(project.investment_thesis || "");
  const updateProject = useUpdateProject();
  const { toast } = useToast();

  const handleSave = async () => {
    if (editedThesis.trim() !== project.investment_thesis) {
      await updateProject.mutateAsync({
        id: project.id,
        investment_thesis: editedThesis.trim(),
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedThesis(project.investment_thesis || "");
    setIsEditing(false);
  };

  const handleCopy = async () => {
    if (project.investment_thesis) {
      await navigator.clipboard.writeText(project.investment_thesis);
      toast({
        title: "Copied",
        description: "Investment thesis copied to clipboard.",
      });
    }
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = (text: string) => {
    const wordCount = getWordCount(text);
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Investment Thesis
            </CardTitle>
            {project.investment_thesis && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{getWordCount(project.investment_thesis)} words</span>
                <span>{getReadingTime(project.investment_thesis)} min read</span>
                <span>Updated {format(new Date(project.created_at), "MMM d, yyyy")}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && project.investment_thesis && (
              <>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </>
            )}
            {isEditing ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancel}
                  disabled={updateProject.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSave}
                  disabled={updateProject.isPending}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editedThesis}
              onChange={(e) => setEditedThesis(e.target.value)}
              placeholder="Enter your investment thesis..."
              className="min-h-[200px] resize-none"
              disabled={updateProject.isPending}
            />
            <div className="text-sm text-muted-foreground">
              {getWordCount(editedThesis)} words • {getReadingTime(editedThesis)} min read
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {project.investment_thesis ? (
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {project.investment_thesis}
              </p>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground italic mb-4">
                  No investment thesis provided
                </p>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Add Investment Thesis
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};