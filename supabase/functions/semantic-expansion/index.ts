import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Semantic expansion function called');

    // Validate HTTP method
    if (req.method !== 'POST') {
      console.error('Invalid HTTP method:', req.method);
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use POST.' }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body parsed:', requestBody);
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate required fields
    const { investment_category } = requestBody;
    if (!investment_category || typeof investment_category !== 'string') {
      console.error('Missing or invalid investment_category:', investment_category);
      return new Response(
        JSON.stringify({ error: 'investment_category is required and must be a string' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Securely retrieve OpenAI API key from Supabase secrets
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('OpenAI API key retrieved successfully');

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch prompt template from database
    console.log('Fetching semantic expansion prompt from database...');
    const { data: promptData, error: promptError } = await supabase
      .from('system_prompts')
      .select('prompt_text')
      .eq('prompt_name', 'semantic_expansion_prompt')
      .maybeSingle();

    if (promptError) {
      console.error('Error fetching prompt from database:', promptError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch semantic expansion prompt from database' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!promptData || !promptData.prompt_text) {
      console.error('Semantic expansion prompt not found in database');
      return new Response(
        JSON.stringify({ error: 'Semantic expansion prompt not found in system_prompts table. Please ensure a prompt with prompt_name "semantic_expansion_prompt" exists.' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Successfully fetched prompt from database');
    
    // Construct the prompt for semantic expansion using the fetched template
    // Replace placeholder in the prompt template with the actual investment category
    const prompt = promptData.prompt_text.replace('${investment_category}', investment_category);

    console.log('Calling OpenAI API with prompt for category:', investment_category);

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert financial analyst specializing in impact investments. You provide precise, professional terminology for investment research.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', openAIResponse.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${openAIResponse.status}`,
          details: errorText 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openAIData = await openAIResponse.json();
    console.log('OpenAI API response received successfully');
    console.log('Full OpenAI response structure:', JSON.stringify(openAIData, null, 2));

    // Extract and parse the generated content
    const generatedContent = openAIData.choices?.[0]?.message?.content;
    console.log('Extracted content:', generatedContent);
    if (!generatedContent) {
      console.error('No content generated by OpenAI');
      return new Response(
        JSON.stringify({ error: 'No content generated by OpenAI' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let keywords: string[];
    try {
      // Try to parse as JSON array
      keywords = JSON.parse(generatedContent);
      
      // Validate that it's an array of strings
      if (!Array.isArray(keywords) || !keywords.every(item => typeof item === 'string')) {
        throw new Error('Response is not an array of strings');
      }
      
      console.log('Successfully parsed keywords:', keywords.length, 'items');
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Raw content:', generatedContent);
      
      // Fallback: extract keywords from text response
      const lines = generatedContent.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/^[-•*]\s*/, '').replace(/^"\s*/, '').replace(/\s*"$/, ''))
        .filter(line => line.length > 2);
      
      keywords = lines.slice(0, 20); // Limit to 20 items
      console.log('Fallback keyword extraction:', keywords.length, 'items');
    }

    // Final validation and response
    if (!keywords || keywords.length === 0) {
      console.error('No keywords extracted from OpenAI response');
      return new Response(
        JSON.stringify({ error: 'Failed to extract keywords from AI response' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Semantic expansion completed successfully. Returning', keywords.length, 'keywords');
    
    return new Response(
      JSON.stringify({ keywords }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error in semantic-expansion function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});