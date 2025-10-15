export type HabitType = 'habit' | 'task';
export type HabitUnit = 'days' | 'hours' | 'liters' | 'pages' | 'numeric';

export interface Habit {
  id: number;
  name: string;
  description: string;
  streak: number;
  progress: number;
  icon: string;
  iconClass: string;
  type: HabitType;
  unit?: HabitUnit;
  target?: number;
  currentValue?: number;
  durationDays?: 7 | 15 | 30 | 60 | 90 | 365;
}

export interface CommunityPost {
  id: number;
  authorName: string;
  authorAvatar: string;
  content: string;
  habits: Habit[];
  likes: number;
  liked: boolean;
  canChallenge: boolean;
  consecutiveDays: number;
}

export interface Challenge {
  id: number;
  challengerId: number;
  challengerName: string;
  challengedId: number;
  habitSet: Habit[];
  status: 'open' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  isPremium: boolean;
  trialEndsAt?: string;
  completedAchievements: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  criteria: string;
  progress: number;
  icon: string;
  level: "bronze" | "silver" | "gold";
  locked: boolean;
}
