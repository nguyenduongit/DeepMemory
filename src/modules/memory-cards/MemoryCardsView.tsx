import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, BookOpen, Brain, Check, ChevronLeft, ChevronRight, Eye, Play, RotateCcw, Trophy, Undo2, Zap } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { getModuleById } from '../../core/module/module-registry';
import { formatDuration } from '../../core/training/timer';
import { SessionAnswer, TrainingSession } from '../../core/training/training-types';
import { useAppStore } from '../../stores/useAppStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { createMemorySequence, scoreRecall, shuffleCards } from './engine';
import { MemoryCardItem, MemoryCardsScreen, RecallResult } from './types';

const LENGTHS = [5, 10, 20, 26, 52];
const EMPTY_CARDS: MemoryCardItem[] = [];

function getTimestamp(): number {
  return Date.now();
}

function CardFace({ card, compact = false }: { card: MemoryCardItem; compact?: boolean }) {
  return (
    <img
      src={card.imageUrl}
      alt={card.name}
      draggable={false}
      className={`block object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.32)] ${compact ? 'h-20 w-14' : 'h-[min(31vh,16rem)] w-auto max-w-full sm:h-[19rem]'}`}
    />
  );
}

function Mnemonic({ card, compact = false }: { card: MemoryCardItem; compact?: boolean }) {
  return (
    <div className={`min-w-0 overflow-hidden border border-indigo-500/30 bg-indigo-500/10 ${compact ? 'rounded-2xl p-2' : 'flex w-full items-center gap-4 rounded-3xl p-3.5 sm:block sm:max-w-52 sm:p-4'}`}>
      <img src={card.mnemonicImageUrl} alt={card.mnemonicName} className={`shrink-0 rounded-2xl object-cover ring-1 ring-white/10 ${compact ? 'mx-auto h-16 w-16' : 'h-24 w-24 sm:mx-auto sm:h-36 sm:w-36'}`} />
      <div className={`${compact ? 'mt-2 text-center' : 'min-w-0 text-left sm:mt-3 sm:text-center'}`}>
        {!compact ? <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-400">Hình liên tưởng</span> : null}
        <strong className={`${compact ? 'font-mono text-indigo-300' : 'block font-mono text-2xl font-black text-indigo-300'}`}>{card.mnemonicNumber}</strong>
        <span className={`${compact ? 'ml-2 text-sm' : 'mt-0.5 block truncate text-base'} font-bold text-white`}>{card.mnemonicName}</span>
      </div>
    </div>
  );
}

function MemoryPair({ card }: { card: MemoryCardItem }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4 shadow-2xl shadow-black/20 sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="relative grid min-w-0 grid-cols-1 items-center justify-items-center gap-3 sm:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] sm:gap-5">
        <div className="flex min-w-0 flex-col items-center">
          <span className="mb-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">{card.name}</span>
          <CardFace card={card} />
        </div>
        <div className="flex items-center justify-center text-indigo-400/70 sm:rotate-[-90deg]">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-500/50" />
          <ArrowDown className="h-5 w-5 shrink-0" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-500/50" />
        </div>
        <Mnemonic card={card} />
      </div>
    </div>
  );
}

