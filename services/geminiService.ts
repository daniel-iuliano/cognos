
import { QuizItem, Flashcard, StudyPlan, Language } from '../types';

// ------------------------------------------------------------------
// Local Heuristics & Helpers
// ------------------------------------------------------------------

// Helper to split text into clean sentences
const getSentences = (text: string): string[] => {
  return text
    .replace(/\s+/g, ' ')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 300); // Filter too short/long noise
};

// Heuristic to identify "definition" style sentences
// e.g. "Photosynthesis is the process..."
const isDefinition = (sentence: string): boolean => {
  const indicators = [" is ", " are ", " refers to ", " defined as ", " means ", " consists of "];
  return indicators.some(ind => sentence.includes(ind));
};

// Extract a potential term from a definition sentence
const extractTerm = (sentence: string): string => {
  // Simple heuristic: Take the first few words before the verb
  const indicators = [" is ", " are ", " refers to ", " defined as ", " means "];
  for (const ind of indicators) {
    if (sentence.includes(ind)) {
      const parts = sentence.split(ind);
      if (parts[0].length < 50) return parts[0].trim();
    }
  }
  return "Concept";
};

// Shuffle array
const shuffle = <T>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

// ------------------------------------------------------------------
// Service Functions (Offline Implementations)
// ------------------------------------------------------------------

export const setApiKey = (key: string) => {
  // No-op for offline version
};

export const generateQuizFromText = async (text: string, language: Language = 'en', numQuestions: number = 5): Promise<QuizItem[]> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const sentences = getSentences(text);
  const defs = sentences.filter(isDefinition);
  
  // If not enough definitions, use random sentences
  const pool = defs.length >= numQuestions ? defs : sentences;
  const selected = shuffle(pool).slice(0, numQuestions);

  return selected.map(sentence => {
    const term = extractTerm(sentence);
    // Create a cloze deletion question
    const questionText = sentence.replace(term, "_______");
    
    // Generate distractors from other terms in the text
    const otherTerms = shuffle(sentences)
      .slice(0, 3)
      .map(s => extractTerm(s))
      .filter(t => t !== term && t !== "Concept");
    
    // Fallback if not enough terms found
    while (otherTerms.length < 3) {
      otherTerms.push("Variable"); 
    }

    const options = shuffle([term, ...otherTerms.slice(0, 3)]);

    return {
      question: `Complete the statement: "${questionText}"`,
      options: options,
      correctAnswerIndex: options.indexOf(term),
      explanation: `The full statement is: "${sentence}"`
    };
  });
};

export const generateFlashcardsFromText = async (text: string, language: Language = 'en', count: number = 10): Promise<Flashcard[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const sentences = getSentences(text);
  const defs = sentences.filter(isDefinition);
  const pool = defs.length > 0 ? defs : sentences;
  const selected = shuffle(pool).slice(0, count);

  return selected.map(s => {
    const term = extractTerm(s);
    // Remove the term from the back of the card if it starts the sentence
    let definition = s;
    const indicators = [" is ", " are ", " refers to "];
    for (const ind of indicators) {
      if (s.includes(ind)) {
         const parts = s.split(ind);
         if (parts[0].trim() === term) {
             definition = parts.slice(1).join(ind).trim();
             // Capitalize first letter
             definition = definition.charAt(0).toUpperCase() + definition.slice(1);
         }
      }
    }

    return {
      front: term,
      back: definition,
      category: "General"
    };
  });
};

export const generateStudyPlanFromText = async (text: string, language: Language = 'en'): Promise<StudyPlan> => {
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Extract potential topics based on capitalization or frequency
  const sentences = getSentences(text);
  const topics: string[] = [];
  
  // Simple topic extractor: find capitalized words that appear frequently? 
  // For offline simplicity, we'll just grab subjects from definition sentences or random segments.
  const potentialTopics = sentences
    .filter(isDefinition)
    .map(extractTerm)
    .filter(t => t !== "Concept" && t.length > 3);
    
  const uniqueTopics = Array.from(new Set(potentialTopics));
  const availableTopics = uniqueTopics.length > 0 ? uniqueTopics : ["Fundamentals", "Core Concepts", "Advanced Theory", "Practical Applications"];

  // Ensure we have at least 4 topics
  while (availableTopics.length < 4) {
    availableTopics.push(`Section ${availableTopics.length + 1}`);
  }

  const shuffledTopics = shuffle(availableTopics);

  return {
    title: "Generated Study Plan",
    goal: "Master the key concepts extracted from your document.",
    items: [
      {
        week: 1,
        topic: shuffledTopics[0] || "Introduction & Basics",
        description: "Focus on understanding definitions and vocabulary found in the introductory sections.",
        estimatedHours: 5,
        priority: 'High'
      },
      {
        week: 2,
        topic: shuffledTopics[1] || "Core Mechanisms",
        description: "Deep dive into the structural components and how they relate to the main subject.",
        estimatedHours: 4,
        priority: 'Medium'
      },
      {
        week: 3,
        topic: shuffledTopics[2] || "Analysis & Application",
        description: "Apply the concepts to examples found in the text and practice problem-solving.",
        estimatedHours: 6,
        priority: 'High'
      },
      {
        week: 4,
        topic: shuffledTopics[3] || "Review & Synthesis",
        description: "Review all generated flashcards and quizzes to consolidate memory.",
        estimatedHours: 3,
        priority: 'Low'
      }
    ]
  };
};

export const simplifyText = async (text: string, language: Language = 'en'): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Offline summarization is hard. We will return the most "dense" paragraphs.
  const sentences = getSentences(text);
  
  // Pick the first few sentences and a few random ones from the middle to act as a "digest"
  const intro = sentences.slice(0, 3).join(' ');
  const middle = sentences.slice(Math.floor(sentences.length / 2), Math.floor(sentences.length / 2) + 2).join(' ');
  const conclusion = sentences.slice(-2).join(' ');

  return `**Summary Digest:**\n\n${intro}\n\n...\n\n${middle}\n\n...\n\n${conclusion}\n\n*(Note: This is an offline extraction. Full semantic simplification requires cloud AI.)*`;
};

// Mock Chat implementation
export const createChatSession = (initialContext: string, language: Language = 'en'): any => {
  const sentences = getSentences(initialContext);

  return {
    sendMessageStream: async function* ({ message }: { message: string }) {
      await new Promise(resolve => setTimeout(resolve, 600)); // Thinking delay

      const query = message.toLowerCase();
      
      // 1. Keyword Search
      const keywords = query.split(' ').filter(w => w.length > 4);
      const matches = sentences.filter(s => {
        const lowerS = s.toLowerCase();
        return keywords.some(k => lowerS.includes(k));
      });

      let responseText = "";

      if (matches.length > 0) {
        // Return top 3 matches
        const topMatches = matches.slice(0, 3).join(" ");
        responseText = `Here is what I found in your notes regarding that:\n\n"${topMatches}"`;
      } else if (query.includes("hello") || query.includes("hi")) {
        responseText = "Hello! I am your offline study assistant. Ask me to find specific info in your notes.";
      } else if (query.includes("summary")) {
        responseText = "I can help you review. Look at the Simplify tab for a digest of the text.";
      } else {
        responseText = "I couldn't find a specific match for that in the uploaded text. Try using specific keywords from your document.";
      }

      // Stream the response character by character or chunk by chunk to simulate AI
      const chunkSize = 10;
      for (let i = 0; i < responseText.length; i += chunkSize) {
        await new Promise(resolve => setTimeout(resolve, 20));
        yield { text: responseText.slice(i, i + chunkSize) };
      }
    }
  };
};
