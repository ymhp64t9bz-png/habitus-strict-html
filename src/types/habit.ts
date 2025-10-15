export interface Habit {
  id: number;
  name: string;
  description: string;
  streak: number;
  progress: number;
  icon: string;
  iconClass: string;
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
