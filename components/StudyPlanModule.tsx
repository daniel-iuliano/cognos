import React from 'react';
import { StudyPlan, Language } from '../types';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { translations } from '../translations';

interface StudyPlanModuleProps {
  plan: StudyPlan | null;
  onRegenerate: () => void;
  isGenerating: boolean;
  language: Language;
}

const StudyPlanModule: React.FC<StudyPlanModuleProps> = ({ plan, onRegenerate, isGenerating, language }) => {
  const t = translations[language].plan;

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Calendar size={48} className="mb-4 opacity-20" />
        <p>{t.noData}</p>
        <button 
          onClick={onRegenerate}
          disabled={isGenerating}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isGenerating ? t.designing : t.create}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 border-b pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h2>
        <p className="text-gray-600 italic">{t.goal} {plan.goal}</p>
      </div>

      <div className="space-y-6">
        {plan.items.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            {item.priority === 'High' && (
              <div className="absolute top-0 right-0 bg-red-100 text-red-700 px-3 py-1 rounded-bl-lg text-xs font-bold uppercase flex items-center gap-1">
                <AlertCircle size={12} /> {t.priority}
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 flex md:flex-col items-center gap-2 md:w-24 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
                <span className="text-xs uppercase tracking-wide text-gray-400 font-bold">{t.week}</span>
                <span className="text-3xl font-black text-indigo-600">{item.week}</span>
              </div>
              
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.topic}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                    <Clock size={14} />
                    <span>{item.estimatedHours} {t.hours}</span>
                  </div>
                  {item.priority !== 'High' && (
                     <span className={`px-2 py-1 rounded text-xs font-medium border
                      ${item.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-green-50 text-green-700 border-green-100'}
                     `}>
                       {item.priority} {t.priority}
                     </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
         <button 
          onClick={onRegenerate}
          disabled={isGenerating}
          className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 transition-colors"
        >
          {isGenerating ? t.refining : t.regenerate}
        </button>
      </div>
    </div>
  );
};

export default StudyPlanModule;