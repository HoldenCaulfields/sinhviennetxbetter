
import { CATEGORIES } from './constants';
import { PersonaScore } from './types';

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
