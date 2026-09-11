import React, { useEffect, useState } from 'react';
import { Check, ChevronDown, Layers3, X } from 'lucide-react';

interface GroupPickerOption {
  id: string;
  name: string;
  itemCount: number;
  isComplete?: boolean;
}

interface GroupPickerProps {
  label: string;
  options: GroupPickerOption[];
  value: string;
  onChange: (value: string) => void;
}

export const GroupPicker: React.FC<GroupPickerProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.id === value) ?? options[0];
  const orderedOptions = [...options].sort(
    (a, b) => Number(b.isComplete) - Number(a.isComplete),
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!selectedOption) return null;

  const selectOption = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="mx-auto flex min-h-11 w-full max-w-2xl items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-left transition-colors hover:border-slate-700 active:bg-slate-800"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300">
          <Layers3 className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </span>
          <strong className="block truncate text-sm text-slate-100">{selectedOption.name}</strong>
        </span>
        <span className="shrink-0 text-xs font-semibold text-slate-500">
          {selectedOption.itemCount} mục
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`Chọn ${label.toLocaleLowerCase('vi')}`}
            className="flex max-h-[78dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-[2rem] border border-slate-700/80 bg-slate-900 shadow-2xl shadow-black/50 sm:rounded-[2rem]"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-400">
                  Phạm vi học
                </p>
                <h2 className="mt-0.5 font-display text-xl font-black text-white">Chọn {label.toLocaleLowerCase('vi')}</h2>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setIsOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-xl bg-slate-800 text-slate-300 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="grid grid-cols-2 gap-2.5">
                {orderedOptions.map((option) => {
                  const isSelected = option.id === value;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => selectOption(option.id)}
                      className={`relative min-h-16 rounded-2xl border px-3 py-2.5 text-left transition-all active:scale-[0.98] ${
                        option.isComplete ? 'col-span-2' : ''
                      } ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-600 text-white shadow-lg shadow-indigo-950/40'
                          : 'border-slate-800 bg-slate-950/65 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span className="block pr-6 text-sm font-bold leading-tight">{option.name}</span>
                      <span className={`mt-1 block text-[11px] font-semibold ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {option.itemCount} mục
                      </span>
                      {isSelected ? (
                        <span className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-white/20">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
};
