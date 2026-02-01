
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Optimizes the professional summary based on industry and career stage.
 */
export const optimizeSummary = async (currentSummary: string, industry?: string, level?: string) => {
  const prompt = `As a world-class executive recruiter, rewrite this professional summary to be high-impact, ATS-optimized, and tailored for ${industry || 'the user\'s field'}.
  Career Level: ${level || 'Professional'}
  Current summary: ${currentSummary}
  
  Guidelines:
  - Use powerful action verbs.
  - Focus on measurable results (e.g., %, $, time saved).
  - Target 'Big Tech' (FAANG) standards.
  - Maximum 3-4 sentences.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

/**
 * Tailors an existing resume text to a specific job description.
 */
export const tailorResume = async (oldResume: string, jobDescription: string): Promise<Partial<ResumeData>> => {
  const prompt = `You are an AI Resume Architect. Analyze the old resume and the job description below. 
  Create a new, tailored resume profile that highlights the most relevant skills and experiences to ensure a 95%+ ATS match score.

  Old Resume:
  ${oldResume}

  Target Job Description:
  ${jobDescription}

  Instructions:
  1. Identify top 10 keywords/skills from the JD.
  2. Rewrite experience bullets to map directly to JD requirements using STAR method.
  3. Create a high-impact summary.
  
  Return ONLY a valid JSON object matching this schema:
  {
    "personalInfo": { "summary": string },
    "experiences": [{ "company": string, "position": string, "description": string, "startDate": string, "endDate": string, "location": string }],
    "skills": [{ "name": string }],
    "education": [{ "school": string, "degree": string }]
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("AI Tailoring failed to produce valid JSON", e);
    return {};
  }
};

/**
 * Generates a "Big Tech Ready" preset for students/freshers.
 */
export const getFresherPreset = async (domain: string): Promise<Partial<ResumeData>> => {
  const prompt = `Generate a world-class entry-level resume for a student/fresher looking to get into a top-tier company (like Google, Goldman Sachs, or McKinsey) in the field of: ${domain}.
  
  Include:
  1. A compelling objective/summary highlighting potential and relevant academic projects.
  2. 3-4 high-impact technical/soft skills.
  3. 2 sample projects with 'Big Tech' style descriptions (e.g., "Scaled a React app to handle 1k concurrent users").
  4. 1 sample internship or university society leadership role.

  Return ONLY a valid JSON object:
  {
    "personalInfo": { "summary": string },
    "experiences": [{ "company": string, "position": string, "description": string, "startDate": string, "endDate": string, "location": string }],
    "skills": [{ "name": string }],
    "customSections": [{ "title": "Projects", "content": string }],
    "education": [{ "school": string, "degree": string }]
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || '{}');
};

/**
 * Suggests custom sections based on the user's profile to make them stand out.
 */
export const suggestCustomSections = async (resumeContext: string) => {
  const prompt = `Based on this resume context: "${resumeContext}", suggest 3 unique custom resume sections that would make this candidate stand out to a high-end recruiter (e.g., "Open Source Contributions", "Research & Publications", "Philosophy & Approach").
  
  Return ONLY a JSON array of strings.`;

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

  return JSON.parse(response.text || '[]');
};

export const generateBulletPoints = async (position: string, company: string, rawText: string) => {
  const prompt = `Rewrite these work responsibilities for a ${position} at ${company} into 3 high-impact, results-driven bullet points for an ATS resume. 
  Focus on the 'Impact' and use the 'Accomplished [X] as measured by [Y], by doing [Z]' formula.
  Raw Input: ${rawText}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const generateCustomSectionContent = async (sectionTitle: string, userContext: string) => {
  const prompt = `Write professional, concise, and impressive content for a resume section titled "${sectionTitle}".
  Context: ${userContext}
  Tone: Professional, confident, and achievement-oriented.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};
