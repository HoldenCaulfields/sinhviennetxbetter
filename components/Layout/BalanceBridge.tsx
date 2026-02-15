
import React, { useMemo } from 'react';
import { PersonaScore } from '../../types';
import { getPersonaLabel } from '../../utils';

interface BalanceBridgeProps {
  score: PersonaScore;
}

const BalanceBridge: React.FC<BalanceBridgeProps> = ({ score }) => {
  const pointerPos = 10 + (score.study / 100) * 80;
  const personaStatus = useMemo(() => getPersonaLabel(score), [score]);

  // Fire Red vs Water Cyan
  const accentColor = score.fun > score.study ? 'border-red-500' : (score.study > score.fun ? 'border-cyan-500' : 'border-slate-900');
  const glowColor = score.fun > score.study ? 'shadow-red-500/50' : (score.study > score.fun ? 'shadow-cyan-500/50' : 'shadow-slate-500/50');

  return (
    <div className="fixed left-4 sm:left-8 top-[25%] bottom-[20%] md:top-32 md:bottom-32 w-12 sm:w-16 z-[2400] flex flex-col items-center pointer-events-none">

      {/* Fun / Fire Zone */}
      <div className="flex flex-col items-center mb-4 group cursor-help pointer-events-auto">
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse" />
        <div className="absolute -right-20 top-0 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 bg-slate-900 text-white text-[8px] sm:text-[9px] px-2.5 py-1 rounded-md font-black uppercase whitespace-nowrap shadow-2xl">
          Nhiệt Huyết (Fun)
        </div>
      </div>

      {/* Central Rail */}
      <div className="relative flex-1 w-1 sm:w-1.5 bg-slate-200/40 rounded-full border border-white/10 backdrop-blur-md overflow-visible">
        {/* Gradient Fill: Red (Top) to Blue (Bottom) */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-t from-cyan-500 via-slate-400 to-red-500 opacity-60"
        />

        {/* Floating Indicator */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-8 h-8 sm:w-11 sm:h-11 bg-white rounded-xl sm:rounded-2xl border-[3px] sm:border-4 ${accentColor} ${glowColor} shadow-2xl transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) flex items-center justify-center group cursor-pointer pointer-events-auto`}
          style={{ top: `${pointerPos}%`, transform: 'translateY(-50%)' }}
        >
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-ping ${score.fun > score.study ? 'bg-red-400' : 'bg-cyan-400'}`} />

          {/* Label Tooltip */}
          <div className="absolute left-10 sm:left-14 py-2 px-3 sm:py-3 sm:px-5 bg-white/95 backdrop-blur-2xl border border-white rounded-xl sm:rounded-2xl shadow-2xl min-w-[120px] sm:min-w-[160px] pointer-events-none origin-left transition-all duration-300 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
            <div className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Nhịp sống</div>
            <div className={`text-[10px] sm:text-xs font-black uppercase tracking-tight leading-none ${score.fun > score.study ? 'text-red-600' : 'text-cyan-600'}`}>
              {personaStatus}
            </div>

            <div className="flex items-center gap-2 sm:gap-4 mt-2 pt-2 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-[6px] sm:text-[7px] font-bold text-red-400 uppercase">Chill</span>
                <span className="text-[9px] sm:text-[11px] font-black text-slate-900 leading-none">{score.fun}%</span>
              </div>
              <div className="w-[1px] h-4 bg-slate-100" />
              <div className="flex flex-col">
                <span className="text-[6px] sm:text-[7px] font-bold text-cyan-400 uppercase">Serious</span>
                <span className="text-[9px] sm:text-[11px] font-black text-slate-900 leading-none">{score.study}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Study / Water Zone */}
      <div className="flex flex-col items-center mt-4 group cursor-help pointer-events-auto">
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)] animate-pulse" />
        <div className="absolute -right-20 bottom-0 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 bg-slate-900 text-white text-[8px] sm:text-[9px] px-2.5 py-1 rounded-md font-black uppercase whitespace-nowrap shadow-2xl">
          Tĩnh Lặng (Study)
        </div>
      </div>
    </div>
  );
};

export default BalanceBridge;
