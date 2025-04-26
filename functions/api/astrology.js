interface Env {
  DEEPSEEK_API_KEY: string;
}

interface BirthData {
  dateOfBirth: string;
  birthTime: string;
  placeOfBirth: string;
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  // Check for API key
  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('DeepSeek API key is not defined in environment variables');
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse request body
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

    // Sanitize inputs
    const sanitizedData = {
      dateOfBirth: sanitizeInput(data.dateOfBirth),
      birthTime: sanitizeInput(data.birthTime),
      placeOfBirth: sanitizeInput(data.placeOfBirth)
    };

    console.log('Processing request for:', sanitizedData);

    // Generate astrological analysis
    try {
      const analysis = await getAstrologyAnalysis(sanitizedData, apiKey);
      
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
        JSON.stringify({ 
          error: 'Error communicating with the AI service', 
          message: apiError instanceof Error ? apiError.message : String(apiError)
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
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

// API call to DeepSeek
async function getAstrologyAnalysis(data: BirthData, apiKey: string) {
  const prompt = `
Astrology Analysis Prompt

Input:
    Date of Birth: ${data.dateOfBirth}
    Exact Birth Time: ${data.birthTime}
    Place of Birth: ${data.placeOfBirth}

Instructions for Astrology Analysis:
    Generate Birth Chart:
        Construct a detailed astrological chart using the provided birth details (Natal Chart).
        Consider planetary positions (Sun, Moon, Ascendant, etc.), houses, and major aspects (conjunctions, squares, trines).
        House wise listing of planets

    Life Event Predictions:
        Good Events (Positive Influences):
            Identify periods of success, happiness, and growth based on beneficial transits (Jupiter trine Sun, Venus in 10th house, etc.).
            Highlight career breakthroughs, financial gains, romantic opportunities, and spiritual growth.
        Bad Events (Challenges & Obstacles):
            Detect difficult phases (Saturn return, Mars square Pluto, Rahu-Ketu influence).
            Warn about health issues, financial losses, conflicts, or emotional struggles.
        Extraordinary Events (Rare & Significant):
            Predict life-changing moments (sudden fame, major relocation, spiritual awakening).
            Check for rare transits (Jupiter-Saturn conjunction, Uranus opposition) and their impact.

    Time Periods:
        Specify key ages or years when major events may occur.
        Differentiate between short-term (transits) and long-term (progressions) influences.

    Remedial Suggestions (Optional):
        Provide astrological remedies (gemstones, mantras, charity) to mitigate negative effects.

    Mahadasha and Antardash from 2025 to 2030

    Output Format:
        Structured, clear, and concise.
        Use bullet points for readability.
        Avoid vague statements; be specific where possible.
        
IMPORTANT: Do not include any follow-up questions or invitations for further conversation at the end of your response. End your analysis with the final conclusion or remedial suggestions.
  `;

  try {
    console.log('Calling DeepSeek API...');
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DeepSeek API error status: ${response.status}`);
      console.error(`DeepSeek API error response: ${errorText}`);
      throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    
    if (!responseData || !responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
      console.error('Invalid response structure from DeepSeek API:', JSON.stringify(responseData));
      throw new Error('Invalid response structure from DeepSeek API');
    }
    
    let content = responseData.choices[0].message.content;
    
    // Remove any follow-up questions that might still appear
    content = content.replace(/Would you like .*?\?(\s*)$/s, '');
    content = content.replace(/Do you have .*?\?(\s*)$/s, '');
    content = content.replace(/Is there anything .*?\?(\s*)$/s, '');
    content = content.replace(/Let me know .*?\.(\s*)$/s, '');
    
    return content;
  } catch (error) {
    console.error('Error in getAstrologyAnalysis:', error);
    throw error;
  }
} 
