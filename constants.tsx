
import { Category } from './types';

export const CATEGORIES: Category[] = [
  // FUN GROUP (FIRE / LỬA)
  {
    id: 'music',
    label: 'Nhạc',
    group: 'fun',
    icon: '🎵',
    color: '#F43F5E', 
    subOptions: [
      { id: 'm1', label: 'Pop' }, { id: 'm2', label: 'Rock' }, { id: 'm3', label: 'Indie' }, { id: 'm4', label: 'EDM' }, { id: 'm5', label: 'Jazz' }
    ]
  },
  {
    id: 'movies',
    label: 'Phim',
    group: 'fun',
    icon: '🎬',
    color: '#FB923C', 
    subOptions: [
      { id: 'f1', label: 'Hành động' }, { id: 'f2', label: 'Kinh dị' }, { id: 'f3', label: 'Tình cảm' }, { id: 'f4', label: 'Anime' }
    ]
  },
  {
    id: 'dating',
    label: 'Dating',
    group: 'fun',
    icon: '❤️',
    color: '#E11D48', 
    subOptions: [
      { id: 'd1', label: 'Cafe' }, { id: 'd2', label: 'Dạo phố' }, { id: 'd3', label: 'Xem phim' }
    ]
  },
  {
    id: 'games',
    label: 'Games',
    group: 'fun',
    icon: '🎮',
    color: '#991B1B', 
    subOptions: [
      { id: 'g1', label: 'MOBA' }, { id: 'g2', label: 'FPS' }, { id: 'g3', label: 'RPG' }, { id: 'g4', label: 'Casual' }
    ]
  },
  {
    id: 'travel',
    label: 'Du lịch',
    group: 'fun',
    icon: '🌴',
    color: '#F0ABFC', 
    subOptions: [
      { id: 't1', label: 'Phượt' }, { id: 't2', label: 'Nghỉ dưỡng' }, { id: 't3', label: 'Camping' }
    ]
  },
  // STUDY GROUP (WATER / NƯỚC)
  {
    id: 'languages',
    label: 'Ngoại ngữ',
    group: 'study',
    icon: '🌐',
    color: '#3B82F6', 
    subOptions: [
      { id: 'l1', label: 'Tiếng Anh' }, { id: 'l2', label: 'Tiếng Nhật' }, { id: 'l3', label: 'Tiếng Trung' }, { id: 'l4', label: 'Tiếng Hàn' }
    ]
  },
  {
    id: 'reading',
    label: 'Đọc sách',
    group: 'study',
    icon: '📚',
    color: '#06B6D4', 
    subOptions: [
      { id: 'r1', label: 'Kỹ năng' }, { id: 'r2', label: 'Kinh tế' }, { id: 'r3', label: 'Văn học' }
    ]
  },
  {
    id: 'parttime',
    label: 'Làm việc',
    group: 'study',
    icon: '💼',
    color: '#2563EB', 
    subOptions: [
      { id: 'p1', label: 'Freelance' }, { id: 'p2', label: 'Gia sư' }, { id: 'p3', label: 'Bán hàng' }
    ]
  },
  {
    id: 'startup',
    label: 'Startup',
    group: 'study',
    icon: '🚀',
    color: '#0891B2', 
    subOptions: [
      { id: 's1', label: 'Công nghệ' }, { id: 's2', label: 'Dịch vụ' }, { id: 's3', label: 'Sáng tạo' }
    ]
  },
  {
    id: 'housework',
    label: 'Việc nhà',
    group: 'study',
    icon: '🏠',
    color: '#1E40AF', 
    subOptions: [
      { id: 'h1', label: 'Nấu ăn' }, { id: 'h2', label: 'Dọn dẹp' }, { id: 'h3', label: 'Chăm sóc' }
    ]
  }
];
