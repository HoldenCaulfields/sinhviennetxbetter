'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Camera, User, Globe, Send, Save, 
  Sparkles, Check, Facebook, Instagram, Youtube 
} from 'lucide-react';
import { UserProfile } from '@/types';
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

interface EditProfileModalProps {
  profile: UserProfile;
  onSave: (data: Partial<UserProfile>) => void;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onSave, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio || '',
    avatar: profile.avatar,
    socialLinks: {
      facebook: profile.socialLinks?.facebook || '',
      instagram: profile.socialLinks?.instagram || '',
      tiktok: profile.socialLinks?.tiktok || '',
      youtube: profile.socialLinks?.youtube || '',
      zalo: profile.socialLinks?.zalo || '',
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, avatar: imageUrl }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSocialChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value }
    }));
  };

  return (
    <div className="fixed inset-0 z-[7000] flex items-end sm:items-center justify-center overflow-hidden p-0 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        
        // --- DRAG TO DISMISS LOGIC ---
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          // Nếu lướt xuống hơn 150px thì đóng
          if (info.offset.y > 150) onClose();
        }}
        // -----------------------------

        className="relative w-full h-[92dvh] sm:h-auto sm:max-h-[85dvh] sm:max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden touch-none"
      >
        {/* Mobile Handle & Header (Khu vực có thể nắm kéo) */}
        <div className="shrink-0 cursor-grab active:cursor-grabbing">
          {/* Mobile Handle */}
          <div className="h-1.5 w-10 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

          {/* Header */}
          <div className="px-6 py-4 sm:px-8 sm:py-6 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-slate-200">
                <Sparkles size={18} className="text-yellow-400 fill-yellow-400" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tighter">Sửa Hồ Sơ</h2>
            </div>
            <button 
              onClick={onClose} 
              className="w-9 h-9 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full transition-all active:scale-90"
            >
              <X size={18} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Body - Nội dung cuộn */}
        {/* Thêm stopPropagation để khi cuộn nội dung không kích hoạt hành động kéo modal */}
        <div 
          onPointerDown={(e) => e.stopPropagation()} 
          className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-8 scrollbar-hide touch-auto"
        >
          
          {/* Avatar Edit */}
          <div className="flex flex-col items-center py-2">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-inner"
            >
              <div className="w-full h-full rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden relative">
                <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Định danh</span>
              <input 
                value={formData.name}
                onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                placeholder="Tên của bạn"
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none transition-all focus:border-indigo-500/30 focus:bg-white"
              />
              <textarea 
                value={formData.bio}
                onChange={e => setFormData(p => ({...p, bio: e.target.value}))}
                placeholder="Vibe của bạn là gì?"
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none transition-all focus:border-indigo-500/30 focus:bg-white h-24 resize-none text-sm leading-relaxed"
              />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mạng xã hội</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { icon: <Facebook size={16} />, key: 'facebook', label: 'FB URL', color: 'text-blue-600' },
                  { icon: <Instagram size={16} />, key: 'instagram', label: 'Insta @', color: 'text-rose-500' },
                  { icon: <Youtube size={16} />, key: 'youtube', label: 'YT Link', color: 'text-red-600' },
                  { icon: <Send size={16} />, key: 'zalo', label: 'Zalo #', color: 'text-cyan-600' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-1 focus-within:bg-white focus-within:ring-2 ring-slate-100 transition-all">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${item.color} bg-white shadow-sm shrink-0`}>
                      {item.icon}
                    </div>
                    <input 
                      value={(formData.socialLinks as any)[item.key]}
                      onChange={e => handleSocialChange(item.key, e.target.value)}
                      placeholder={item.label}
                      className="flex-1 bg-transparent px-2 text-xs font-bold outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 bg-white border-t border-slate-50 flex gap-3 shrink-0 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pb-6">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 border border-slate-100 active:scale-95 transition-all bg-slate-50"
          >
            Hủy
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); onSave(formData); onClose(); }}
            disabled={uploading}
            className="flex-[1.5] py-3.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-95 transition-all hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Check size={16} /> Lưu thay đổi</>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;