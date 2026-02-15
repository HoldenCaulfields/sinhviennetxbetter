import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Flame, Droplets, Hash, Layout, ArrowRight } from 'lucide-react';
import { UserProfile, PersonaScore } from '../../types';
import { CATEGORIES } from '../../constants';
import { getPersonaLabel } from '../../utils';

interface VibeReviewModalProps {
  myProfile: UserProfile;
  score: PersonaScore;
  onConfirm: () => void;
  onClose: () => void;
}

const VibeReviewModal: React.FC<VibeReviewModalProps> = ({ myProfile, score, onConfirm, onClose }) => {
  const selectedCategories = CATEGORIES.filter(c => 
    c.subOptions.some(opt => myProfile.selectedOptions.includes(opt.id))
  );

  return (
    <div className="fixed inset-0 z-[6000] flex items-end sm:items-center justify-center overflow-hidden p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => { if (info.offset.y > 100) onClose(); }}
        className="relative w-full max-w-xl bg-white rounded-t-[2.5rem] sm:rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[85dvh]"
      >
        {/* Mobile Pull Handle */}
        <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto mt-3 shrink-0 sm:hidden" />

        {/* Header Section - Tối ưu padding */}
        <div className="p-6 sm:p-10 text-center border-b border-slate-50 shrink-0">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest mb-4">
             <CheckCircle2 size={12} /> Sync Verification
           </div>
           <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight">
             Tôi là người thế nào?
           </h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 px-4">
             Mọi thứ đều thay đổi trên cuộc đời này
           </p>
        </div>

        {/* Content Area - Cuộn mượt và không hiện thanh scroll */}
        <div className="p-6 sm:p-10 overflow-y-auto no-scrollbar space-y-8 flex-1 touch-auto">
          
          {/* Balance Preview - Grid thích ứng */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
             <div className="p-4 sm:p-6 rounded-[2rem] bg-rose-50 border border-rose-100 flex flex-col items-center group transition-colors hover:bg-rose-100">
                <Flame className="text-rose-500 mb-2 transition-transform group-hover:scale-110" size={24} />
                <span className="text-2xl sm:text-3xl font-black text-rose-600 tabular-nums">{score.fun}%</span>
                <span className="text-[7px] font-black uppercase text-rose-400 tracking-widest mt-1 text-center">Tự Do, Sáng Tạo</span>
             </div>
             <div className="p-4 sm:p-6 rounded-[2rem] bg-blue-50 border border-blue-100 flex flex-col items-center group transition-colors hover:bg-blue-100">
                <Droplets className="text-blue-500 mb-2 transition-transform group-hover:scale-110" size={24} />
                <span className="text-2xl sm:text-3xl font-black text-blue-600 tabular-nums">{score.study}%</span>
                <span className="text-[7px] font-black uppercase text-blue-400 tracking-widest mt-1 text-center">Chăm Chỉ, Sáng Suốt</span>
             </div>
          </div>

          {/* Persona Tag */}
          <div className="flex flex-col items-center gap-3 py-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vibe hiện tại của bạn</span>
            <div className="px-6 py-2 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 animate-pulse">
              {getPersonaLabel(score)}
            </div>
          </div>

          {/* Chosen Nodes - Dùng layout flex linh hoạt hơn */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Dấu ấn đã chọn ({myProfile.selectedOptions.length})
            </h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {selectedCategories.map(cat => (
                <div key={cat.id} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl">
                   <span className="text-base sm:text-lg">{cat.icon}</span>
                   <span className="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase">{cat.label}</span>
                </div>
              ))}
              
              {myProfile.customTags.map((tag, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl sm:rounded-2xl shadow-md">
                   <Hash size={10} className="text-slate-400" />
                   <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions - Cố định ở đáy, thêm Safe Area padding */}
        <div className="p-6 sm:p-10 bg-white border-t border-slate-50 flex flex-col sm:flex-row gap-3 shrink-0 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-10">
           <button 
             onClick={onClose}
             className="flex-1 py-4 sm:py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-95 order-2 sm:order-1"
           >
             Tiếp tục chỉnh sửa
           </button>
           <button 
             onClick={onConfirm}
             className="flex-[2] py-4 sm:py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 order-1 sm:order-2"
           >
             Xác nhận danh tính <ArrowRight size={14} />
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VibeReviewModal;