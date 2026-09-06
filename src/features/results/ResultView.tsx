import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTrainingStore } from '../../stores/useTrainingStore';
import { useAppStore } from '../../stores/useAppStore';
import { PageContainer } from '../../components/layout/PageContainer';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { formatDuration, formatReactionSpeed } from '../../core/training/timer';
import { Trophy, RotateCcw, Home, CheckCircle2, XCircle } from 'lucide-react';

interface ResultViewProps {
  moduleId: string;
}

export const ResultView: React.FC<ResultViewProps> = ({ moduleId }) => {
  const { lastSessionResult, answers, questions, isNewBestTime, resetSession } =
    useTrainingStore();
  const { navigate } = useAppStore();

  const [filterMode, setFilterMode] = useState<'all' | 'wrong'>('all');

  useEffect(() => {
    // Launch celebratory confetti if high score
    if (lastSessionResult && lastSessionResult.accuracy >= 90) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [lastSessionResult]);

  if (!lastSessionResult) {
    return (
      <PageContainer maxWidth="md">
        <div className="text-center py-12">
          <p className="text-slate-400">Không có kết quả session.</p>
          <Button onClick={() => navigate({ name: 'module-home', moduleId })} className="mt-4">
            Về module
          </Button>
        </div>
      </PageContainer>
    );
  }

  const handleRetry = () => {
    resetSession();
    navigate({ name: 'training-setup', moduleId });
  };

  const handleBackToModule = () => {
    resetSession();
    navigate({ name: 'module-home', moduleId });
  };

  const filteredAnswers = answers.filter((a) => {
    if (filterMode === 'wrong') return !a.isCorrect;
    return true;
  });

  return (
    <div className="min-h-screen pb-24 bg-slate-950">
      <Header title="Kết quả luyện tập" showBack onBack={handleBackToModule} />

      <PageContainer maxWidth="md" className="space-y-6">
        {/* Main Result Card (Section 34) */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-slate-950/60">
          {/* New Best Record Banner */}
          {isNewBestTime && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 animate-bounce">
              <Trophy className="w-4 h-4" /> Kỷ lục thời gian mới!
            </div>
          )}

          <h2 className="text-xs font-bold tracking-wider uppercase text-indigo-400 mb-1">
            HOÀN THÀNH
          </h2>

          <div className="font-display font-black text-5xl sm:text-6xl text-white tracking-tight my-2">
            {lastSessionResult.correctAnswers}{' '}
            <span className="text-slate-600 font-normal text-3xl sm:text-4xl">
              / {lastSessionResult.totalQuestions}
            </span>
          </div>

          <div className="font-display font-black text-3xl text-indigo-400 mb-6">
            {lastSessionResult.accuracy}%
          </div>

          {/* Timing Grid */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Tổng thời gian
              </span>
              <span className="font-mono font-bold text-lg text-white">
                {formatDuration(lastSessionResult.durationMs)}
              </span>
            </div>

            <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Tốc độ phản xạ
              </span>
              <span className="font-mono font-bold text-lg text-white">
                {formatReactionSpeed(
                  lastSessionResult.averageReactionMs ||
                    lastSessionResult.durationMs / lastSessionResult.totalQuestions
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Section 34) */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            size="lg"
            variant="secondary"
            fullWidth
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={handleRetry}
          >
            Luyện lại
          </Button>

          <Button
            size="lg"
            variant="primary"
            fullWidth
            leftIcon={<Home className="w-4 h-4" />}
            onClick={handleBackToModule}
          >
            Về module
          </Button>
        </div>

        {/* Review Answers (Section 36) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wide">
              Chi tiết câu trả lời
            </h3>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterMode === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tất cả ({answers.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('wrong')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterMode === 'wrong'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Câu sai ({lastSessionResult.wrongAnswers})
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredAnswers.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                {filterMode === 'wrong'
                  ? 'Tuyệt vời! Không có câu nào bị sai.'
                  : 'Không có dữ liệu câu trả lời.'}
              </div>
            ) : (
              filteredAnswers.map((ans, idx) => {
                const questionObj = questions.find((q) => q.id === ans.questionId);
                const selectedOpt = questionObj?.options.find(
                  (o) => o.id === ans.selectedOptionId
                );
                const correctOpt = questionObj?.options.find((o) => o.isCorrect);

                const renderContentVal = (content?: any) => {
                  if (!content) return '—';
                  if (content.type === 'text') return content.value;
                  return content.alt || 'Hình ảnh';
                };

                return (
                  <div
                    key={`${ans.questionId}-${idx}`}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs ${
                      ans.isCorrect
                        ? 'bg-slate-950/50 border-slate-800/80'
                        : 'bg-rose-950/20 border-rose-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {ans.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}

                      <div className="min-w-0">
                        <div className="font-semibold text-slate-200 flex items-center gap-2">
                          <span>
                            Câu hỏi:{' '}
                            <strong className="text-white font-display text-sm">
                              {renderContentVal(questionObj?.question)}
                            </strong>
                          </span>
                        </div>

                        {!ans.isCorrect ? (
                          <div className="text-[11px] text-slate-400 mt-1 space-x-2">
                            <span>
                              Bạn chọn:{' '}
                              <span className="text-rose-400 font-semibold">
                                {renderContentVal(selectedOpt?.content)}
                              </span>
                            </span>
                            <span>•</span>
                            <span>
                              Đáp án đúng:{' '}
                              <span className="text-emerald-400 font-semibold">
                                {renderContentVal(correctOpt?.content)}
                              </span>
                            </span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Đáp án:{' '}
                            <span className="text-emerald-400 font-semibold">
                              {renderContentVal(correctOpt?.content)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="font-mono text-slate-500 text-[11px] shrink-0">
                      {formatReactionSpeed(ans.reactionMs)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
