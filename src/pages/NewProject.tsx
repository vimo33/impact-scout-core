import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const NewProject = () => {
  const [investmentThesis, setInvestmentThesis] = useState('');
  const [showKeywords, setShowKeywords] = useState(false);

  // Mock keywords that appear after typing
  const mockKeywords = [
    'Conformational Stability',
    'Recombinant Proteins',
    'Biomarker Discovery',
    'Clinical Trials',
    'Therapeutic Proteins',
    'Drug Development'
  ];

  // Show keywords after a delay when user types
  useEffect(() => {
    if (investmentThesis.trim().length > 2) {
      const timer = setTimeout(() => {
        setShowKeywords(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setShowKeywords(false);
    }
  }, [investmentThesis]);

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

          {showKeywords && (
            <div className="space-y-3 animate-in fade-in-50 duration-500">
              <Label className="text-sm font-medium text-muted-foreground">
                AI-Suggested Keywords
              </Label>
              <div className="flex flex-wrap gap-2">
                {mockKeywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 transition-colors"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold"
            disabled={investmentThesis.trim().length < 3}
          >
            Generate KPI Framework
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewProject;