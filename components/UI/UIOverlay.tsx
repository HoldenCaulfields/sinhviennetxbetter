
import React from 'react';
import { Pin, Eye, EyeOff, CheckCircle2, History, Compass, Target, ArrowLeft, TrendingUp, Users } from 'lucide-react';
import FilterBar from '../Filters/FilterBar';
import SubFilterModal from '../Filters/SubFilterModal';
import BalanceBridge from '../Layout/BalanceBridge';
import ConnectionLines from './ConnectionLines';
import { UserProfile, Category, PersonaScore, ViewMode, DiscoveryMode } from '@/types';
import FilterMarker from '../Filters/FilterMarker';
import VibeReviewModal from '../Modals/VibeReviewModal';

interface UIOverlayProps {
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  discoveryMode: DiscoveryMode;
  setDiscoveryMode: (m: DiscoveryMode) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (o: boolean) => void;
  myProfile: UserProfile;
  setMyProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  personaScore: PersonaScore;
  activeCategory: Category | null;
  setActiveCategory: (cat: Category | null) => void;
  handleToggleOption: (id: string) => void;
  handleAddCustomTag: (tag: string) => void;
  handleRemoveCustomTag: (tag: string) => void;
  handleOpenReview: () => void;
  handleConfirmSave: () => void;
  handleRecenter: () => void;
  handleResetDraft: () => void;
  setSelectedUser: (user: UserProfile) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  viewMode, setViewMode,
  discoveryMode, setDiscoveryMode,
  isReviewModalOpen, setIsReviewModalOpen,
  myProfile, setMyProfile,
  personaScore, activeCategory, setActiveCategory,
  handleToggleOption, handleAddCustomTag, handleRemoveCustomTag,
  handleOpenReview, handleConfirmSave, handleRecenter, handleResetDraft,
  setSelectedUser
}) => {
  const isSelfMode = discoveryMode === 'self';

  return (
    <>
      {/* Background Connections (Only in Present) */}
      {viewMode === 'present' && (
        <ConnectionLines
          selectedOptions={myProfile.selectedOptions}
          isPinned={myProfile.isPinned}
        />
      )}

      {/* Main Timeline Navigation - Clearly Visible & Refined */}
      <header className="fixed top-3 left-0 right-0 z-[4000] pointer-events-none flex justify-center px-4">
        <nav className="bg-white/80 backdrop-blur-2xl px-1 py-1 rounded-full flex items-center shadow-[0_12px_25px_-8px_rgba(0,0,0,0.12)] pointer-events-auto border border-white/50 ring-1 ring-black/5 transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.18)]">

          <button
            onClick={() => setViewMode('past')}
            className={`px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${viewMode === 'past'
              ? 'bg-slate-900 text-white shadow-lg scale-100'
              : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
          >
            Past
          </button>

          <button
            onClick={() => setViewMode('present')}
            className={`px-5 py-1.5 sm:px-7 sm:py-2.5 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-2 ${viewMode === 'present'
              ? 'bg-rose-500 text-white shadow-[0_10px_20px_rgba(244,63,94,0.35)] scale-105'
              : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
          >
            Present
            {viewMode === 'present' && (
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_6px_#fff]" />
            )}
          </button>

          <button
            onClick={() => setViewMode('future')}
            className={`px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${viewMode === 'future'
              ? 'bg-indigo-600 text-white shadow-lg scale-100'
              : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
          >
            Future
          </button>

        </nav>
      </header>


      {/* --- THE PRESENT VIEW --- */}
      {viewMode === 'present' && (
        <>
          {/* --- SIDEBAR ACTIONS --- */}
          <div className="fixed right-4 sm:right-10 top-1/2 -translate-y-1/2 z-[4500] flex flex-col gap-6 pointer-events-none items-center">

            {/* 1. CHẾ ĐỘ: Đổi giữa Khám phá và Cá nhân */}
            <div className="group relative flex items-center justify-center">
              <button
                onClick={() => setDiscoveryMode(isSelfMode ? 'map' : 'self')}
                className={`w-14 h-14 sm:w-20 sm:h-20 rounded-[1.75rem] sm:rounded-[2.25rem] shadow-2xl flex items-center justify-center transition-all duration-500 pointer-events-auto active:scale-90 border-4 relative overflow-hidden group
                ${isSelfMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-blue-100'}`}
              >
                <span className="relative z-10 text-3xl sm:text-4xl transform transition-transform group-hover:scale-110">
                  {isSelfMode ? '🌍' : '👤'}
                </span>
                {/* Hiệu ứng nền khi ở chế độ Map */}
                {!isSelfMode && <div className="absolute inset-0 bg-blue-50 animate-pulse opacity-50" />}
              </button>
              <div className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
                {isSelfMode ? "Xem mọi người" : "Chỉnh sửa tôi"}
              </div>
            </div>

            {/* 2. VỊ TRÍ: Kết hợp "Recenter" + "Auto-Update Draft Location" */}
            <div className="group relative flex items-center justify-center">
              <button
                onClick={handleRecenter} // Hàm này giờ sẽ bao gồm cả việc cập nhật vị trí vào state myProfile
                className="w-14 h-14 sm:w-20 sm:h-20 bg-white border-4 border-slate-100 rounded-[1.75rem] sm:rounded-[2.25rem] shadow-2xl flex items-center justify-center transition-all duration-500 pointer-events-auto active:scale-90 hover:border-rose-200 group"
              >
                <span className="text-3xl sm:text-4xl group-hover:animate-bounce">📍</span>
                {/* Vòng tròn sóng radar cho cảm giác đang quét vị trí thật */}
                <div className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping opacity-0 group-active:opacity-40" />
              </button>
              <div className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
                Cập nhật vị trí thật
              </div>
            </div>

            {/* 3. LƯU/CHỈNH SỬA: Chốt hạ Snapshot */}
            <div className="group relative flex items-center justify-center">
              {isSelfMode ? (
                <button
                  onClick={handleOpenReview}
                  className="w-14 h-14 sm:w-20 sm:h-20 bg-emerald-500 border-4 border-emerald-400 text-white rounded-[1.75rem] sm:rounded-[2.25rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center transition-all duration-500 pointer-events-auto active:scale-95 text-3xl sm:text-4xl relative overflow-hidden"
                >
                  <span className="relative z-10">💾</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </button>
              ) : (
                <button
                  onClick={handleResetDraft}
                  className="w-14 h-14 sm:w-20 sm:h-20 bg-white border-4 border-rose-100 text-rose-500 rounded-[1.75rem] sm:rounded-[2.25rem] shadow-xl flex items-center justify-center transition-all duration-500 pointer-events-auto active:scale-90 text-3xl sm:text-4xl"
                >
                  <span>✏️</span>
                </button>
              )}
              <div className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
                {isSelfMode ? "Lưu Snapshot" : "Sửa hồ sơ"}
              </div>
            </div>
          </div>

          {isSelfMode ? (
            <>
              <BalanceBridge score={personaScore} />
              <FilterBar group="fun" selectedIds={myProfile.selectedOptions} onCategoryClick={setActiveCategory} position="top" />
              <FilterBar group="study" selectedIds={myProfile.selectedOptions} onCategoryClick={setActiveCategory} position="bottom" />
            </>
          ) : (
            <FilterMarker />
          )}
        </>
      )}

      {/* --- THE PAST VIEW: SELF-EVOLUTION --- */}
      {viewMode === 'past' && (
        <div className="fixed inset-0 z-[3000] bg-slate-50/95 backdrop-blur-[120px] flex justify-center p-6 animate-in fade-in slide-in-from-left duration-700 pointer-events-auto overflow-y-auto">
          <div className="max-w-3xl w-full pt-16 pb-20">
            <div className="flex flex-col items-center mb-16 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-900 text-white rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl transform -rotate-6">
                <History size={36} />
              </div>
              <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">Your Evolution</h3>
              <p className="text-[10px] sm:text-[12px] font-bold text-slate-400 uppercase tracking-[0.5em] mt-5 italic">Nhìn lại hành trình thấu hiểu bản thân</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center">
                <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-4">Lửa Hiện Tại</span>
                <span className="text-5xl font-black text-slate-900">{personaScore.fun}%</span>
                <div className="mt-4 flex items-center gap-2 text-emerald-500">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-bold">+5% Growth</span>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center">
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-4">Nước Hiện Tại</span>
                <span className="text-5xl font-black text-slate-900">{personaScore.study}%</span>
                <span className="mt-4 text-[10px] font-bold text-slate-400 italic">Steady Balance</span>
              </div>
              <div className="bg-slate-900 p-8 rounded-[3rem] shadow-xl text-white flex flex-col items-center justify-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Self Insight</span>
                <p className="text-[12px] font-bold text-center leading-relaxed">"Bạn đang dần tìm thấy sự tĩnh lặng trong những cuộc vui. Một sự phát triển đáng kinh ngạc."</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar px-2 sm:px-4 pb-10">
              {myProfile.history.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">Dòng thời gian đang chờ snapshot đầu tiên</p>
                </div>
              ) : (
                myProfile.history.map((entry, idx) => (
                  <div key={idx} className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 flex justify-between items-center transition-all hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-2">
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] sm:text-[13px] font-black text-slate-900 uppercase tracking-widest">{new Date(entry.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest flex items-center gap-2">
                        <Pin size={11} className="text-rose-400" /> Snapshot at {new Date(entry.date).toLocaleTimeString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex gap-10 items-center">
                      <div className="text-right">
                        <span className="text-2xl font-black text-rose-500">{entry.score.fun}%</span>
                        <span className="block text-[7px] font-black uppercase text-slate-300 tracking-widest mt-1">Fire</span>
                      </div>
                      <div className="w-[1px] h-10 bg-slate-100" />
                      <div className="text-right">
                        <span className="text-2xl font-black text-blue-500">{entry.score.study}%</span>
                        <span className="block text-[7px] font-black uppercase text-slate-300 tracking-widest mt-1">Water</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setViewMode('present')}
              className="mt-12 w-full py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.7em] flex items-center justify-center gap-5 active:scale-95 transition-all shadow-3xl hover:bg-slate-800"
            >
              <ArrowLeft size={18} /> Quay lại thực tại
            </button>
          </div>
        </div>
      )}

      {/* --- THE FUTURE VIEW: MANIFESTATION --- */}
      {viewMode === 'future' && (
        <div className="fixed inset-0 z-[3000] bg-[#0c0e14] flex justify-center p-6 overflow-y-auto animate-in fade-in slide-in-from-right duration-1000 pointer-events-auto">
          <div className="max-w-3xl w-full text-center pt-20 pb-20">
            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-tr from-rose-500 via-indigo-600 to-cyan-500 rounded-[3rem] sm:rounded-[4rem] flex items-center justify-center mx-auto mb-12 shadow-[0_0_100px_rgba(79,70,229,0.5)] animate-[pulse_4s_infinite]">
              <Target className="text-white" size={64} />
            </div>

            <h3 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white mb-5 leading-none">Manifest Future</h3>
            <p className="text-indigo-400 text-[11px] sm:text-[13px] font-black uppercase tracking-[0.8em] mb-16 italic">Định hướng cộng đồng đồng điệu</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/10 text-left group hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-14 h-14 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="text-rose-500" size={28} />
                </div>
                <h4 className="text-xl font-black text-white uppercase mb-2">Startup Nodes</h4>
                <p className="text-slate-400 text-[12px] font-medium leading-relaxed">Kết nối với 12 người cùng gu 'Tech & Innovation' đang ở gần bạn.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/10 text-left group hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Compass className="text-cyan-500" size={28} />
                </div>
                <h4 className="text-xl font-black text-white uppercase mb-2">Art Collective</h4>
                <p className="text-slate-400 text-[12px] font-medium leading-relaxed">Khám phá triển lãm và những nghệ sĩ Indie chung tần số âm nhạc.</p>
              </div>
            </div>

            <button
              onClick={() => setViewMode('present')}
              className="w-full py-7 bg-white text-slate-950 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.8em] active:scale-95 transition-all shadow-[0_25px_50px_rgba(255,255,255,0.15)] hover:shadow-white/20"
            >
              Master Your Path
            </button>
          </div>
        </div>
      )}

      {/* --- SUB MODALS --- */}
      {activeCategory && (
        <SubFilterModal
          category={activeCategory}
          selectedIds={myProfile.selectedOptions}
          customTags={myProfile.customTags}
          onToggleOption={handleToggleOption}
          onAddCustomTag={handleAddCustomTag}
          onRemoveCustomTag={handleRemoveCustomTag}
          onClose={() => setActiveCategory(null)}
        />
      )}

      {isReviewModalOpen && (
        <VibeReviewModal
          myProfile={myProfile}
          score={personaScore}
          onConfirm={handleConfirmSave}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </>
  );
};

export default UIOverlay;
