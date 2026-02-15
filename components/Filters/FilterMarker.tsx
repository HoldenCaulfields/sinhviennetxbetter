
import React from 'react';

export const FILTER_LABELS = [
  { id: 'all', label: 'Tất cả', icon: '🌍' },
  { id: 'music', label: 'Âm nhạc', icon: '🎵' },
  { id: 'movies', label: 'Phim ảnh', icon: '🎬' },
  { id: 'games', label: 'Trò chơi', icon: '🎮' },
  { id: 'dating', label: 'Dating', icon: '❤️' },
  { id: 'travel', label: 'Du lịch', icon: '🌴' },
  { id: 'reading', label: 'Đọc sách', icon: '📚' },
  { id: 'parttime', label: 'Công việc', icon: '💼' },
  { id: 'startup', label: 'Công nghệ', icon: '🚀' },
  { id: 'housework', label: 'Gia đình', icon: '🏠' },
];

interface FilterMarkerProps {
  activeFilter: string;
  onFilterChange: (id: string) => void;
}

const FilterMarker: React.FC<FilterMarkerProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div
      className="
      fixed left-1/2 -translate-x-1/2 z-[3000]
       w-[min(96vw,720px)] lg:w-[min(90vw,820px)]
       px-2 sm:px-3 lg:px-0 pointer-events-none
       top-[calc(4.5rem+env(safe-area-inset-top))]
    "
    >
      {/* Scroll container */}
      <div
        className="
        flex flex-nowrap md:flex-wrap items-center
        gap-2 sm:gap-3
        overflow-x-auto md:overflow-visible
        pb-3 md:pb-0
        no-scrollbar
        pointer-events-auto
        snap-x snap-mandatory
        touch-pan-x md:justify-center
      "
      >
        {FILTER_LABELS.map((item) => (
          <button
            key={item.id}
            onClick={() => onFilterChange(item.id)}
            className={`
              snap-start shrink-0
              flex items-center gap-1.5 sm:gap-2
              px-3 sm:px-5
              py-2 sm:py-2.5
              rounded-full border
              text-xs sm:text-sm
              transition-all duration-200
              whitespace-nowrap
              active:scale-95
              
              ${activeFilter === item.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20 scale-105'
                : 'bg-white/80 backdrop-blur-xl text-slate-600 border-white shadow-sm hover:border-slate-300 hover:bg-white'}
            `}
          >
            {item.icon && (
              <span className="text-sm sm:text-base leading-none">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterMarker;
