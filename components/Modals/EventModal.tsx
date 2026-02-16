'use client';

import { MapEvent } from '@/types';
import { useAppState } from '@/hooks/useAppState';
import { useProfiles } from '@/hooks/useProfiles';
import { useEffect, useMemo, useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventModalProps {
  event: MapEvent;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  const { handleJoinEvent, myProfile } = useAppState();
  const firestoreUsers = useProfiles();
  const isJoined = event.attendees?.includes(myProfile.id);

  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  /* ================= LOGIC & HELPERS ================= */
  const creator = useMemo(() => firestoreUsers.find(u => u.id === event.creatorId), [firestoreUsers, event.creatorId]);
  const attendeeProfiles = useMemo(() => firestoreUsers.filter(u => event.attendees?.includes(u.id)), [firestoreUsers, event.attendees]);

  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const updateCountdown = () => {
      const diff = new Date(event.startTime).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Đang diễn ra'); return; }
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [event.startTime]);

  const getCategoryTheme = () => {
    switch (event.category) {
      case 'party': return { icon: '🎉', color: 'bg-rose-500', gradient: 'from-rose-500 to-pink-600', text: 'text-rose-600' };
      case 'coffee': return { icon: '☕', color: 'bg-amber-500', gradient: 'from-amber-500 to-orange-600', text: 'text-amber-600' };
      case 'study': return { icon: '📚', color: 'bg-indigo-500', gradient: 'from-indigo-500 to-blue-600', text: 'text-indigo-600' };
      default: return { icon: '📍', color: 'bg-slate-500', gradient: 'from-slate-500 to-slate-600', text: 'text-slate-600' };
    }
  };

  const theme = getCategoryTheme();

  return (
    <div className="fixed inset-0 z-[5000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />

      {/* Modal Content */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          if (info.offset.y > 150) onClose();
        }}
        className="relative bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden touch-none"
      >
        {/* Mobile Drag Handle */}
        <div className="absolute top-3 left-0 right-0 flex justify-center z-10 sm:hidden">
          <div className="w-12 h-1.5 bg-white/30 rounded-full" />
        </div>

        {/* HEADER SECTION */}
        <div className={`relative bg-gradient-to-br ${theme.gradient} p-8 pt-10 text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors hidden sm:block"
          >
            <X size={18} />
          </button>

          <div className="flex justify-between items-start ">
            <div className="text-6xl mb-4 filter drop-shadow-lg">{theme.icon}</div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 mt-3 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/20">
              <Clock size={12} /> {timeLeft}
            </div>
          </div>
          
          <h2 className="text-3xl font-black tracking-tight leading-tight">{event.title}</h2>
          
          <div className="flex items-center gap-2 mt-3 text-white/90 font-medium">
            <Calendar size={16} />
            <span className="text-sm">
              {new Date(event.startTime).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>
        </div>

        {/* BODY SECTION */}
        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
          
          {/* Creator & Description */}
          <div className="space-y-4">
            {creator && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={creator.avatar || '/avatar-placeholder.png'}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white p-0.5 rounded-md border-2 border-white">
                    <Star size={10} fill="currentColor" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Host</p>
                  <h4 className="font-bold text-slate-800 leading-none">{creator.name}</h4>
                </div>
              </div>
            )}

            {event.description && (
              <div className="relative">
                <p className="text-slate-600 leading-relaxed italic pl-4 border-l-4 border-slate-100">
                  "{event.description}"
                </p>
              </div>
            )}
          </div>

          {/* Attendees Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Users size={18} className={theme.text} />
                <span>Người tham gia</span>
              </div>
              <span className="text-xs font-black px-2 py-1 bg-slate-100 rounded-lg text-slate-500">
                {event.attendees?.length || 0}
              </span>
            </div>

            {attendeeProfiles.length === 0 ? (
              <div className="py-4 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-sm">
                Chưa có ai tham gia. Hãy là người đầu tiên!
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {attendeeProfiles.map((user) => (
                  <motion.img
                    whileHover={{ y: -5 }}
                    key={user.id}
                    src={user.avatar || '/avatar-placeholder.png'}
                    title={user.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ACTION FOOTER */}
        <div className="p-8 pt-2">
          {isJoined ? (
            <div className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-emerald-50 text-emerald-600 font-bold border-2 border-emerald-100">
              <CheckCircle2 size={20} />
              Đã đăng ký tham gia
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleJoinEvent(event.id)}
              className={`w-full py-5 rounded-2xl ${theme.color} text-white font-black text-lg shadow-xl shadow-indigo-100 hover:brightness-110 transition-all`}
            >
              THAM GIA NGAY
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}