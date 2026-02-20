import { History, TrendingUp, Pin, ArrowLeft } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { getAnalysis, generateBalancePath } from '@/utils';
import { PersonaScore, UserProfile, ViewMode } from "@/types";

const chartWidth = 500
const chartHeight = 200
const centerY = chartHeight / 2

interface PastViewProps {
    personaScore: PersonaScore
    myProfile: UserProfile
}

export default function ThePast({ personaScore, myProfile }: PastViewProps) {
    const { setViewMode } = useAppState();
    
    return (
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
    )

}