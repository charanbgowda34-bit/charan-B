
import { GoogleGenAI, Type } from "@google/genai";

// Always use named parameter and direct process.env.API_KEY reference
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeSummary = async (currentSummary: string, targetJob?: string) => {
  const prompt = `Rewrite this professional summary to be more high-impact and ATS-friendly. 
  ${targetJob ? `Target Job Title: ${targetJob}` : ''}
  Current summary: ${currentSummary}
  Focus on quantifiable achievements, action verbs, and relevant keywords. Keep it under 100 words.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const generateBulletPoints = async (position: string, company: string, rawText: string) => {
  const prompt = `Convert the following description of a ${position} role at ${company} into 3-5 high-impact, ATS-optimized bullet points using the STAR method (Situation, Task, Action, Result). 
  Description: ${rawText}
  Use strong action verbs and include metrics or results where possible.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const suggestSkills = async (experiences: string[], projects: string[]) => {
  const prompt = `Based on these experiences and projects, suggest 10 relevant hard and soft skills for a modern ATS-friendly resume.
  Experiences: ${experiences.join('; ')}
  Projects: ${projects.join('; ')}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};
