import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KPI {
  kpi_name: string;
  kpi_description: string;
  category: 'Scientific/Technical' | 'Operational' | 'Financial' | 'Impact';
}

serve(async (req) => {
  console.log('KPI framework generation function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse request body
    const body = await req.json();
    console.log('Request body parsed:', body);

    const { project_id, investment_thesis } = body;

    // Validate input
    if (!project_id || !investment_thesis) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: project_id and investment_thesis' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if KPI framework already exists for this project
    console.log('Checking for existing KPI framework for project:', project_id);
    let { data: existingFramework, error: frameworkQueryError } = await supabase
      .from('kpi_frameworks')
      .select('id')
      .eq('project_id', project_id)
      .maybeSingle();

    if (frameworkQueryError) {
      console.error('Error querying KPI frameworks:', frameworkQueryError);
      throw new Error('Failed to query existing KPI frameworks');
    }

    let framework_id: string;

    if (existingFramework) {
      framework_id = existingFramework.id;
      console.log('Using existing framework:', framework_id);
    } else {
      // Create new KPI framework
      console.log('Creating new KPI framework for project:', project_id);
      const { data: newFramework, error: createFrameworkError } = await supabase
        .from('kpi_frameworks')
        .insert({
          framework_name: `KPI Framework for Project ${project_id}`,
          project_id: project_id,
          version: 1
        })
        .select('id')
        .single();

      if (createFrameworkError || !newFramework) {
        console.error('Error creating KPI framework:', createFrameworkError);
        throw new Error('Failed to create KPI framework');
      }

      framework_id = newFramework.id;
      console.log('Created new framework:', framework_id);
    }

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    console.log('OpenAI API key retrieved successfully');

    // Fetch prompt template from database
    console.log('Fetching KPI generation prompt from database...');
    const { data: promptData, error: promptError } = await supabase
      .from('system_prompts')
      .select('prompt_text')
      .eq('prompt_name', 'kpi_generation_prompt')
      .maybeSingle();

    if (promptError) {
      console.error('Error fetching prompt from database:', promptError);
      throw new Error('Failed to fetch KPI generation prompt from database');
    }

    if (!promptData || !promptData.prompt_text) {
      console.error('KPI generation prompt not found in database');
      throw new Error('KPI generation prompt not found in system_prompts table. Please ensure a prompt with prompt_name "kpi_generation_prompt" exists.');
    }

    console.log('Successfully fetched prompt from database');
    
    // Construct OpenAI prompt using the fetched template
    // Replace placeholder in the prompt template with the actual investment thesis
    const prompt = promptData.prompt_text.replace('${investment_thesis}', investment_thesis);

    // Call OpenAI API
    console.log('Calling OpenAI API for investment thesis:', investment_thesis.substring(0, 100) + '...');
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert impact investment analyst. Respond only with valid JSON arrays as requested.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    console.log('OpenAI API response received successfully');
    
    const generatedContent = openaiData.choices[0].message.content;
    console.log('Generated content:', generatedContent.substring(0, 200) + '...');

    // Parse OpenAI response
    let kpis: KPI[];
    try {
      // Clean up the response in case it has markdown formatting
      const cleanedContent = generatedContent
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      kpis = JSON.parse(cleanedContent);
      
      if (!Array.isArray(kpis)) {
        throw new Error('Response is not an array');
      }
      
      // Validate KPI structure
      for (const kpi of kpis) {
        if (!kpi.kpi_name || !kpi.kpi_description || !kpi.category) {
          throw new Error('Invalid KPI structure');
        }
        
        const validCategories = ['Scientific/Technical', 'Operational', 'Financial', 'Impact'];
        if (!validCategories.includes(kpi.category)) {
          throw new Error(`Invalid category: ${kpi.category}`);
        }
      }
      
      console.log(`Successfully parsed ${kpis.length} KPIs`);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw content:', generatedContent);
      throw new Error('Failed to parse AI response as valid KPI data');
    }

    // Insert KPIs into database
    console.log('Inserting KPIs into database...');
    const kpiInserts = kpis.map(kpi => ({
      framework_id: framework_id,
      kpi_name: kpi.kpi_name,
      kpi_description: kpi.kpi_description,
      category: kpi.category,
      source_url: 'https://api.openai.com/v1/chat/completions',
      source_snippet: `Generated by OpenAI for investment thesis: ${investment_thesis.substring(0, 100)}...`
    }));

    const { data: insertedKpis, error: insertError } = await supabase
      .from('kpis')
      .insert(kpiInserts)
      .select('id, kpi_name, category');

    if (insertError) {
      console.error('Error inserting KPIs:', insertError);
      throw new Error('Failed to save KPIs to database');
    }

    console.log(`Successfully inserted ${insertedKpis?.length || 0} KPIs`);

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      framework_id: framework_id,
      kpis_generated: insertedKpis?.length || 0,
      kpis: insertedKpis
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-kpi-framework function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});