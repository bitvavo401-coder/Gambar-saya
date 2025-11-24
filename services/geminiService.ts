import { GoogleGenAI } from "@google/genai";
import { stripBase64Prefix } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const cleanBase64 = stripBase64Prefix(base64Image);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    return response.text || "No response text generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};