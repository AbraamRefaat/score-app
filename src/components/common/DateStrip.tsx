import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TODAY_DATE = '2026-10-19';

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

// Helper to format date string YYYY-MM-DD
function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const DateStrip: React.FC = () => {
  const { selectedDate, setSelectedDate } = useApp();

  // Reference base date (today)
  const baseDateObj = useMemo(() => new Date(2026, 9, 19), []); // Oct 19, 2026

  // Window center offset (0 means today is in center of the 5 days)
  const [centerOffset, setCenterOffset] = useState<number>(0);

  // Generate 5 visible days around centerOffset
  const visibleDates = useMemo(() => {
    // 5 days: -2, -1, 0, +1, +2 relative to centerOffset
    const offsets = [-2, -1, 0, 1, 2];
    return offsets.map(off => {
      const d = new Date(baseDateObj);
      d.setDate(baseDateObj.getDate() + centerOffset + off);
      const id = formatDate(d);
      const isToday = id === TODAY_DATE;
      const dayName = isToday ? 'اليوم' : ARABIC_DAYS[d.getDay()];
      const dayNumber = d.getDate();

      return {
        id,
        dayName,
        dayNumber,
        isToday,
      };
    });
  }, [baseDateObj, centerOffset]);

  // Navigate earlier (to the right in RTL, clicking the right chevron)
  const handleEarlier = () => {
    setCenterOffset(prev => prev - 1);
  };

  // Navigate later (to the left in RTL, clicking the left chevron)
  const handleLater = () => {
    setCenterOffset(prev => prev + 1);
  };

  return (
    <div className="px-3 py-2.5 bg-neutral-950/90 select-none">
      {/* Sleek Pill Capsule Widget matching design attachment */}
      <div className="bg-[#0b1324] border border-[#1e2a44]/80 rounded-2xl px-2 py-1.5 flex items-center justify-between shadow-lg shadow-black/40">
        {/* Right Arrow (in RTL: goes back to earlier dates) */}
        <button
          type="button"
          onClick={handleEarlier}
          aria-label="الأيام السابقة"
          className="p-1.5 text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer rounded-lg hover:bg-slate-800/40 flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* 5 Day Items */}
        <div className="flex-1 grid grid-cols-5 items-center gap-1 mx-1 text-center">
          {visibleDates.map(item => {
            const isSelected = selectedDate === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedDate(item.id)}
                className={`py-1.5 px-1 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center select-none ${
                  isSelected
                    ? 'bg-[#7ec815] text-black shadow-[0_2px_14px_rgba(126,200,21,0.4)] scale-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
                aria-pressed={isSelected}
              >
                {/* Day Name / "اليوم" */}
                <span
                  className={`text-[12px] leading-tight block ${
                    isSelected ? 'font-black text-black' : 'font-bold'
                  }`}
                >
                  {item.dayName}
                </span>

                {/* Day Number */}
                <span
                  className={`text-[15px] leading-tight mt-0.5 block ${
                    isSelected ? 'font-black text-black' : 'font-extrabold text-slate-300'
                  }`}
                >
                  {item.dayNumber}
                </span>
              </button>
            );
          })}
        </div>

        {/* Left Arrow (in RTL: goes forward to later dates) */}
        <button
          type="button"
          onClick={handleLater}
          aria-label="الأيام القادمة"
          className="p-1.5 text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer rounded-lg hover:bg-slate-800/40 flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
