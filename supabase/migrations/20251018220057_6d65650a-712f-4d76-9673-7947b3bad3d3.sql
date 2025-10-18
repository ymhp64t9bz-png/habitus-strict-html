-- Adicionar campos para controle diário e quebra de hábitos
ALTER TABLE public.habits 
ADD COLUMN IF NOT EXISTS last_completed_date date,
ADD COLUMN IF NOT EXISTS broken boolean DEFAULT false;

-- Criar índice para otimizar consultas por data
CREATE INDEX IF NOT EXISTS idx_habits_last_completed ON public.habits(last_completed_date);
CREATE INDEX IF NOT EXISTS idx_habits_broken ON public.habits(broken);