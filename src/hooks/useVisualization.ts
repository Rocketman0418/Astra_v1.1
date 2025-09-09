import { useState, useCallback } from 'react';
import { VisualizationState } from '../types';

const GEMINI_API_KEY = 'AIzaSyCsZwYakYNFcOo37li73JGjXTtc0DYmdcQ';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const useVisualization = () => {
  const [visualizations, setVisualizations] = useState<Record<string, VisualizationState>>({});
  const [currentVisualization, setCurrentVisualization] = useState<string | null>(null);

  const generateVisualization = useCallback(async (messageId: string, messageText: string) => {
    setVisualizations(prev => ({
      ...prev,
      [messageId]: {
        messageId,
        isGenerating: true,
        content: null,
        isVisible: false
      }
    }));

    try {
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
- Use gradients from blue to purple for primary elements
- Implement responsive design that works on all screen sizes
- Add smooth transitions and professional styling
- Include data labels, legends, and clear visual hierarchy
- Use modern CSS features like flexbox, grid, and custom properties
- Make it visually striking and dashboard-quality

TECHNICAL REQUIREMENTS:
- Return ONLY clean HTML with inline CSS and JavaScript
- No external dependencies or libraries
- Use semantic HTML structure
- Ensure accessibility with proper ARIA labels
- Optimize for performance and smooth animations

DATA TO VISUALIZE:
${messageText}

Create a visualization that would impress executives and stakeholders with its professional appearance and interactivity.`;

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate visualization');
      }

      const data = await response.json();
      const visualizationContent = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No visualization could be generated.';

      setVisualizations(prev => ({
        ...prev,
        [messageId]: {
          messageId,
          isGenerating: false,
          content: visualizationContent,
          isVisible: false
        }
      }));
    } catch (error) {
      console.error('Error generating visualization:', error);
      setVisualizations(prev => ({
        ...prev,
        [messageId]: {
          messageId,
          isGenerating: false,
          content: '<div style="padding: 20px; text-align: center; color: #ef4444;">Failed to generate visualization. Please try again.</div>',
          isVisible: false
        }
      }));
    }
  }, []);

  const showVisualization = useCallback((messageId: string) => {
    setCurrentVisualization(messageId);
    setVisualizations(prev => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        isVisible: true
      }
    }));
  }, []);

  const hideVisualization = useCallback(() => {
    setCurrentVisualization(null);
  }, []);

  const getVisualization = useCallback((messageId: string) => {
    return visualizations[messageId] || null;
  }, [visualizations]);

  return {
    generateVisualization,
    showVisualization,
    hideVisualization,
    getVisualization,
    currentVisualization
  };
};