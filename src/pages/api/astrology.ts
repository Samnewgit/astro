import type { APIRoute } from 'astro';
// import { getAstrologyAnalysis } from '../../services/deepseekService';

// API key validation
function isValidApiKey(apiKey: string | null): boolean {
  // For debugging
  console.log('API Key type:', typeof apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  console.log('ENV var type:', typeof import.meta.env.DEEPSEEK_API_KEY);
  console.log('ENV var length:', import.meta.env.DEEPSEEK_API_KEY ? import.meta.env.DEEPSEEK_API_KEY.length : 0);
  
  // In a real production app, you would use more secure methods
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
    console.log('POST request received');
    
    // Skip all validation and processing
    // TEMPORARY SOLUTION FOR DEBUGGING
    
    // Return a static response
    return new Response(
      JSON.stringify({ 
        analysis: `
# Astrological Analysis

## Birth Chart Summary
- Sun in Aries: Strong leadership qualities
- Moon in Cancer: Emotionally intuitive
- Ascendant in Libra: Diplomatic approach to life

## Life Event Predictions
### Positive Influences
- Career advancement in 2026
- Financial growth in mid-2027
- Relationship harmony in early 2028

### Challenges
- Health awareness needed in late 2025
- Communication challenges in 2026

## Remedial Suggestions
- Wear red garnet for strength
- Practice meditation on Tuesdays
- Charity work related to children

THIS IS A STATIC TEST RESPONSE
`
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=600'
        } 
      }
    );
    
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 
