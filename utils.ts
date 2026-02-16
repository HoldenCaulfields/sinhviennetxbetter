
import { CATEGORIES } from './constants';
import { PersonaScore } from './types';
import confetti from 'canvas-confetti';

export const calculatePersonaScore = (selectedIds: string[]): PersonaScore => {
  if (selectedIds.length === 0) return { fun: 50, study: 50 };

  let funCount = 0;
  let studyCount = 0;

  selectedIds.forEach(id => {
    const category = CATEGORIES.find(cat => cat.subOptions.some(opt => opt.id === id));
    if (category) {
      if (category.group === 'fun') funCount++;
      else studyCount++;
    }
  });

  const total = funCount + studyCount;
  if (total === 0) return { fun: 50, study: 50 };

  return {
    fun: Math.round((funCount / total) * 100),
    study: Math.round((studyCount / total) * 100)
  };
};

export const getPersonaLabel = (score: PersonaScore): string => {
  if (score.fun > 70) return "Bậc Thầy Ăn Chơi";
  if (score.study > 70) return "Chiến Thần Học Tập";
  if (score.fun > 40 && score.fun < 60) return "Người Cân Bằng";
  return "Đa Năng";
};

export const calculateCompatibility = (s1: PersonaScore, s2: PersonaScore): number => {
  const diff = Math.abs(s1.fun - s2.fun);
  return 100 - diff;
};

export const triggerFireworkAtPoint = (x: number, y: number) => {
  const rocketDuration = 800; // Thời gian hỏa tiễn vút lên (ms)
  const flyHeight = 0.25;     // Độ cao hỏa tiễn bay lên (25% chiều cao màn hình)
  const startTime = Date.now();

  // --- GIAI ĐOẠN 1: HỎA TIỄN VÚT LÊN TỪ USER ---
  const tracerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = elapsed / rocketDuration;

    if (progress >= 1) {
      clearInterval(tracerInterval);
      createMegaExplosion(x, y - flyHeight); // Nổ ở điểm cuối của đường bay
      return;
    }

    // Tọa độ hỏa tiễn: x giữ nguyên, y giảm dần (bay lên)
    const currentY = y - (flyHeight * progress);

    // Đuôi lửa hỏa tiễn (Tracer) - Mạnh mẽ và rõ nét hơn
    confetti({
      particleCount: 4,
      angle: 270, 
      spread: 15,
      origin: { x, y: currentY },
      colors: ['#ff4d00', '#ffd700', '#ffffff'],
      startVelocity: 10,
      gravity: 0.8,
      ticks: 40,
      scalar: 0.7, // Hạt đuôi lửa to hơn cho rõ
      zIndex: 9999,
    });
  }, 25);
};

// --- GIAI ĐOẠN 2: VỤ NỔ SIÊU CẤP (MEGA EXPLOSION) ---
const createMegaExplosion = (x: number, y: number) => {
  const count = 150; // Tăng số lượng hạt cho hoành tráng
  const defaults = {
    origin: { x, y },
    zIndex: 9999,
    scalar: 1.2
  };

  function shoot() {
    // Vòng nổ chính (Vàng & Cam)
    confetti({
      ...defaults,
      particleCount: count / 2,
      angle: 60,
      spread: 70,
      startVelocity: 40,
      colors: ['#ff0000', '#ff8c00', '#ffd700']
    });
    confetti({
      ...defaults,
      particleCount: count / 2,
      angle: 120,
      spread: 70,
      startVelocity: 40,
      colors: ['#ff0000', '#ff8c00', '#ffd700']
    });
    
    // Các tia lấp lánh nổ chậm phía sau (Xanh dương/Trắng)
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 40,
        spread: 360,
        startVelocity: 20,
        colors: ['#ffffff', '#00e5ff'],
        shapes: ['star'] as any, // Nổ hình sao cho rực rỡ
      });
    }, 200);
  }

  shoot();
};