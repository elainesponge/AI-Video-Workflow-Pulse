
import { GoogleGenAI } from "@google/genai";
import { PulseItem, PulseResponse, Category } from '../types';
import { INITIAL_PROMPT } from '../constants';

export const generateLibraryFeed = async (): Promise<PulseItem[]> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Calculate date 30 days ago for the "after:" search operator (1 Month range)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString().split('T')[0];
    
    console.log(`[GeminiService] Scouting for workflows posted after: ${dateStr}`);

    // We pass the rules as a System Instruction for strict adherence
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: INITIAL_PROMPT,
        tools: [{ googleSearch: {} }],
        temperature: 0.0, // STRICT 0.0 to prevent URL hallucinations
      },
      contents: [
        {
          role: 'user',
          parts: [
            { 
              text: `Perform the following 3 specific Google Searches to find high-quality AI Video Workflows.
              
              SEARCH QUERIES:
              1. site:youtube.com ("Runway" OR "ComfyUI" OR "Kling AI" OR "Hailuo" OR "Luma Dream Machine") AND ("workflow" OR "tutorial" OR "guide") after:${dateStr}
              2. site:x.com ("AI video" OR "img2vid" OR "video generation") AND ("workflow" OR "process" OR "steps") after:${dateStr}
              3. site:reddit.com ("r/aivideo" OR "r/comfyui" OR "r/runwayml") AND ("workflow" OR "tutorial") after:${dateStr}

              TASK:
              - Look at the search results from the tool.
              - Extract the BEST items that contain actual workflows or tutorials.
              - Do NOT invent items. If you only find 2 good YouTube videos, only return 2.
              - MAP the 'web.uri' directly to 'sourceUrl'.
              - Return valid JSON.` 
            }
          ]
        }
      ]
    });

    const text = response.text;
    if (!text) return [];

    let jsonString = '';
    
    // Robust JSON extraction logic
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1];
    } else {
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonString = text.substring(firstBrace, lastBrace + 1);
      }
    }

    jsonString = jsonString.trim();

    if (!jsonString) {
      console.warn("No JSON structure found in response:", text);
      return [];
    }

    let data: PulseResponse;
    try {
      data = JSON.parse(jsonString) as PulseResponse;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Failed Text:", text);
      return [];
    }
    
    // Assign IDs client-side and FORCE category to WORKFLOW
    if (data && data.items) {
      return data.items.map((item, index) => ({
        ...item,
        category: Category.WORKFLOW, // Force all items to be workflows
        id: `lib-${Date.now()}-${index}`
      }));
    }
    
    return [];

  } catch (error) {
    console.error("Failed to generate library feed:", error);
    return [];
  }
};
