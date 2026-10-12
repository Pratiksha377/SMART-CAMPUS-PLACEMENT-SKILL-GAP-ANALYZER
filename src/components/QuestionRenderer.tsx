import React from 'react';
import { Question } from '@/types/assessment';
import { Code, Check, FileText } from 'lucide-react';

export interface QuestionRendererProps {
  question: Question;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
  className?: string;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  className = '',
}) => {
  return (
    <div className={`space-y-6 font-sans ${className}`} data-testid="question-renderer">
      {/* Question Header & Prompt */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {question.type.toUpperCase()} • {question.points} Points
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-slate-100 leading-snug">
          {question.text}
        </h3>
      </div>

      {/* MCQ Question Renderer */}
      {question.type === 'mcq' && question.options && (
        <div role="radiogroup" aria-label={question.text} className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = currentAnswer === option;
            const optionLetter = String.fromCharCode(65 + idx);

            return (
              <label
                key={option}
                className={`
                  flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-150 select-none
                  ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-600/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }
                `}
              >
                <div className="flex items-center space-x-3.5">
                  <span
                    className={`
                      w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors
                      ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }
                    `}
                  >
                    {optionLetter}
                  </span>
                  <span
                    className={`text-sm ${
                      isSelected ? 'text-white font-medium' : 'text-slate-300'
                    }`}
                  >
                    {option}
                  </span>
                </div>

                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => onAnswerChange(option)}
                  className="hidden"
                />

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 ml-3">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </label>
            );
          })}
        </div>
      )}

      {/* Coding Question Renderer */}
      {question.type === 'coding' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
              <Code className="w-4 h-4" />
              Code Implementation Editor
            </span>
            <span>TypeScript / JavaScript</span>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 shadow-inner">
            <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">solution.ts</span>
              {question.rubric && (
                <span className="text-[11px] text-slate-500">{question.rubric}</span>
              )}
            </div>
            <textarea
              rows={9}
              value={currentAnswer || question.sampleCode || ''}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="// Write your code implementation here..."
              className="w-full bg-slate-950 p-4 font-mono text-xs text-indigo-200 placeholder:text-slate-600 focus:outline-none resize-y selection:bg-indigo-500/40"
            />
          </div>
        </div>
      )}

      {/* Essay / Conceptual Question Renderer */}
      {question.type === 'essay' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <FileText className="w-4 h-4" />
              Written Technical Explanation
            </span>
            <span>{currentAnswer ? currentAnswer.trim().split(/\s+/).length : 0} words</span>
          </div>

          <textarea
            rows={6}
            value={currentAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Provide a clear, detailed technical explanation addressing the core principles..."
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;
