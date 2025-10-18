-- Adicionar campos de streak e métricas na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_completion_date date,
ADD COLUMN IF NOT EXISTS total_habits_completed integer DEFAULT 0;

-- Criar tabela de conquistas desbloqueadas
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id text NOT NULL,
  unlocked_at timestamp with time zone DEFAULT now() NOT NULL,
  progress integer DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- Habilitar RLS na tabela user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_achievements
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON public.user_achievements
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Atualizar a função handle_new_user para criar hábitos padrão
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Criar perfil do usuário
  INSERT INTO public.profiles (user_id, name, email, avatar_url, streak, total_habits_completed)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id),
    0,
    0
  );

  -- Criar 3 hábitos padrão
  INSERT INTO public.habits (user_id, title, frequency, color, icon, goal_value, current_value, is_task)
  VALUES 
    (new.id, 'Ler 10 páginas', 'daily', '#8B5CF6', '📚', 10, 0, false),
    (new.id, 'Caminhar 30 minutos', 'daily', '#10B981', '🚶', 30, 0, false),
    (new.id, 'Meditar 10 minutos', 'daily', '#3B82F6', '🧘', 10, 0, false);

  RETURN new;
END;
$function$;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON public.habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_completed_at ON public.habit_completions(completed_at);