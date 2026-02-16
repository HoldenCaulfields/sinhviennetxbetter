'use client';
import React, { useState } from 'react';
import { MapEvent } from '@/types';
import { X, Calendar, MapPin } from 'lucide-react';

interface CreateEventModalProps {
  userLocation: [number, number];
  onSave: (event: Partial<MapEvent>) => void;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ userLocation, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'party' | 'coffee' | 'study'>('party');

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Tạo Sự Kiện Mới</h2>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20} /></button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2">Tên sự kiện</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Workshop múa lân..."
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2">Loại hình</label>
              <div className="grid grid-cols-3 gap-3">
                {(['party', 'coffee', 'study'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCategory(type)}
                    className={`py-4 rounded-2xl border-2 transition-all font-black text-xs uppercase ${
                      category === type ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'
                    }`}
                  >
                    {type === 'party' ? '🎉 Quẩy' : type === 'coffee' ? '☕ Cafe' : '📚 Học'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSave({ title, category, location: userLocation, attendees: [] })}
            disabled={!title}
            className="w-full mt-8 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
          >
            Xuất bản lên bản đồ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;