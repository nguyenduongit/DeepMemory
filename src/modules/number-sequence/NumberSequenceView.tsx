import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Brain,
  Check,
  Clock3,
  Eye,
  Play,
  RotateCcw,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { getModuleById } from '../../core/module/module-registry';
import { generateBestTimeKey } from '../../core/training/scoring';
import { formatDuration } from '../../core/training/timer';
import { SessionAnswer, TrainingSession } from '../../core/training/training-types';
import { useAppStore } from '../../stores/useAppStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { NumberMemoryItem } from '../numbers/types';
import {
  generateDigitSequence,
  sanitizeDigitInput,
  scoreDigitRecall,
} from './engine';
import {
  NUMBER_SEQUENCE_LENGTHS,
  NumberSequenceLength,
  NumberSequenceResult,
  NumberSequenceScreen,
} from './types';

const MODULE_ID = 'numbers-00-99';
const MODE_ID = 'number-sequence';
const EMPTY_NUMBER_ITEMS: NumberMemoryItem[] = [];

function sequenceGroupId(length: number): string {
  return `${length}-digits`;
}

function ElapsedTimer({ startedAt }: { startedAt: number }) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const updateElapsed = () => setElapsedMs(Date.now() - startedAt);
    updateElapsed();
    const intervalId = window.setInterval(updateElapsed, 100);
    return () => window.clearInterval(intervalId);
  }, [startedAt]);

  return <>{formatDuration(elapsedMs)}</>;
}

function ContinuousSequence({ sequence }: { sequence: string }) {
  return (
    <p className="break-all font-mono text-2xl font-black leading-relaxed tracking-normal text-white sm:text-3xl">
      {sequence}
    </p>
  );
}

