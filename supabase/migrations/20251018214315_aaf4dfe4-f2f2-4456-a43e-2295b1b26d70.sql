-- Atualizar a função handle_new_user para usar classes de gradiente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

  -- Criar 3 hábitos padrão com classes de gradiente e meta de 21 dias
  INSERT INTO public.habits (user_id, title, frequency, color, icon, goal_value, current_value, is_task, unit)
  VALUES 
    (new.id, 'Ler por 21 dias', 'daily', 'gradient-book', '📚', 21, 0, false, 'dias'),
    (new.id, 'Caminhar por 21 dias', 'daily', 'gradient-walk', '🚶', 21, 0, false, 'dias'),
    (new.id, 'Meditar por 21 dias', 'daily', 'gradient-meditate', '🧘', 21, 0, false, 'dias');

  RETURN new;
END;
$function$;