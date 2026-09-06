import React, { useEffect, useCallback } from 'react';
import { useTrainingStore } from '../../stores/useTrainingStore';
import { useAppStore } from '../../stores/useAppStore';
import { getModuleById } from '../../core/module/module-registry';
import { PageContainer } from '../../components/layout/PageContainer';
import { QuestionCard } from '../../components/quiz/QuestionCard';
import { OptionButton } from '../../components/quiz/OptionButton';
import { QuizProgress } from '../../components/quiz/QuizProgress';
import { X } from 'lucide-react';

interface TrainingSessionViewProps {
  moduleId: string;
}

export const TrainingSessionView: React.FC<TrainingSessionViewProps> = ({ moduleId }) => {
  const {
    status,
    questions,
    currentQuestionIndex,
    startedAt,
    answerLocked,
    startSession,
    answerQuestion,
    resetSession,
  } = useTrainingStore();

  const { navigate } = useAppStore();
  const module = getModuleById(moduleId);

  // Auto start session on mount if status is preparing
  useEffect(() => {
    if (status === 'preparing') {
      startSession();
    }
  }, [status, startSession]);

  // When session completes, navigate to result screen
  useEffect(() => {
    if (status === 'completed') {
      navigate({ name: 'result', moduleId });
    }
  }, [status, moduleId, navigate]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = useCallback(
    (optionId: string) => {
      answerQuestion(optionId);
    },
    [answerQuestion]
  );

  // Keyboard shortcut listener: Keys 1, 2, 3, 4 (Section 24)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (answerLocked || status !== 'running' || !currentQuestion) return;

      const keyIndex = parseInt(e.key, 10) - 1;
      if (keyIndex >= 0 && keyIndex < currentQuestion.options.length) {
        e.preventDefault();
        const selectedOption = currentQuestion.options[keyIndex];
        if (selectedOption) {
          handleSelectOption(selectedOption.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answerLocked, status, currentQuestion, handleSelectOption]);

  const handleExit = () => {
    if (window.confirm('Bạn có chắc chắn muốn dừng phiên luyện tập này?')) {
      resetSession();
      navigate({ name: 'module-home', moduleId });
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 font-medium text-sm">Đang tải câu hỏi...</div>
      </div>
    );
  }

  // Find corresponding item for fallback text if available
  const associatedItem = module?.items.find(
    (it: any) => it.id === currentQuestion.itemId
  ) as any;

  return (
    <div className="min-h-screen pb-12 flex flex-col justify-between bg-slate-950">
      {/* Top Session Progress Bar */}
      <div className="w-full bg-slate-950/90 border-b border-slate-800/80 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <QuizProgress
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              startedAt={startedAt}
              isRunning={status === 'running'}
            />
          </div>

          <button
            onClick={handleExit}
            aria-label="Thoát phiên luyện tập"
            className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Quiz Area (Max-width 720-800px per Section 58) */}
      <PageContainer maxWidth="md" className="flex-1 flex flex-col justify-center py-4 space-y-6">
        {/* Question visual/text card */}
        <div className="w-full">
          <QuestionCard
            question={currentQuestion.question}
            fallbackTitle={associatedItem?.number}
            fallbackSubtitle={associatedItem?.name}
          />
        </div>

        {/* 2x2 Option Buttons Grid (Section 20) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
          {currentQuestion.options.map((option, idx) => (
            <OptionButton
              key={option.id}
              content={option.content}
              index={idx}
              disabled={answerLocked}
              onSelect={() => handleSelectOption(option.id)}
            />
          ))}
        </div>
      </PageContainer>

      {/* Desktop shortcut footer guide */}
      <div className="hidden sm:block text-center py-2 text-[11px] text-slate-600 font-mono select-none">
        Bấm phím 1, 2, 3, 4 trên bàn phím để phản xạ tức thì
      </div>
    </div>
  );
};