function ComparisonRow({
  label,
  value,
  expected,
}: {
  label: string;
  value: string;
  expected?: string;
}) {
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2">
      <span className="pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <div className="flex flex-wrap font-mono text-sm font-bold leading-relaxed">
        {Array.from(value).map((digit, index) => {
          const isWrong = expected !== undefined && digit !== expected[index];
          return (
            <span key={index} className={isWrong ? 'rounded bg-rose-500/20 text-rose-300' : 'text-slate-200'}>
              {digit}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export const NumberSequenceView: React.FC = () => {
  const module = getModuleById(MODULE_ID);
  const numberItems = (module?.items ?? EMPTY_NUMBER_ITEMS) as NumberMemoryItem[];
  const { goBack } = useAppStore();
  const { bestTimesMap, loadModuleProgress, recordSessionCompletion } = useProgressStore();
  const [screen, setScreen] = useState<NumberSequenceScreen>('home');
  const [length, setLength] = useState<NumberSequenceLength>(20);
  const [sequence, setSequence] = useState('');
  const [recalled, setRecalled] = useState('');
  const [startedAt, setStartedAt] = useState(0);
  const [memoryDuration, setMemoryDuration] = useState(0);
  const [result, setResult] = useState<NumberSequenceResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewBestTime, setIsNewBestTime] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadModuleProgress(MODULE_ID);
  }, [loadModuleProgress]);

  useEffect(() => {
    if (screen === 'recall') inputRef.current?.focus();
  }, [screen]);

  const title = screen === 'home'
    ? 'Thi đấu nhớ số'
    : screen === 'memorize'
      ? 'Ghi nhớ dãy số'
      : screen === 'recall'
        ? 'Nhập lại dãy số'
        : 'Kết quả';

  const startChallenge = () => {
    const nextSequence = generateDigitSequence(length);
    setSequence(nextSequence);
    setRecalled('');
    setResult(null);
    setIsNewBestTime(false);
    setMemoryDuration(0);
    setStartedAt(Date.now());
    setScreen('memorize');
  };

  const beginRecall = () => {
    const duration = Math.max(1, Date.now() - startedAt);
    setMemoryDuration(duration);
    setScreen('recall');
  };

  const submitRecall = async () => {
    if (recalled.length !== sequence.length || isSaving) return;

    const scored = scoreDigitRecall(sequence, recalled, memoryDuration);
    setResult(scored);
    setScreen('result');
    setIsSaving(true);

    const completedAt = new Date().toISOString();
    const session: TrainingSession = {
      id: crypto.randomUUID(),
      moduleId: MODULE_ID,
      modeId: MODE_ID,
      groupId: sequenceGroupId(length),
      totalQuestions: length,
      correctAnswers: scored.correctCount,
      wrongAnswers: length - scored.correctCount,
      accuracy: scored.accuracy,
      durationMs: memoryDuration,
      completedAt,
    };
    const answers: SessionAnswer[] = Array.from({ length: sequence.length / 2 }, (_, pairIndex) => {
      const startIndex = pairIndex * 2;
      const expectedPair = sequence.slice(startIndex, startIndex + 2);
      const recalledPair = recalled.slice(startIndex, startIndex + 2);
      return {
        questionId: `pair-${pairIndex}`,
        itemId: expectedPair,
        selectedOptionId: recalledPair,
        correctOptionId: expectedPair,
        isCorrect: recalledPair === expectedPair,
        reactionMs: 0,
      };
    });

    try {
      const saved = await recordSessionCompletion(session, answers, numberItems.length);
      setIsNewBestTime(saved.isNewBestTime);
    } finally {
      setIsSaving(false);
    }
  };

  const back = () => {
    if (screen === 'home') goBack();
    else setScreen('home');
  };

  if (!module || numberItems.length !== 100) {
    return <div className="grid h-full place-items-center px-6 text-center text-slate-400">Dữ liệu thi đấu nhớ số chưa đầy đủ.</div>;
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="app-header">
        <Header title={title} subtitle="Thi đấu" showBack onBack={back} />
      </div>

      <div className="app-scroll min-h-0 flex-1">
        <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-5 pb-24 sm:px-6">
          {screen === 'home' ? (
            <>
              <div className="relative overflow-hidden rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/15 via-indigo-500/10 to-slate-900 p-6">
                <div className="relative z-10 flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                    <Brain className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-black text-white">Nhớ nhanh, nhập chính xác</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      Ghép mỗi 2 chữ số thành một hình trong hệ 00–99, nối các hình thành câu chuyện rồi đặt vào cung điện trí nhớ.
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">Độ dài thử thách</p>
                    <h3 className="font-display text-lg font-black text-white">Chọn số chữ số</h3>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-slate-600" />
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {NUMBER_SEQUENCE_LENGTHS.map((value) => {
                    const recordKey = generateBestTimeKey(MODULE_ID, MODE_ID, sequenceGroupId(value), value);
                    const best = bestTimesMap[recordKey];
                    const selected = length === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setLength(value)}
                        className={`rounded-2xl border px-4 py-3 text-left transition-all active:scale-[0.98] ${selected ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-950/30' : 'border-slate-800 bg-slate-950/70'}`}
                      >
                        <strong className={`block font-mono text-2xl font-black ${selected ? 'text-cyan-300' : 'text-white'}`}>{value}</strong>
                        <span className="text-[11px] font-semibold text-slate-500">chữ số</span>
                        <span className={`mt-1 flex min-h-4 items-center gap-1 text-[10px] font-bold ${best ? 'text-amber-400' : 'text-slate-700'}`}>
                          <Trophy className="h-3 w-3" /> {best ? formatDuration(best.durationMs) : 'Chưa có kỷ lục'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button size="lg" fullWidth className="min-h-16 bg-cyan-600 hover:bg-cyan-500" onClick={startChallenge} leftIcon={<Play className="h-5 w-5 fill-white" />}>
                BẮT ĐẦU THỬ THÁCH {length} SỐ
              </Button>
            </>
          ) : null}

          {screen === 'memorize' ? (
            <div className="flex min-h-[calc(100dvh-10rem)] flex-col gap-4">
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
                <span className="text-xs font-bold text-slate-400">{length} CHỮ SỐ</span>
                <span className="flex items-center gap-2 font-mono text-lg font-black text-cyan-300"><Clock3 className="h-4 w-4" /> <ElapsedTimer startedAt={startedAt} /></span>
              </div>
              <div className="min-h-0 flex-1 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
                <ContinuousSequence sequence={sequence} />
              </div>
              <Button size="lg" fullWidth className="min-h-14" onClick={beginRecall} leftIcon={<Eye className="h-5 w-5" />}>
                TÔI ĐÃ NHỚ XONG
              </Button>
            </div>
          ) : null}

          {screen === 'recall' ? (
            <div className="space-y-5">
              <div className="rounded-3xl border border-indigo-500/25 bg-indigo-500/10 p-5 text-center">
                <p className="text-sm font-bold text-white">Nhập lại toàn bộ dãy số theo đúng thứ tự</p>
                <p className="mt-1 text-xs text-slate-400">Thời gian nhập không tính vào kỷ lục.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                <div className="mb-3 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">ĐÃ NHẬP</span>
                  <span className={recalled.length === length ? 'text-emerald-400' : 'text-indigo-300'}>{recalled.length} / {length}</span>
                </div>
                <textarea
                  ref={inputRef}
                  value={recalled}
                  inputMode="numeric"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-label="Nhập dãy số đã ghi nhớ"
                  onChange={(event) => setRecalled(sanitizeDigitInput(event.target.value, length))}
                  className="h-56 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-4 font-mono text-2xl font-black leading-relaxed tracking-normal text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Nhập dãy số…"
                />
              </div>
              <Button size="lg" fullWidth disabled={recalled.length !== length || isSaving} onClick={submitRecall} leftIcon={<Check className="h-5 w-5" />}>
                CHẤM KẾT QUẢ
              </Button>
            </div>
          ) : null}

          {screen === 'result' && result ? (
            <div className="space-y-5">
              <div className={`rounded-3xl border p-6 text-center ${result.accuracy === 100 ? 'border-amber-500/30 bg-gradient-to-b from-amber-500/15 to-slate-900' : 'border-slate-800 bg-slate-900'}`}>
                <Trophy className={`mx-auto h-12 w-12 ${result.accuracy === 100 ? 'text-amber-400' : 'text-slate-600'}`} />
                <h2 className="mt-3 text-4xl font-black text-white">{result.accuracy}%</h2>
                <p className="mt-1 text-sm text-slate-400">{result.correctCount} / {length} vị trí chính xác</p>
                {isSaving ? <p className="mt-3 text-xs text-slate-500">Đang lưu kết quả…</p> : null}
                {!isSaving && isNewBestTime ? <p className="mt-3 font-bold text-amber-400">Kỷ lục mới!</p> : null}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3"><strong className="block font-mono text-sm text-white">{formatDuration(result.durationMs)}</strong><span className="text-[10px] text-slate-500">Ghi nhớ</span></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3"><strong className="block text-sm text-white">{result.firstErrorIndex === null ? 'Không có' : result.firstErrorIndex + 1}</strong><span className="text-[10px] text-slate-500">Lỗi đầu</span></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3"><strong className="block text-sm text-white">{result.longestStreak}</strong><span className="text-[10px] text-slate-500">Chuỗi đúng</span></div>
              </div>

              <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900 p-4">
                <ComparisonRow label="Đề bài" value={sequence} />
                <div className="h-px bg-slate-800" />
                <ComparisonRow label="Đã nhập" value={recalled} expected={sequence} />
              </div>

              <p className="text-center text-xs text-slate-500">Chỉ kết quả đúng 100% mới được công nhận là kỷ lục thời gian.</p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={() => setScreen('home')} leftIcon={<ArrowLeft className="h-4 w-4" />}>Trang chính</Button>
                <Button onClick={startChallenge} leftIcon={<RotateCcw className="h-4 w-4" />}>Thử dãy mới</Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
