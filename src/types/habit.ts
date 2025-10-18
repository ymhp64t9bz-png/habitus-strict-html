export interface Habit {
  id: string;
  title: string;
  frequency: string;
  color: string;
  icon: string;
  goal_value: number;
  current_value: number;
  is_complete: boolean;
  is_task: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
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
