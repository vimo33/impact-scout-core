import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { FamilyOfficeCombobox } from '@/components/FamilyOfficeCombobox';

const NewProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [projectTitle, setProjectTitle] = useState('');
  const [investmentThesis, setInvestmentThesis] = useState('');
  const [familyOffice, setFamilyOffice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateKpiFramework = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a project.",
        variant: "destructive",
      });
      return;
    }

    if (!projectTitle.trim()) {
      toast({
        title: "Project Title Required",
        description: "Please enter a title for your project.",
        variant: "destructive",
      });
      return;
    }

    if (!investmentThesis.trim()) {
      toast({
        title: "Investment Thesis Required",
        description: "Please enter an investment thesis to generate KPIs.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      let familyOfficeId = null;

      // Step 1: Handle family office (create if new, find if existing)
      if (familyOffice.trim()) {
        console.log('Processing family office:', familyOffice);
        
        // First check if it already exists
        const { data: existingOffice, error: searchError } = await supabase
          .from('family_offices')
          .select('id')
          .eq('name', familyOffice.trim())
          .maybeSingle();

        if (searchError && searchError.code !== 'PGRST116') {
          throw searchError;
        }

        if (existingOffice) {
          familyOfficeId = existingOffice.id;
          console.log('Found existing family office:', familyOfficeId);
        } else {
          // Create new family office
          const { data: newOffice, error: createError } = await supabase
            .from('family_offices')
            .insert({ name: familyOffice.trim() })
            .select('id')
            .single();

          if (createError) throw createError;
          
          familyOfficeId = newOffice.id;
          console.log('Created new family office:', familyOfficeId);
        }
      }

      // Step 2: Create the project
      console.log('Creating project...');
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          project_title: projectTitle.trim(),
          investment_thesis: investmentThesis.trim(),
          family_office_id: familyOfficeId,
          user_id: user.id
        })
        .select()
        .single();

      if (projectError) throw projectError;

      console.log('Project created:', projectData);

      // Step 3: Call the generate-kpi-framework function
      console.log('Generating KPI framework...');
      const { data: kpiData, error: kpiError } = await supabase.functions.invoke('generate-kpi-framework', {
        body: { 
          project_id: projectData.id,
          investment_thesis: investmentThesis.trim()
        }
      });

      if (kpiError) throw kpiError;

      console.log('KPI framework generated:', kpiData);

      toast({
        title: "Project Created Successfully",
        description: "Your project and KPI framework have been created successfully.",
      });

      // Step 4: Redirect to workbench
      navigate(`/app/projects/${projectData.id}/workbench`);

    } catch (error) {
      console.error('Error creating project and KPI framework:', error);
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
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
            <Label htmlFor="project-title" className="text-base font-medium">
              Project Title
            </Label>
            <Input
              id="project-title"
              type="text"
              placeholder="e.g., Biotech Therapeutics Analysis Q1 2024"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="h-12 text-base"
            />
          </div>

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

          <div className="space-y-3">
            <Label htmlFor="family-office" className="text-base font-medium">
              Family Office / Investor / Organization
            </Label>
            <FamilyOfficeCombobox
              value={familyOffice}
              onChange={setFamilyOffice}
              placeholder="Search or create family office..."
            />
          </div>

          <div className="pt-4">
            <Button
              size="lg"
              className="w-full h-12 text-base font-semibold"
              disabled={!projectTitle.trim() || !investmentThesis.trim() || isGenerating}
              onClick={generateKpiFramework}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Project & Generating KPIs...
                </>
              ) : (
                'Create Project & Generate KPIs'
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              This will create your project and generate a tailored KPI framework
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;