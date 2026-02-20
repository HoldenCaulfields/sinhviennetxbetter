import { Target, Users, Compass } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

export default function TheFuture() {
    const { setViewMode } = useAppState();

    return (
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
    );
}