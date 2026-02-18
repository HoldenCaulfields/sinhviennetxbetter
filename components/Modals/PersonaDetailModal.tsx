import React from 'react';
import { motion } from 'framer-motion';
import {
  X, Heart, Hash, Share2, Sparkles, MapPin,
  Facebook, Instagram, Youtube, Link2, Clock, Info
} from 'lucide-react';
import { UserProfile, PersonaScore, SocialLinks } from '@/types';
import { getPersonaLabel, calculateCompatibility, calculatePersonaScore, calculateDistance } from '@/utils';
import { CATEGORIES } from '@/constants';

interface PersonaDetailModalProps {
  user: UserProfile;
  myScore: PersonaScore;
  myLocation: [number, number];
  onClose: () => void;
}

const PersonaDetailModal: React.FC<PersonaDetailModalProps> = ({ user, myScore, onClose, myLocation }) => {
  const isMe = user.id === 'me' || user.id === 'Bạn';
  const score = isMe ? myScore : (user.selectedOptions ? calculatePersonaScore(user.selectedOptions) : { fun: 50, study: 50 });
  const comp = !isMe ? calculateCompatibility(myScore, score) : null;
  const distance =
    !isMe && user.location && myLocation
      ? calculateDistance(myLocation, user.location)
      : null;

  const selectedOptions = CATEGORIES.flatMap(cat =>
    cat.subOptions
      .filter(opt => user.selectedOptions?.includes(opt.id))
      .map(opt => ({
        ...opt,
        categoryIcon: cat.icon,
        categoryLabel: cat.label
      }))
  );

  // Render Social Icons Helper
  const renderSocials = (links?: SocialLinks) => {
    if (!links) return null;
    const icons = [
      { id: 'facebook', icon: <Facebook size={18} />, link: links.facebook, color: 'hover:bg-blue-500' },
      { id: 'instagram', icon: <Instagram size={18} />, link: links.instagram, color: 'hover:bg-pink-500' },
      { id: 'tiktok', icon: <span className="font-bold text-[10px]">TT</span>, link: links.tiktok, color: 'hover:bg-black' },
      { id: 'zalo', icon: <span className="font-bold text-[10px]">Zalo</span>, link: links.zalo, color: 'hover:bg-blue-400' },
    ].filter(item => item.link);

    return icons.map(item => (
      <a
        key={item.id}
        href={item.link}
        target="_blank"
        className={`w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all ${item.color} hover:text-white active:scale-90`}
      >
        {item.icon}
      </a>
    ));
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-end sm:items-center justify-center overflow-hidden p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y" dragConstraints={{ top: 0 }} dragElastic={0.2}
        onDragEnd={(_, info) => { if (info.offset.y > 150) onClose(); }}
        className="relative w-full max-w-[460px] bg-white rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95dvh]"
      >
        {/* Mobile Handle */}
        <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center z-30 sm:hidden">
          <div className="w-12 h-1.5 bg-white/30 rounded-full" />
        </div>

        {/* Header - Rút gọn để nhường chỗ cho nội dung mới */}
        <div className={`relative p-6 sm:p-8 text-white shrink-0 ${score.fun > score.study ? 'bg-gradient-to-br from-orange-600 to-pink-600' : 'bg-gradient-to-br from-blue-600 to-cyan-500'
          }`}>
          <div className="relative z-10 flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-white/20 rounded-3xl rotate-6" />
              <img src={user.avatar || '/tet.jpg'} className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-[1.8rem] border-4 border-white/30 object-cover shadow-xl" alt="" />
              {user.isPinned && (
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-xs">📌</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-black truncate drop-shadow-sm uppercase">{isMe ? 'Hồ sơ của bạn' : user.name}</h2>
              <div className="flex items-center gap-2 mt-1 opacity-90 text-[10px] font-bold uppercase tracking-wider">
                <MapPin size={12} /> {isMe ? 'Vị trí của bạn' : distance ? `Cách bạn ${distance} km` : 'Không rõ vị trí'}
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-black uppercase tracking-widest">
                <Sparkles size={10} /> {getPersonaLabel(score)}
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="px-6 py-6 sm:px-10 overflow-y-auto scrollbar-hide flex-1 space-y-7 touch-auto">

          

          {/* Stats & Compatibility */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-3xl bg-orange-50 border border-orange-100 text-center">
              <span className="block text-[9px] font-black text-orange-400 uppercase mb-1">Nhiệt huyết</span>
              <span className="text-2xl font-black text-orange-600 tabular-nums">{score.fun}%</span>
            </div>
            <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-100 text-center">
              <span className="block text-[9px] font-black text-indigo-400 uppercase mb-1">Tĩnh lặng</span>
              <span className="text-2xl font-black text-indigo-600 tabular-nums">{score.study}%</span>
            </div>
            {!isMe && comp !== null && (
              <div className="col-span-2 p-4 bg-slate-900 rounded-[2rem] flex items-center justify-between text-white overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-50" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <span className="text-sm font-black italic">Độ tương hợp</span>
                </div>
                <span className="text-3xl font-black text-emerald-400 relative z-10 tabular-nums">{comp}%</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          {user.socialLinks && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Link2 size={14} />Mạng xã hội đã kết nối
              </h4>
              <div className="flex gap-3">
                {renderSocials(user.socialLinks)}
              </div>
            </div>
          )}

          {/* Selected Options */}
          {selectedOptions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Các lựa chọn
              </h4>

              <div className="flex flex-wrap gap-2">
                {selectedOptions.map((opt, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-extrabold rounded-xl uppercase"
                  >
                    <span className="text-sm">{opt.categoryIcon}</span>
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio Section */}
          {user.bio && (
            <div className="relative p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-tighter">Bio</div>
              <p className="text-slate-600 text-sm font-medium leading-relaxed italic italic-quote">
                "{user.bio}"
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Hash size={14} /> Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.customTags.map((t, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-extrabold rounded-xl uppercase">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 sm:p-8 bg-white border-t border-slate-50 flex gap-3 shrink-0 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <button className="flex-[2] py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-slate-200">
            <Share2 size={18} /> Chia sẻ Vibe
          </button>
          {!isMe && (
            <button className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl flex items-center justify-center active:scale-95 transition-all">
              <Info size={22} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PersonaDetailModal;