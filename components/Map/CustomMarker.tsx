'use client';
import React from 'react';
import { PersonaScore, UserProfile } from '@/types';
import { Camera } from 'lucide-react';

interface CustomMarkerProps {
  user: UserProfile;
  myScore: PersonaScore;
  onOpenEdit?: () => void;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ user, myScore, onOpenEdit }) => {
  // Tăng kích thước Radius để vòng tròn to hẳn ra ngoài
  const radius = 52; 
  const stroke = 7;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Tính toán tỉ lệ
  const funStrokeDashoffset = circumference - (myScore.fun / 100) * circumference;
  const isFunDominant = myScore.fun > myScore.study;

  return (
    <div className="relative flex items-center justify-center z-[5000]">
      
      {/* 1. Hào quang (Glow) - Làm đậm thêm bằng opacity 0.6 và blur rộng
      <div 
        className={`absolute rounded-full blur-3xl transition-all duration-1000 animate-soft-pulse ${
          isFunDominant ? 'bg-red-500/60' : 'bg-blue-500/60'
        }`} 
        style={{ 
            width: radius * 3.5, 
            height: radius * 3.5,
            opacity: 0.7 
        }} 
      />  */}

      {/* 2. Container chính */}
      <div className="relative flex items-center justify-center animate-float pointer-events-auto">
        
        {/* Vòng tròn tỉ lệ - Kích thước to hơn hẳn */}
        <svg height={radius * 2} width={radius * 2} className="absolute -rotate-90 z-20 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          {/* Nền Study (Xanh) - Đậm hơn */}
          <circle 
            stroke="#2563EB" 
            fill="white" 
            strokeWidth={stroke} 
            r={normalizedRadius} 
            cx={radius} 
            cy={radius} 
            className="transition-all duration-1000"
          />
          {/* Tiến trình Fun (Đỏ) - Rực rỡ */}
          <circle
            stroke="#DC2626"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ 
              strokeDashoffset: funStrokeDashoffset,
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' 
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius} 
            cy={radius}
          />
        </svg>

        {/* 3. Ảnh đại diện - Nằm gọn bên trong vòng tròn to */}
        <div 
          onClick={onOpenEdit}
          className={`
            relative rounded-full overflow-hidden border-1 border-white shadow-2xl z-30 cursor-pointer group
            w-18 h-18 sm:w-20 sm:h-20 ring-4 ring-white/30
          `}
        >
          <img 
            src={user.avatar || '/tet.jpg'} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            alt={user.name} 
          />
          
            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity backdrop-blur-[2px]">
              <Camera size={24} className="text-white drop-shadow-lg mb-1" />
              <span className="text-[10px] font-black text-white tracking-tighter">EDIT</span>
            </div>
        </div>

        {/* 4. Tên người dùng - Thiết kế lại cho chuyên nghiệp hơn */}
        <div className="absolute -bottom-10 z-40">
           <div className={`px-4 py-1 rounded-full text-[10px] font-black text-white shadow-2xl whitespace-nowrap border-2 transition-all bg-slate-900
              border-slate-400 text-white
           }`}>
             {user.name.toUpperCase()}
           </div>
        </div>

      </div>
    </div>
  );
};

export default CustomMarker;