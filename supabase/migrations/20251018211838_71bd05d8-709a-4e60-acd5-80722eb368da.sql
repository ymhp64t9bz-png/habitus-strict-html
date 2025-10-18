-- Adicionar campo de unidade de medida aos hábitos
ALTER TABLE public.habits ADD COLUMN unit text DEFAULT 'unidade';