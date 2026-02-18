
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

export function calculateDistance(
  loc1: [number, number],
  loc2: [number, number]
) {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const [lat1, lon1] = loc1;
  const [lat2, lon2] = loc2;

  const R = 6371; // bán kính trái đất (km)

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c).toFixed(1); // km
}

//calculate % of fun and study
export const getAnalysis = (fun: number, study: number) => {
  const diff = fun - study;
  if (Math.abs(diff) <= 10) return "Sự cân bằng tuyệt vời. Bạn đang làm chủ được cả lý trí lẫn tâm hồn.";
  if (fun > study && fun > 70) return "Năng lượng sáng tạo đang bùng nổ.";
  if (study > fun && study > 70) return "Sự tập trung cao độ. Bạn đang tiến bộ rất nhanh trong việc tích lũy tri thức.";
  if (fun < 30 && study < 30) return "Có vẻ bạn đang trong giai đoạn nghỉ ngơi. Hãy nạp lại năng lượng để bắt đầu hành trình mới.";
  return "Bạn đang dần tìm thấy sự tĩnh lặng trong những cuộc vui.";
};

const chartWidth = 500;
const chartHeight = 200;
const centerY = chartHeight / 2; // Đường 0 nằm ở giữa

export const generateBalancePath = (data: any[]) => {
  if (data.length < 2) return "";
  
  return data.map((entry, i) => {
    const x = (i / (data.length - 1)) * (chartWidth - 40) + 20;
    // Tính toán độ lệch: (Fun - Study) / 2 
    // Ví dụ: Fun 100%, Study 0% => Lệch +50. Fun 0%, Study 100% => Lệch -50.
    const diff = (entry.score.fun - entry.score.study) / 2;
    // Chuyển đổi diff thành tọa độ Y (Y càng nhỏ càng nằm cao trên SVG)
    const y = centerY - (diff * (chartHeight / 120)); 
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
};