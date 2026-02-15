
const SAMPLE_FILTERS = [
  { id: 1, label: 'Tất cả', active: true },
  { id: 2, label: 'Âm nhạc', icon: '🎵' },
  { id: 3, label: 'Phim ảnh', icon: '🎬' },
  { id: 4, label: 'Trò chơi', icon: '🎮' },
  { id: 5, label: 'Dating', icon: '❤️' },
  { id: 6, label: 'Học tập', icon: '📚' },
  { id: 7, label: 'Việc làm', icon: '💼' },
  { id: 8, label: 'Sức khỏe', icon: '💪' },
  { id: 9, label: 'Công nghệ', icon: '🚀' },
  { id: 10, label: 'Ẩm thực', icon: '🍜' },
];

const FilterMarker = () => {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-[3000] w-[min(96vw,720px)] lg:w-[min(90vw,820px)] px-2 sm:px-3 lg:px-0 pointer-events-none top-16 sm:top-18">
      {/* Container cuộn ngang trên mobile, wrap trên desktop */}
      <div className="flex flex-nowrap md:flex-wrap items-center gap-3 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
        {SAMPLE_FILTERS.map((item) => (
          <button
            key={item.id}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 whitespace-nowrap
              ${item.active 
                ? 'bg-black text-white border-black shadow-lg shadow-black/20' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'}
            `}
          >
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span className="text-sm font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterMarker;