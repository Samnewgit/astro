import type { APIRoute } from 'astro';
import { getAstrologyAnalysis } from '../../services/deepseekService';

// API key validation
function isValidApiKey(apiKey: string | null): boolean {
  // In a real production app, you would use more secure methods
  // like comparing against a hash, not storing the key directly
  return apiKey === import.meta.env.DEEPSEEK_API_KEY;
}

// Input validation
function validateInput(data: any): string | null {
  if (!data) return 'Missing request body';
  
  if (!data.dateOfBirth || typeof data.dateOfBirth !== 'string') 
    return 'Missing or invalid dateOfBirth';
  
  if (!data.birthTime || typeof data.birthTime !== 'string')
    return 'Missing or invalid birthTime';
  
  if (!data.placeOfBirth || typeof data.placeOfBirth !== 'string')
    return 'Missing or invalid placeOfBirth';
  
  // Validate date format (DD/MM/YYYY)
  const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!dateRegex.test(data.dateOfBirth))
    return 'Invalid date format. Please use DD/MM/YYYY';
  
  // Validate time format (HH:MM)
  const timeRegex = /^\d{1,2}:\d{2}$/;
  if (!timeRegex.test(data.birthTime))
    return 'Invalid time format. Please use HH:MM (24-hour format)';
  
  // Validate place (minimum length)
  if (data.placeOfBirth.length < 3)
    return 'Place of birth is too short';
  
  return null;
}

// Sanitize input to prevent injection attacks
function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[;'"\\]/g, ''); // Remove script-related chars
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if request has proper content type
    const contentType = request.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse and validate request data
    let data;
    try {
      data = await request.json();
    } catch (e) {
      console.error('Failed to parse request JSON:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate input
    const validationError = validateInput(data);
    if (validationError) {
      console.error('Input validation error:', validationError);
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Sanitize all inputs
    const sanitizedData = {
      dateOfBirth: sanitizeInput(data.dateOfBirth),
      birthTime: sanitizeInput(data.birthTime),
      placeOfBirth: sanitizeInput(data.placeOfBirth)
    };
    
    // Log the request for debugging
    console.log('Processing request for:', sanitizedData);
    console.log('API Key exists:', !!import.meta.env.DEEPSEEK_API_KEY);
    
    // Get analysis from DeepSeek
    try {
      const analysis = await getAstrologyAnalysis(sanitizedData);
      
      // Return analysis
      return new Response(
        JSON.stringify({ analysis }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'private, max-age=600' // Cache for 10 minutes
          } 
        }
      );
    } catch (apiError) {
      console.error('DeepSeek API error:', apiError);
      return new Response(
        JSON.stringify({ error: 'Error communicating with the AI service. Please try again later.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 
