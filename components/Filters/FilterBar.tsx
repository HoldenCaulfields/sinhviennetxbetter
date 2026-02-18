
import React from 'react';
import { CATEGORIES } from '@/constants';
import { CategoryGroup, Category } from '@/types';

interface FilterBarProps {
  group: CategoryGroup;
  selectedIds: string[];
  onCategoryClick: (category: Category) => void;
  position: 'top' | 'bottom';
}

const FilterBar: React.FC<FilterBarProps> = ({ group, selectedIds, onCategoryClick, position }) => {
  const filteredCategories = CATEGORIES.filter(c => c.group === group);

  return (
    <div className={`
  fixed left-1/2 -translate-x-1/2 z-[3000]
  w-[min(96vw,720px)] lg:w-[min(90vw,820px)]   // 👈 responsive width
  px-2 sm:px-3 lg:px-0
  pointer-events-none 
  ${position === 'top' ? 'top-16 sm:top-18' : 'bottom-6 sm:bottom-10'}
`}>

      <div className="
    bg-white/90 backdrop-blur-2xl
    border border-white/60
    shadow-[0_12px_30px_rgba(0,0,0,0.08)]
    rounded-2xl sm:rounded-[2rem]
    p-1.5 sm:p-2
    grid grid-cols-5
    gap-1.5 sm:gap-2 lg:gap-3
    pointer-events-auto
  ">

        {filteredCategories.map((cat) => {
          const selectedCount = cat.subOptions.filter(opt => selectedIds.includes(opt.id)).length;
          const isActive = selectedCount > 0;

          return (
            <button
              key={cat.id}
              data-sync-id={cat.id}
              onClick={() => onCategoryClick(cat)}
              className={`
            group relative flex flex-col items-center justify-center
            h-[60px] sm:h-[70px] lg:h-[64px]   // 👈 chiều cao ổn định
            gap-1
            rounded-xl sm:rounded-2xl
            transition-all 
            ${isActive
                  ? 'bg-white shadow-md border-slate-100 scale-[1.04] z-10'
                  : 'bg-white/40 text-slate-400 border-white/50 hover:bg-white/80'
                }
          `}
            >
              {/* icon auto scale */}
              <span className="
            text-[clamp(20px,2.2vw,26px)]
            group-hover:scale-110
            transition-transform duration-300
          ">
                {cat.icon}
              </span>

              {/* label auto scale */}
              <span className={`
            text-[clamp(7px,0.75vw,10px)]
            font-black uppercase tracking-tight
            whitespace-nowrap text-center px-1
            ${isActive ? 'text-slate-900' : 'text-slate-400'}
          `}>
                {cat.label}
              </span>

              {selectedCount > 0 && (
                <div
                  className="
                absolute -top-1.5 -right-1.5
                w-5 h-5 sm:w-6 sm:h-6
                rounded-full flex items-center justify-center
                text-[10px] text-white font-black
                shadow-md ring-2 ring-white
              "
                  style={{ backgroundColor: cat.color }}
                >
                  {selectedCount}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Group Badge (bottom center) */}
      <div className={`
    absolute left-1/2 -translate-x-1/2 -bottom-3
    px-3 py-1
    rounded-full
    text-[clamp(7px,0.7vw,9px)]
    font-black uppercase tracking-[0.2em]
    border border-white/40 shadow-lg
    ${group === 'fun'
          ? 'bg-gradient-to-r from-rose-500 to-orange-500'
          : 'bg-gradient-to-r from-blue-600 to-cyan-500'}
    text-white z-20
  `}>
        {group === 'fun' ? 'Chill / Ăn Chơi' : 'Learn / Học Tập'}
      </div>

    </div>

  );
};

export default FilterBar;
