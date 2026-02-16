'use client';
import React, { useState } from 'react';
import { MapEvent } from '@/types';
import { X, Calendar, AlignLeft, Type, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateEventModalProps {
  userLocation: [number, number];
  onSave: (event: Partial<MapEvent>) => void;
  onClose: () => void;
}

export default function CreateEventModal({
  userLocation,
  onSave,
  onClose
}: CreateEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'party' | 'coffee' | 'study'>('party');
  const [startTime, setStartTime] = useState(
    new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );

  const handleSubmit = () => {
    if (!title) return;
    onSave({
      title,
      description,
      category,
      location: userLocation,
      startTime: new Date(startTime).toISOString(),
      attendees: []
    });
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
      />

      {/* Modal Content */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 150) onClose();
        }}
        className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden touch-none"
      >
        {/* Thanh kéo giả (Handle) cho Mobile */}
        <div className="flex justify-center pt-4 sm:hidden">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        <div className="p-6 sm:p-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                TẠO CUỘC HẸN MỚI
              </h2>
              <p className="text-slate-500 text-sm font-medium">Kết nối mọi người gần nhau hơn</p>
            </div>

            <button
              onClick={onClose}
              className="hidden sm:flex p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 transition-colors rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5">
            {/* Title Input */}
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                <Type size={14} /> Tên cuộc hẹn
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none rounded-2xl transition-all font-medium"
                placeholder="Ví dụ: Cafe cuối tuần..."
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                <AlignLeft size={14} /> Mô tả
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none rounded-2xl transition-all font-medium resize-none"
                placeholder="Thêm mô tả cho cuộc hẹn, địa điểm..."
              />
            </div>

            {/* Two column row for Time & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                  <Calendar size={14} /> Thời gian
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none rounded-2xl transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 block">
                  Loại hình (giao lưu / cafe / học nhóm)
                </label>
                <div className="flex gap-2">
                  {(['party', 'coffee', 'study'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCategory(type)}
                      className={`flex-1 py-4 rounded-2xl border-2 text-xl transition-all
                        ${category === type
                          ? 'border-indigo-600 bg-indigo-50 scale-105 shadow-sm'
                          : 'border-slate-100 bg-slate-50 opacity-60'
                        }`}
                      title={type}
                    >
                      {type === 'party' ? '🎉' : type === 'coffee' ? '☕' : '📚'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!title}
            className="w-full mt-10 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <Rocket size={20} />
            Xuất bản sự kiện ngay
          </button>
        </div>
      </motion.div>
    </div>
  );
}