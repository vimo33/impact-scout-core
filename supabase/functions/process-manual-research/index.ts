import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompanyData {
  company_name: string;
  company_description?: string;
  website_url?: string;
  relevance_score?: number;
  kpi_data?: KpiData[];
}

interface KpiData {
  kpi_name: string;
  data_value?: string;
  source_url?: string;
}

interface ProcessedResults {
  companies_processed: number;
  kpi_records_created: number;
  failed_kpi_lookups: string[];
  company_ids: string[];
}

serve(async (req) => {
  console.log('Process manual research function called');

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
    console.log('Request body parsed');

    const { project_id, research_json_string } = body;

    // Validate input
    if (!project_id || !research_json_string) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: project_id and research_json_string' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the research JSON string
    let parsedData: CompanyData[];
    try {
      const jsonData = JSON.parse(research_json_string);
      
      // Handle different possible JSON structures
      if (Array.isArray(jsonData)) {
        parsedData = jsonData;
      } else if (jsonData.companies && Array.isArray(jsonData.companies)) {
        parsedData = jsonData.companies;
      } else {
        throw new Error('Invalid JSON structure: expected array of companies or object with companies property');
      }

      // Validate company data structure
      for (const company of parsedData) {
        if (!company.company_name) {
          throw new Error('Invalid company data: company_name is required');
        }
      }

      console.log(`Successfully parsed ${parsedData.length} companies from JSON`);
    } catch (parseError) {
      console.error('Failed to parse research JSON:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON format or structure',
        details: parseError.message
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify project exists and get KPI framework
    console.log('Verifying project and fetching KPI framework...');
    const { data: projectKpis, error: kpiError } = await supabase
      .from('kpis')
      .select(`
        id,
        kpi_name,
        framework_id,
        kpi_frameworks!inner(
          project_id
        )
      `)
      .eq('kpi_frameworks.project_id', project_id);

    if (kpiError) {
      console.error('Error fetching project KPIs:', kpiError);
      throw new Error('Failed to fetch project KPI framework');
    }

    if (!projectKpis || projectKpis.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'No KPI framework found for this project. Please generate KPIs first.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create KPI lookup map
    const kpiLookup = new Map<string, string>();
    projectKpis.forEach(kpi => {
      kpiLookup.set(kpi.kpi_name.toLowerCase().trim(), kpi.id);
    });

    console.log(`Found ${projectKpis.length} KPIs in project framework`);

    // Process results tracking
    const results: ProcessedResults = {
      companies_processed: 0,
      kpi_records_created: 0,
      failed_kpi_lookups: [],
      company_ids: []
    };

    // Process each company
    for (const companyData of parsedData) {
      try {
        console.log(`Processing company: ${companyData.company_name}`);

        // Insert company record
        const { data: insertedCompany, error: companyError } = await supabase
          .from('companies')
          .insert({
            project_id: project_id,
            company_name: companyData.company_name,
            company_description: companyData.company_description || null,
            website_url: companyData.website_url || null,
            relevance_score: companyData.relevance_score || null
          })
          .select('id')
          .single();

        if (companyError || !insertedCompany) {
          console.error(`Error inserting company ${companyData.company_name}:`, companyError);
          continue; // Skip this company but continue with others
        }

        const companyId = insertedCompany.id;
        results.company_ids.push(companyId);
        results.companies_processed++;

        console.log(`Successfully inserted company: ${companyData.company_name} with ID: ${companyId}`);

        // Process KPI data if it exists
        if (companyData.kpi_data && Array.isArray(companyData.kpi_data)) {
          for (const kpiEntry of companyData.kpi_data) {
            try {
              // Look up KPI ID by name
              const kpiId = kpiLookup.get(kpiEntry.kpi_name.toLowerCase().trim());
              
              if (!kpiId) {
                console.warn(`KPI not found in framework: ${kpiEntry.kpi_name}`);
                results.failed_kpi_lookups.push(`${companyData.company_name}: ${kpiEntry.kpi_name}`);
                continue;
              }

              // Insert KPI data record
              const { error: kpiDataError } = await supabase
                .from('company_kpi_data')
                .insert({
                  company_id: companyId,
                  kpi_id: kpiId,
                  data_value: kpiEntry.data_value || null,
                  source_url: kpiEntry.source_url || null,
                  status: 'completed'
                });

              if (kpiDataError) {
                console.error(`Error inserting KPI data for ${kpiEntry.kpi_name}:`, kpiDataError);
                results.failed_kpi_lookups.push(`${companyData.company_name}: ${kpiEntry.kpi_name} (insert failed)`);
              } else {
                results.kpi_records_created++;
                console.log(`Successfully inserted KPI data: ${kpiEntry.kpi_name} for ${companyData.company_name}`);
              }
            } catch (kpiError) {
              console.error(`Error processing KPI ${kpiEntry.kpi_name}:`, kpiError);
              results.failed_kpi_lookups.push(`${companyData.company_name}: ${kpiEntry.kpi_name} (processing error)`);
            }
          }
        }
      } catch (companyError) {
        console.error(`Error processing company ${companyData.company_name}:`, companyError);
        // Continue with next company
      }
    }

    // Return success response with detailed results
    const response = {
      success: true,
      message: `Successfully processed ${results.companies_processed} companies`,
      results: {
        companies_processed: results.companies_processed,
        kpi_records_created: results.kpi_records_created,
        company_ids: results.company_ids,
        failed_kpi_lookups: results.failed_kpi_lookups.length > 0 ? results.failed_kpi_lookups : undefined
      }
    };

    // Log summary
    console.log('Processing complete:', {
      companies: results.companies_processed,
      kpiRecords: results.kpi_records_created,
      failedKpis: results.failed_kpi_lookups.length
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-manual-research function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});