import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { QuizItem, Flashcard, StudyPlan, Language } from '../types';

// Use gemini-3-pro-preview for complex reasoning tasks as requested
const MODEL_COMPLEX = "gemini-3-pro-preview";
// Use gemini-3-flash-preview for faster, simpler tasks
const MODEL_FAST = "gemini-3-flash-preview";

// Initialize the client
// The API key must be available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const LANGUAGE_MAP: Record<Language, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  pt: "Portuguese",
  zh: "Chinese (Simplified)"
};

export const generateQuizFromText = async (text: string, language: Language = 'en', numQuestions: number = 5): Promise<QuizItem[]> => {
  const langName = LANGUAGE_MAP[language];
  const prompt = `Generate a quiz with ${numQuestions} multiple-choice questions based on the following text. 
  Ensure the questions cover key concepts and vary in difficulty.
  
  IMPORTANT: Generate the content (questions, options, explanations) in ${langName} language.
  However, keep the JSON keys strictly in English (e.g., "question", "options", "correctAnswerIndex", "explanation").
  
  Text Content:
  ${text.slice(0, 50000)}... (truncated for context if too long)`;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswerIndex: { type: Type.INTEGER },
        explanation: { type: Type.STRING, description: "Short explanation of why the answer is correct." }
      },
      required: ["question", "options", "correctAnswerIndex", "explanation"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_COMPLEX,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizItem[];
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

export const generateFlashcardsFromText = async (text: string, language: Language = 'en', count: number = 10): Promise<Flashcard[]> => {
  const langName = LANGUAGE_MAP[language];
  const prompt = `Create ${count} flashcards based on the key terms and concepts in the text provided.
  
  IMPORTANT: Generate the content (front, back, category) in ${langName} language.
  However, keep the JSON keys strictly in English (e.g., "front", "back", "category").
  
  Text Content:
  ${text.slice(0, 50000)}`;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        front: { type: Type.STRING, description: "The term, question, or concept." },
        back: { type: Type.STRING, description: "The definition, answer, or explanation." },
        category: { type: Type.STRING, description: "A short tag for the topic." }
      },
      required: ["front", "back"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_COMPLEX, // Pro model usually better for extracting key concepts accurately
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Flashcard[];
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

export const generateStudyPlanFromText = async (text: string, language: Language = 'en'): Promise<StudyPlan> => {
  const langName = LANGUAGE_MAP[language];
  const prompt = `Create a structured adaptive study plan based on this material. 
  Assume the student needs to master this content over the next 4 weeks. 
  Break it down by week and topic. Identify weak areas or complex topics as 'High' priority.

  IMPORTANT: Generate the content (title, goal, topic, description, priority) in ${langName} language.
  However, keep the JSON keys strictly in English (e.g., "items", "week", "priority").
  For the 'priority' field value, use English values: "High", "Medium", "Low".

  Text Content:
  ${text.slice(0, 50000)}`;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      goal: { type: Type.STRING },
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            week: { type: Type.INTEGER },
            topic: { type: Type.STRING },
            description: { type: Type.STRING },
            estimatedHours: { type: Type.NUMBER },
            priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
          },
          required: ["week", "topic", "description", "priority"]
        }
      }
    },
    required: ["title", "goal", "items"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_COMPLEX,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as StudyPlan;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw error;
  }
};

export const simplifyText = async (text: string, language: Language = 'en'): Promise<string> => {
  const langName = LANGUAGE_MAP[language];
  const prompt = `Explain the following text in simple terms, suitable for a beginner. 
  Use analogies where helpful. Break down complex jargon.
  
  IMPORTANT: Write the explanation in ${langName} language.
  
  Text to simplify:
  ${text.slice(0, 30000)}`; 

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST, 
      contents: prompt,
    });

    return response.text || "Could not generate simplification.";
  } catch (error) {
    console.error("Error simplifying text:", error);
    throw error;
  }
};

export const createChatSession = (initialContext: string, language: Language = 'en'): Chat => {
  const langName = LANGUAGE_MAP[language];
  return ai.chats.create({
    model: MODEL_COMPLEX, 
    config: {
      systemInstruction: `You are an intelligent study assistant named Cognos. 
      You are helpful, encouraging, and precise. 
      The user has provided the following study material context. 
      Answer their questions based on this context primarily, but use your general knowledge to fill in gaps.
      
      IMPORTANT: Converse with the user in ${langName} language.
      
      Study Material Context:
      ${initialContext.slice(0, 100000)}` 
    }
  });
};
