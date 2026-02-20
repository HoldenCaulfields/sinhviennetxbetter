
import React from 'react';
import { Pin, Eye, EyeOff, CheckCircle2, History, Compass, Target, ArrowLeft, TrendingUp, Users } from 'lucide-react';
import FilterBar from '../Filters/FilterBar';
import SubFilterModal from '../Filters/SubFilterModal';
import BalanceBridge from '../Layout/BalanceBridge';
import ConnectionLines from './ConnectionLines';
import { UserProfile, Category, PersonaScore, ViewMode, DiscoveryMode } from '@/types';
import FilterMarker from '../Filters/FilterMarker';
import VibeReviewModal from '../Modals/VibeReviewModal';
import { getAnalysis, generateBalancePath } from '@/utils';

const chartWidth = 500;
const chartHeight = 200;
const centerY = chartHeight / 2;

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
        <div className="fixed inset-0 z-[3000] bg-slate-50/95 backdrop-blur-[120px] flex justify-center p-6 animate-in fade-in slide-in-from-left duration-700 pointer-events-auto overflow-y-auto">
          <div className="max-w-3xl w-full pt-16 pb-20">
            <div className="flex flex-col items-center mb-16 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-900 text-white rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl transform -rotate-6">
                <History size={36} />
              </div>
              <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">Lịch Sử Thay Đổi</h3>
              <p className="text-[10px] sm:text-[12px] font-bold text-slate-400 uppercase tracking-[0.5em] mt-5 italic">Nhìn lại hành trình thấu hiểu bản thân</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center">
                <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-4">Sáng Tạo</span>
                <span className="text-5xl font-black text-slate-900">{personaScore.fun}%</span>
                <div className="mt-4 flex items-center gap-2 text-emerald-500">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-bold">+5% Growth</span>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center">
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-4">Sáng Suốt</span>
                <span className="text-5xl font-black text-slate-900">{personaScore.study}%</span>
                <span className="mt-4 text-[10px] font-bold text-slate-400 italic">Steady Balance</span>
              </div>
              <div className="bg-slate-900 p-8 rounded-[3rem] shadow-xl text-white flex flex-col items-center justify-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">
                  Phân Tích (Just for Fun)
                </span>
                <p className="text-[12px] font-bold text-center leading-relaxed">
                  "{getAnalysis(personaScore.fun, personaScore.study)}"
                </p>
              </div>
            </div>

            {/* Section: Chart Mô phỏng Dòng thời gian */}
            <div className="mb-12 bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Nhịp Sinh Học Nội Tại</span>
                <span className="text-[9px] font-bold text-slate-400 italic">0 = Trạng thái Cân bằng</span>
              </div>

              <div className="relative w-full" style={{ height: chartHeight }}>
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                  {/* Vùng mờ phân chia */}
                  <rect x="0" y="0" width={chartWidth} height={centerY} fill="#fff1f2" fillOpacity="0.4" />
                  <rect x="0" y={centerY} width={chartWidth} height={centerY} fill="#eff6ff" fillOpacity="0.4" />

                  {/* Trục Ox (Đường cân bằng 0) */}
                  <line x1="0" y1={centerY} x2={chartWidth} y2={centerY} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Trục Oy Label */}
                  <text x="5" y={20} className="fill-rose-500 text-[9px] font-black uppercase">↑ Chill</text>
                  <text x="5" y={chartHeight - 10} className="fill-blue-500 text-[9px] font-black uppercase">↓ Learn</text>

                  {/* Đường biểu diễn chính (Sine-like Wave) */}
                  <path
                    d={generateBalancePath(myProfile.history)}
                    fill="none"
                    stroke="url(#balanceGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-md"
                  />

                  {/* Gradient cho đường line: Đỏ ở trên, Xanh ở dưới */}
                  <defs>
                    <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="30%" stopColor="#f43f5e" />
                      <stop offset="50%" stopColor="#94a3b8" />
                      <stop offset="70%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>

                  {/* Điểm hiện tại */}
                  {myProfile.history.length > 0 && (
                    <circle
                      cx={chartWidth - 20}
                      cy={centerY - ((myProfile.history[myProfile.history.length - 1].score.fun - myProfile.history[myProfile.history.length - 1].score.study) / 2 * (chartHeight / 120))}
                      r="6"
                      className="fill-slate-900 stroke-white stroke-2"
                    />
                  )}
                </svg>
              </div>
            </div>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar px-2 sm:px-4 pb-10">
              {myProfile.history.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">Dòng thời gian đang chờ thông tin bạn lưu lại</p>
                </div>
              ) : (
                myProfile.history.slice().reverse().map((entry, idx) => (
                  <div key={idx} className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 flex justify-between items-center transition-all hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-2">
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] sm:text-[13px] font-black text-slate-900 uppercase tracking-widest">{new Date(entry.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest flex items-center gap-2">
                        <Pin size={11} className="text-rose-400" /> Đã lưu lúc {new Date(entry.date).toLocaleTimeString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex gap-10 items-center">
                      <div className="text-right">
                        <span className="text-2xl font-black text-rose-500">{entry.score.fun}%</span>
                        <span className="block text-[7px] font-black uppercase text-slate-300 tracking-widest mt-1">Chill</span>
                      </div>
                      <div className="w-[1px] h-10 bg-slate-100" />
                      <div className="text-right">
                        <span className="text-2xl font-black text-blue-500">{entry.score.study}%</span>
                        <span className="block text-[7px] font-black uppercase text-slate-300 tracking-widest mt-1">Learn</span>
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

            <h3 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white mb-5 leading-none">Mục Tiêu Tương Lai</h3>
            <p className="text-indigo-400 text-[11px] sm:text-[13px] font-black uppercase tracking-[0.8em] mb-16 italic">Định hướng cộng đồng đồng điệu</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/10 text-left group hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-14 h-14 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="text-rose-500" size={28} />
                </div>
                <h4 className="text-xl font-black text-white uppercase mb-2">Startup Mode</h4>
                <p className="text-slate-400 text-[12px] font-medium leading-relaxed">Kiến tạo cộng đồng khởi nghiệp lành mạnh, cùng nhau phát triển và lan tỏa giá trị tích cực.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/10 text-left group hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Compass className="text-cyan-500" size={28} />
                </div>
                <h4 className="text-xl font-black text-white uppercase mb-2">Art Collective</h4>
                <p className="text-slate-400 text-[12px] font-medium leading-relaxed">Khám phá những trải nghiệm nghệ thuật độc đáo, sự tự do của những người khác bạn.</p>
              </div>
            </div>

            <button
              onClick={() => setViewMode('present')}
              className="w-full py-7 bg-white text-slate-950 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.8em] active:scale-95 transition-all shadow-[0_25px_50px_rgba(255,255,255,0.15)] hover:shadow-white/20"
            >
              Quay lại thực tại
            </button>

            {/* Tính năng Bonus khiêm nhường - Gọn & Responsive */}
            <div className="mt-16 sm:mt-20 max-w-md mx-auto relative z-[5001] pointer-events-auto px-4">
              <details className="group appearance-none">
                <summary className="list-none cursor-pointer outline-none">
                  <p className="text-[9px] sm:text-[10px] text-slate-600 font-medium tracking-widest leading-relaxed transition-all duration-500 group-open:opacity-20 hover:text-slate-400">
                    Tính năng này đang được team phát triển mở rộng. Nếu tin tưởng vào tầm nhìn của dự án, bạn có thể
                    <span className="ml-1 border-b border-slate-800 pb-0.5">tìm hiểu cách ủng hộ team tại đây</span>
                  </p>
                </summary>

                <div className="mt-4 animate-in fade-in zoom-in-95 duration-500">
                  <div
                    className="inline-flex flex-col items-center sm:items-start bg-white/5 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-white/10 cursor-pointer active:scale-95 transition-transform"
                    onClick={(e) => {
                      navigator.clipboard.writeText("0381000602207");
                      const label = e.currentTarget.querySelector('.status-text') as HTMLElement;
                      if (label) {
                        const original = label.innerText;
                        label.innerText = "ĐÃ SAO CHÉP";
                        label.classList.add('text-emerald-400');
                        setTimeout(() => {
                          label.innerText = original;
                          label.classList.remove('text-emerald-400');
                        }, 2000);
                      }
                    }}
                  >
                    <p className="text-[7px] text-indigo-400 font-black uppercase tracking-[0.4em] mb-2 status-text transition-colors">
                      Click để sao chép
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm sm:text-base font-mono tracking-[0.15em]">
                        0381 0006 02207
                      </span>
                      <div className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className="text-slate-400 text-[9px] font-bold uppercase">VCB</span>
                    </div>

                    <p className="mt-2 text-[8px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
                      Cảm ơn rất nhiều <span className="text-rose-500/80">❤️</span>
                    </p>
                  </div>

                  {/* Nút đóng cho mobile dễ thao tác */}
                  <summary className="mt-4 text-[7px] text-slate-700 uppercase font-black tracking-[0.3em] cursor-pointer list-none">
                    [ Thu gọn ]
                  </summary>
                </div>
              </details>
            </div>
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