export const MemoryCardsView: React.FC = () => {
  const module = getModuleById('memory-cards');
  const cards = (module?.items ?? EMPTY_CARDS) as MemoryCardItem[];
  const { goBack } = useAppStore();
  const { recordSessionCompletion } = useProgressStore();
  const [screen, setScreen] = useState<MemoryCardsScreen>('home');
  const [mappingIndex, setMappingIndex] = useState(0);
  const [length, setLength] = useState(10);
  const [sequence, setSequence] = useState<MemoryCardItem[]>([]);
  const [memoryIndex, setMemoryIndex] = useState(0);
  const [recalled, setRecalled] = useState<MemoryCardItem[]>([]);
  const [startedAt, setStartedAt] = useState(0);
  const [memoryDuration, setMemoryDuration] = useState(0);
  const [result, setResult] = useState<RecallResult | null>(null);
  const [reflexCard, setReflexCard] = useState<MemoryCardItem | null>(null);
  const [reflexOptions, setReflexOptions] = useState<MemoryCardItem[]>([]);
  const [reflexScore, setReflexScore] = useState({ answered: 0, correct: 0 });

  const title = screen === 'home' ? module?.name : screen === 'mapping' ? 'Bảng mã 52 lá' : screen === 'reflex' ? 'Phản xạ mã hóa' : screen === 'memorize' ? 'Ghi nhớ' : screen === 'recall' ? 'Tái hiện thứ tự' : 'Kết quả';

  const nextReflexQuestion = () => {
    const target = shuffleCards(cards)[0];
    if (!target) return;
    const distractors = shuffleCards(cards.filter((card) => card.id !== target.id)).slice(0, 3);
    setReflexCard(target);
    setReflexOptions(shuffleCards([target, ...distractors]));
  };

  const startReflex = () => {
    setReflexScore({ answered: 0, correct: 0 });
    setScreen('reflex');
    setTimeout(nextReflexQuestion, 0);
  };

  const answerReflex = (card: MemoryCardItem) => {
    if (!reflexCard) return;
    const answered = reflexScore.answered + 1;
    const correct = reflexScore.correct + Number(card.id === reflexCard.id);
    setReflexScore({ answered, correct });
    if (answered >= 20) {
      setReflexCard(null);
      return;
    }
    nextReflexQuestion();
  };

  const startMemory = () => {
    setSequence(createMemorySequence(cards, length));
    setMemoryIndex(0);
    setRecalled([]);
    setResult(null);
    setStartedAt(getTimestamp());
    setScreen('memorize');
  };

  const beginRecall = () => {
    setMemoryDuration(getTimestamp() - startedAt);
    setScreen('recall');
  };

  const submitRecall = async () => {
    const scored = scoreRecall(sequence, recalled, memoryDuration);
    setResult(scored);
    setScreen('result');

    const completedAt = new Date().toISOString();
    const session: TrainingSession = {
      id: crypto.randomUUID(),
      moduleId: 'memory-cards',
      modeId: 'deck-order',
      groupId: `${length}-cards`,
      totalQuestions: sequence.length,
      correctAnswers: scored.correctCount,
      wrongAnswers: sequence.length - scored.correctCount,
      accuracy: scored.accuracy,
      durationMs: memoryDuration,
      completedAt,
    };
    const answers: SessionAnswer[] = sequence.map((card, index) => ({
      questionId: `recall-${index}`,
      itemId: card.id,
      selectedOptionId: recalled[index]?.id ?? '',
      correctOptionId: card.id,
      isCorrect: recalled[index]?.id === card.id,
      reactionMs: 0,
    }));
    await recordSessionCompletion(session, answers, cards.length);
  };

  const selectedCardIds = new Set(recalled.map((card) => card.id));
  const availableCards = cards.filter((card) => !selectedCardIds.has(card.id));

  useEffect(() => {
    if (screen !== 'memorize') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setMemoryIndex((index) => Math.min(sequence.length - 1, index + 1));
      if (event.key === 'ArrowLeft') setMemoryIndex((index) => Math.max(0, index - 1));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [screen, sequence.length]);

  if (!module || cards.length !== 52) {
    return <div className="grid h-full place-items-center px-6 text-center text-slate-400">Dữ liệu bộ bài chưa đầy đủ.</div>;
  }

  const back = () => {
    if (screen === 'home') goBack();
    else setScreen('home');
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="app-header"><Header title={title} subtitle="Nhớ bài" showBack onBack={back} /></div>
      <div className="app-scroll min-h-0 flex-1">
        <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-5 pb-24 sm:px-6">
          {screen === 'home' && (
            <>
              <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/15 to-slate-900 p-6">
                <div className="mb-3 flex items-center gap-3"><Brain className="h-7 w-7 text-indigo-400" /><h2 className="font-display text-2xl font-black text-white">Một lá → một hình ảnh</h2></div>
                <p className="text-sm leading-relaxed text-slate-300">Mỗi lá bài được gán cố định với một hình từ hệ 100 số. Khi bộ bài được xáo ngẫu nhiên, hãy nối 2–3 hình thành câu chuyện rồi đặt vào cung điện trí nhớ.</p>
                <div className="mt-4 rounded-2xl bg-slate-950/60 p-3 text-xs text-slate-400">Quy ước: ♠ 01–13 · ♥ 14–26 · ♦ 27–39 · ♣ 40–52</div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <button onClick={() => setScreen('mapping')} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left active:scale-[.98]"><BookOpen className="mb-3 h-6 w-6 text-indigo-400" /><strong className="block text-white">Học bảng mã</strong><span className="mt-1 block text-xs text-slate-400">52 liên kết bài ↔ hình</span></button>
                <button onClick={startReflex} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left active:scale-[.98]"><Zap className="mb-3 h-6 w-6 text-amber-400" /><strong className="block text-white">Luyện phản xạ</strong><span className="mt-1 block text-xs text-slate-400">20 câu chọn hình đúng</span></button>
                <button onClick={startMemory} className="rounded-2xl border border-indigo-500/40 bg-indigo-600 p-5 text-left shadow-lg shadow-indigo-950 active:scale-[.98]"><Play className="mb-3 h-6 w-6 fill-white" /><strong className="block text-white">Nhớ thứ tự bài</strong><span className="mt-1 block text-xs text-indigo-100">Ghi nhớ rồi tái hiện</span></button>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-indigo-400">Số lá cần nhớ</label>
                <div className="grid grid-cols-5 gap-2">{LENGTHS.map((value) => <button key={value} onClick={() => setLength(value)} className={`rounded-xl border py-3 font-mono font-bold ${length === value ? 'border-indigo-400 bg-indigo-600 text-white' : 'border-slate-700 bg-slate-950 text-slate-300'}`}>{value}</button>)}</div>
              </div>
            </>
          )}

          {screen === 'mapping' && (
            <>
              <MemoryPair card={cards[mappingIndex]} />
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <Button className="min-h-12" variant="secondary" onClick={() => setMappingIndex((index) => Math.max(0, index - 1))} disabled={mappingIndex === 0} leftIcon={<ChevronLeft className="h-4 w-4" />}>Trước</Button>
                <span className="min-w-16 text-center font-mono text-sm font-bold text-slate-400"><strong className="text-white">{mappingIndex + 1}</strong> / 52</span>
                <Button className="min-h-12" onClick={() => setMappingIndex((index) => Math.min(51, index + 1))} disabled={mappingIndex === 51} rightIcon={<ChevronRight className="h-4 w-4" />}>Tiếp</Button>
              </div>
            </>
          )}

          {screen === 'reflex' && reflexCard && (
            <>
              <div className="text-center text-xs font-bold text-slate-400">CÂU {reflexScore.answered + 1} / 20</div>
              <div className="flex justify-center"><CardFace card={reflexCard} /></div>
              <p className="text-center font-bold text-white">Hình ảnh nào đại diện cho lá này?</p>
              <div className="grid grid-cols-2 gap-3">{reflexOptions.map((card) => <button key={card.id} onClick={() => answerReflex(card)} className="rounded-2xl border border-slate-800 bg-slate-900 p-2 active:scale-[.98]"><Mnemonic card={card} compact /></button>)}</div>
            </>
          )}

          {screen === 'reflex' && !reflexCard && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 text-center"><Trophy className="mx-auto h-10 w-10 text-amber-400" /><h2 className="mt-3 text-3xl font-black text-white">{reflexScore.correct} / 20</h2><p className="mt-1 text-slate-400">Câu trả lời chính xác</p><Button className="mt-6" onClick={startReflex} leftIcon={<RotateCcw className="h-4 w-4" />}>Luyện lại</Button></div>
          )}

          {screen === 'memorize' && sequence[memoryIndex] && (
            <>
              <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-400"><span>LÁ {memoryIndex + 1} / {sequence.length}</span><span className="truncate text-right">Ghép 2–3 hình thành câu chuyện</span></div>
              <MemoryPair card={sequence[memoryIndex]} />
              <div className="flex gap-3"><Button variant="secondary" className="flex-1" disabled={memoryIndex === 0} onClick={() => setMemoryIndex((index) => index - 1)} leftIcon={<ChevronLeft className="h-4 w-4" />}>Trước</Button><Button className="flex-1" disabled={memoryIndex === sequence.length - 1} onClick={() => setMemoryIndex((index) => index + 1)} rightIcon={<ChevronRight className="h-4 w-4" />}>Tiếp</Button></div>
              <Button fullWidth variant="secondary" onClick={beginRecall} leftIcon={<Eye className="h-5 w-5" />}>TÔI ĐÃ NHỚ XONG</Button>
            </>
          )}

          {screen === 'recall' && (
            <>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3"><div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-400"><span>ĐÃ CHỌN {recalled.length} / {sequence.length}</span><button onClick={() => setRecalled((value) => value.slice(0, -1))} disabled={!recalled.length} className="flex items-center gap-1 text-indigo-300 disabled:opacity-30"><Undo2 className="h-4 w-4" /> Hoàn tác</button></div><div className="flex min-h-20 gap-1 overflow-x-auto">{recalled.map((card, index) => <div key={card.id} className="shrink-0 text-center"><CardFace card={card} compact /><span className="text-[10px] text-slate-500">{index + 1}</span></div>)}</div></div>
              <p className="text-center text-sm font-bold text-white">Chọn các lá theo đúng thứ tự đã ghi nhớ</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">{availableCards.map((card) => <button key={card.id} onClick={() => recalled.length < sequence.length && setRecalled((value) => [...value, card])} className="rounded-lg active:scale-95"><CardFace card={card} compact /></button>)}</div>
              <Button fullWidth disabled={recalled.length !== sequence.length} onClick={submitRecall} leftIcon={<Check className="h-5 w-5" />}>CHẤM KẾT QUẢ</Button>
            </>
          )}

          {screen === 'result' && result && (
            <div className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center">
              <Trophy className={`mx-auto h-12 w-12 ${result.accuracy === 100 ? 'text-amber-400' : 'text-slate-600'}`} />
              <div><h2 className="text-4xl font-black text-white">{result.accuracy}%</h2><p className="mt-1 text-slate-400">{result.correctCount} / {sequence.length} vị trí chính xác</p></div>
              <div className="grid grid-cols-3 gap-2 text-sm"><div className="rounded-xl bg-slate-950 p-3"><strong className="block text-white">{formatDuration(result.durationMs)}</strong><span className="text-xs text-slate-500">Ghi nhớ</span></div><div className="rounded-xl bg-slate-950 p-3"><strong className="block text-white">{result.firstErrorIndex === null ? 'Không có' : result.firstErrorIndex + 1}</strong><span className="text-xs text-slate-500">Lỗi đầu</span></div><div className="rounded-xl bg-slate-950 p-3"><strong className="block text-white">{result.longestStreak}</strong><span className="text-xs text-slate-500">Chuỗi đúng</span></div></div>
              <p className="text-xs text-slate-500">Chỉ kết quả đúng 100% mới được công nhận là kỷ lục thời gian.</p>
              <div className="flex gap-3"><Button variant="secondary" className="flex-1" onClick={() => setScreen('home')} leftIcon={<ArrowLeft className="h-4 w-4" />}>Trang chính</Button><Button className="flex-1" onClick={startMemory} leftIcon={<RotateCcw className="h-4 w-4" />}>Luyện lại</Button></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
