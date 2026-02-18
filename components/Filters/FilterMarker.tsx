import React, { useMemo } from "react"
import { Category } from "@/types"

interface FilterMarkerProps {
  categories: Category[]
  activeFilter: string
  onFilterChange: (id: string) => void
}

const FilterMarker: React.FC<FilterMarkerProps> = ({
  activeFilter,
  onFilterChange,
  categories,
}) => {

  const sortedCategories = useMemo(() => {
    const hasInterest = categories.some(c => (c.interestScore || 0) > 0)
    if (!hasInterest) return categories

    return [...categories].sort((a, b) => {
      if (a.id === "all") return -1
      if (b.id === "all") return 1
      return (b.interestScore || 0) - (a.interestScore || 0)
    })
  }, [categories])

  return (
    <div className="
      fixed left-1/2 -translate-x-1/2 z-[3000]
      w-full sm:w-[min(96vw,720px)] lg:w-[min(90vw,900px)]
      px-4 sm:px-3
      pointer-events-none
      top-[calc(4.5rem+env(safe-area-inset-top))]
    ">
      <div className="
        /* Mobile: Scroll ngang, ẩn thanh scroll */
        flex flex-nowrap overflow-x-auto no-scrollbar
        /* Tablet/Desktop: Hiện ra và cho phép xuống hàng (tối đa 2 hàng nhờ w-parent) */
        sm:flex-wrap sm:justify-center 
        gap-2 sm:gap-3
        pointer-events-auto
        pb-4 sm:pb-0
      ">
        {sortedCategories.map((item) => {
          const percent =
            item.interestPercent && item.interestPercent > 0
              ? Math.round(item.interestPercent * 100)
              : null

          const isActive = activeFilter === item.id

          return (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`
                flex items-center gap-2 sm:gap-3
                px-4 py-2 sm:py-2.5
                rounded-xl sm:rounded-2xl border
                transition-all duration-200
                /* Co giãn linh hoạt hơn trên mobile */
                flex-shrink-0 min-w-fit sm:min-w-[130px]
                active:scale-95 touch-manipulation

                ${isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105'
                  : 'bg-white/90 backdrop-blur-md text-slate-600 border-slate-200/60 shadow-sm hover:border-slate-300'}
              `}
            >
              <span className="text-lg sm:text-xl leading-none">
                {item.icon}
              </span>

              <div className="flex flex-col items-start leading-tight whitespace-nowrap">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  {item.label}
                </span>

                {percent !== null && item.id !== "all" && (
                  <span className={`text-[9px] text-red-500 sm:text-[10px] ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                    {percent}%
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FilterMarker