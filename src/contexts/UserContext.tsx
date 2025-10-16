import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  profession: string;
  avatarUrl: string;
  selectedAchievements: string[];
}

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUser: UserProfile = {
  name: "João Silva",
  email: "joao@exemplo.com",
  bio: "Transformando hábitos em resultados",
  profession: "Desenvolvedor",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
  selectedAchievements: ["first_habit", "week_streak", "water_champion"],
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(user));
  }, [user]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
