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

    const prompt = `You are a data visualization expert. Create a complete, working HTML page with inline CSS and JavaScript that visualizes the following data.

${messageText}

Requirements:
- Create a complete HTML page with <!DOCTYPE html>, <html>, <head>, and <body> tags
- Include all CSS inline in <style> tags within the <head>
- Include all JavaScript inline in <script> tags
- Use modern, responsive design with a clean, professional appearance
- Choose the most appropriate visualization type (charts, graphs, tables, etc.) based on the data
- Use libraries like Chart.js, D3.js, or create custom visualizations as appropriate
- Include proper titles, labels, and legends
- Make it interactive where possible (hover effects, clickable elements, etc.)
- Use a modern color scheme and typography
- Ensure the visualization is mobile-friendly
- If the data contains time series, use appropriate time-based charts
- If the data is categorical, use bar charts, pie charts, or similar
- If the data is numerical/statistical, consider histograms, scatter plots, or box plots
- Include brief explanatory text about what the visualization shows
- Handle edge cases gracefully (empty data, invalid formats, etc.)

The output should be a complete, self-contained HTML file that can be opened in any modern web browser.`;

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