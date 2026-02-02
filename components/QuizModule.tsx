import React, { useState } from 'react';
import { QuizItem, Language } from '../types';
import { CheckCircle, XCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { translations } from '../translations';

interface QuizModuleProps {
  quiz: QuizItem[];
  onRegenerate: () => void;
  isGenerating: boolean;
  language: Language;
}

const QuizModule: React.FC<QuizModuleProps> = ({ quiz, onRegenerate, isGenerating, language }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const t = translations[language].quiz;

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === quiz[currentQuestion].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (quiz.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>{t.noData}</p>
        <button 
          onClick={onRegenerate}
          disabled={isGenerating}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isGenerating ? t.generating : t.generate}
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-4 text-indigo-900">{t.completed}</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">
          {Math.round((score / quiz.length) * 100)}%
        </div>
        <p className="text-gray-600 mb-8">{t.youGot} {score} {t.correct}.</p>
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={resetQuiz}
            className="flex items-center gap-2 px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium"
          >
            <RefreshCw size={20} /> {t.retry}
          </button>
          <button 
            onClick={onRegenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
          >
            {isGenerating ? t.generating : t.new}
          </button>
        </div>
      </div>
    );
  }

  const question = quiz[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500">{t.question} {currentQuestion + 1} / {quiz.length}</span>
        <span className="text-sm font-medium text-indigo-600">{t.score}: {score}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
        ></div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
        {question.question}
      </h3>

      <div className="space-y-3 mb-8">
        {question.options.map((option, idx) => {
          let optionClass = "w-full p-4 text-left rounded-lg border-2 transition-all ";
          
          if (selectedOption === null) {
            optionClass += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
          } else {
            if (idx === question.correctAnswerIndex) {
              optionClass += "border-green-500 bg-green-50 text-green-900";
            } else if (idx === selectedOption) {
              optionClass += "border-red-500 bg-red-50 text-red-900";
            } else {
              optionClass += "border-gray-200 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={selectedOption !== null}
              className={optionClass}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selectedOption !== null && idx === question.correctAnswerIndex && (
                  <CheckCircle size={20} className="text-green-600" />
                )}
                {selectedOption !== null && idx === selectedOption && idx !== question.correctAnswerIndex && (
                  <XCircle size={20} className="text-red-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6 animate-fade-in">
          <p className="font-semibold text-blue-900 mb-1">{t.explanation}</p>
          <p className="text-blue-800">{question.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={selectedOption === null}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {currentQuestion === quiz.length - 1 ? t.finish : t.next} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default QuizModule;