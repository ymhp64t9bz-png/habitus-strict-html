-- Add last_completed_date and broken columns to habits table
ALTER TABLE public.habits
ADD COLUMN IF NOT EXISTS last_completed_date date,
ADD COLUMN IF NOT EXISTS broken boolean DEFAULT false;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_habits_last_completed_date ON public.habits(last_completed_date);
CREATE INDEX IF NOT EXISTS idx_habits_broken ON public.habits(broken);