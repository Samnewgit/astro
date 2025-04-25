export async function onRequest({ request, env }) {
  // Log environment variables (won't expose secrets in actual logs)
  console.log('API Key exists:', !!env.DEEPSEEK_API_KEY);
  
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Return a static response for now
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
} 