import { GoogleGenAI, Type } from "@google/genai";
import type { Mood, ApiResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

// Custom error for issues with the API response format
class InvalidResponseError extends Error {
  constructor(message = "The AI's response was not in the expected format. Please try again.") {
    super(message);
    this.name = 'InvalidResponseError';
  }
}

// Custom error for network or general API communication issues
class ApiCommunicationError extends Error {
  constructor(message = "Could not connect to the AI service. Please check your internet connection and try again.") {
    super(message);
    this.name = 'ApiCommunicationError';
  }
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    advice: {
      type: Type.STRING,
      description: "A short, gentle, and supportive piece of advice or comforting message, acknowledging the user's feelings and specific thoughts.",
    },
    quote: {
      type: Type.STRING,
      description: "A short, general, and inspiring quote relevant to the user's mood. This should be different from the advice."
    },
    showResources: {
      type: Type.BOOLEAN,
      description: "Analyze the user's thoughts for crisis indicators. Set to true ONLY if the user's thoughts suggest a potential crisis, severe distress, or an urgent need for professional help. Otherwise, set to false. This property is only considered when the mood is 'Depressed'.",
    },
    resources: {
      type: Type.ARRAY,
      description: "A list of 3-4 searchable mental health resources. This array should always be populated.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "The name of the resource, e.g., 'National Suicide Prevention Lifeline'." },
          query: { type: Type.STRING, description: "The exact search term a user can use to find the resource, e.g., 'National Suicide Prevention Lifeline phone number'." },
        },
        required: ["title", "query"],
      },
    },
  },
  required: ["advice", "quote"],
};

export const generateResponse = async (mood: Mood, thoughts?: string): Promise<ApiResponse> => {
  try {
    let prompt = `You are a compassionate mental health AI assistant. A user is feeling '${mood}'.`;

    if (thoughts && thoughts.trim() !== '') {
      prompt += ` They also shared this thought: "${thoughts}".`;
    } else {
      prompt += ` They haven't shared any specific thoughts.`;
    }

    prompt += ` Based on their mood and thoughts, generate a JSON object containing: 
    1. "advice": A personalized, gentle, and supportive message.
    2. "quote": A short, general, and inspirational quote relevant to their mood.
    `;
    
    if (mood === 'Depressed') {
        prompt += `3. "showResources": A boolean, which you will set to true ONLY if their thoughts indicate a crisis or you have a strong reason to believe they need immediate help. Otherwise, set it to false. 
        4. "resources": A list of 3 searchable resources.`
    }


    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new InvalidResponseError("The AI returned an empty response.");
    }
    
    let parsedResponse;
    try {
        parsedResponse = JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonText);
        throw new InvalidResponseError("The AI's response was malformed.");
    }


    if (parsedResponse.advice && parsedResponse.quote) {
      let resources = null;
      // Ensure resources are only shown for 'Depressed' mood, when the AI flags it, and the data is a valid array.
      if (mood === 'Depressed' && parsedResponse.showResources === true && Array.isArray(parsedResponse.resources)) {
          resources = parsedResponse.resources;
      }
      return {
        advice: parsedResponse.advice,
        quote: parsedResponse.quote,
        resources: resources,
      };
    } else {
      console.error("Invalid response structure from API:", parsedResponse);
      throw new InvalidResponseError("The AI's response was missing required fields.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof InvalidResponseError) {
      throw error; // Re-throw our custom error
    }
    // For other errors (network, API key issues, etc.), wrap them.
    throw new ApiCommunicationError();
  }
};