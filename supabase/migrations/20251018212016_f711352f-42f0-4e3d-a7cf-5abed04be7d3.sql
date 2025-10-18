-- Atualizar a função handle_new_user para incluir unidade de medida nos hábitos padrão
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

  -- Criar 3 hábitos padrão com unidades de medida
  INSERT INTO public.habits (user_id, title, frequency, color, icon, goal_value, current_value, is_task, unit)
  VALUES 
    (new.id, 'Ler 10 páginas', 'daily', '#8B5CF6', '📚', 10, 0, false, 'páginas'),
    (new.id, 'Caminhar 30 minutos', 'daily', '#10B981', '🚶', 30, 0, false, 'minutos'),
    (new.id, 'Meditar 10 minutos', 'daily', '#3B82F6', '🧘', 10, 0, false, 'minutos');

  RETURN new;
END;
$function$;