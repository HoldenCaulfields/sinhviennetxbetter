import React, { useState, useEffect } from "react";
import { Calendar, Sparkles } from "lucide-react";

interface TimeLeft {
  h: number;
  m: number;
  s: number;
}

/**
 * Ngày Tết dương lịch tương ứng từng năm (00:00 là giao thừa)
 * Có thể update mỗi năm.
 */
const TET_DATES: Record<number, { month: number; day: number }> = {
  2025: { month: 0, day: 29 }, // 29 Jan 2025
  2026: { month: 1, day: 17 }, // 17 Feb 2026
  2027: { month: 1, day: 6 },
};

const getNextTetTarget = () => {
  const now = new Date();
  const currentYear = now.getFullYear();

  const createDate = (year: number) => {
    const tet = TET_DATES[year];
    if (!tet) return null;

    // 0h00 đúng giao thừa
    return new Date(year, tet.month, tet.day, 0, 0, 0, 0);
  };

  let target = createDate(currentYear);

  if (!target || target.getTime() <= now.getTime()) {
    target = createDate(currentYear + 1);
  }

  return target;
};

const calculateTimeLeft = (): TimeLeft => {
  const target = getNextTetTarget();
  if (!target) return { h: 0, m: 0, s: 0 };

  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return { h: 0, m: 0, s: 0 };

  return {
    h: Math.floor(diff / (1000 * 60 * 60)),
    m: Math.floor((diff / (1000 * 60)) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
};

const TetCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let timer: NodeJS.Timeout;

    const syncTimer = () => {
      setTimeLeft(calculateTimeLeft());

      // sync theo clock thật → không lệch
      const delay = 1000 - (Date.now() % 1000);
      timer = setTimeout(syncTimer, delay);
    };

    syncTimer();

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-4 z-[4000]
        transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-yellow-500/30 rounded-3xl blur-xl animate-pulse" />

      <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-red-600 p-[2px] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_3s_linear_infinite]" />

        <div className="relative bg-gradient-to-br from-red-600 to-red-700 rounded-2xl md:rounded-[22px] p-3 md:p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-300 rounded-xl md:rounded-2xl blur-md opacity-60 animate-pulse" />
              <div className="relative w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 md:w-7 md:h-7 text-red-600" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                <span className="text-[10px] font-black text-yellow-200 uppercase tracking-[0.25em]">
                  Đón Giao Thừa
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <TimeBlock value={timeLeft.h} label="Giờ" />
                <Separator />
                <TimeBlock value={timeLeft.m} label="Phút" />
                <Separator />
                <TimeBlock value={timeLeft.s} label="Giây" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimeBlock = ({ value, label }: any) => (
  <div className="flex flex-col items-center">
    <div className="bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/20">
      <span className="text-3xl font-black text-white tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="text-[8px] text-yellow-200/80 font-semibold mt-0.5 uppercase">
      {label}
    </span>
  </div>
);

const Separator = () => (
  <span className="text-3xl font-black text-yellow-300 pb-4">:</span>
);

export default TetCountdown;
