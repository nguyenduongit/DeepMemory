import React, { useState } from 'react';
import { getModuleById } from '../../core/module/module-registry';
import { useAppStore } from '../../stores/useAppStore';
import { useTrainingStore } from '../../stores/useTrainingStore';
import { PageContainer } from '../../components/layout/PageContainer';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Play, Shuffle, ArrowRight } from 'lucide-react';

interface TrainingSetupViewProps {
  moduleId: string;
}

export const TrainingSetupView: React.FC<TrainingSetupViewProps> = ({ moduleId }) => {
  const module = getModuleById(moduleId);
  const { navigate, goBack } = useAppStore();
  const { prepareSession } = useTrainingStore();

  const defaultModeId = module?.trainingModes?.[0]?.id || '';
  const defaultGroupId = module?.groups?.[0]?.id || '';

  const [selectedModeId, setSelectedModeId] = useState(defaultModeId);
  const [selectedGroupId, setSelectedGroupId] = useState(defaultGroupId);
  const [questionCount, setQuestionCount] = useState<number | 'all'>(10);
  const [order, setOrder] = useState<'random' | 'sequential'>('random');

  if (!module) {
    return (
      <PageContainer maxWidth="sm">
        <p className="text-slate-400 text-center">Module không tồn tại.</p>
      </PageContainer>
    );
  }

  const handleStart = () => {
    prepareSession(module, {
      modeId: selectedModeId,
      groupId: selectedGroupId,
      questionCount,
      order,
    });
    navigate({ name: 'training-session', moduleId });
  };

  return (
    <div className="min-h-screen pb-24">
      <Header title={`Luyện ${module.name}`} subtitle="Cấu hình" showBack onBack={goBack} />

      <PageContainer maxWidth="md" className="space-y-6">
        {/* Section 1: Mode Selection (Section 25) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
            Chế độ luyện tập
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {module.trainingModes.map((mode) => {
              const isSelected = selectedModeId === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedModeId(mode.id)}
                  className={`flex flex-col items-start text-left p-4 rounded-2xl border transition-all select-none active:scale-[0.99] cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-950/40'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-display font-black text-base">{mode.name}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                  {mode.description && (
                    <span className="text-xs text-slate-400 leading-snug">
                      {mode.description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Group / Range Selection */}
        {module.groups && module.groups.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
              Phạm vi bài học
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {module.groups.map((group) => {
                const isSelected = selectedGroupId === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`py-2.5 px-3 rounded-xl font-mono font-bold text-xs sm:text-sm border transition-all select-none active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {group.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 3: Question Count (Section 26) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
            Số lượng câu hỏi
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {[10, 20, 50, 'all'].map((count) => {
              const isSelected = questionCount === count;
              const label = count === 'all' ? 'Tất cả' : count.toString();
              return (
                <button
                  key={count.toString()}
                  type="button"
                  onClick={() => setQuestionCount(count as number | 'all')}
                  className={`py-3 rounded-xl font-display font-black text-sm sm:text-base border transition-all select-none active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Question Order */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
            Thứ tự xuất hiện
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOrder('random')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-all active:scale-98 select-none cursor-pointer ${
                order === 'random'
                  ? 'bg-indigo-600/15 border-indigo-500 text-indigo-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <Shuffle className="w-4 h-4" /> Ngẫu nhiên
            </button>
            <button
              type="button"
              onClick={() => setOrder('sequential')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-all active:scale-98 select-none cursor-pointer ${
                order === 'sequential'
                  ? 'bg-indigo-600/15 border-indigo-500 text-indigo-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <ArrowRight className="w-4 h-4" /> Theo thứ tự
            </button>
          </div>
        </div>

        {/* Start Button */}
        <Button
          size="lg"
          variant="primary"
          fullWidth
          leftIcon={<Play className="w-5 h-5 fill-white" />}
          onClick={handleStart}
          className="h-16 text-base"
        >
          BẮT ĐẦU LUYỆN TẬP
        </Button>
      </PageContainer>
    </div>
  );
};
