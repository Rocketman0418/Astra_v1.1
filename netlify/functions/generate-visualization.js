exports.handler = async (event, context) => {
  console.log('Function started, method:', event.httpMethod);
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    console.log('Parsing request body...');
    const { messageText } = JSON.parse(event.body);
    
    if (!messageText) {
      console.log('No message text provided');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Message text is required' })
      };
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    console.log('API key exists:', !!GEMINI_API_KEY);
    
    if (!GEMINI_API_KEY) {
      console.log('Gemini API key not found in environment');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Gemini API key not configured' })
      };
    }

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    console.log('Making request to Gemini API...');

    const prompt = `Create a sophisticated, interactive HTML data visualization based on the following text. 

DESIGN REQUIREMENTS:
- Use a DARK THEME with these exact colors:
  * Background: #111827 (dark gray)
  * Secondary background: #1f2937 (lighter dark gray)
  * Primary accent: #3b82f6 (blue)
  * Secondary accent: #8b5cf6 (purple)
  * Text: #ffffff (white)
  * Muted text: #9ca3af (light gray)
  * Success/positive: #10b981 (green)
  * Warning/negative: #ef4444 (red)

VISUALIZATION REQUIREMENTS:
- Create dynamic, interactive charts using modern CSS and JavaScript
- Include hover effects, animations, and micro-interactions
- Return ONLY clean HTML with inline CSS and JavaScript
${messageText}

Create a visualization that would impress executives and stakeholders with its professional appearance and interactivity.`;
    const prompt = `You are a data visualization expert. Create a complete, working HTML page with inline CSS and JavaScript that visualizes the following data.

    console.log('Sending request to Gemini...');
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 23000); // 23 seconds to stay under Netlify's 26s limit
    
    let response;
    try {
      response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 1,
            maxOutputTokens: 4096, // Reduce to speed up generation
          }
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('Request timed out after 25 seconds');
        throw new Error('Request timed out');
      }
      throw error;
    }

    console.log('Gemini API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, response.statusText, errorText);
      throw new Error('Failed to generate visualization');
    }

    const data = await response.json();
    console.log('Gemini API response received, candidates:', data.candidates?.length);
    const visualizationContent = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No visualization could be generated.';

    console.log('Successfully generated visualization, length:', visualizationContent.length);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: visualizationContent })
    };

  } catch (error) {
    console.error('Function error:', error.message, error.stack);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: `Failed to generate visualization: ${error.message}`,
        content: '<div style="padding: 20px; text-align: center; color: #ef4444;">Failed to generate visualization. Please try again.</div>'
      })
    };
  }
};