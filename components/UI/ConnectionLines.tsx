
import React, { useEffect, useState, useCallback } from 'react';
import { CATEGORIES } from '../../constants';

interface Line {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
}

interface ConnectionLinesProps {
  selectedOptions: string[];
  isPinned: boolean;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ selectedOptions, isPinned }) => {
  const [lines, setLines] = useState<Line[]>([]);

  const updateLines = useCallback(() => {
    // Luôn cập nhật vị trí trung tâm cho dù đã pin hay chưa để line biến mất mượt mà
    const target = document.getElementById('persona-center');
    if (!target) return;

    const tRect = target.getBoundingClientRect();
    const tX = tRect.left + tRect.width / 2;
    const tY = tRect.top + tRect.height / 2;

    const activeCategories = CATEGORIES.filter(c => 
      c.subOptions.some(opt => selectedOptions.includes(opt.id))
    );

    const newLines = activeCategories.map(cat => {
      const btn = document.querySelector(`[data-sync-id="${cat.id}"]`);
      if (!btn) return null;
      const rect = btn.getBoundingClientRect();
      return {
        id: cat.id,
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
        endX: tX,
        endY: tY,
        color: cat.color
      };
    }).filter((l): l is Line => l !== null);

    setLines(newLines);
  }, [selectedOptions]);

  useEffect(() => {
    updateLines();
    window.addEventListener('resize', updateLines);
    
    // Sử dụng requestAnimationFrame để line bám sát theo marker khi map di chuyển
    let frameId: number;
    const loop = () => {
      updateLines();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', updateLines);
      cancelAnimationFrame(frameId);
    };
  }, [updateLines]);

  if (isPinned || lines.length === 0) return null;

  return (
    <svg className="fixed inset-0 pointer-events-none z-[2000] w-full h-full overflow-visible">
      <defs>
        {lines.map(line => (
          <filter key={`glow-${line.id}`} id={`glow-${line.id}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>
      {lines.map(line => (
        <g key={line.id} style={{ filter: `url(#glow-${line.id})` }}>
          <line
            x1={line.startX}
            y1={line.startY}
            x2={line.endX}
            y2={line.endY}
            stroke={line.color}
            strokeWidth="2"
            strokeDasharray="6,8"
            strokeLinecap="round"
            style={{ 
              opacity: 0.4,
              strokeDashoffset: 100,
              animation: 'sync-line-flow 4s linear infinite' 
            }}
          />
          {/* Điểm nhấn đầu line */}
          <circle
            cx={line.startX}
            cy={line.startY}
            r="4"
            fill={line.color}
            className="animate-pulse"
          />
        </g>
      ))}
      <style>{`
        @keyframes sync-line-flow {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
};

export default ConnectionLines;
