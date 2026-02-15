
import React, { useState } from 'react';
import { X, Check, Plus, Hash } from 'lucide-react';
import { Category } from '../../types';

interface SubFilterModalProps {
  category: Category;
  selectedIds: string[];
  customTags: string[];
  onToggleOption: (id: string) => void;
  onAddCustomTag: (tag: string) => void;
  onRemoveCustomTag: (tag: string) => void;
  onClose: () => void;
}

const SubFilterModal: React.FC<SubFilterModalProps> = ({ 
  category, selectedIds, customTags, onToggleOption, onAddCustomTag, onRemoveCustomTag, onClose 
}) => {
  const [newTag, setNewTag] = useState('');
  const emojiIcon = category.icon;

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      onAddCustomTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in slide-in-from-bottom sm:zoom-in duration-500">
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 sm:hidden" />

        <div className="p-6 sm:p-10 max-h-[85vh] overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl text-4xl" style={{ backgroundColor: category.color }}>
                {emojiIcon}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tight">{category.label}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Vibe Personalization</p>
              </div>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block ml-1 tracking-widest">Lựa chọn của bạn</label>
              <div className="grid grid-cols-2 gap-3">
                {category.subOptions.map(opt => {
                  const isActive = selectedIds.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onToggleOption(opt.id)}
                      className={`
                        flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all duration-300
                        ${isActive 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]' 
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'
                        }
                      `}
                    >
                      <span className="font-black text-xs uppercase tracking-tight">{opt.label}</span>
                      {isActive && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block ml-1 tracking-widest">Thêm Tag Riêng</label>
              <form onSubmit={handleAddTag} className="relative mb-4">
                <input 
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Thêm gì đó..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-slate-900 transition-colors pr-14"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                  <Plus size={20} />
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {customTags.map((tag, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 animate-in zoom-in">
                    <Hash size={12} className="text-slate-400" />
                    <span className="text-xs font-black text-slate-700">{tag}</span>
                    <button onClick={() => onRemoveCustomTag(tag)} className="text-slate-400 hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs tracking-[0.2em] uppercase hover:bg-slate-800 transition-all shadow-2xl active:scale-95"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubFilterModal;
