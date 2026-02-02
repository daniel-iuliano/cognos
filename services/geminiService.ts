
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { QuizItem, Flashcard, StudyPlan, Language } from '../types';

// ------------------------------------------------------------------
// Global State & Config
// ------------------------------------------------------------------

let genAI: GoogleGenAI | null = null;
let apiKey: string | null = null;

export const setApiKey = (key: string) => {
  if (key && key.trim().length > 0) {
    apiKey = key;
    genAI = new GoogleGenAI({ apiKey: key });
  } else {
    apiKey = null;
    genAI = null;
  }
};

export const isOnline = (): boolean => !!genAI;

// ------------------------------------------------------------------
// Language Data & Templates (Offline Fallbacks)
// ------------------------------------------------------------------

const STOP_WORDS: Record<Language, Set<string>> = {
  en: new Set(["a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "of", "in", "on", "to", "with", "by", "for", "it", "this", "that", "these", "those", "as", "at", "from", "which", "who", "what", "where", "when", "how", "can", "will", "be", "has", "have", "had", "do", "does", "did", "not", "we", "you", "they", "he", "she", "i", "my", "your", "their", "his", "her", "its", "about", "into", "through", "during", "before", "after", "above", "below", "between", "under", "up", "down", "out", "off", "over", "again", "further", "then", "once", "here", "there", "why", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "only", "own", "same", "so", "than", "too", "very", "just", "should", "now", "also", "use", "used", "using", "uses"]),
  es: new Set(["el", "la", "los", "las", "un", "una", "unos", "unas", "y", "o", "pero", "si", "de", "en", "a", "con", "por", "para", "es", "son", "fue", "fueron", "que", "se", "su", "sus", "lo", "al", "del", "como", "más", "este", "esta", "ese", "esa", "esos", "esas", "todo", "toda", "todos", "todas", "muy", "sin", "sobre", "entre", "ya", "cuando", "donde", "quien", "porque", "está", "están", "ser", "haber", "hacer", "también", "además", "así", "entonces", "luego", "bien", "aunque", "esto", "eso", "aquello", "mi", "mis", "tu", "tus", "nos", "vos", "ellos", "ellas"]),
  fr: new Set(["le", "la", "les", "un", "une", "des", "et", "ou", "mais", "si", "de", "en", "à", "avec", "par", "pour", "est", "sont", "été", "que", "qui", "ce", "se", "sa", "ses", "son", "du", "au", "aux", "comme", "plus", "tout", "toute", "très", "sans", "sur", "entre", "quand", "où", "car", "il", "elle", "ils", "elles", "ne", "pas", "avoir", "être", "faire", "cette", "ces", "aussi", "ainsi", "donc"]),
  de: new Set(["der", "die", "das", "den", "dem", "des", "und", "oder", "aber", "wenn", "von", "in", "zu", "mit", "durch", "für", "ist", "sind", "war", "waren", "dass", "das", "sich", "ihr", "ihre", "sein", "seine", "wie", "als", "mehr", "alle", "sehr", "ohne", "über", "unter", "zwischen", "wann", "wo", "wer", "warum", "weil", "es", "sie", "er", "wir", "nicht", "haben", "werden", "können", "auch", "dann", "damit"]),
  pt: new Set(["o", "a", "os", "as", "um", "uma", "uns", "umas", "e", "ou", "mas", "se", "de", "em", "a", "com", "por", "para", "é", "são", "foi", "foram", "que", "se", "seu", "sua", "seus", "suas", "do", "da", "ao", "como", "mais", "este", "esta", "esse", "essa", "todo", "toda", "muito", "sem", "sobre", "entre", "quando", "onde", "quem", "porque", "está", "estão", "ser", "ter", "fazer", "também", "assim", "então"]),
  zh: new Set(["的", "了", "在", "是", "我", "有", "和", "就", "不", "人", "都", "一", "一个", "上", "也", "很", "到", "说", "要", "去", "你", "会", "着", "没有", "看", "好", "自己", "这", "那", "个", "为", "之"])
};

const TEMPLATES: Record<Language, any> = {
  en: {
    fillBlank: 'Fill in the blank: "{0}"',
    explanation: 'The original sentence was: "{0}"',
    contextCat: "Context",
    defCat: "Definition",
    planTitle: "Structured Study Roadmap",
    planGoal: "Master the core vocabulary and concepts extracted from your text.",
    keyTakeaways: "**Key Takeaways (Extracted):**",
    chatCatch: "I didn't catch that. Could you please ask a more specific question about the text?",
    chatIntro: "Hello! I'm ready to help you study your uploaded notes.",
    chatRef: 'Based on your notes: "{0}"',
    chatNoRef: "I couldn't find a specific reference to that in the text. Try using keywords from your document.",
    chatSuggest: 'I suggest checking the Simplify tab, but here is a key thought: "{0}"'
  },
  es: {
    fillBlank: 'Completa el espacio: "{0}"',
    explanation: 'La frase original era: "{0}"',
    contextCat: "Contexto",
    defCat: "Definición",
    planTitle: "Hoja de Ruta de Estudio Estructurada",
    planGoal: "Dominar el vocabulario y los conceptos clave extraídos de su texto.",
    keyTakeaways: "**Puntos Clave (Extraídos):**",
    chatCatch: "No entendí eso. ¿Podrías hacer una pregunta más específica sobre el texto?",
    chatIntro: "¡Hola! Estoy listo para ayudarte a estudiar tus notas.",
    chatRef: 'Basado en tus notas: "{0}"',
    chatNoRef: "No encontré una referencia específica a eso en el texto. Intenta usar palabras clave de tu documento.",
    chatSuggest: 'Sugiero revisar la pestaña Simplificar, pero aquí hay una idea clave: "{0}"'
  },
  fr: {
    fillBlank: 'Remplissez le vide : "{0}"',
    explanation: 'La phrase originale était : "{0}"',
    contextCat: "Contexte",
    defCat: "Définition",
    planTitle: "Feuille de Route d'Étude Structurée",
    planGoal: "Maîtriser le vocabulaire de base et les concepts extraits de votre texte.",
    keyTakeaways: "**Points Clés (Extraits) :**",
    chatCatch: "Je n'ai pas saisi. Pourriez-vous poser une question plus précise sur le texte ?",
    chatIntro: "Bonjour ! Je suis prêt à vous aider à étudier vos notes.",
    chatRef: 'Basé sur vos notes : "{0}"',
    chatNoRef: "Je n'ai pas trouvé de référence spécifique à cela dans le texte. Essayez d'utiliser des mots-clés de votre document.",
    chatSuggest: 'Je suggère de vérifier l\'onglet Simplifier, mais voici une idée clé : "{0}"'
  },
  de: {
    fillBlank: 'Füllen Sie die Lücke: "{0}"',
    explanation: 'Der ursprüngliche Satz lautete: "{0}"',
    contextCat: "Kontext",
    defCat: "Definition",
    planTitle: "Strukturierter Lernplan",
    planGoal: "Beherrschen Sie das Kernvokabular und die Konzepte aus Ihrem Text.",
    keyTakeaways: "**Wichtige Erkenntnisse (Extrahiert):**",
    chatCatch: "Das habe ich nicht verstanden. Könnten Sie bitte eine spezifischere Frage zum Text stellen?",
    chatIntro: "Hallo! Ich bin bereit, Ihnen beim Lernen Ihrer Notizen zu helfen.",
    chatRef: 'Basierend auf Ihren Notizen: "{0}"',
    chatNoRef: "Ich konnte im Text keinen spezifischen Hinweis darauf finden. Versuchen Sie es mit Schlüsselwörtern aus Ihrem Dokument.",
    chatSuggest: 'Ich schlage vor, den Tab Vereinfachen zu prüfen, aber hier ist ein wichtiger Gedanke: "{0}"'
  },
  pt: {
    fillBlank: 'Preencha a lacuna: "{0}"',
    explanation: 'A frase original era: "{0}"',
    contextCat: "Contexto",
    defCat: "Definição",
    planTitle: "Roteiro de Estudo Estruturado",
    planGoal: "Dominar o vocabulário e conceitos fundamentais extraídos do seu texto.",
    keyTakeaways: "**Principais Pontos (Extraídos):**",
    chatCatch: "Não entendi. Poderia fazer uma pergunta mais específica sobre o texto?",
    chatIntro: "Olá! Estou pronto para ajudar você a estudar suas anotações.",
    chatRef: 'Com base em suas anotações: "{0}"',
    chatNoRef: "Não encontrei uma referência específica a isso no texto. Tente usar palavras-chave do seu documento.",
    chatSuggest: 'Sugiro verificar a aba Simplificar, mas aqui está um pensamento chave: "{0}"'
  },
  zh: {
    fillBlank: '填空："{0}"',
    explanation: '原句是："{0}"',
    contextCat: "语境",
    defCat: "定义",
    planTitle: "结构化学习路线图",
    planGoal: "掌握从文本中提取的核心词汇和概念。",
    keyTakeaways: "**主要要点（摘录）：**",
    chatCatch: "我没听懂。请问您能问一个关于文本的具体问题吗？",
    chatIntro: "你好！我准备好帮您学习上传的笔记了。",
    chatRef: '根据您的笔记："{0}"',
    chatNoRef: "我在文中找不到具体的参考。尝试使用文档中的关键词。",
    chatSuggest: '我建议查看简化标签，但这是一个关键想法："{0}"'
  }
};

const DEFINITION_REGEX: Record<Language, RegExp> = {
  en: /^([A-Z][\w\s-]{2,30})(:| is a | is the | refers to | defined as )(.+)/i,
  es: /^([A-ZÁ-Ü][\w\s\u00C0-\u00FF-]{2,30})(:| es un | es una | es el | es la | se refiere a | se define como )(.+)/iu,
  fr: /^([A-Z][\w\s\u00C0-\u00FF-]{2,30})(:| est un | est une | est le | est la | désigne | se définit comme )(.+)/iu,
  de: /^([A-ZÄÖÜ][\w\s\u00C0-\u00FF-]{2,30})(:| ist ein | ist eine | ist der | ist die | bezeichnet | definiert als )(.+)/iu,
  pt: /^([A-ZÁ-Ü][\w\s\u00C0-\u00FF-]{2,30})(:| é um | é uma | é o | é a | refere-se a | definido como )(.+)/iu,
  zh: /^([^\s:：]{2,10})([:：]|是|是指|定义为)(.+)/ 
};

// ------------------------------------------------------------------
// Offline NLP Utilities
// ------------------------------------------------------------------

const formatString = (template: string, ...args: string[]): string => {
  return template.replace(/{(\d+)}/g, (match, number) => {
    return typeof args[number] !== 'undefined' ? args[number] : match;
  });
};

const tokenize = (text: string, lang: Language): string[] => {
  const stopWords = STOP_WORDS[lang] || STOP_WORDS['en'];
  const normalized = text.normalize("NFC").toLowerCase();
  
  if (lang === 'zh') {
    return normalized.split('').filter(char => !stopWords.has(char) && /[\u4e00-\u9fa5a-zA-Z0-9]/.test(char));
  }
  
  // Use Unicode property escapes to handle accented characters correctly
  // \p{L} matches any unicode letter, \p{N} any number
  return normalized
    .replace(/[^\p{L}\p{N}\s-]/gu, " ") 
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
};

const splitSentences = (text: string, lang: Language): string[] => {
  if (lang === 'zh') {
    return text.replace(/([。！？])\s*/g, "$1|").split("|").map(s => s.trim()).filter(s => s.length > 5);
  }
  
  // Normalized text for consistent processing
  const normalized = text.normalize("NFC");
  
  // Split by punctuation followed by uppercase letter (Unicode aware)
  // Covers . ! ? followed by whitespace and an Uppercase Letter (\p{Lu})
  return normalized
    .replace(/([.!?])\s*(?=[\p{Lu}])/gu, "$1|")
    .split("|")
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 500); 
};

const getWordFrequencies = (text: string, lang: Language): Record<string, number> => {
  const tokens = tokenize(text, lang);
  const freq: Record<string, number> = {};
  tokens.forEach(t => freq[t] = (freq[t] || 0) + 1);
  return freq;
};

const getTopKeywords = (text: string, lang: Language, n: number = 20): string[] => {
  const freq = getWordFrequencies(text, lang);
  return Object.entries(freq).sort(([, a], [, b]) => b - a).slice(0, n).map(([w]) => w);
};

const scoreSentence = (sentence: string, freqMap: Record<string, number>, lang: Language): number => {
  const tokens = tokenize(sentence, lang);
  if (tokens.length === 0) return 0;
  const score = tokens.reduce((sum, token) => sum + (freqMap[token] || 0), 0);
  return score / tokens.length;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// ------------------------------------------------------------------
// Main Service Exports (Dual Mode)
// ------------------------------------------------------------------

export const generateQuizFromText = async (text: string, language: Language = 'en', numQuestions: number = 5): Promise<QuizItem[]> => {
  if (isOnline() && genAI) {
    return generateQuizOnline(text, language, numQuestions);
  }
  return generateQuizOffline(text, language, numQuestions);
};

export const generateFlashcardsFromText = async (text: string, language: Language = 'en', count: number = 10): Promise<Flashcard[]> => {
  if (isOnline() && genAI) {
    return generateFlashcardsOnline(text, language, count);
  }
  return generateFlashcardsOffline(text, language, count);
};

export const generateStudyPlanFromText = async (text: string, language: Language = 'en'): Promise<StudyPlan> => {
  if (isOnline() && genAI) {
    return generateStudyPlanOnline(text, language);
  }
  return generateStudyPlanOffline(text, language);
};

export const simplifyText = async (text: string, language: Language = 'en'): Promise<string> => {
  if (isOnline() && genAI) {
    return simplifyTextOnline(text, language);
  }
  return simplifyTextOffline(text, language);
};

export const createChatSession = (initialContext: string, language: Language = 'en'): any => {
  if (isOnline() && genAI) {
    return createChatSessionOnline(initialContext, language);
  }
  return createChatSessionOffline(initialContext, language);
};

// ------------------------------------------------------------------
// Online Implementations (Gemini API)
// ------------------------------------------------------------------

const generateQuizOnline = async (text: string, language: Language, numQuestions: number): Promise<QuizItem[]> => {
  if (!genAI) throw new Error("AI not initialized");
  
  const prompt = `Generate ${numQuestions} multiple-choice quiz questions based on the text below. 
  Language: ${language}. 
  Return JSON format matching the schema.
  
  Text: ${text.substring(0, 30000)}...`; 

  const response = await genAI.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

const generateFlashcardsOnline = async (text: string, language: Language, count: number): Promise<Flashcard[]> => {
  if (!genAI) throw new Error("AI not initialized");

  const prompt = `Generate ${count} flashcards (front/back) from the text. 
  Language: ${language}.
  Return JSON.
  Text: ${text.substring(0, 30000)}...`;

  const response = await genAI.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["front", "back"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

const generateStudyPlanOnline = async (text: string, language: Language): Promise<StudyPlan> => {
  if (!genAI) throw new Error("AI not initialized");

  const prompt = `Create a 4-week study plan based on this text. Language: ${language}. Return JSON.
  Text: ${text.substring(0, 30000)}...`;

  const response = await genAI.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
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
                estimatedHours: { type: Type.INTEGER },
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
              },
              required: ["week", "topic", "description", "estimatedHours", "priority"]
            }
          }
        },
        required: ["title", "goal", "items"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

const simplifyTextOnline = async (text: string, language: Language): Promise<string> => {
  if (!genAI) throw new Error("AI not initialized");
  
  const prompt = `Summarize the following text in a clear, concise manner using bullet points and Markdown formatting. 
  Language: ${language}.
  Text: ${text.substring(0, 30000)}...`;

  const response = await genAI.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  return response.text || "";
};

const createChatSessionOnline = (initialContext: string, language: Language) => {
  if (!genAI) throw new Error("AI not initialized");

  const chat = genAI.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a helpful study assistant. Answer questions based ONLY on the provided context. Context: ${initialContext.substring(0, 30000)}... Language: ${language}`
    }
  });

  return chat;
};

// ------------------------------------------------------------------
// Offline Implementations (Heuristics)
// ------------------------------------------------------------------

const generateQuizOffline = async (text: string, language: Language, numQuestions: number): Promise<QuizItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500)); 

  const sentences = splitSentences(text, language);
  const topKeywords = getTopKeywords(text, language, 50); 
  const t = TEMPLATES[language];

  // Improved Heuristic: Score sentences by keyword density to find "important" facts
  const freqMap = getWordFrequencies(text, language);
  const scoredSentences = sentences
    .map(s => ({ text: s, score: scoreSentence(s, freqMap, language) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, numQuestions * 3); 

  const selected = shuffle(scoredSentences).slice(0, numQuestions);

  return selected.map(({ text: sentence }) => {
    const tokens = tokenize(sentence, language);
    const validKeywords = tokens.filter(t => topKeywords.includes(t));
    
    // Pick the longest keyword as it is often more significant
    const targetWord = validKeywords.sort((a, b) => b.length - a.length)[0] || tokens[0];

    // Escape regex characters
    const escaped = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Use lookbehind/lookahead (or simplified boundaries) to avoid replacing sub-words
    // (?<!\p{L}) checks that the preceding char is NOT a letter.
    // (?!\p{L}) checks that the following char is NOT a letter.
    // This works for "año", "canción" etc. correctly.
    const regex = new RegExp(`(?<!\\p{L})${escaped}(?!\\p{L})`, 'gui');
    
    const questionText = sentence.replace(regex, "_______");

    let distractors = topKeywords.filter(k => k !== targetWord);
    const similarStart = distractors.filter(k => k[0] === targetWord[0]);
    
    distractors = shuffle(similarStart.length >= 3 ? similarStart : distractors).slice(0, 3);
    
    while (distractors.length < 3) {
      distractors.push("variable"); 
    }

    const options = shuffle([targetWord, ...distractors]);

    return {
      question: formatString(t.fillBlank, questionText),
      options: options,
      correctAnswerIndex: options.indexOf(targetWord),
      explanation: formatString(t.explanation, sentence)
    };
  });
};

const generateFlashcardsOffline = async (text: string, language: Language, count: number): Promise<Flashcard[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const sentences = splitSentences(text, language);
  const cards: Flashcard[] = [];
  const usedTerms = new Set<string>();
  const t = TEMPLATES[language];
  const regex = DEFINITION_REGEX[language] || DEFINITION_REGEX['en'];

  // Strategy 1: Regex
  for (const s of sentences) {
    if (cards.length >= count) break;
    const match = s.match(regex);
    if (match) {
      const term = match[1].trim();
      // Only add if term length is reasonable
      if (usedTerms.has(term) || term.split(' ').length > 6) continue;
      
      let def = match[3].trim();
      if (def.endsWith('.') || def.endsWith('。')) def = def.slice(0, -1);
      
      cards.push({ front: term, back: capitalize(def), category: t.defCat });
      usedTerms.add(term);
    }
  }

  // Strategy 2: High Score Context
  if (cards.length < count) {
    const freqMap = getWordFrequencies(text, language);
    const topKeywords = getTopKeywords(text, language, 30);
    const scoredSentences = sentences
      .map(s => ({ text: s, score: scoreSentence(s, freqMap, language) }))
      .sort((a, b) => b.score - a.score);

    for (const item of scoredSentences) {
      if (cards.length >= count) break;
      const tokens = tokenize(item.text, language);
      const keywordsInSentence = tokens.filter(t => topKeywords.includes(t));
      if (keywordsInSentence.length > 0) {
        const term = keywordsInSentence.sort((a, b) => b.length - a.length)[0]; 
        if (usedTerms.has(term)) continue;
        cards.push({ front: capitalize(term), back: item.text, category: t.contextCat });
        usedTerms.add(term);
      }
    }
  }
  return cards;
};

const generateStudyPlanOffline = async (text: string, language: Language): Promise<StudyPlan> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const sentences = splitSentences(text, language);
  const chunkSize = Math.ceil(sentences.length / 4);
  const chunks: string[][] = [[], [], [], []];
  sentences.forEach((s, i) => chunks[Math.min(Math.floor(i / chunkSize), 3)].push(s));

  const planItems = chunks.map((chunkSentences, idx) => {
    const chunkText = chunkSentences.join(" ");
    const keywords = getTopKeywords(chunkText, language, 5);
    const topic = keywords.length > 0 ? capitalize(keywords[0]) : `Section ${idx + 1}`;
    const freqMap = getWordFrequencies(chunkText, language);
    const bestSentence = chunkSentences.reduce((best, current) => scoreSentence(current, freqMap, language) > scoreSentence(best, freqMap, language) ? current : best, chunkSentences[0] || "");
    const desc = bestSentence.length > 100 ? bestSentence.substring(0, 97) + "..." : bestSentence;
    const priorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'High', 'Low'];

    return {
      week: idx + 1,
      topic: topic,
      description: desc || "Review content.",
      estimatedHours: 2 + Math.floor(Math.random() * 4), 
      priority: priorities[idx]
    };
  });

  const t = TEMPLATES[language];
  return { title: t.planTitle, goal: t.planGoal, items: planItems };
};

const simplifyTextOffline = async (text: string, language: Language): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const sentences = splitSentences(text, language);
  const freqMap = getWordFrequencies(text, language);
  const rankedSentences = sentences
    .map((s, index) => ({ text: s, score: scoreSentence(s, freqMap, language), originalIndex: index }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) 
    .sort((a, b) => a.originalIndex - b.originalIndex);
  const summary = rankedSentences.map(item => `• ${item.text}`).join("\n\n");
  const t = TEMPLATES[language];
  return `${t.keyTakeaways}\n\n${summary}`;
};

const createChatSessionOffline = (initialContext: string, language: Language): any => {
  const sentences = splitSentences(initialContext, language);
  const freqMap = getWordFrequencies(initialContext, language);
  const t = TEMPLATES[language];

  return {
    sendMessageStream: async function* ({ message }: { message: string }) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
      const queryTokens = tokenize(message, language);
      
      if (queryTokens.length === 0) {
        yield { text: t.chatCatch };
        return;
      }

      const matches = sentences.map(s => {
        const sTokens = tokenize(s, language);
        const intersection = sTokens.filter(t => queryTokens.includes(t)).length;
        const union = new Set([...sTokens, ...queryTokens]).size;
        let score = union === 0 ? 0 : intersection / union;
        
        if (s.toLowerCase().includes(message.toLowerCase())) score += 0.5;

        return { text: s, score };
      });

      const bestMatches = matches.filter(m => m.score > 0).sort((a, b) => b.score - a.score);

      let response = "";
      if (bestMatches.length > 0) {
        const topText = bestMatches.slice(0, 2).map(m => m.text).join(" ");
        response = formatString(t.chatRef, topText);
      } else {
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.match(/(hello|hi|hola|bonjour|hallo|olá|你好)/)) {
          response = t.chatIntro;
        } else if (lowerMsg.match(/(summary|explain|resumen|résumé|zusammenfassung|resumo|摘要)/)) {
           const topSentence = sentences.map(s => ({ s, score: scoreSentence(s, freqMap, language) })).sort((a, b) => b.score - a.score)[0]?.s || "";
           response = formatString(t.chatSuggest, topSentence);
        } else {
          response = t.chatNoRef;
        }
      }

      const chunkSize = 5;
      for (let i = 0; i < response.length; i += chunkSize) {
        await new Promise(resolve => setTimeout(resolve, 15));
        yield { text: response.slice(i, i + chunkSize) };
      }
    }
  };
};
