-- Adicionar campo premium à tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS premium BOOLEAN DEFAULT false;

-- Adicionar índice para consultas rápidas de usuários premium
CREATE INDEX IF NOT EXISTS idx_profiles_premium ON public.profiles(premium) WHERE premium = true;

-- Comentário na coluna para documentação
COMMENT ON COLUMN public.profiles.premium IS 'Indica se o usuário possui assinatura premium ativa';