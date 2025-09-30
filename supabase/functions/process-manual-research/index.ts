import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompanyData {
  entity_type?: string;
  company_name: string;
  company_description?: string;
  website_url?: string;
  hq_city?: string;
  hq_country?: string;
  founded_year?: number;
  employee_count?: number | string;
  tags?: string[];
  contacts?: {
    general_email?: string;
    phone?: string;
    address?: string;
    linkedin_url?: string;
  } | Array<{ name?: string; title?: string; email?: string; linkedin_url?: string }>;
  funding?: {
    track?: string;
    stage?: string;
    last_round?: string;
    last_round_amount_usd?: number;
    total_funding_usd?: number;
    investors?: string[];
    grants?: any[];
  };
  products_solutions?: Array<{
    name: string;
    description: string;
    type?: string;
    status?: string;
    link_url?: string;
  }>;
  customers_partners?: Array<{
    name: string;
    type: string;
    notes?: string;
    link_url?: string;
  }>;
  team?: Array<{
    name: string;
    role: string;
    linkedin_url?: string;
  }>;
  clinical_activity?: {
    pilots?: Array<{ title?: string; status?: string; participants?: any; duration?: string }>;
    trials?: Array<{ trial_id?: string; title?: string; status?: string; phase?: string }>;
  };
  ip_portfolio?: {
    patent_count?: number;
    representative_patents?: Array<{ title?: string; patent_number?: string; filing_date?: string; status?: string }>;
  };
  publications?: Array<{ title?: string; journal?: string; year?: number; doi?: string; citations?: number }>;
  news_last_12mo?: Array<{ title?: string; date?: string; source?: string; url?: string; sentiment?: string }>;
  evidence?: {
    source_references?: string[];
    corporate_profile?: {
      press_releases?: string[];
      technology_summary?: string;
    };
  };
  analysis?: {
    relevance_score?: number;
    relevance_score_breakdown?: any;
    news_sentiment_label?: string;
    data_completeness_percent?: number;
    missing_kpis_count?: number;
    stage_confidence_score?: number;
    completeness_flag?: string;
    risks?: string[];
    opportunity_summary?: string;
  };
  category_completeness?: {
    scientific_technical_percent?: number;
    operational_percent?: number;
    financial_percent?: number;
    impact_percent?: number;
  };
  kpi_data?: KpiData[];
  // Legacy fields (direct mapping)
  relevance_score?: number;
  location?: string;
  mission_statement?: string;
  technology_summary?: string;
  opportunity_summary?: string;
}

interface KpiData {
  kpi_name: string;
  category?: string;
  status?: string;
  data_value?: string | number;
  unit?: string;
  source_url?: string;
  source_snippet?: string;
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

        // Transform contacts: object → array format
        let contactsArray = null;
        if (companyData.contacts) {
          if (Array.isArray(companyData.contacts)) {
            contactsArray = companyData.contacts;
          } else {
            // Convert contact object to array format
            contactsArray = [{
              name: 'General Contact',
              email: companyData.contacts.general_email || null,
              phone: companyData.contacts.phone || null,
              linkedin_url: companyData.contacts.linkedin_url || null,
            }];
          }
        }

        // Transform news_last_12mo → news_sentiment structure
        let newsSentiment = null;
        if (companyData.news_last_12mo && Array.isArray(companyData.news_last_12mo)) {
          newsSentiment = {
            recent_news: companyData.news_last_12mo.map(item => ({
              headline: item.title || '',
              date: item.date || '',
              source: item.source || '',
              url: item.url || '',
            })),
            market_sentiment: companyData.analysis?.news_sentiment_label || null,
          };
        }

        // Transform IP portfolio
        let ipPortfolio = null;
        if (companyData.ip_portfolio) {
          ipPortfolio = {
            patents: companyData.ip_portfolio.representative_patents || [],
            key_publications: companyData.publications || [],
          };
        }

        // Extract analysis fields with fallback to direct fields
        const relevanceScore = companyData.analysis?.relevance_score ?? companyData.relevance_score ?? null;
        const dataCompleteness = companyData.analysis?.data_completeness_percent ?? null;
        const stageConfidence = companyData.analysis?.stage_confidence_score ?? null;
        const missingKpiCount = companyData.analysis?.missing_kpis_count ?? null;
        const riskBadges = companyData.analysis?.risks || [];
        const opportunitySummary = companyData.analysis?.opportunity_summary ?? companyData.opportunity_summary ?? null;

        // Convert employee_count to string if it's a number
        const employeeCount = companyData.employee_count ? String(companyData.employee_count) : null;

        // Insert company record with all fields
        const { data: insertedCompany, error: companyError } = await supabase
          .from('companies')
          .insert({
            project_id: project_id,
            company_name: companyData.company_name,
            company_description: companyData.company_description || null,
            website_url: companyData.website_url || null,
            entity_type: companyData.entity_type || 'Company',
            hq_city: companyData.hq_city || null,
            hq_country: companyData.hq_country || null,
            location: companyData.hq_city && companyData.hq_country 
              ? `${companyData.hq_city}, ${companyData.hq_country}` 
              : (companyData.location || null),
            founded_year: companyData.founded_year || null,
            employee_count: employeeCount,
            tags: companyData.tags || [],
            relevance_score: relevanceScore,
            data_completeness_percentage: dataCompleteness,
            stage_confidence_score: stageConfidence,
            missing_kpi_count: missingKpiCount,
            risk_badges: riskBadges,
            // Funding fields
            funding_track: companyData.funding?.track || null,
            funding_stage: companyData.funding?.stage || null,
            total_raised: companyData.funding?.total_funding_usd 
              ? `$${(companyData.funding.total_funding_usd / 1000000).toFixed(1)}M` 
              : null,
            key_investors: companyData.funding?.investors || [],
            // Summary fields
            mission_statement: companyData.mission_statement || null,
            technology_summary: companyData.technology_summary || null,
            opportunity_summary: opportunitySummary,
            // Complex JSONB fields
            products_solutions: companyData.products_solutions || [],
            customers_partners: companyData.customers_partners || [],
            team: companyData.team || [],
            contacts: contactsArray,
            clinical_activity: companyData.clinical_activity || { pilots: [], trials: [] },
            ip_portfolio: ipPortfolio || { patents: [], key_publications: [] },
            publications: companyData.publications || [],
            news_sentiment: newsSentiment || { recent_news: [], market_sentiment: null },
            news_sentiment_label: companyData.analysis?.news_sentiment_label || null,
            evidence: companyData.evidence || {},
            category_completeness: companyData.category_completeness || {},
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

              // Map status values
              const statusMap: Record<string, string> = {
                'complete': 'complete',
                'partial': 'partial',
                'pending': 'pending',
                'not_applicable': 'pending',
              };
              const kpiStatus = kpiEntry.status ? (statusMap[kpiEntry.status] || 'pending') : 'pending';

              // Convert data_value to string
              const dataValue = kpiEntry.data_value != null ? String(kpiEntry.data_value) : null;

              // Insert KPI data record
              const { error: kpiDataError } = await supabase
                .from('company_kpi_data')
                .insert({
                  company_id: companyId,
                  kpi_id: kpiId,
                  data_value: dataValue,
                  source_url: kpiEntry.source_url || null,
                  status: kpiStatus,
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