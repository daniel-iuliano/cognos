import React, { useState } from 'react';
import { Flashcard, Language } from '../types';
import { RotateCw, ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { translations } from '../translations';

interface FlashcardModuleProps {
  cards: Flashcard[];
  onRegenerate: () => void;
  isGenerating: boolean;
  language: Language;
}

const FlashcardModule: React.FC<FlashcardModuleProps> = ({ cards, onRegenerate, isGenerating, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const t = translations[language].flashcards;

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 200);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Layers size={48} className="mb-4 opacity-20" />
        <p>{t.noData}</p>
        <button 
          onClick={onRegenerate}
          disabled={isGenerating}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isGenerating ? t.creating : t.generate}
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto py-8">
      <div className="w-full flex justify-between items-center mb-6 px-2">
        <span className="text-gray-500 font-medium">{t.card} {currentIndex + 1} / {cards.length}</span>
        {currentCard.category && (
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            {currentCard.category}
          </span>
        )}
      </div>

      <div 
        className="relative w-full aspect-[3/2] cursor-pointer perspective-1000 group"
        onClick={handleFlip}
      >
        <div className={`relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute w-full h-full bg-white rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">{t.question}</p>
            <p className="text-2xl text-center font-semibold text-gray-800 leading-relaxed">{currentCard.front}</p>
            <p className="absolute bottom-6 text-xs text-gray-400 flex items-center gap-1">
              <RotateCw size={12} /> {t.clickFlip}
            </p>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full bg-indigo-600 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 border border-indigo-500">
            <p className="text-xs text-indigo-200 uppercase tracking-widest font-bold mb-4">{t.answer}</p>
            <p className="text-xl text-center font-medium text-white leading-relaxed">{currentCard.back}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-10">
        <button 
          onClick={handlePrev}
          className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>
        
        <button
          onClick={handleFlip}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
        >
          {isFlipped ? t.showQuestion : t.showAnswer}
        </button>

        <button 
          onClick={handleNext}
          className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      <div className="mt-12 text-center">
         <button 
          onClick={onRegenerate}
          disabled={isGenerating}
          className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline disabled:opacity-50"
        >
          {isGenerating ? t.creating : t.newDeck}
        </button>
      </div>
    </div>
  );
};

export default FlashcardModule;