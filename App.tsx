import React, { useState, useRef, useEffect } from 'react';
import { Upload, BookOpen, BrainCircuit, Calendar, Layers, FileText, ChevronRight, MessageCircle, Globe, Loader2, Key } from 'lucide-react';
import { AppMode, QuizItem, Flashcard, StudyPlan, StudyContext, Language } from './types';
import * as GeminiService from './services/geminiService';
import { parseFile } from './services/fileParser';
import { translations } from './translations';

// Components
import QuizModule from './components/QuizModule';
import FlashcardModule from './components/FlashcardModule';
import StudyPlanModule from './components/StudyPlanModule';
import ChatAssistant from './components/ChatAssistant';

interface AIStudioClient {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

const getAIStudio = (): AIStudioClient | undefined => {
  return (window as any).aistudio;
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.UPLOAD);
  const [context, setContext] = useState<StudyContext | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  // Data States
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [simplifiedText, setSimplifiedText] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      const aiStudio = getAIStudio();
      if (aiStudio) {
        try {
          const hasKey = await aiStudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } catch (e) {
          console.error("Error checking API key:", e);
          setHasApiKey(false);
        }
      }
      setIsCheckingKey(false);
    };
    checkKey();
  }, []);

  const handleConnectApiKey = async () => {
    const aiStudio = getAIStudio();
    if (aiStudio) {
      try {
        await aiStudio.openSelectKey();
        // Assume success if no error thrown
        setHasApiKey(true);
      } catch (e) {
        console.error("Failed to select key:", e);
        // Error handling as per instructions
        // If "Requested entity was not found" error, reset state
        // Here we just log and user can try again
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const text = await parseFile(file);
      
      if (!text || text.trim().length === 0) {
        throw new Error("Could not extract text from the file. It might be empty or scanned (image-based).");
      }

      setContext({
        rawText: text,
        fileName: file.name,
        lastUpdated: Date.now()
      });
      setMode(AppMode.DASHBOARD);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process file.");
    } finally {
      setIsProcessing(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTextPaste = (text: string) => {
     setContext({
        rawText: text,
        fileName: "Pasted Text",
        lastUpdated: Date.now()
      });
      setMode(AppMode.DASHBOARD);
  };

  const handleError = (e: any, defaultMsg: string) => {
    // If the error suggests the key is invalid or missing (404/403 often related to key issues in this context)
    // or specifically "Requested entity was not found"
    const errMsg = e?.message || "";
    if (errMsg.includes("Requested entity was not found") || errMsg.includes("API key")) {
      setHasApiKey(false);
      setError("API Key connection failed. Please connect your key again.");
    } else {
      setError(defaultMsg);
    }
  };

  const generateQuiz = async () => {
    if (!context) return;
    setIsProcessing(true);
    try {
      const data = await GeminiService.generateQuizFromText(context.rawText, language);
      setQuiz(data);
    } catch (e) {
      handleError(e, "Failed to generate quiz. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateFlashcards = async () => {
    if (!context) return;
    setIsProcessing(true);
    try {
      const data = await GeminiService.generateFlashcardsFromText(context.rawText, language);
      setFlashcards(data);
    } catch (e) {
      handleError(e, "Failed to generate flashcards.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePlan = async () => {
    if (!context) return;
    setIsProcessing(true);
    try {
      const data = await GeminiService.generateStudyPlanFromText(context.rawText, language);
      setStudyPlan(data);
    } catch (e) {
      handleError(e, "Failed to generate study plan.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSimplification = async () => {
    if (!context) return;
    setIsProcessing(true);
    try {
      const text = await GeminiService.simplifyText(context.rawText, language);
      setSimplifiedText(text);
    } catch (e) {
      handleError(e, "Failed to simplify text.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Switcher for tool activation (load data if not present)
  const switchMode = (newMode: AppMode) => {
    setMode(newMode);
    if (newMode === AppMode.QUIZ && quiz.length === 0) generateQuiz();
    if (newMode === AppMode.FLASHCARDS && flashcards.length === 0) generateFlashcards();
    if (newMode === AppMode.PLAN && !studyPlan) generatePlan();
    if (newMode === AppMode.SIMPLIFY && !simplifiedText) generateSimplification();
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.UPLOAD:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-2xl w-full border border-gray-100">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                <BrainCircuit size={40} />
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{t.appTitle}</h1>
              <p className="text-xl text-gray-500 mb-8">{t.uploadDesc}</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    alert(t.formatAlert);
                    fileInputRef.current?.click();
                  }}
                  disabled={isProcessing}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <Upload size={20} />} 
                  {isProcessing ? "Processing File..." : t.uploadBtn}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".txt,.pdf,.docx" 
                  onChange={handleFileUpload}
                />
                
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">{t.or}</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <textarea 
                  className="w-full h-32 p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm"
                  placeholder={t.pastePlaceholder}
                  onBlur={(e) => {
                    if (e.target.value.trim().length > 10) handleTextPaste(e.target.value);
                  }}
                ></textarea>
              </div>
              {error && <p className="mt-4 text-red-500 text-sm font-medium">{error}</p>}
            </div>
          </div>
        );

      case AppMode.DASHBOARD:
        return (
          <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboardWelcome}</h2>
              <p className="text-gray-500">{t.studying} <span className="font-semibold text-indigo-600">{context?.fileName}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ToolCard 
                icon={<BookOpen size={24} />}
                title={t.tools.quiz.title}
                desc={t.tools.quiz.desc}
                onClick={() => switchMode(AppMode.QUIZ)}
                color="bg-blue-500"
              />
              <ToolCard 
                icon={<Layers size={24} />}
                title={t.tools.flashcards.title}
                desc={t.tools.flashcards.desc}
                onClick={() => switchMode(AppMode.FLASHCARDS)}
                color="bg-emerald-500"
              />
              <ToolCard 
                icon={<Calendar size={24} />}
                title={t.tools.plan.title}
                desc={t.tools.plan.desc}
                onClick={() => switchMode(AppMode.PLAN)}
                color="bg-purple-500"
              />
              <ToolCard 
                icon={<FileText size={24} />}
                title={t.tools.simplify.title}
                desc={t.tools.simplify.desc}
                onClick={() => switchMode(AppMode.SIMPLIFY)}
                color="bg-orange-500"
              />
            </div>
          </div>
        );
      
      case AppMode.QUIZ:
        return <QuizModule quiz={quiz} onRegenerate={generateQuiz} isGenerating={isProcessing} language={language} />;

      case AppMode.FLASHCARDS:
        return <FlashcardModule cards={flashcards} onRegenerate={generateFlashcards} isGenerating={isProcessing} language={language} />;
        
      case AppMode.PLAN:
        return <StudyPlanModule plan={studyPlan} onRegenerate={generatePlan} isGenerating={isProcessing} language={language} />;

      case AppMode.SIMPLIFY:
        return (
           <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
             <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
               <FileText className="text-orange-500"/> {t.simplify.title}
             </h2>
             {isProcessing ? (
               <div className="flex items-center justify-center h-40 text-gray-500">
                 <p className="animate-pulse">{t.simplify.analyzing}</p>
               </div>
             ) : (
               <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                 {simplifiedText || t.simplify.placeholder}
               </div>
             )}
             <div className="mt-8 text-right">
                <button 
                  onClick={generateSimplification}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  {t.simplify.regenerate}
                </button>
             </div>
           </div>
        );

      default:
        return <div>Not Implemented</div>;
    }
  };

  if (isCheckingKey) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  // API Key Connection Modal
  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100 text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <Key size={36} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">{t.apiKey.title}</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {t.apiKey.desc}
          </p>
          <button 
            onClick={handleConnectApiKey}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2 mb-6"
          >
            <BrainCircuit size={20} />
            {t.apiKey.connectBtn}
          </button>
          
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline"
          >
            {t.apiKey.billing}
          </a>

          {/* Language Selector in Modal */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
             <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md">
                 <Globe size={16} className="text-gray-500" />
                 <select 
                   value={language} 
                   onChange={(e) => {
                     setLanguage(e.target.value as Language);
                   }}
                   className="bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer"
                 >
                   <option value="en">English</option>
                   <option value="es">Español</option>
                   <option value="fr">Français</option>
                   <option value="de">Deutsch</option>
                   <option value="pt">Português</option>
                   <option value="zh">中文</option>
                 </select>
               </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setMode(context ? AppMode.DASHBOARD : AppMode.UPLOAD)}>
              <div className="bg-indigo-600 p-1.5 rounded-lg mr-2">
                <BrainCircuit className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">{t.appTitle}</span>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Language Selector */}
               <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md">
                 <Globe size={16} className="text-gray-500" />
                 <select 
                   value={language} 
                   onChange={(e) => {
                     setLanguage(e.target.value as Language);
                   }}
                   className="bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer"
                 >
                   <option value="en">English</option>
                   <option value="es">Español</option>
                   <option value="fr">Français</option>
                   <option value="de">Deutsch</option>
                   <option value="pt">Português</option>
                   <option value="zh">中文</option>
                 </select>
               </div>

               {context && (
                 <>
                   <button 
                      onClick={() => setMode(AppMode.DASHBOARD)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hidden sm:block ${mode === AppMode.DASHBOARD ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      {t.nav.dashboard}
                    </button>
                    <button 
                      onClick={() => {
                         setContext(null);
                         setMode(AppMode.UPLOAD);
                         setQuiz([]);
                         setFlashcards([]);
                         setStudyPlan(null);
                         setSimplifiedText("");
                      }}
                      className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                      {t.nav.uploadNew}
                    </button>
                 </>
               )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {renderContent()}
      </main>

      {/* Floating Chat Button */}
      {context && (
        <>
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all z-40 hover:scale-105"
          >
             {isChatOpen ? <ChevronRight size={24} /> : <MessageCircle size={24} />}
          </button>
          
          <ChatAssistant 
             contextText={context.rawText} 
             isOpen={isChatOpen} 
             onClose={() => setIsChatOpen(false)}
             language={language}
          />
        </>
      )}
    </div>
  );
};

// Helper Component for Dashboard Cards
const ToolCard: React.FC<{icon: React.ReactNode, title: string, desc: string, onClick: () => void, color: string}> = ({ icon, title, desc, onClick, color }) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group w-full"
  >
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{desc}</p>
  </button>
);

export default App;