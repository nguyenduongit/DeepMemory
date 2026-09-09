import React, { memo } from 'react';
import { LearningOverviewProps } from '../../core/learning/learning-types';
import { ChemicalElementItem, ElementCategory, ELEMENT_CATEGORY_LABELS } from './types';

const CATEGORY_STYLES: Record<ElementCategory, string> = {
  'alkali-metal': 'bg-rose-500/20 border-rose-400/50 text-rose-100',
  'alkaline-earth-metal': 'bg-orange-500/20 border-orange-400/50 text-orange-100',
  'transition-metal': 'bg-amber-500/20 border-amber-400/50 text-amber-100',
  'post-transition-metal': 'bg-lime-500/20 border-lime-400/50 text-lime-100',
  metalloid: 'bg-emerald-500/20 border-emerald-400/50 text-emerald-100',
  'reactive-nonmetal': 'bg-cyan-500/20 border-cyan-400/50 text-cyan-100',
  'noble-gas': 'bg-violet-500/20 border-violet-400/50 text-violet-100',
  lanthanide: 'bg-fuchsia-500/20 border-fuchsia-400/50 text-fuchsia-100',
  actinide: 'bg-pink-500/20 border-pink-400/50 text-pink-100',
  unknown: 'bg-slate-500/20 border-slate-400/50 text-slate-100',
};

const LEGEND_CATEGORIES: ElementCategory[] = [
  'alkali-metal',
  'alkaline-earth-metal',
  'transition-metal',
  'post-transition-metal',
  'metalloid',
  'reactive-nonmetal',
  'noble-gas',
  'lanthanide',
  'actinide',
  'unknown',
];

interface ElementCellProps {
  item: ChemicalElementItem;
  onSelect: (item: ChemicalElementItem) => void;
  style?: React.CSSProperties;
}

const ElementCell = memo(({ item, onSelect, style }: ElementCellProps) => (
  <button
    type="button"
    onClick={() => onSelect(item)}
    aria-label={`${item.atomicNumber}, ${item.vietnameseName}, ${item.symbol}`}
    title={`${item.vietnameseName} (${item.internationalName})`}
    style={style}
    className={`relative min-w-12 h-14 rounded-lg border p-1 text-left transition-transform hover:z-10 hover:scale-110 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${CATEGORY_STYLES[item.category]}`}
  >
    <span className="block text-[9px] leading-none opacity-70">{item.atomicNumber}</span>
    <span className="block text-center font-display text-lg font-black leading-5">{item.symbol}</span>
    <span className="block truncate text-center text-[7px] leading-3 opacity-80">{item.vietnameseName}</span>
  </button>
));

ElementCell.displayName = 'ElementCell';

const PeriodicTableOverviewComponent: React.FC<LearningOverviewProps<ChemicalElementItem>> = ({
  items,
  onSelectItem,
}) => {
  const mainElements = items.filter(
    (item) => item.category !== 'lanthanide' && item.category !== 'actinide',
  );
  const lanthanides = items.filter((item) => item.category === 'lanthanide');
  const actinides = items.filter((item) => item.category === 'actinide');

  return (
    <div className="h-full min-h-0 flex flex-col gap-3 p-3 sm:p-4">
      <div className="flex-none flex flex-wrap justify-center gap-x-3 gap-y-1 px-1">
        {LEGEND_CATEGORIES.map((category) => (
          <span key={category} className="inline-flex items-center gap-1 text-[9px] text-slate-400">
            <span className={`h-2.5 w-2.5 rounded-sm border ${CATEGORY_STYLES[category]}`} />
            {ELEMENT_CATEGORY_LABELS[category]}
          </span>
        ))}
      </div>

      <div className="app-scroll flex-1 min-h-0 rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
        <div className="min-w-[970px] mx-auto w-max">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: 'repeat(18, 50px)', gridTemplateRows: 'repeat(7, 56px)' }}
          >
            {mainElements.map((item) => (
              <ElementCell
                key={item.id}
                item={item}
                onSelect={onSelectItem}
                style={{ gridColumn: item.group, gridRow: item.period }}
              />
            ))}
            <ElementCell
              item={lanthanides[0]}
              onSelect={onSelectItem}
              style={{ gridColumn: 3, gridRow: 6 }}
            />
            <ElementCell
              item={actinides[0]}
              onSelect={onSelectItem}
              style={{ gridColumn: 3, gridRow: 7 }}
            />
          </div>

          <div className="mt-4 ml-[102px] space-y-1">
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(15, 50px)' }}>
              {lanthanides.map((item) => (
                <ElementCell key={`series-${item.id}`} item={item} onSelect={onSelectItem} />
              ))}
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(15, 50px)' }}>
              {actinides.map((item) => (
                <ElementCell key={`series-${item.id}`} item={item} onSelect={onSelectItem} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="flex-none text-center text-[10px] text-slate-500">
        Vuốt ngang để xem toàn bảng • Chạm một nguyên tố để mở thẻ chi tiết
      </p>
    </div>
  );
};

export const PeriodicTableOverview = memo(PeriodicTableOverviewComponent);
