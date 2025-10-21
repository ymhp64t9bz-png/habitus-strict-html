-- Adicionar campo trial_used para controlar se usuário já usou o trial
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_used BOOLEAN DEFAULT false;

-- Adicionar campo trial_cancelled_at para rastrear quando trial foi cancelado
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_cancelled_at TIMESTAMP WITH TIME ZONE;