
import React from 'react';
import FilterBar from '../Filters/FilterBar';
import SubFilterModal from '../Filters/SubFilterModal';
import BalanceBridge from '../Layout/BalanceBridge';
import ConnectionLines from './ConnectionLines';
import { UserProfile, Category, PersonaScore, ViewMode, DiscoveryMode } from '@/types';
import FilterMarker from '../Filters/FilterMarker';
import VibeReviewModal from '../Modals/VibeReviewModal';
import ThePast from './ThePast';
import TheFuture from './TheFuture';

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
  activeFilter: string; setActiveFilter: (f: string) => void;
  handleBlastFirework: () => void;
  handleJoinEvent: (eventId: string) => void;
  setIsEventModalOpen: (open: boolean) => void;
  sortedCategories: Category[];
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  viewMode, setViewMode,
  discoveryMode, setDiscoveryMode,
  isReviewModalOpen, setIsReviewModalOpen,
  myProfile, setMyProfile,
  personaScore, activeCategory, setActiveCategory,
  handleToggleOption, handleAddCustomTag, handleRemoveCustomTag,
  handleOpenReview, handleConfirmSave, handleRecenter, handleResetDraft,
  setSelectedUser, activeFilter, setActiveFilter,
  handleBlastFirework, handleJoinEvent, setIsEventModalOpen,
  sortedCategories,
}) => {
  const isSelfMode = discoveryMode === 'self';

  return (
    <>
      {/* 2. BACKGROUND CONNECTIONS: Chỉ hiện trong Present + Self Mode */}
      {viewMode === 'present' && isSelfMode && (
        <div className="z-[2500] relative">
          <ConnectionLines
            selectedOptions={myProfile.selectedOptions}
          />
        </div>
      )}

      {/* 3. TIMELINE NAVIGATION (TOP) */}
      <header className="fixed top-4 left-0 right-0 z-[4000] pointer-events-none flex justify-center px-4">
        <nav className="bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full flex items-center shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] pointer-events-auto border border-white/50 transition-all duration-500 hover:shadow-2xl">
          <button
            onClick={() => setViewMode('past')}
            className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${viewMode === 'past' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Past
          </button>
          <button
            onClick={() => setViewMode('present')}
            className={`px-5 py-2 sm:px-8 sm:py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-2 ${viewMode === 'present' ? 'bg-rose-500 text-white shadow-[0_8px_20px_rgba(244,63,94,0.3)] scale-105' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Present
            {viewMode === 'present' && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_#fff]" />}
          </button>
          <button
            onClick={() => setViewMode('future')}
            className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${viewMode === 'future' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Future
          </button>
        </nav>
      </header>

      {/* --- THE PRESENT VIEW --- */}
      {viewMode === 'present' && (
        <>
          {/* 4. CỤM ĐIỀU KHIỂN TRUNG TÂM BÊN PHẢI (CENTER-RIGHT DOCK) */}
          <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[5000] flex flex-col items-center gap-6 pointer-events-none">

            {/* Nút Chuyển Chế Độ (PRIMARY SWITCH) */}
            <div className="relative group">
              <button
                onClick={() => setDiscoveryMode(isSelfMode ? 'map' : 'self')}
                className={`pointer-events-auto w-16 h-16 sm:w-24 sm:h-24 rounded-[2.2rem] sm:rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-500 active:scale-90 border-[6px] 
                  ${isSelfMode
                    ? 'bg-white border-rose-500 text-rose-500 ring-8 ring-rose-500/5'
                    : 'bg-slate-950 border-slate-800 text-white ring-8 ring-slate-950/5'
                  }`}
              >
                <span className="text-3xl sm:text-5xl transform group-hover:scale-110 transition-transform">
                  {isSelfMode ? '🌍' : '👤'}
                </span>
              </button>
              {/* Label hiển thị khi hover */}
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isSelfMode ? 'Khám phá' : 'Chỉnh sửa tôi'}
              </div>
            </div>

            {/* CỤM NÚT HÀNH ĐỘNG PHỤ */}
            <div className="flex flex-col gap-4 items-center">
              {isSelfMode ? (
                /* SELF MODE: Chỉ hiện Save */
                <button
                  onClick={handleOpenReview}
                  className="w-14 h-14 bg-emerald-500 text-white rounded-2xl shadow-xl flex items-center justify-center pointer-events-auto active:scale-95 border-b-4 border-emerald-700 hover:translate-y-[-2px] transition-all"
                >
                  <span className="text-2xl">💾</span>
                </button>
              ) : (
                /* MAP MODE: Create Event, Recenter, Firework */
                <>
                  <button
                    onClick={() => setIsEventModalOpen(true)}
                    className="w-16 h-16 bg-rose-500 text-white rounded-[1.5rem] shadow-xl flex items-center justify-center pointer-events-auto active:scale-95 border-b-4 border-rose-700 hover:bg-rose-600 transition-all animate-in zoom-in"
                  >
                    <span className="text-4xl font-bold">+</span>
                  </button>
                  <button
                    onClick={handleRecenter}
                    className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center pointer-events-auto active:scale-90 hover:bg-white transition-all"
                  >
                    <span className="text-xl">📍</span>
                  </button>
                  <button
                    onClick={handleBlastFirework}
                    className="w-12 h-12 bg-white/95 backdrop-blur-md animate-bounce rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center pointer-events-auto active:scale-90 hover:bg-white transition-all"
                  >
                    <span className="text-xl">🚀</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 5. LAYOUT NỘI DUNG BIẾN ĐỔI THEO CHẾ ĐỘ */}
          <div className="fixed inset-0 pointer-events-none flex flex-col justify-between items-center z-[3500]">
            {isSelfMode ? (
              /* CHẾ ĐỘ SELF: Hiện FilterBar & Balance */
              <>
                <div className="mt-24 pointer-events-auto animate-in slide-in-from-top-10 duration-700">
                  <FilterBar group="fun" selectedIds={myProfile.selectedOptions} onCategoryClick={setActiveCategory} position="top" />
                </div>

                <div className="w-full flex justify-center">
                  <BalanceBridge score={personaScore} />
                </div>

                <div className="mb-24 pointer-events-auto animate-in slide-in-from-bottom-10 duration-700">
                  <FilterBar group="study" selectedIds={myProfile.selectedOptions} onCategoryClick={setActiveCategory} position="bottom" />
                </div>
              </>
            ) : (
              /* CHẾ ĐỘ MAP: Chỉ hiện Filter Marker tìm người */
              <div className="mt-24 pointer-events-auto animate-in fade-in slide-in-from-right-10">
                <FilterMarker activeFilter={activeFilter} onFilterChange={setActiveFilter} categories={sortedCategories}/>
              </div>
            )}
          </div>
        </>
      )}

      {/* --- THE PAST VIEW: SELF-EVOLUTION --- */}
      {viewMode === 'past' && (
        <ThePast personaScore={personaScore} myProfile={myProfile} />
      )}

      {/* --- THE FUTURE VIEW: MANIFESTATION --- */}
      {viewMode === 'future' && (
        <TheFuture />
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
