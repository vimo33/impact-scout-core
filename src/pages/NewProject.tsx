import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { X, Loader2, Plus } from 'lucide-react';

const NewProject = () => {
  const [investmentThesis, setInvestmentThesis] = useState('');
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);
  const [editableKeywords, setEditableKeywords] = useState<string[]>([]);
  const [showKeywords, setShowKeywords] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const { toast } = useToast();

  // Show mock keywords after a delay when user types (only if no AI keywords generated yet)
  const mockKeywords = [
    'Conformational Stability',
    'Recombinant Proteins',
    'Biomarker Discovery',
    'Clinical Trials',
    'Therapeutic Proteins',
    'Drug Development'
  ];

  useEffect(() => {
    if (investmentThesis.trim().length > 2 && aiKeywords.length === 0) {
      const timer = setTimeout(() => {
        setShowKeywords(true);
      }, 800);
      return () => clearTimeout(timer);
    } else if (aiKeywords.length === 0) {
      setShowKeywords(false);
    }
  }, [investmentThesis, aiKeywords]);

  const generateKeywords = async () => {
    if (!investmentThesis.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter an investment thesis or category first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Calling semantic-expansion function with:', investmentThesis);
      
      const { data, error } = await supabase.functions.invoke('semantic-expansion', {
        body: { investment_category: investmentThesis }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data?.keywords || !Array.isArray(data.keywords)) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from AI service');
      }

      console.log('Generated keywords:', data.keywords);
      
      setAiKeywords(data.keywords);
      setEditableKeywords([...data.keywords]);
      setShowKeywords(false); // Hide mock keywords
      
      toast({
        title: "Keywords Generated",
        description: `Generated ${data.keywords.length} relevant keywords for your investment category.`,
      });

    } catch (error) {
      console.error('Error generating keywords:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate keywords. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = editableKeywords.filter((_, i) => i !== index);
    setEditableKeywords(newKeywords);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingValue(editableKeywords[index]);
  };

  const saveEditing = () => {
    if (editingIndex !== null && editingValue.trim()) {
      const newKeywords = [...editableKeywords];
      newKeywords[editingIndex] = editingValue.trim();
      setEditableKeywords(newKeywords);
    }
    setEditingIndex(null);
    setEditingValue('');
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const addCustomKeyword = () => {
    const newKeyword = prompt('Enter a custom keyword:');
    if (newKeyword && newKeyword.trim()) {
      setEditableKeywords([...editableKeywords, newKeyword.trim()]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">
            New Project
          </h1>
          <p className="text-muted-foreground">
            Define your investment thesis to generate a tailored KPI framework
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="investment-thesis" className="text-base font-medium">
              Investment Thesis or Category
            </Label>
            <Input
              id="investment-thesis"
              type="text"
              placeholder="e.g., Biotechnology companies focusing on protein therapeutics"
              value={investmentThesis}
              onChange={(e) => setInvestmentThesis(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {showKeywords && aiKeywords.length === 0 && (
            <div className="space-y-3 animate-in fade-in-50 duration-500">
              <Label className="text-sm font-medium text-muted-foreground">
                AI-Suggested Keywords (Preview)
              </Label>
              <div className="flex flex-wrap gap-2">
                {mockKeywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 transition-colors opacity-60"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Click "Generate KPI Framework" to get AI-powered keyword suggestions
              </p>
            </div>
          )}

          {editableKeywords.length > 0 && (
            <div className="space-y-4 animate-in fade-in-50 duration-500">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Generated Keywords ({editableKeywords.length})
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCustomKeyword}
                  className="h-8 px-3"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Custom
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {editableKeywords.map((keyword, index) => (
                  <div key={index} className="relative">
                    {editingIndex === index ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditing();
                            if (e.key === 'Escape') cancelEditing();
                          }}
                          className="h-8 w-32 text-xs"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={saveEditing}
                          className="h-6 w-6 p-0"
                        >
                          ✓
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                          className="h-6 w-6 p-0"
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80 transition-colors pr-6 relative group"
                        onClick={() => startEditing(index)}
                      >
                        {keyword}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeKeyword(index);
                          }}
                          className="absolute -top-1 -right-1 h-4 w-4 p-0 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground">
                Click on keywords to edit them, or click the × to remove them. These will be used to generate your KPI framework.
              </p>
            </div>
          )}

          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold"
            disabled={investmentThesis.trim().length < 3 || isGenerating}
            onClick={generateKeywords}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Keywords...
              </>
            ) : (
              'Generate KPI Framework'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewProject;