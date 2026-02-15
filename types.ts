
export type CategoryGroup = 'fun' | 'study';
export type ViewMode = 'past' | 'present' | 'future';
export type DiscoveryMode = 'self' | 'map';

export interface SubOption {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  group: CategoryGroup;
  icon: any;
  color: string;
  subOptions: SubOption[];
}

export interface ScoreHistory {
  date: string;
  score: PersonaScore;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  zalo?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  location: [number, number];
  selectedOptions: string[]; 
  customTags: string[];
  history: ScoreHistory[];
  isPinned: boolean;
  bio?: string;
  socialLinks?: SocialLinks;
  lastUpdated?: string;
}

export interface PersonaScore {
  fun: number;
  study: number;
}
