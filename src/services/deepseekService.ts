// import fetch from 'node-fetch';

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface AstrologyRequestData {
  dateOfBirth: string;
  birthTime: string;
  placeOfBirth: string;
}

export async function getAstrologyAnalysis(data: AstrologyRequestData): Promise<string> {
  const apiKey = import.meta.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    throw new Error('DeepSeek API key is not defined. Please add it to your environment variables.');
  }
  
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
    // Using native fetch available in Cloudflare Workers
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
      console.error(`DeepSeek API response status: ${response.status}`);
      console.error(`DeepSeek API response body: ${errorText}`);
      throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
    }

    const responseData = await response.json() as DeepSeekResponse;
    let content = responseData.choices[0].message.content;
    
    // Remove any follow-up questions that might still appear
    content = content.replace(/Would you like .*?\?(\s*)$/s, '');
    content = content.replace(/Do you have .*?\?(\s*)$/s, '');
    content = content.replace(/Is there anything .*?\?(\s*)$/s, '');
    content = content.replace(/Let me know .*?\.(\s*)$/s, '');
    
    return content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
} 
