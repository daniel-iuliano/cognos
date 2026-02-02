export enum AppMode {
  UPLOAD = 'UPLOAD',
  DASHBOARD = 'DASHBOARD',
  QUIZ = 'QUIZ',
  FLASHCARDS = 'FLASHCARDS',
  PLAN = 'PLAN',
  SIMPLIFY = 'SIMPLIFY',
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'zh';

export interface QuizItem {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
  category?: string;
}

export interface StudyPlanItem {
  week: number;
  topic: string;
  description: string;
  estimatedHours: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface StudyPlan {
  title: string;
  goal: string;
  items: StudyPlanItem[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface StudyContext {
  rawText: string;
  fileName?: string;
  lastUpdated: number;
}
