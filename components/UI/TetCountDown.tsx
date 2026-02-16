import React, { useState, useEffect } from "react";
import { Calendar, Sparkles } from "lucide-react";

interface TimeLeft {
  h: number;
  m: number;
  s: number;
}

const TetCountdown: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const target = new Date(
      now.getFullYear(),
      now.getMonth(),
      16,
      23,
      59,
      0,
      0
    );

    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return { h: 0, m: 0, s: 0 };

    return {
      h: Math.floor(diff / (1000 * 60 * 60)),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-4  z-[4000] 
        transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-yellow-500/30 rounded-3xl blur-xl animate-pulse" />

      {/* Main card */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-red-600 p-[2px] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden group">
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_3s_linear_infinite]" />

        {/* Content container */}
        <div className="relative bg-gradient-to-br from-red-600 to-red-700 rounded-2xl md:rounded-[22px] p-3 md:p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Icon container with animated background */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-300 rounded-xl md:rounded-2xl blur-md opacity-60 animate-pulse" />
              <div className="relative w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                <Calendar className="w-5 h-5 md:w-7 md:h-7 text-red-600 drop-shadow-sm" />
              </div>
            </div>

            {/* Time display */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-300 animate-pulse" />
                <span className="text-[9px] md:text-[10px] font-black text-yellow-200 uppercase tracking-[0.25em] drop-shadow-sm">
                  Đến Giao Thừa
                </span>
              </div>

              <div className="flex items-center gap-1 md:gap-1.5">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 backdrop-blur-sm px-2 py-1 md:px-2.5 md:py-1.5 rounded-lg border border-white/20 shadow-inner">
                    <span className="text-xl md:text-3xl font-black text-white tabular-nums tracking-tight drop-shadow-md">
                      {String(timeLeft.h).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[7px] md:text-[8px] text-yellow-200/80 font-semibold mt-0.5 uppercase tracking-wide">
                    Giờ
                  </span>
                </div>

                <span className="text-xl md:text-3xl font-black text-yellow-300 animate-pulse pb-4">
                  :
                </span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 backdrop-blur-sm px-2 py-1 md:px-2.5 md:py-1.5 rounded-lg border border-white/20 shadow-inner">
                    <span className="text-xl md:text-3xl font-black text-white tabular-nums tracking-tight drop-shadow-md">
                      {String(timeLeft.m).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[7px] md:text-[8px] text-yellow-200/80 font-semibold mt-0.5 uppercase tracking-wide">
                    Phút
                  </span>
                </div>

                <span className="text-xl md:text-3xl font-black text-yellow-300 animate-pulse pb-4">
                  :
                </span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 backdrop-blur-sm px-2 py-1 md:px-2.5 md:py-1.5 rounded-lg border border-white/20 shadow-inner">
                    <span className="text-xl md:text-3xl font-black text-white tabular-nums tracking-tight drop-shadow-md">
                      {String(timeLeft.s).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[7px] md:text-[8px] text-yellow-200/80 font-semibold mt-0.5 uppercase tracking-wide">
                    Giây
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative flowers - positioned differently on mobile vs desktop */}
      <div className="relative mt-2 md:mt-3 ml-2 flex gap-2 md:gap-3">
        {["🌸", "🧧", "🌼", "🎊"].map((emoji, i) => (
          <div
            key={i}
            className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-pink-400/30 to-yellow-400/30 backdrop-blur-sm border border-white/30 flex items-center justify-center text-xs md:text-sm shadow-lg transform transition-all duration-300 hover:scale-125 hover:-translate-y-1 cursor-pointer"
            style={{
              animation: `bounce 2s ease-in-out ${i * 0.2}s infinite`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-2 h-2 md:w-3 md:h-3 bg-yellow-300 rounded-full animate-ping" />
      <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-2 h-2 md:w-3 md:h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
    </div>
  );
};

export default TetCountdown;