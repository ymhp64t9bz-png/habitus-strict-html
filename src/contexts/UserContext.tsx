import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { logError } from '@/lib/errorHandler';

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  profession: string;
  avatarUrl: string;
  selectedAchievements: string[];
  premium: boolean;
  subscriptionStatus?: {
    subscribed: boolean;
    inTrial: boolean;
    trialEnd?: string;
    subscriptionEnd?: string;
    productId?: string;
  };
}

interface UserContextType {
  user: UserProfile | null;
  authUser: User | null;
  session: Session | null;
  loading: boolean;
  hasActiveAccess: boolean;
  needsSubscription: boolean;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);

  const hasActiveAccess = user?.premium || user?.subscriptionStatus?.inTrial || false;
  const needsSubscription = session !== null && !hasActiveAccess && subscriptionChecked;

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setAuthUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSubscription = async () => {
    if (!authUser) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        logError('Check Subscription', error);
        return;
      }

      setUser(prev => prev ? {
        ...prev,
        premium: data.subscribed || false,
        subscriptionStatus: {
          subscribed: data.subscribed || false,
          inTrial: data.in_trial || false,
          trialEnd: data.trial_end,
          subscriptionEnd: data.subscription_end,
          productId: data.product_id,
        }
      } : null);
    } catch (error) {
      logError('Check Subscription', error);
    } finally {
      setSubscriptionChecked(true);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          name: data.name,
          email: data.email,
          bio: data.bio || '',
          profession: data.profession || '',
          avatarUrl: data.avatar_url,
          selectedAchievements: data.selected_achievements || [],
          premium: data.premium || false,
        });
        
        // Verifica assinatura após carregar perfil
        setTimeout(() => {
          checkSubscription();
        }, 0);
      }
    } catch (error) {
      logError('Load Profile', error);
      setSubscriptionChecked(true);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!authUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          bio: updates.bio,
          profession: updates.profession,
          avatar_url: updates.avatarUrl,
          selected_achievements: updates.selectedAchievements,
        })
        .eq('user_id', authUser.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      logError('Update Profile', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      authUser, 
      session, 
      loading, 
      hasActiveAccess,
      needsSubscription,
      updateUser,
      checkSubscription 
    }}>
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
